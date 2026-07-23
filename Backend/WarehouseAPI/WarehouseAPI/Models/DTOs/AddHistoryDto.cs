using System.ComponentModel.DataAnnotations;

namespace WarehouseAPI.Models.DTOs
{
    public class AddHistoryDto
    {

        [Required]
        public int? IdP { get; set; }

        [Required]
        public int? IdU { get; set; }

        public string? InvoiceNr { get; set; }

        [Required]
        public float? Quantity { get; set; }

        [Required]
        public int? Direction { get; set; }

        public float? Pprice { get; set; }

        public float? Sprice { get; set; }

        public string? SerialNr { get; set; }

    }
}
