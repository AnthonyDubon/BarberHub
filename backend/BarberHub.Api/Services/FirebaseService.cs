using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;

namespace BarberHub.Api.Services;

public class FirebaseService
{
    public FirestoreDb Db { get; }

    public FirebaseService()
    {
        string projectId = "barberhub-1f779";

        string credentialsPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "firebase-credentials.json"
        );

        GoogleCredential credential;

        if (File.Exists(credentialsPath))
        {
            // Desarrollo local
            credential = CredentialFactory.FromFile<ServiceAccountCredential>(credentialsPath).ToGoogleCredential();
        }
        else
        {
            // Producción: credenciales del entorno
            credential = GoogleCredential.GetApplicationDefault();
        }

        Db = new FirestoreDbBuilder
        {
            ProjectId = projectId,
            GoogleCredential = credential
        }.Build();
    }
}

