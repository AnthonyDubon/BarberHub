using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// ConfiguraciÃ³n JWT
string jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "Jwt:Key no estÃ¡ configurado."
    );

string jwtIssuer =
    builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "Jwt:Issuer no estÃ¡ configurado."
    );

string jwtAudience =
    builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "Jwt:Audience no estÃ¡ configurado."
    );

// Controllers y OpenAPI
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// AutenticaciÃ³n JWT
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ClockSkew = TimeSpan.Zero
            };
    });

// AutorizaciÃ³n
builder.Services.AddAuthorization();

// CORS para Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:4200",
                "https://barberhub-1f779.web.app",
                "https://barberhub-1f779.firebaseapp.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Servicios de BarberHub
builder.Services.AddSingleton<BarberHub.Api.Services.FirebaseService>();
builder.Services.AddScoped<BarberHub.Api.Services.AppointmentService>();
builder.Services.AddScoped<BarberHub.Api.Services.ServiceService>();
builder.Services.AddScoped<BarberHub.Api.Services.BarberService>();
builder.Services.AddScoped<BarberHub.Api.Services.AuthService>();

var app = builder.Build();

// OpenAPI + Scalar solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularDev");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
