namespace BarberHub.Api.DTOs;

public class CreateServiceDto
{
    public string Name { get; set; } = string.Empty;

    public double Price { get; set; }

    public int DurationMinutes { get; set; }
}