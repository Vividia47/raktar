using System.ComponentModel.DataAnnotations;

namespace WarehouseAPI.Models.DTOs
{
    public class AddGoodsDto
    {
        public string? Article { get; set; }

        public string? Barcode { get; set; }

        [Required]
        public string? Name { get; set; }

        public float? Vat { get; set; }

        public float? Sprice { get; set; }

        public float? MinStock { get; set; }

        public string? Unit { get; set; }

        public string? Shelf { get; set; }

        public float? Bundle { get; set; }

        public string? Bunit { get; set; }

    }
}
