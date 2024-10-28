using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface ITournamentService
    {
        Task<List<Tournament>> GetTournaments();
        Task<Tournament> GetByIdTournament(int? id);
        Task<object> CAUTournament(TournamentRequest request);
        Task<object> StatusHideTournament(int id);
        Task<object> StatusHideTournaments(int year);
        Task<object> RemoveTournament(int id);
    }
}
