using AWSServerlessProjectBack.Models.DTOs;
using AWSServerlessProjectBack.Models.Entities;
using AWSServerlessProjectBack.Persistence.Repositories;

namespace AWSServerlessProjectBack.Business
{
    public class CasaService : ICasaService
    {
        private readonly ICasaRepository _repository;

        public CasaService(ICasaRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CasaResponseDto>> GetAllAsync(int page, int pageSize)
        {
            var casas = await _repository.GetAllAsync(page, pageSize);
            return casas.Select(ToResponseDto);
        }

        public async Task<CasaResponseDto?> GetByIdAsync(int id)
        {
            var casa = await _repository.GetByIdAsync(id);
            return casa == null ? null : ToResponseDto(casa);
        }

        public async Task<CasaResponseDto> CreateAsync(CasaRequestDto dto)
        {
            var casa = ToEntity(dto);
            var created = await _repository.CreateAsync(casa);
            return ToResponseDto(created);
        }

        public async Task<bool> UpdateAsync(int id, CasaRequestDto dto)
        {
            if (!await _repository.ExistsAsync(id)) return false;
            var casa = ToEntity(dto);
            casa.Id = id;
            return await _repository.UpdateAsync(casa);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        private static CasaResponseDto ToResponseDto(Casa casa) => new()
        {
            Id = casa.Id,
            Direccion = casa.Direccion,
            Distrito = casa.Distrito,
            NumeroHabitaciones = casa.NumeroHabitaciones,
            TipoCasa = casa.TipoCasa,
            AreaM2 = casa.AreaM2,
            Precio = casa.Precio,
            Descripcion = casa.Descripcion,
            FechaPublicacion = casa.FechaPublicacion,
            Activo = casa.Activo
        };

        private static Casa ToEntity(CasaRequestDto dto) => new()
        {
            Direccion = dto.Direccion,
            Distrito = dto.Distrito,
            NumeroHabitaciones = dto.NumeroHabitaciones,
            TipoCasa = dto.TipoCasa,
            AreaM2 = dto.AreaM2,
            Precio = dto.Precio,
            Descripcion = dto.Descripcion
        };
    }
}
