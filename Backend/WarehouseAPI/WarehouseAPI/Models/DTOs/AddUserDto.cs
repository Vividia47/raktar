using System.ComponentModel.DataAnnotations;

namespace WarehouseAPI.Models.DTOs
{
    public class AddUserDto
    {
        [Required]
        public string? UserName { get; set; }

        [Required]
        public string? FullName { get; set; }

        [Required]
        public string? Password { get; set; }

        [Required]
        public int? UserRank { get; set; }

    }
}
