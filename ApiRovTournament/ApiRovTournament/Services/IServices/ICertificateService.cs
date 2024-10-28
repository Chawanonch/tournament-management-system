using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface ICertificateService
    {
        Task<List<Certificate>> GetCertificates();
        Task<Certificate> GetByIdCertificate(int? id);
        Task<object> CAUCertificateONE(CertificateRequest request);
        Task<object> CAUCertificate(ListCertificateRequest request);
        Task<object> RemoveCertificate(int id);
    }
}
