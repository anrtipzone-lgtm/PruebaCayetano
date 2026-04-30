using AWSServerlessProjectBack.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AWSServerlessProjectBack.Persistence.Repositories
{
    public class CasaRepository : ICasaRepository
    {
        private readonly AppDbContext _context;

        public CasaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Casa>> GetAllAsync(int page, int pageSize)
        {
            return await _context.Casas
                .FromSqlRaw("SELECT * FROM fn_get_all_casas({0}, {1})", page, pageSize)
                .ToListAsync();
        }

        public async Task<Casa?> GetByIdAsync(int id)
        {
            return await _context.Casas
                .FromSqlRaw("SELECT * FROM fn_get_casa_by_id({0})", id)
                .FirstOrDefaultAsync();
        }

        public async Task<Casa> CreateAsync(Casa casa)
        {
            return await _context.Casas
                .FromSqlRaw(
                    "SELECT * FROM fn_create_casa({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7})",
                    casa.Direccion,
                    casa.Distrito,
                    casa.NumeroHabitaciones,
                    casa.TipoCasa,
                    casa.AreaM2,
                    casa.Precio,
                    casa.Descripcion,
                    casa.FechaPublicacion)
                .FirstAsync();
        }

        public async Task<bool> UpdateAsync(Casa casa)
        {
            return await _context.Database
                .SqlQuery<bool>(
                    $"SELECT fn_update_casa({casa.Id}, {casa.Direccion}, {casa.Distrito}, {casa.NumeroHabitaciones}, {casa.TipoCasa}, {casa.AreaM2}, {casa.Precio}, {casa.Descripcion})")
                .FirstAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _context.Database
                .SqlQuery<bool>($"SELECT fn_delete_casa({id})")
                .FirstAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Database
                .SqlQuery<bool>($"SELECT fn_exists_casa({id})")
                .FirstAsync();
        }
    }
}
