using AWSServerlessProjectBack.Models.DTOs;

namespace AWSServerlessProjectBack.Business
{
    public interface ICasaService
    {
        Task<IEnumerable<CasaResponseDto>> GetAllAsync(int page, int pageSize);
        Task<CasaResponseDto?> GetByIdAsync(int id);
        Task<CasaResponseDto> CreateAsync(CasaRequestDto dto);
        Task<bool> UpdateAsync(int id, CasaRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
