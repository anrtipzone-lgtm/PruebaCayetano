using AWSServerlessProjectBack.Business;
using AWSServerlessProjectBack.Persistence;
using AWSServerlessProjectBack.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace AWSServerlessProjectBack.Configuration
{
    public static class ServiceConfiguration
    {
        public static IServiceProvider BuildServiceProvider()
        {
            var services = new ServiceCollection();

            var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
                ?? "Host=localhost;Port=5432;Database=CasasDB;Username=postgres;Password=tuClave";

            EnsureDatabaseExists(connectionString);

            services.AddDbContext<AppDbContext>(opts =>
                opts.UseNpgsql(connectionString));

            services.AddScoped<ICasaRepository, CasaRepository>();
            services.AddScoped<ICasaService, CasaService>();

            var provider = services.BuildServiceProvider();

            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();

            return provider;
        }

        private static void EnsureDatabaseExists(string connectionString)
        {
            var builder = new NpgsqlConnectionStringBuilder(connectionString);
            var dbName = builder.Database ?? "CasasDB";
            builder.Database = "postgres";

            using var conn = new NpgsqlConnection(builder.ConnectionString);
            conn.Open();

            using var checkCmd = conn.CreateCommand();
            checkCmd.CommandText = "SELECT 1 FROM pg_database WHERE datname = $1";
            checkCmd.Parameters.AddWithValue(dbName);
            var exists = checkCmd.ExecuteScalar() != null;

            if (!exists)
            {
                // CREATE DATABASE no admite parámetros, el nombre ya está sanitizado del connection string
                using var createCmd = conn.CreateCommand();
                createCmd.CommandText = $"CREATE DATABASE \"{dbName}\"";
                createCmd.ExecuteNonQuery();
            }
        }
    }
}
