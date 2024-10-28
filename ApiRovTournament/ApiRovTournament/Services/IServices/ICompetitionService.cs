using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface ICompetitionService
    {
        Task<List<Competition>> GetCompetitions();
        Task<Competition> GetByIdCompetition(int? id);
        Task<object> CAUCompetition(CompetitionRequest request);
        Task<object> RemoveCompetition(int id);

        Task<List<CompetitionList>> GetCompetitionLists();
        Task<object> CAUCompetitionList(CompetitionListDto request);
        Task<object> RemoveCompetitionList(int id);
    }
}
