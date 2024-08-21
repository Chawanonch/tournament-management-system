using ApiRovTournament.Models;
using System.Text.Json.Serialization;

namespace ApiRovTournament.Dtos
{
    public class RegistrationRequest
    {
        public int? Id { get; set; }
        public int TournamentId { get; set; }
        public int? TeamId { get; set; } //ถ้ากรอกเลข ไม่ต้องกรอกชื้อทีม
        public string? TeamName { get; set; }
        public StatusTeamInTournament? Status { get; set; } = StatusTeamInTournament.Pedding;
        public DateTime? DateRegistration { get; set; } = DateTime.Now;
        public int? UserId { get; set; } // เพิ่ม UserId เพื่อระบุผู้ใช้
        public int? Number { get; set; }
    }
}
