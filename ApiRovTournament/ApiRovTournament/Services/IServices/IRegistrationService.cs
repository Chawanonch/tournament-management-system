using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface IRegistrationService
    {
        Task<List<Registration>> GetRegistrations();
        Task<Registration> GetByIdRegistration(int? id);
        Task<object> Registration(RegistrationRequest request);
        Task<object> CheckInRegistrations(int id);
        Task<object> CheckInAllRegistrations(int id);
        Task<object> CancelCheckInAllRegistrations(int id);
        Task<object> RemoveRegistration(int id);
    }
}
