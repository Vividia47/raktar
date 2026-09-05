using System.ComponentModel.DataAnnotations;

namespace WarehouseAPI.Models.DTOs
{
    public class UpdateUserDto
    {
        [Required]
        public string? UserName { get; set; }

        [Required]
        public string? FullName { get; set; }

        [Required]
        public int UserRank { get; set; }
    }
}