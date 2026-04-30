namespace AWSServerlessProjectBack.Models.DTOs
{
    public class CasaResponseDto
    {
        public int Id { get; set; }
        public string Direccion { get; set; } = string.Empty;
        public string Distrito { get; set; } = string.Empty;
        public int NumeroHabitaciones { get; set; }
        public string TipoCasa { get; set; } = string.Empty;
        public decimal AreaM2 { get; set; }
        public decimal Precio { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaPublicacion { get; set; }
        public bool Activo { get; set; }
    }
}
