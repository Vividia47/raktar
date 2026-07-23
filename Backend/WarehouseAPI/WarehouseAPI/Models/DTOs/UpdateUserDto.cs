using System.ComponentModel.DataAnnotations;

namespace WarehouseAPI.Models.DTOs
{
    public class UpdateUserDto
    {
        [Required]
        public string? Password { get; set; }

    }
}
