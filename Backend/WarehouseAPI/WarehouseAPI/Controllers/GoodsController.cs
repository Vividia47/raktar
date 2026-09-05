using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using WarehouseAPI.Models;
using WarehouseAPI.Models.DTOs;

namespace WarehouseAPI.Controllers
{
    [Route("goods")]
    [ApiController]
    public class GoodsController : ControllerBase
    {
        private readonly WarehouseContext _warehousecontext;

        public GoodsController(WarehouseContext warehousecontext)
        {
            _warehousecontext = warehousecontext;
        }

        [HttpPost]
public async Task<ActionResult> AddNewGoods(
    [FromQuery] int userId,
    [FromBody] AddGoodsDto addGoodsDto)
        {
            try
            {
var user = await _warehousecontext.Users
        .FirstOrDefaultAsync(x => x.IdU == userId);

    if (user == null)
    {
        return NotFound(new
        {
            message = "Nincs ilyen felhasználó."
        });
    }

    if (user.UserRank != 1 && user.UserRank != 2)
    {
        return Forbid();
    }

                var goods = new Goods
                {
                    Article = addGoodsDto.Article,
                    Barcode = addGoodsDto.Barcode,
                    Name = addGoodsDto.Name,
                    Vat = addGoodsDto.Vat,
                    Sprice = addGoodsDto.Sprice,
                    MinStock = addGoodsDto.MinStock,
                    Unit = addGoodsDto.Unit,
                    Shelf = addGoodsDto.Shelf,
                    Bundle = addGoodsDto.Bundle,
                    Bunit = addGoodsDto.Bunit
                };

                if (goods != null)
                {
                    goods.Stock = 0;
                    goods.Lpprice = 0;

                    await _warehousecontext.Goods.AddAsync(goods);
                    await _warehousecontext.SaveChangesAsync();

                    return StatusCode(201, new { message = "Sikeres felvétel.", result = goods });
                }

                return StatusCode(404, new { message = "Sikertelen felvétel.", result = goods });

            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllGoods()
        {
            try
            {
                return Ok(new {message = "Sikeres lekérdezés", result = await _warehousecontext.Goods.ToListAsync()});
            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpGet("byid")]
        public async Task<ActionResult> GetGoodsByID(int id)
        {
            try
            {
                var goods = await _warehousecontext.Goods.FindAsync(id);

                if (goods != null)
                {
                    return Ok(new { message = "Sikeres lekérdezés", result = goods });
                }
                return StatusCode(404, new { message = "Sikertelen lekérdezés.", result = goods });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpPut]
public async Task<ActionResult> UpdateGoods(
    [FromQuery] int id,
    [FromQuery] int userId,
    [FromBody] UpdateGoodsDto updateGoodsDto)
        {
            try
            {
var user = await _warehousecontext.Users
    .FirstOrDefaultAsync(x => x.IdU == userId);

if (user == null)
{
    return NotFound(new
    {
        message = "Nincs ilyen felhasználó."
    });
}

if (user.UserRank != 1 && user.UserRank != 2)
{
    return Forbid();
}

                var goods = await _warehousecontext.Goods.FirstOrDefaultAsync(x => x.IdP == id); ;

                if (goods  != null)
                {
                    goods.Article = updateGoodsDto.Article;
                    goods.Barcode = updateGoodsDto.Barcode;
                    goods.Name = updateGoodsDto.Name;
                    goods.Vat = updateGoodsDto.Vat;
                    goods.MinStock = updateGoodsDto.MinStock;
                    goods.Unit = updateGoodsDto.Unit;
                    goods.Shelf = updateGoodsDto.Shelf;
                    goods.Bundle = updateGoodsDto.Bundle;
                    goods.Bunit = updateGoodsDto.Bunit;

                    _warehousecontext.Goods.Update(goods);
                    await _warehousecontext.SaveChangesAsync();
                    return Ok( new { message = "Sikeres frissítés.", result = goods });
                }

                return StatusCode(404, new { message = "Nincs találat.", result = goods });

            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpPut("price")]
public async Task<ActionResult> UpdateSellingPrice(
    [FromQuery] int id,
    [FromQuery] int userId,
    [FromBody] float sprice)
{
    try
    {
var user = await _warehousecontext.Users
    .FirstOrDefaultAsync(x => x.IdU == userId);

if (user == null)
{
    return NotFound(new
    {
        message = "Nincs ilyen felhasználó."
    });
}

if (user.UserRank != 1 && user.UserRank != 3)
{
    return Forbid();
}

        var goods = await _warehousecontext.Goods
            .FirstOrDefaultAsync(x => x.IdP == id);

        if (goods == null)
        {
            return StatusCode(404, new
            {
                message = "Nincs találat.",
                result = goods
            });
        }

        goods.Sprice = sprice;

        _warehousecontext.Goods.Update(goods);
        await _warehousecontext.SaveChangesAsync();

        return Ok(new
        {
            message = "Sikeres árfrissítés.",
            result = goods
        });
    }
    catch (Exception ex)
    {
        return StatusCode(400, new
        {
            message = ex.Message
        });
    }
}

        [HttpDelete]
public async Task<ActionResult> DeleteGoods(
    [FromQuery] int id,
    [FromQuery] int userId)
{
    try
    {
        var user = await _warehousecontext.Users
    .FirstOrDefaultAsync(x => x.IdU == userId);

if (user == null)
{
    return NotFound(new
    {
        message = "Nincs ilyen felhasználó."
    });
}

if (user.UserRank != 1 && user.UserRank != 2)
{
    return Forbid();
}

        var goods = await _warehousecontext.Goods.FindAsync(id);

        if (goods != null)
        {
            if (goods.Stock != 0)
            {
                return BadRequest(new
                {
                    message = "A termék csak 0 készlet esetén törölhető."
                });
            }

            _warehousecontext.Goods.Remove(goods);
            await _warehousecontext.SaveChangesAsync();

            return Ok(new
            {
                message = "Sikeres törlés.",
                result = goods
            });
        }

        return StatusCode(404, new
        {
            message = "Nincs találat.",
            result = goods
        });
    }
    catch (Exception ex)
    {
        return StatusCode(400, new
        {
            message = ex.Message
        });
    }
}

        [HttpGet("getAllGoodsHistory")]     // fejkarton + mozgások együtt
        public async Task<ActionResult> GetAllGoodsHistory(int id) 
        {
            try
            {
                var goodsHistory = await _warehousecontext.Goods.Include(x => x.Histories).Where(x => x.IdP == id).ToListAsync();

                if (goodsHistory != null)
                {
                    return Ok(new { message = "Sikeres lekérdezés", result = goodsHistory });
                }

                return StatusCode(404, new { message = "Sikertelen lekérdezés", result = goodsHistory });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpPut("movement")]
        public async Task<ActionResult> MovementGoods([FromQuery] int id, [FromBody] MovementGoodsDto movementGoodsDto)
        {
            try
            {
var user = await _warehousecontext.Users
    .FirstOrDefaultAsync(x => x.IdU == movementGoodsDto.IdU);

if (user == null)
{
    return NotFound(new
    {
        message = "Nincs ilyen felhasználó."
    });
}

if (user.UserRank != 1 && user.UserRank != 2)
{
    return Forbid();
}

                var goods = await _warehousecontext.Goods.FirstOrDefaultAsync(x => x.IdP == id); ;

                if (goods != null)
                {
                    int i = movementGoodsDto.Mcode;
                    float lpp = movementGoodsDto.Lpprice;
                    float r = movementGoodsDto.Stock;

                    if (i > 200)
{
    if (r > goods.Stock)
    {
        return BadRequest(new
        {
            message = "Nincs elegendő készlet a készletmozgás végrehajtásához."
        });
    }

    goods.Stock -= r;
}
else
{
    goods.Stock += r;
}

                    if (i == 101 || i == 102)
                    {
                        if (lpp != 0)
                        {
                            goods.Lpprice = lpp;
                        }
                    }

                    var history = new History
                    {
                        IdP = goods.IdP,
                        IdU = movementGoodsDto.IdU,
                        Date = DateTime.Now,
                        InvoiceNr = movementGoodsDto.InvoiceNr,
                        Quantity = r,
                        Direction = i,
                        Pprice = movementGoodsDto.Lpprice,
                        Sprice = movementGoodsDto.Sprice,
                        SerialNr = movementGoodsDto.SerialNr
                    };

                    await _warehousecontext.Histories.AddAsync(history);

                    _warehousecontext.Goods.Update(goods);

                    await _warehousecontext.SaveChangesAsync();
                    
                    return Ok(new { message = "Sikeres frissítés.", result = goods });
                }

                return StatusCode(404, new { message = "Nincs találat.", result = goods });

            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

    }
}
