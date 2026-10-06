using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;

namespace BarberHub.Api.Services;

public class FirebaseService
{
    public FirestoreDb Db { get; }

    public FirebaseService()
    {
        string credentialsPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "firebase-credentials.json"
        );

        string projectId = "barberhub-1f779";

        GoogleCredential credential =
            CredentialFactory
                .FromFile<ServiceAccountCredential>(credentialsPath)
                .ToGoogleCredential();

        Db = new FirestoreDbBuilder
        {
            ProjectId = projectId,
            GoogleCredential = credential
        }.Build();
    }
}