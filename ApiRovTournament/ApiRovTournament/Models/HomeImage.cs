using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class HomeImage
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public ICollection<HomeImages> HoomImages { get; set; }
    }
    public class HomeImages
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public int HomeImageId { get; set; }
        [JsonIgnore]
        public HomeImage HomeImage { get; set; }
    }
}
