using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult> AddNewGoods( AddGoodsDto addGoodsDto)
        {
            try
            {
                var goods = new Goods
                {
                    Article = addGoodsDto.Article,
                    Barcode = addGoodsDto.Barcode,
                    Name = addGoodsDto.Name,
                    Vat = addGoodsDto.Vat,
                    MinStock = addGoodsDto.MinStock,
                    Unit = addGoodsDto.Unit,
                    Shelf = addGoodsDto.Shelf,
                    Bundle = addGoodsDto.Bundle,
                    Bunit = addGoodsDto.Bunit
                };

                if (goods != null)
                {
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
    }
}
