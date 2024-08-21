using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class Match
    {
        public int Id { get; set; }

        public int TournamentId { get; set; }
        [ForeignKey("TournamentId")]
        [JsonIgnore]
        public Tournament Tournament { get; set; }

        public int Team1Id { get; set; }
        [ForeignKey("Team1Id")]
        [JsonIgnore]
        public Registration Team1 { get; set; } 
        public int Team2Id { get; set; }
        [ForeignKey("Team2Id")]
        [JsonIgnore]
        public Registration Team2 { get; set; } 
        public int WinnerTeamId { get; set; }
        public DateTime MatchDate { get; set; }
        public int Round { get; set; }
    }
}
