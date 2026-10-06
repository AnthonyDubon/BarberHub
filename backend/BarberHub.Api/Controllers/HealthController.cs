using BarberHub.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BarberHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly FirebaseService _firebaseService;

    public HealthController(FirebaseService firebaseService)
    {
        _firebaseService = firebaseService;
    }

    [HttpGet]
    public async Task<IActionResult> GetHealth()
    {
        var testCollection = _firebaseService.Db.Collection("health-check");
        var snapshot = await testCollection.Limit(1).GetSnapshotAsync();

        return Ok(new
        {
            status = "ok",
            message = "BarberHub API is running",
            firestore = "connected"
        });
    }
}