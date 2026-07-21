using System;
using System.Collections.Generic;

namespace WarehouseAPI.Models;

public partial class Goods
{
    public int IdP { get; set; }

    public string? Article { get; set; }

    public string? Barcode { get; set; }

    public string? Name { get; set; }

    public float? Vat { get; set; }

    public float? Lpprice { get; set; }

    public float? Sprice { get; set; }

    public float? Stock { get; set; }

    public float? MinStock { get; set; }

    public string? Unit { get; set; }

    public string? Shelf { get; set; }

    public float? Bundle { get; set; }

    public string? Bunit { get; set; }

    public virtual ICollection<History> Histories { get; set; } = new List<History>();
}
