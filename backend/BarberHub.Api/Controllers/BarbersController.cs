using BarberHub.Api.DTOs;
using BarberHub.Api.Models;
using BarberHub.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BarberHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BarbersController : ControllerBase
{
    private readonly BarberService _barberService;

    public BarbersController(BarberService barberService)
    {
        _barberService = barberService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        List<Barber> barbers =
            await _barberService.GetAllAsync();

        return Ok(barbers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        Barber? barber =
            await _barberService.GetByIdAsync(id);

        if (barber == null)
        {
            return NotFound();
        }

        return Ok(barber);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBarberDto dto)
    {
        Barber barber = new Barber
        {
            Name = dto.Name,
            Specialty = dto.Specialty
        };

        Barber createdBarber =
            await _barberService.CreateAsync(barber);

        return StatusCode(201, createdBarber);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        UpdateBarberDto dto)
    {
        Barber barber = new Barber
        {
            Name = dto.Name,
            Specialty = dto.Specialty,
            Active = dto.Active
        };

        bool updated =
            await _barberService.UpdateAsync(id, barber);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        bool deactivated =
            await _barberService.DeactivateAsync(id);

        if (!deactivated)
        {
            return NotFound();
        }

        return NoContent();
    }
}