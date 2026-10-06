namespace BarberHub.Api.DTOs;

public class UpdateBarberDto
{
    public string Name { get; set; } = string.Empty;

    public string Specialty { get; set; } = string.Empty;

    public bool Active { get; set; }
}