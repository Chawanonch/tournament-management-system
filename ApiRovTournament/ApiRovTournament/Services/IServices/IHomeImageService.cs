using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface IHomeImageService
    {
        Task<List<HomeImage>> GetHomeImages();
        Task<HomeImage> GetByIdHomeImages(int? id);
        Task<object> CAUHomeImages(HomeImagesRequest request);
        Task<object> RemoveHomeImages(int id);
    }
}
