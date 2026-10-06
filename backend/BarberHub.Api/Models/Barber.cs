using Google.Cloud.Firestore;

namespace BarberHub.Api.Models;

[FirestoreData]
public class Barber
{
    [FirestoreDocumentId]
    public string Id { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Name { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Specialty { get; set; } = string.Empty;

    [FirestoreProperty]
    public bool Active { get; set; } = true;

    [FirestoreProperty]
    public DateTime CreatedAt { get; set; }
}