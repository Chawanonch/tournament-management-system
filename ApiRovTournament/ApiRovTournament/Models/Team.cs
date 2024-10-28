using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string SchoolName { get; set; }
        public List<ListMember> ListMembers { get; set; }
        public List<ListTrainer> ListTrainers { get; set; }
        public DateTime Created { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        public int LevelId { get; set; }
        [JsonIgnore]
        public Level Level { get; set; }
    }

    public class ListMember
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public int TeamId { get; set; }
        [JsonIgnore]
        public Team Team { get; set; }
    }
    public class ListTrainer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public int TeamId { get; set; }
        [JsonIgnore]
        public Team Team { get; set; }
    }
}
