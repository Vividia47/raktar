using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WarehouseAPI.Models;
using WarehouseAPI.Models.DTOs;
using WarehouseAPI.DTOs;

namespace WarehouseAPI.Controllers
{
    [Route("user")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly WarehouseContext _warehouseContext;
        private readonly PasswordHasher<User> _passwordHasher = new();
        private readonly IConfiguration _configuration;

        public UserController(
            WarehouseContext warehouseContext,
            IConfiguration configuration)
        {
            _warehouseContext = warehouseContext;
            _configuration = configuration;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> AddNewUser(AddUserDto addUserDto)
        {
            try
            {
                var usersAlreadyExist = await _warehouseContext.Users.AnyAsync();

                if (usersAlreadyExist &&
                    (!User.Identity?.IsAuthenticated ?? true || !User.IsInRole("1")))
                {
                    return Forbid();
                }

                var userName = addUserDto.UserName?.Trim();

                if (string.IsNullOrWhiteSpace(userName))
                {
                    return BadRequest(new
                    {
                        message = "A felhasználónév megadása kötelező."
                    });
                }

                if (await _warehouseContext.Users.AnyAsync(
                    existingUser => existingUser.UserName == userName))
                {
                    return Conflict(new
                    {
                        message = "Ez a felhasználónév már használatban van."
                    });
                }

                var user = new User
                {
                    UserName = userName,
                    FullName = addUserDto.FullName,
                    UserRank = usersAlreadyExist ? addUserDto.UserRank : 1
                };

                user.PasswordHash = _passwordHasher.HashPassword(
                    user,
                    addUserDto.Password!
                );

                if (user != null)
                {
                    await _warehouseContext.Users.AddAsync(user);
                    await _warehouseContext.SaveChangesAsync();

                    return StatusCode(201, new
                    {
                        message = "Sikeres felvétel.",
                        result = ToResponse(user)
                    });
                }

                return StatusCode(404, new { message = "Sikertelen felvétel.", result = user });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);

                if (ex is DbUpdateException)
                {
                    return Conflict(new
                    {
                        message = "Ez a felhasználónév már használatban van."
                    });
                }

                return StatusCode(400, new { message = "Hiba történt a felhasználó művelet végrehajtása során." });

            }
        }

        [HttpGet]
        [Authorize(Roles = "1")]
        public async Task<ActionResult> GetAllUsers()
        {
            try
            {
                var users = await _warehouseContext.Users
                    .Select(user => new UserResponseDto
                    {
                        IdU = user.IdU,
                        UserName = user.UserName,
                        FullName = user.FullName,
                        UserRank = user.UserRank
                    })
                    .ToListAsync();

                return Ok(new { message = "Sikeres lekérdezés", result = users });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(400, new { message = "Hiba történt a felhasználók lekérése során." });
            }
        }

        [HttpGet("names")]
        [Authorize]
        public async Task<ActionResult> GetUserNames()
        {
            try
            {
                var users = await _warehouseContext.Users
                    .Select(x => new
                    {
                        idU = x.IdU,
                        fullName = x.FullName
                    })
                    .ToListAsync();

                return Ok(new
                {
                    message = "Sikeres lekérdezés.",
                    result = users
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(400, new
                {
                    message = "Hiba történt a felhasználónevek lekérése során."
                });
            }
        }

        [HttpGet("exists")]
        [AllowAnonymous]
        public async Task<ActionResult> UsersExist()
        {
            try
            {
                var exists = await _warehouseContext.Users.AnyAsync();

                return Ok(new
                {
                    result = exists
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(400, new
                {
                    message = "Hiba történt a felhasználók ellenőrzése során."
                });
            }
        }

        [HttpGet("byid")]
        [Authorize]
        public async Task<ActionResult> GetUserByID(int id)
        {
            try
            {
                var user = await _warehouseContext.Users.FindAsync(id);

                if (user != null)
                {
                    return Ok(new { message = "Sikeres lekérdezés", result = ToResponse(user) });
                }
                return StatusCode(404, new { message = "Sikertelen lekérdezés.", result = user });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(400, new { message = "Hiba történt a felhasználó lekérése során." });
            }
        }

        [HttpPut]
        [Authorize(Roles = "1")]
        public async Task<ActionResult> UpdateUser(
    [FromQuery] int id,
    [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _warehouseContext.Users
                    .FirstOrDefaultAsync(x => x.IdU == id);

                if (user != null)
                {
                    if (user.UserRank == 1 && updateUserDto.UserRank != 1)
                    {
                        var managerCount = await _warehouseContext.Users
                            .CountAsync(x => x.UserRank == 1);

                        if (managerCount <= 1)
                        {
                            return BadRequest(new
                            {
                                message = "A rendszerben legalább egy Raktárvezetőnek kell lennie."
                            });
                        }
                    }

                    user.UserName = updateUserDto.UserName;
                    user.FullName = updateUserDto.FullName;
                    user.UserRank = updateUserDto.UserRank;

                    _warehouseContext.Users.Update(user);

                    await _warehouseContext.SaveChangesAsync();

                    return Ok(new
                    {
                        message = "Sikeres frissítés.",
                        result = ToResponse(user)
                    });
                }

                return StatusCode(404, new
                {
                    message = "Nincs találat."
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(400, new
                {
                    message = "Hiba történt a felhasználó frissítése során."
                });
            }
        }
        [HttpDelete]
        [Authorize(Roles = "1")]
        public async Task<ActionResult> DeleteUser(
    [FromQuery] int id)
        {
            try
            {
                var user = await _warehouseContext.Users
                    .FirstOrDefaultAsync(x => x.IdU == id);

                if (user == null)
                {
                    return NotFound(new
                    {
                        message = "Nincs találat."
                    });
                }

                if (user.UserRank == 1)
                {
                    var managerCount = await _warehouseContext.Users
                        .CountAsync(x => x.UserRank == 1);

                    if (managerCount <= 1)
                    {
                        return BadRequest(new
                        {
                            message = "A rendszerben legalább egy Raktárvezetőnek kell lennie."
                        });
                    }
                }

                _warehouseContext.Users.Remove(user);

                await _warehouseContext.SaveChangesAsync();

                return Ok(new
                {
                    message = "Sikeres törlés.",
                    result = ToResponse(user)
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(400, new
                {
                    message = "Hiba történt a felhasználó törlése során."
                });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login(LoginDto login)
        {
            var user = _warehouseContext.Users.FirstOrDefault(u =>
                u.UserName == login.UserName);

            if (user == null || string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                return Unauthorized(new
                {
                    message = "Hibás felhasználónév vagy jelszó."
                });
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                login.Password ?? string.Empty
            );

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new
                {
                    message = "Hibás felhasználónév vagy jelszó."
                });
            }

            return Ok(new
            {
                message = "Sikeres bejelentkezés.",
                result = ToResponse(user),
                token = CreateToken(user)
            });
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword(
    [FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                var id = GetCurrentUserId();
                var user = await _warehouseContext.Users
                    .FirstOrDefaultAsync(x => x.IdU == id);

                if (user == null)
                {
                    return NotFound(new
                    {
                        message = "Nincs ilyen felhasználó."
                    });
                }

                if (string.IsNullOrWhiteSpace(user.PasswordHash) ||
                    _passwordHasher.VerifyHashedPassword(
                        user,
                        user.PasswordHash,
                        changePasswordDto.CurrentPassword ?? string.Empty
                    ) == PasswordVerificationResult.Failed)
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

                user.PasswordHash = _passwordHasher.HashPassword(
                    user,
                    changePasswordDto.NewPassword!
                );

                await _warehouseContext.SaveChangesAsync();

                return Ok(new
                {
                    message = "Sikeres jelszómódosítás."
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return BadRequest(new
                {
                    message = "Hiba történt a jelszó módosítása során."
                });
            }
        }

        [HttpPut("change-password-manager")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult> ChangeUserPassword(
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

                if (changePasswordDto.NewPassword != changePasswordDto.ConfirmPassword)
                {
                    return BadRequest(new
                    {
                        message = "A két jelszó nem egyezik."
                    });
                }

                user.PasswordHash = _passwordHasher.HashPassword(
                    user,
                    changePasswordDto.NewPassword!
                );

                _warehouseContext.Users.Update(user);

                await _warehouseContext.SaveChangesAsync();

                return Ok(new
                {
                    message = "A jelszó sikeresen módosítva."
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(400, new
                {
                    message = "Hiba történt a jelszó módosítása során."
                });
            }
        }

        private static UserResponseDto ToResponse(User user)
        {
            return new UserResponseDto
            {
                IdU = user.IdU,
                UserName = user.UserName,
                FullName = user.FullName,
                UserRank = user.UserRank
            };
        }

        private string CreateToken(User user)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.IdU.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.IdU.ToString()),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim(ClaimTypes.Role, (user.UserRank ?? 0).ToString())
        };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);
            var expirationMinutes = _configuration.GetValue<int?>(
                "Jwt:ExpirationMinutes") ?? 60;

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(claim, out var userId))
            {
                throw new UnauthorizedAccessException("Érvénytelen felhasználói azonosító.");
            }

            return userId;
        }
    }

}


