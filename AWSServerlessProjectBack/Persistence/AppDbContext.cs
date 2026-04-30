using AWSServerlessProjectBack.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AWSServerlessProjectBack.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Casa> Casas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Casa>(entity =>
            {
                entity.ToTable("casas");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").UseIdentityAlwaysColumn();
                entity.Property(e => e.Direccion).HasColumnName("direccion").IsRequired().HasMaxLength(500);
                entity.Property(e => e.Distrito).HasColumnName("distrito").IsRequired().HasMaxLength(200);
                entity.Property(e => e.NumeroHabitaciones).HasColumnName("numero_habitaciones");
                entity.Property(e => e.TipoCasa).HasColumnName("tipo_casa").HasMaxLength(100);
                entity.Property(e => e.AreaM2).HasColumnName("area_m2").HasColumnType("decimal(10,2)");
                entity.Property(e => e.Precio).HasColumnName("precio").HasColumnType("decimal(15,2)");
                entity.Property(e => e.Descripcion).HasColumnName("descripcion").HasMaxLength(2000);
                entity.Property(e => e.FechaPublicacion).HasColumnName("fecha_publicacion");
                entity.Property(e => e.Activo).HasColumnName("activo");
            });
        }
    }
}
