using BarberHub.Api.Models;
using BarberHub.Api.Services;
using Microsoft.AspNetCore.Mvc;
using BarberHub.Api.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace BarberHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppointmentService _appointmentService;

    public AppointmentsController(AppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

[AllowAnonymous]
   [HttpPost]
public async Task<IActionResult> Create(CreateAppointmentDto dto)
{
    Appointment appointment = new Appointment
    {
        ClientName = dto.ClientName,
        ClientPhone = dto.ClientPhone,
        ServiceId = dto.ServiceId,
        BarberId = dto.BarberId,
        AppointmentDate = dto.AppointmentDate
    };

    Appointment createdAppointment =
        await _appointmentService.CreateAsync(appointment);

    return StatusCode(201, createdAppointment);
}

[Authorize]
[HttpGet]
public async Task<IActionResult> GetAll()
{
    List<Appointment> appointments =
        await _appointmentService.GetAllAsync();

    return Ok(appointments);
}

[Authorize]
[HttpGet("{id}")]
public async Task<IActionResult> GetById(string id)
{
    Appointment? appointment =
        await _appointmentService.GetByIdAsync(id);

    if (appointment == null)
    {
        return NotFound();
    }

    return Ok(appointment);
}

[Authorize]
[HttpPatch("{id}/confirm")]
public async Task<IActionResult> Confirm(string id)
{
    AppointmentActionResult result =
        await _appointmentService.ConfirmAsync(id);

    if (result == AppointmentActionResult.NotFound)
    {
        return NotFound();
    }

    if (result == AppointmentActionResult.InvalidStatus)
    {
        return Conflict();
    }

    return NoContent();
}

[Authorize]
[HttpPatch("{id}/reject")]
public async Task<IActionResult> Reject(string id)
{
    AppointmentActionResult result =
        await _appointmentService.RejectAsync(id);

    if (result == AppointmentActionResult.NotFound)
    {
        return NotFound();
    }

    if (result == AppointmentActionResult.InvalidStatus)
    {
        return Conflict();
    }

    return NoContent();
}
}