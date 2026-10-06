namespace BarberHub.Api.DTOs;

public class UpdateServiceDto
{
    public string Name { get; set; } = string.Empty;

    public double Price { get; set; }

    public int DurationMinutes { get; set; }

    public bool Active { get; set; }
}