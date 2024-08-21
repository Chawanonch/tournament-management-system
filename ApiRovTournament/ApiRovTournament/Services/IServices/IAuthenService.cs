using ApiRovTournament.Dtos;
using ApiRovTournament.Models;

namespace ApiRovTournament.Services.IServices
{
    public interface IAuthenService
    {
        Task<List<User>> GetUsers();
        Task<List<Role>> GetRoles();
        Task<User> Register(RegisterDto dto);
        Task<string> Login(LoginDto dto);
        Task<Object> GetUserDetail();
        Task<User> GetUser();
        Task<bool> IsTokenExpired(string token);
        Task<object> RemoveUser(int id);

    }
}
