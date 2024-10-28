namespace ApiRovTournament.Dtos
{
    public class SignerDetailRequest
    {
        public int? Id { get; set; }
        public string FullName { get; set; }
        public string Position { get; set; }
        public IFormFile? SignatureImageUrl { get; set; }
    }
}
