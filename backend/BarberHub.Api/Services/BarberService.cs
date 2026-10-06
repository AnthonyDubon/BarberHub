using BarberHub.Api.Models;
using Google.Cloud.Firestore;

namespace BarberHub.Api.Services;

public class BarberService
{
    private readonly CollectionReference _barbersCollection;

    public BarberService(FirebaseService firebaseService)
    {
        _barbersCollection =
            firebaseService.Db.Collection("barbers");
    }

    public async Task<List<Barber>> GetAllAsync()
    {
        QuerySnapshot snapshot =
            await _barbersCollection.GetSnapshotAsync();

        List<Barber> barbers = snapshot.Documents
            .Select(document => document.ConvertTo<Barber>())
            .ToList();

        return barbers;
    }

    public async Task<Barber?> GetByIdAsync(string id)
    {
        DocumentReference document =
            _barbersCollection.Document(id);

        DocumentSnapshot snapshot =
            await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return null;
        }

        return snapshot.ConvertTo<Barber>();
    }

    public async Task<Barber> CreateAsync(Barber barber)
    {
        barber.Active = true;
        barber.CreatedAt = DateTime.UtcNow;

        DocumentReference document =
            await _barbersCollection.AddAsync(barber);

        barber.Id = document.Id;

        return barber;
    }

    public async Task<bool> UpdateAsync(
        string id,
        Barber barber)
    {
        DocumentReference document =
            _barbersCollection.Document(id);

        DocumentSnapshot snapshot =
            await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return false;
        }

        Dictionary<string, object> updates = new()
        {
            { "Name", barber.Name },
            { "Specialty", barber.Specialty },
            { "Active", barber.Active }
        };

        await document.UpdateAsync(updates);

        return true;
    }

    public async Task<bool> DeactivateAsync(string id)
    {
        DocumentReference document =
            _barbersCollection.Document(id);

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