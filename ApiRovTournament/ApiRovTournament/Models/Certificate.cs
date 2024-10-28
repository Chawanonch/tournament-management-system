using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiRovTournament.Models
{
    public class Certificate
    {
        public int Id { get; set; }
        public string Name { get; set; } // ชื่อรายการ
        public string Rank { get; set; } // รางวัล
        public int TeamId { get; set; }
        [JsonIgnore]
        public Team Team { get; set; }
        public string Image { get; set; } // URL หรือ path ของลายเซ็น
        public int CertificateNumber { get; set; } // เลขเกียรติบัตร
        public DateTime DateTime { get; set; }
        public int TextInImageId { get; set; }
        [JsonIgnore]
        public TextInImage TextInImage { get; set; }
        public List<ListSignerDetail> ListSignerDetails { get; set; }
    }

    public class ListSignerDetail
    {
        public int Id { get; set; }
        public int SignerDetailId { get; set; }
        [JsonIgnore]
        public SignerDetail SignerDetail { get; set; }
        public int CertificateId { get; set; }
        [JsonIgnore]
        public Certificate Certificate { get; set; }
    }
}
