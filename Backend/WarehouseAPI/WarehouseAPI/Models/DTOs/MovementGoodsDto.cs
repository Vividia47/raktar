namespace WarehouseAPI.Models.DTOs
{
    public class MovementGoodsDto
    {
        public decimal Lpprice { get; set; }

        public decimal Sprice { get; set; }

        public float Stock { get; set; }

        public string? InvoiceNr { get; set; }

        public string? SerialNr { get; set; }

        public int Mcode { get; set; }
    }
}
