using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface IMatchService
    {
        Task<List<Match>> GetMatchs();
        Task<Match> GetByIdMatch(int? id);
        Task<object> RandomMatchs(RandomMatchDto dto);
        Task<string> UpdateMatchResult(UpdateMatchDto dto);
        Task<object> RemoveMatch(int id);
        Task<object> ResetTeamsAndDeleteMatches(int id);
    }
}
