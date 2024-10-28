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

        Task<List<RegistrationCompete>> GetRegistrationCompetes();
        Task<RegistrationCompete> GetByIdRegistrationCompete(int? id);
        Task<object> RegistrationCompete(RegistrationCompeteRequest request);
        Task<object> CheckInRegistrationCompetes(int id);
        Task<object> CheckInAllRegistrationCompetes(int id);
        Task<object> CancelCheckInAllRegistrationCompetes(int id);
        Task<object> RemoveRegistrationCompete(int id);
    }
}
