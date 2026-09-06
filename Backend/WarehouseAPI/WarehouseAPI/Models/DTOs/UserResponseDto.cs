namespace WarehouseAPI.Models.DTOs
{
    public class UserResponseDto
    {
        public int IdU { get; set; }
        public string? UserName { get; set; }
        public string? FullName { get; set; }
        public int? UserRank { get; set; }
    }
}
