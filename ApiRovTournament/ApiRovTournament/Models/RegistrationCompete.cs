using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class RegistrationCompete
    {
        public int Id { get; set; }
        public int CompeteId { get; set; }
        [JsonIgnore]
        public Compete Compete { get; set; }
        public int TeamId { get; set; }
        [JsonIgnore]
        public Team Team { get; set; }
        public StatusTeamInCompete Status { get; set; }
        public DateTime DateRegistration { get; set; }
        public int Number { get; set; }
    }
}
