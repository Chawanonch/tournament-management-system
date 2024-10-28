using ApiRovTournament.Models;
using System.Text.Json.Serialization;

namespace ApiRovTournament.Dtos
{
    public class CertificateRequest
    {
        public int? Id { get; set; }
        public string Name { get; set; } // ชื่อรายการ
        public string Rank { get; set; } // รางวัล
        public int TeamId { get; set; }
        public string? Image { get; set; } = string.Empty;
        public int? CertificateNumber { get; set; } = 0;
        public DateTime? DateTime { get; set; }
        public int? TextInImageId { get; set; }
        public List<ListSignerDetailDto>? ListSignerDetails { get; set; }
    }
    public class ListCertificateRequest
    {
        public int? Id { get; set; }
        public List<CertificateRequest> CertificateRequests { get; set; }
        public int TextInImageId { get; set; }
        public List<ListSignerDetailDto> ListSignerDetails { get; set; }
    }

    public class ListSignerDetailDto
    {
        public int? Id { get; set; }
        public int SignerDetailId { get; set; }
        public int? CertificateId { get; set; }
    }
}
