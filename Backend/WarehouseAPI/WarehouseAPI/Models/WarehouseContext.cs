using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WarehouseAPI.Models;

public partial class WarehouseContext : DbContext
{
    public WarehouseContext()
    {
    }

    public WarehouseContext(DbContextOptions<WarehouseContext> options) : base(options)
    {
        Database.EnsureCreated();  // legenerálja az adatbázist és a táblákat
    }

    public virtual DbSet<Goods> Goods { get; set; }

    public virtual DbSet<History> Histories { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("server=localhost;database=warehouse;user=root;password=");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Goods>(entity =>
        {
            entity.HasKey(e => e.IdP).HasName("PRIMARY");

            entity.ToTable("goods");

            entity.Property(e => e.IdP).HasColumnName("idP");
            entity.Property(e => e.Article).HasMaxLength(20);
            entity.Property(e => e.Barcode).HasMaxLength(13);
            entity.Property(e => e.Bunit)
                .HasMaxLength(20)
                .HasColumnName("BUnit");
            entity.Property(e => e.Lpprice).HasColumnName("LPPrice");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Shelf).HasMaxLength(20);
            entity.Property(e => e.Sprice).HasColumnName("SPrice");
            entity.Property(e => e.Unit).HasMaxLength(20);
            entity.Property(e => e.Vat).HasColumnName("VAT");
        });

        modelBuilder.Entity<History>(entity =>
        {
            entity.HasKey(e => e.IdH).HasName("PRIMARY");

            entity.ToTable("history");

            entity.HasIndex(e => e.IdP, "idP");

            entity.HasIndex(e => e.IdU, "idU");

            entity.Property(e => e.IdH).HasColumnName("idH");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.IdP).HasColumnName("idP");
            entity.Property(e => e.IdU).HasColumnName("idU");
            entity.Property(e => e.InvoiceNr).HasMaxLength(100);
            entity.Property(e => e.Pprice).HasColumnName("PPrice");
            entity.Property(e => e.SerialNr).HasMaxLength(50);
            entity.Property(e => e.Sprice).HasColumnName("SPrice");

            entity.HasOne(d => d.IdPNavigation).WithMany(p => p.Histories)
                .HasForeignKey(d => d.IdP)
                .HasConstraintName("history_ibfk_1");

            entity.HasOne(d => d.IdUNavigation).WithMany(p => p.Histories)
                .HasForeignKey(d => d.IdU)
                .HasConstraintName("history_ibfk_2");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.IdU).HasName("PRIMARY");

            entity.ToTable("users");

            entity.Property(e => e.IdU).HasColumnName("idU");
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(30);
            entity.Property(e => e.UserName).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
