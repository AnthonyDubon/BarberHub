using Google.Cloud.Firestore;

namespace BarberHub.Api.Models;

[FirestoreData]
public class Appointment
{
    [FirestoreDocumentId]
    public string Id { get; set; } = string.Empty;

    [FirestoreProperty]
    public string ClientName { get; set; } = string.Empty;

    [FirestoreProperty]
    public string ClientPhone { get; set; } = string.Empty;

    [FirestoreProperty]
    public string ServiceId { get; set; } = string.Empty;

    [FirestoreProperty]
    public string BarberId { get; set; } = string.Empty;

    [FirestoreProperty]
    public DateTime AppointmentDate { get; set; }

    [FirestoreProperty]
    public string Status { get; set; } = "Pending";

    [FirestoreProperty]
    public DateTime CreatedAt { get; set; }
}