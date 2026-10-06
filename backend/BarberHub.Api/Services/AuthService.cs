using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BarberHub.Api.DTOs;
using BarberHub.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace BarberHub.Api.Services;

public class AuthService
{
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<AdminUser> _passwordHasher;

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<AdminUser>();
    }

    public LoginResponseDto? Login(LoginDto dto)
    {
        string adminEmail =
            _configuration["Admin:Email"]
            ?? throw new InvalidOperationException(
                "Admin:Email no está configurado."
            );

        string adminName =
            _configuration["Admin:Name"]
            ?? throw new InvalidOperationException(
                "Admin:Name no está configurado."
            );

        string passwordHash =
            _configuration["Admin:PasswordHash"]
            ?? throw new InvalidOperationException(
                "Admin:PasswordHash no está configurado."
            );

        AdminUser admin = new AdminUser
        {
            Email = adminEmail,
            Name = adminName,
            Role = "Admin"
        };

        bool validEmail =
            string.Equals(
                dto.Email,
                admin.Email,
                StringComparison.OrdinalIgnoreCase
            );

        if (!validEmail)
        {
            return null;
        }

        PasswordVerificationResult passwordResult =
            _passwordHasher.VerifyHashedPassword(
                admin,
                passwordHash,
                dto.Password
            );

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return null;
        }

        string token = GenerateToken(admin);

        return new LoginResponseDto
        {
            Token = token,
            Name = admin.Name,
            Role = admin.Role
        };
    }

    private string GenerateToken(AdminUser admin)
    {
        string jwtKey =
            _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "Jwt:Key no está configurado."
            );

        string issuer =
            _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException(
                "Jwt:Issuer no está configurado."
            );

        string audience =
            _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException(
                "Jwt:Audience no está configurado."
            );

        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.Name, admin.Name),
            new Claim(ClaimTypes.Email, admin.Email),
            new Claim(ClaimTypes.Role, admin.Role)
        };

        SymmetricSecurityKey key =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            );

        SigningCredentials credentials =
            new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

        JwtSecurityToken token =
            new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}