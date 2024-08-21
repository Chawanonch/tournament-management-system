using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public int RoleId { get; set; }
        [JsonIgnore]
        public Role Role { get; set; }
    }
}
