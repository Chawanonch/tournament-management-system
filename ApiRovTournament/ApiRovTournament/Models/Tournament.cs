using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class Tournament
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime DateCreated { get; set; }
        public List<ListLevel> ListLevels { get; set; }
        public bool IsHide { get; set; }
    }
    public class ListLevel
    {
        public int Id { get; set; }
        public int LevelId { get; set; }
        [JsonIgnore]
        public Level Level { get; set; }
        public int TournamentId { get; set; }
        [JsonIgnore]
        public Tournament Tournament { get; set; }
    }
}
