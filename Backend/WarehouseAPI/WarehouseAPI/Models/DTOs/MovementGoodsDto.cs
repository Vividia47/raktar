namespace WarehouseAPI.Models.DTOs
{
    public class MovementGoodsDto
    {
        public int IdU { get; set; }

        public float Lpprice { get; set; }

        public float Sprice { get; set; }

        public float Stock { get; set; }

        public string? InvoiceNr { get; set; }

        public string? SerialNr { get; set; }

        public int Mcode { get; set; }
    }
}
