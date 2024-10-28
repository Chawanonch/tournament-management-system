using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class Compete
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime DateCreated { get; set; }
        public bool IsHide { get; set; }
        public int CompetitionListId { get; set; }
        [JsonIgnore]
        public CompetitionList CompetitionList { get; set; }
        public List<ListLevelCompete> ListLevelCompetes { get; set; }
    }
    public class ListLevelCompete
    {
        public int Id { get; set; }
        public int LevelId { get; set; }
        [JsonIgnore]
        public Level Level { get; set; }
        public int CompeteId { get; set; }
        [JsonIgnore]
        public Compete Compete { get; set; }
    }
}
