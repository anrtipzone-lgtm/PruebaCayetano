using AWSServerlessProjectBack.Models.Entities;

namespace AWSServerlessProjectBack.Persistence.Repositories
{
    public interface ICasaRepository
    {
        Task<IEnumerable<Casa>> GetAllAsync(int page, int pageSize);
        Task<Casa?> GetByIdAsync(int id);
        Task<Casa> CreateAsync(Casa casa);
        Task<bool> UpdateAsync(Casa casa);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
