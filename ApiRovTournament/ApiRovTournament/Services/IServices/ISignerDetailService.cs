using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface ISignerDetailService
    {
        Task<List<SignerDetail>> GetSignerDetails();
        Task<SignerDetail> GetByIdSignerDetail(int? id);
        Task<object> CAUSignerDetail(SignerDetailRequest request);
        Task<object> RemoveSignerDetail(int id);
    }
}
