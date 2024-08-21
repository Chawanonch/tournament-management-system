using ApiRovTournament.Models;
using System.Text.Json.Serialization;

namespace ApiRovTournament.Dtos
{
    public class TournamentRequest
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? DateCreated { get; set; }
        public List<ListLevelDto> ListLevels { get; set; }
        public bool? IsHide { get; set; } = false;
    }

    public class ListLevelDto
    {
        public int? Id { get; set; }
        public int LevelId { get; set; }
        public int? TournamentId { get; set; }
    }
}
