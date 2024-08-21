using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface ITeamService
    {
        Task<List<Team>> GetTeams();
        Task<List<Team>> GetTeamByUser();
        Task<Team> GetByIdTeam(int? id);
        Task<object> CAUTeam(TeamRequest request);
        Task<object> RemoveTeam(int id);
    }
}
