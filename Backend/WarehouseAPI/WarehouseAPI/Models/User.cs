using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WarehouseAPI.Models;

public partial class User
{
    public int IdU { get; set; }

    public string? UserName { get; set; }

    public string? FullName { get; set; }

    public string? PasswordHash { get; set; }

    public int? UserRank { get; set; }

    public virtual ICollection<History> Histories { get; set; } = new List<History>();
}
