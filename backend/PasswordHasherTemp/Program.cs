using Microsoft.AspNetCore.Identity;

Console.Write("Contraseña: ");

string password = Console.ReadLine() ?? string.Empty;

PasswordHasher<object> hasher = new();

string hash = hasher.HashPassword(
    new object(),
    password
);

Console.WriteLine();
Console.WriteLine("HASH:");
Console.WriteLine(hash);