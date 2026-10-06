namespace BarberHub.Api.DTOs;

public class CreateAppointmentDto
{
    public string ClientName { get; set; } = string.Empty;

    public string ClientPhone { get; set; } = string.Empty;

    public string ServiceId { get; set; } = string.Empty;

    public string BarberId { get; set; } = string.Empty;

    public DateTime AppointmentDate { get; set; }
}