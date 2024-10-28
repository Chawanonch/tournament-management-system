using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class Competition
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CompetitionList
    {
        public int Id { get; set; }
        public DateTime DateTimeYear { get; set; }
        public int CompetitionId { get; set; }
        [JsonIgnore]
        public Competition Competition { get; set; }
        public List<ListNameCompetitionDetails> Details { get; set; }
    }

    public class ListNameCompetitionDetails
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public int CompetitionListId { get; set; }
        [JsonIgnore]
        public CompetitionList CompetitionList { get; set; }
    }
}
