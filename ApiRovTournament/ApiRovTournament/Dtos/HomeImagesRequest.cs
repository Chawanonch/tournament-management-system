using ApiRovTournament.Models;

namespace ApiRovTournament.Dtos
{
    public class HomeImagesRequest
    {
        public int? Id { get; set; }
        public string? Text { get; set; }
        public IFormFileCollection? images { get; set; }
    }
}
