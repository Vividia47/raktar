using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Models;
using WarehouseAPI.Models.DTOs;

namespace WarehouseAPI.Controllers
{
    [Route("history")]
    [ApiController]
    [Authorize]
    public class HistoryController : ControllerBase
    {
        private readonly WarehouseContext _warehouseContext;

        public HistoryController(WarehouseContext warehouseContext)
        {
            _warehouseContext = warehouseContext;
        }

        [HttpPost]
        public async Task<ActionResult> AddNewHistory(AddHistoryDto addHistoryDto)
        {
            try
            {
                var history = new History
                {
                    IdP = addHistoryDto.IdP,
                    IdU = addHistoryDto.IdU,
                    Date = DateTime.Now,
                    InvoiceNr = addHistoryDto.InvoiceNr,
                    Quantity = addHistoryDto.Quantity,
                    Direction = addHistoryDto.Direction,
                    Pprice = addHistoryDto.Pprice,
                    Sprice = addHistoryDto.Sprice,
                    SerialNr = addHistoryDto.SerialNr
                };

                if (history != null)
                {
                    await _warehouseContext.Histories.AddAsync(history);
                    await _warehouseContext.SaveChangesAsync();

                    return StatusCode(201, new { message = "Sikeres felvétel.", result = history });
                }

                return StatusCode(404, new { message = "Sikertelen felvétel.", result = history });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });

            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllHistory()
        {
            try
            {
                return Ok(new { message = "Sikeres lekérdezés", result = await _warehouseContext.Histories.ToListAsync() });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpGet("getAllUserHistory")]  // egy adott user által rögzített összes mozgás
        public async Task<ActionResult> GetAllUserHistory(int id)
        {
            try
            {
                var userHistory = await _warehouseContext.Histories.Where(x => x.IdU == id).ToListAsync();

                if (userHistory != null)
                {
                    return Ok(new { message = "Sikeres lekérdezés", result = userHistory });
                }

                return StatusCode(404, new { message = "Sikertelen lekérdezés", result = userHistory });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }
    }
}
