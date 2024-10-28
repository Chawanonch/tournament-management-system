using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface ITextInImageService
    {
        Task<List<TextInImage>> GetTextInImages();
        Task<TextInImage> GetByIdTextInImage(int? id);
        Task<object> CAUTextInImage(TextInImageRequest request);
        Task<object> RemoveTextInImage(int id);
    }
}
