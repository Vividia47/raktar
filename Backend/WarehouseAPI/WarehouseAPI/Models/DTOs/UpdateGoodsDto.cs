using System.ComponentModel.DataAnnotations;

namespace WarehouseAPI.Models.DTOs
{
    public class UpdateGoodsDto
    {
        public string? Article { get; set; }

        public string? Barcode { get; set; }

        public string? Name { get; set; }

        public decimal? Vat { get; set; }

        public float? MinStock { get; set; }

        public decimal? Sprice { get; set; }

        public string? Unit { get; set; }

        public string? Shelf { get; set; }

        public float? Bundle { get; set; }

        public string? Bunit { get; set; }

    }
}
