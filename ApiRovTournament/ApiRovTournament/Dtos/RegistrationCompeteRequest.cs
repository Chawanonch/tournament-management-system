using ApiRovTournament.Models;

namespace ApiRovTournament.Dtos
{
    public class RegistrationCompeteRequest
    {
        public int? Id { get; set; }
        public int CompeteId { get; set; }
        public int? TeamId { get; set; } //ถ้ากรอกเลข ไม่ต้องกรอกชื้อทีม
        public string? TeamName { get; set; }
        public StatusTeamInCompete? Status { get; set; } = StatusTeamInCompete.Pedding;
        public DateTime? DateRegistration { get; set; } = DateTime.Now;
        public int? UserId { get; set; } // เพิ่ม UserId เพื่อระบุผู้ใช้
        public int? Number { get; set; }
    }
}
