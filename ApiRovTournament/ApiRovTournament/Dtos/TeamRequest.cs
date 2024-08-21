using ApiRovTournament.Models;
using System.Text.Json.Serialization;

namespace ApiRovTournament.Dtos
{
    public class TeamRequest
    {
        public int? Id { get; set; }
        public string SchoolName { get; set; }
        public List<ListMemberDto>? ListMembers { get; set; }
        public DateTime? Created { get; set; } = DateTime.Now;
        public int? UserId { get; set; }
        public int LevelId { get; set; }
    }

    public class ListMemberDto
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; } = "";
        public int? TeamId { get; set; }
    }
}
