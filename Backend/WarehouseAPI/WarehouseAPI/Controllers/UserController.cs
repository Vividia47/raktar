using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Models;
using WarehouseAPI.Models.DTOs;
using WarehouseAPI.DTOs;

namespace WarehouseAPI.Controllers
{
    [Route("user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly WarehouseContext _warehouseContext;

        public UserController(WarehouseContext warehouseContext)
        {
            _warehouseContext = warehouseContext;
        }

        [HttpPost]
        public async Task<ActionResult> AddNewUser(AddUserDto addUserDto)
        {
            try
            {
                var user = new User
                {
                    UserName = addUserDto.UserName,
                    FullName = addUserDto.FullName,
                    Password = addUserDto.Password,
                    UserRank = addUserDto.UserRank
                };

                if (user != null)
                {
                    await _warehouseContext.Users.AddAsync(user);
                    await _warehouseContext.SaveChangesAsync();

                    return StatusCode(201, new { message = "Sikeres felvétel.", result = user });
                }

                return StatusCode(404, new { message = "Sikertelen felvétel.", result = user });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });

            }
        }

        [HttpGet]
        public async Task<ActionResult> GetAllUsers()
        {
            try
            {
                return Ok(new { message = "Sikeres lekérdezés", result = await _warehouseContext.Users.ToListAsync() });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpGet("byid")]
        public async Task<ActionResult> GetUserByID(int id)
        {
            try
            {
                var user = await _warehouseContext.Users.FindAsync(id);

                if (user != null)
                {
                    return Ok(new { message = "Sikeres lekérdezés", result = user });
                }
                return StatusCode(404, new { message = "Sikertelen lekérdezés.", result = user });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser([FromQuery] int id, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _warehouseContext.Users.FirstOrDefaultAsync(x => x.IdU == id); ;

                if (user != null)
                {
                    user.Password = updateUserDto.Password;

                    _warehouseContext.Users.Update(user);
                    await _warehouseContext.SaveChangesAsync();
                    return Ok(new { message = "Sikeres frissítés.", result = user });
                }

                return StatusCode(404, new { message = "Nincs találat.", result = user });

            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _warehouseContext.Users.FindAsync(id);

                if (user != null)
                {
                    _warehouseContext.Users.Remove(user);
                    await _warehouseContext.SaveChangesAsync();
                    return Ok(new { message = "Sikeres törlés.", result = user });
                }

                return StatusCode(404, new { message = "Nincs találat.", result = user });

            }
            catch (Exception ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto login)
        {
            var user = _warehouseContext.Users.FirstOrDefault(u =>
                u.UserName == login.UserName &&
                u.Password == login.Password);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Hibás felhasználónév vagy jelszó."
                });
            }

            return Ok(new
            {
                message = "Sikeres bejelentkezés.",
                result = user
            });
        }

        [HttpPut("change-password")]
public async Task<ActionResult> ChangePassword(
    [FromQuery] int id,
    [FromBody] ChangePasswordDto changePasswordDto)
{
    try
    {
        var user = await _warehouseContext.Users
            .FirstOrDefaultAsync(x => x.IdU == id);

        if (user == null)
        {
            return NotFound(new
            {
                message = "Nincs ilyen felhasználó."
            });
        }

        if (user.Password != changePasswordDto.CurrentPassword)
        {
            return BadRequest(new
            {
                message = "A jelenlegi jelszó hibás."
            });
        }

        if (changePasswordDto.NewPassword != changePasswordDto.ConfirmPassword)
        {
            return BadRequest(new
            {
                message = "Az új jelszavak nem egyeznek."
            });
        }

        user.Password = changePasswordDto.NewPassword;

        await _warehouseContext.SaveChangesAsync();

        return Ok(new
        {
            message = "Sikeres jelszómódosítás."
        });
    }
    catch (Exception ex)
    {
        return BadRequest(new
        {
            message = ex.Message
        });
    }
}

    }
}
