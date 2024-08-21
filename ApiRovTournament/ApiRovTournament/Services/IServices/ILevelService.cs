using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface ILevelService
    {
        Task<List<Level>> GetLevels();
        Task<Level> GetByIdLevel(int? id);
        Task<object> CAULevel(LevelRequest request);
        Task<object> RemoveLevel(int id);
    }
}
