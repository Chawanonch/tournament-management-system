using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface IAllDetailService
    {
        Task<List<AllDetail>> GetAllDetails();
        Task<AllDetail> GetByIdAllDetail(int? id);
        Task<object> CAUAllDetail(AllDetailRequest request);
        Task<object> RemoveAllDetail(int id);
    }
}
