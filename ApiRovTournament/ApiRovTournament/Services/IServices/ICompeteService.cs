using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface ICompeteService
    {
        Task<List<Compete>> GetCompetes();
        Task<Compete> GetByIdCompete(int? id);
        Task<object> CAUCompete(CompeteRequest request);
        Task<object> StatusHideCompete(int id);
        Task<object> StatusHideCompetes(int year);
        Task<object> RemoveCompete(int id);
    }
}
