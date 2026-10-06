using BarberHub.Api.Models;
using Google.Cloud.Firestore;

namespace BarberHub.Api.Services;

public class AppointmentService
{
    private readonly CollectionReference _appointmentsCollection;

    public AppointmentService(FirebaseService firebaseService)
    {
        _appointmentsCollection =
            firebaseService.Db.Collection("appointments");
    }

    public async Task<Appointment> CreateAsync(Appointment appointment)
{
    appointment.CreatedAt = DateTime.UtcNow;
    appointment.Status = AppointmentStatus.Pending.ToString();

    if (appointment.AppointmentDate.Kind != DateTimeKind.Utc)
    {
        appointment.AppointmentDate =
            DateTime.SpecifyKind(
                appointment.AppointmentDate,
                DateTimeKind.Utc
            );
    }

    DocumentReference document =
        await _appointmentsCollection.AddAsync(appointment);

    appointment.Id = document.Id;

    return appointment;
}

    public async Task<List<Appointment>> GetAllAsync()
    {
        QuerySnapshot snapshot =
            await _appointmentsCollection.GetSnapshotAsync();

        List<Appointment> appointments = snapshot.Documents
            .Select(document => document.ConvertTo<Appointment>())
            .ToList();

        return appointments;
    }

    public async Task<Appointment?> GetByIdAsync(string id)
    {
        DocumentReference document =
            _appointmentsCollection.Document(id);

        DocumentSnapshot snapshot =
            await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return null;
        }

        return snapshot.ConvertTo<Appointment>();
    }

    public async Task<AppointmentActionResult> ConfirmAsync(string id)
    {
        DocumentReference document =
            _appointmentsCollection.Document(id);

        DocumentSnapshot snapshot =
            await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return AppointmentActionResult.NotFound;
        }

        Appointment appointment =
            snapshot.ConvertTo<Appointment>();

        if (appointment.Status != AppointmentStatus.Pending.ToString())
        {
            return AppointmentActionResult.InvalidStatus;
        }

        await document.UpdateAsync(
            "Status",
            AppointmentStatus.Confirmed.ToString()
        );

        return AppointmentActionResult.Success;
    }

    public async Task<AppointmentActionResult> RejectAsync(string id)
    {
        DocumentReference document =
            _appointmentsCollection.Document(id);

        DocumentSnapshot snapshot =
            await document.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return AppointmentActionResult.NotFound;
        }

        Appointment appointment =
            snapshot.ConvertTo<Appointment>();

        if (appointment.Status != AppointmentStatus.Pending.ToString())
        {
            return AppointmentActionResult.InvalidStatus;
        }

        await document.UpdateAsync(
            "Status",
            AppointmentStatus.Rejected.ToString()
        );

        return AppointmentActionResult.Success;
    }
}