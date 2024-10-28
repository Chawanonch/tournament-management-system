using ApiRovTournament.Models;
using System.Text.Json.Serialization;

namespace ApiRovTournament.Dtos
{
    public class CompetitionRequest
    {
        public int? Id { get; set; }
        public string Name { get; set; }
    }

    public class CompetitionListDto
    {
        public int? Id { get; set; }
        public DateTime DateTimeYear { get; set; }
        public int CompetitionId { get; set; }
        public List<ListNameCompetitionDetailsDto> Details { get; set; }
    }

    public class ListNameCompetitionDetailsDto
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public int? CompetitionListId { get; set; }
    }
}
