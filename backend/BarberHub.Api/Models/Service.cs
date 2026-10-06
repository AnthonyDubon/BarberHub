using Google.Cloud.Firestore;

namespace BarberHub.Api.Models;

[FirestoreData]
public class Service
{
    [FirestoreDocumentId]
    public string Id { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Name { get; set; } = string.Empty;

    [FirestoreProperty]
    public double Price { get; set; }

    [FirestoreProperty]
    public int DurationMinutes { get; set; }

    [FirestoreProperty]
    public bool Active { get; set; } = true;

    [FirestoreProperty]
    public DateTime CreatedAt { get; set; }
}