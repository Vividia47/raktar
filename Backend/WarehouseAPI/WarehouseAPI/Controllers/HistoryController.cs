using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Models;

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

        [HttpGet]
        public async Task<ActionResult> GetAllHistory()
        {
            try
            {
                return Ok(new { message = "Sikeres lekérdezés", result = await _warehouseContext.Histories.ToListAsync() });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(400, new { message = "Hiba történt az előzmények lekérése során." });
            }
        }

    }
}
