using ApiRovTournament.Models;
using System.Text.Json.Serialization;

namespace ApiRovTournament.Dtos
{
    public class CompeteRequest
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? DateCreated { get; set; }
        public bool? IsHide { get; set; } = false;
        public int CompetitionListId { get; set; }
        public List<ListLevelCompeteDto> ListLevelCompetes { get; set; }
    }

    public class ListLevelCompeteDto
    {
        public int? Id { get; set; }
        public int LevelId { get; set; }
        public int? CompeteId { get; set; }
    }

}
