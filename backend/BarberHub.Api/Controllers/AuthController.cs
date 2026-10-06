using BarberHub.Api.DTOs;
using BarberHub.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        LoginResponseDto? response =
            _authService.Login(dto);

        if (response == null)
        {
            return Unauthorized(new
            {
                message = "Email o contraseña incorrectos."
            });
        }

        return Ok(response);
    }
}