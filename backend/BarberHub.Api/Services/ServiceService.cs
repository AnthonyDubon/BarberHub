using BarberHub.Api.Models;
using Google.Cloud.Firestore;

namespace BarberHub.Api.Services;

public class ServiceService
{
    private readonly CollectionReference _servicesCollection;

    public ServiceService(FirebaseService firebaseService)
    {
        _servicesCollection =
            firebaseService.Db.Collection("services");
    }

    public async Task<List<Service>> GetAllAsync()
    {
        QuerySnapshot snapshot =
            await _servicesCollection.GetSnapshotAsync();

        List<Service> services = snapshot.Documents
            .Select(document => document.ConvertTo<Service>())
            .ToList();

        return services;
    }

    public async Task<Service?> GetByIdAsync(string id)
    {
        DocumentReference document =
            _servicesCollection.Document(id);

        DocumentSnapshot snapshot =
            await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return null;
        }

        return snapshot.ConvertTo<Service>();
    }

    public async Task<Service> CreateAsync(Service service)
    {
        service.Active = true;
        service.CreatedAt = DateTime.UtcNow;

        DocumentReference document =
            await _servicesCollection.AddAsync(service);

        service.Id = document.Id;

        return service;
    }

    public async Task<bool> UpdateAsync(
        string id,
        Service service)
    {
        DocumentReference document =
            _servicesCollection.Document(id);

        DocumentSnapshot snapshot =
            await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return false;
        }

        Dictionary<string, object> updates = new()
        {
            { "Name", service.Name },
            { "Price", service.Price },
            { "DurationMinutes", service.DurationMinutes },
            { "Active", service.Active }
        };

        await document.UpdateAsync(updates);

        return true;
    }

    public async Task<bool> DeactivateAsync(string id)
    {
        DocumentReference document =
            _servicesCollection.Document(id);

        DocumentSnapshot snapshot =
            await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return false;
        }

        await document.UpdateAsync("Active", false);

        return true;
    }
}