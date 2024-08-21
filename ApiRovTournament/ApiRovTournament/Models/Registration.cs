using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class Registration
    {
        public int Id { get; set; }
        public int TournamentId { get; set; }
        [JsonIgnore]
        public Tournament Tournament { get; set; }
        public int TeamId { get; set; }
        [JsonIgnore]
        public Team Team { get; set; }
        public StatusTeamInTournament Status { get; set; }
        public DateTime DateRegistration { get; set; }
        public int Number {  get; set; }
    }
}
