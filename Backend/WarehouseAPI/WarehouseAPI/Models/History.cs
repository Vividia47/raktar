using System;
using System.Collections.Generic;

namespace WarehouseAPI.Models;

public partial class History
{
    public int IdH { get; set; }

    public int? IdP { get; set; }

    public int? IdU { get; set; }

    public DateTime? Date { get; set; }

    public string? InvoiceNr { get; set; }

    public float? Quantity { get; set; }

    public int? Direction { get; set; }

    public float? Pprice { get; set; }

    public float? Sprice { get; set; }

    public string? SerialNr { get; set; }

    public virtual Goods? IdPNavigation { get; set; }

    public virtual User? IdUNavigation { get; set; }
}
