using BarberHub.Api.DTOs;
using BarberHub.Api.Models;
using BarberHub.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BarberHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly ServiceService _serviceService;

    public ServicesController(ServiceService serviceService)
    {
        _serviceService = serviceService;
    }

[AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        List<Service> services =
            await _serviceService.GetAllAsync();

        return Ok(services);
    }
[AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        Service? service =
            await _serviceService.GetByIdAsync(id);

        if (service == null)
        {
            return NotFound();
        }

        return Ok(service);
    }

[AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Create(CreateServiceDto dto)
    {
        Service service = new Service
        {
            Name = dto.Name,
            Price = dto.Price,
            DurationMinutes = dto.DurationMinutes
        };

        Service createdService =
            await _serviceService.CreateAsync(service);

        return StatusCode(201, createdService);
    }

[AllowAnonymous]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        string id,
        UpdateServiceDto dto)
    {
        Service service = new Service
        {
            Name = dto.Name,
            Price = dto.Price,
            DurationMinutes = dto.DurationMinutes,
            Active = dto.Active
        };

        bool updated =
            await _serviceService.UpdateAsync(id, service);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

[AllowAnonymous]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        bool deactivated =
            await _serviceService.DeactivateAsync(id);

        if (!deactivated)
        {
            return NotFound();
        }

        return NoContent();
    }
}