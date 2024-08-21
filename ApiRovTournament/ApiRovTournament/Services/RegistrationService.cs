using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ApiRovTournament.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly ITournamentService _tournamentService;
        private readonly ITeamService _teamService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RegistrationService(Context context, IMapper mapper, ITournamentService tournamentService, ITeamService teamService, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _tournamentService = tournamentService;
            _teamService = teamService;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<List<Registration>> GetRegistrations()
        {
            return await _context.Registrations.OrderBy(x => x.Number).Include(x => x.Tournament).Include(x => x.Team).ToListAsync();
        }
        public async Task<Registration> GetByIdRegistration(int? id)
        {
            var registration = await _context.Registrations.Include(x => x.Tournament).Include(x => x.Team).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (registration == null) return null;
            else return registration;
        }

        public async Task<object> Registration(RegistrationRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var result = _mapper.Map<Registration>(request);

                var email = string.Empty;
                if (request.UserId != null)
                {
                    var userById = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId);
                    if (userById == null) return "User not found.";
                    email = userById.Email;
                }
                else if (_httpContextAccessor.HttpContext != null)
                {
                    var users = _httpContextAccessor.HttpContext.User;
                    if (users != null) email = users.FindFirstValue(ClaimTypes.Email);

                    if (string.IsNullOrEmpty(email)) return "Email not found in HttpContext.";
                }

                var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
                if (user == null) return "User not found.";

                var numTournament = await _tournamentService.GetByIdTournament(request.TournamentId);
                if (numTournament == null) return "Tournament not found!";

                // ตรวจสอบว่ามีทีมอยู่แล้วหรือยัง ถ้าไม่มีให้สร้างทีมใหม่
                var numTeam = await _teamService.GetByIdTeam(request.TeamId ?? 0);

                if (request.TeamId != null && numTeam != null)
                {
                    var existingRegistration = await _context.Registrations
                        .FirstOrDefaultAsync(r => r.TeamId == numTeam.Id && r.TournamentId == request.TournamentId);

                    if (existingRegistration != null) return "Duplicate registration!";

                    var foundLevel = numTournament.ListLevels?.Any(item => item.LevelId == numTeam.LevelId) ?? false;
                    if (!foundLevel) return "Level not found!";

                    var maxNumber0 = (await _context.Registrations
                        .Where(r => r.TournamentId == request.TournamentId)
                        .MaxAsync(r => (int?)r.Number)) ?? 0;

                    result.Number = maxNumber0 + 1;

                    result.TeamId = numTeam.Id;

                    var registration = await GetByIdRegistration(request?.Id);
                    if (registration == null) await _context.Registrations.AddAsync(result);
                    else _context.Registrations.Update(result);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                    return result;
                }

                // สร้างทีมใหม่
                if (numTeam == null)
                {
                    if (numTournament.ListLevels == null || !numTournament.ListLevels.Any())
                        return "No levels found in the tournament!";

                    result.Status = StatusTeamInTournament.Pedding;

                    var teamRequest = new TeamRequest
                    {
                        SchoolName = request.TeamName ?? "Bot Team",
                        Created = DateTime.Now,
                        UserId = user.Id,
                        LevelId = numTournament.ListLevels[0].LevelId,
                        ListMembers = new List<ListMemberDto>() // สามารถเพิ่มสมาชิกทีมได้ตามต้องการ
                    };

                    var newTeam = _mapper.Map<Team>(teamRequest);
                    await _context.Teams.AddAsync(newTeam);
                    await _context.SaveChangesAsync();
                    numTeam = newTeam; // ใช้ทีมที่สร้างใหม่สำหรับการลงทะเบียน
                }

                var existingRegistrationForNewTeam = await _context.Registrations
                    .FirstOrDefaultAsync(r => r.TeamId == numTeam.Id && r.TournamentId == request.TournamentId);

                if (existingRegistrationForNewTeam != null) return "Duplicate registration!";

                var maxNumber = (await _context.Registrations
                    .Where(r => r.TournamentId == request.TournamentId)
                    .MaxAsync(r => (int?)r.Number)) ?? 0;

                result.Number = maxNumber + 1;

                result.TeamId = numTeam.Id;

                var registrationForNewTeam = await GetByIdRegistration(request?.Id);
                if (registrationForNewTeam == null) await _context.Registrations.AddAsync(result);
                else _context.Registrations.Update(result);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return result;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw; // หรือจัดการข้อผิดพลาดตามที่ต้องการ
            }
        }


        public async Task<object> CheckInRegistrations(int id)
        {
            var registration = await _context.Registrations.FirstOrDefaultAsync(x => x.Id == id);
            if (registration == null) return null;

            if (registration.Status == StatusTeamInTournament.Active) registration.Status = StatusTeamInTournament.Pedding;
            else registration.Status = StatusTeamInTournament.Active;

            registration.DateRegistration = DateTime.Now;

            _context.Registrations.Update(registration);
            await _context.SaveChangesAsync();
            return registration;
        }
        public async Task<object> CheckInAllRegistrations(int id)
        {
            var registrations = await _context.Registrations
                                              .Where(x => x.TournamentId == id && x.Status == StatusTeamInTournament.Pedding)
                                              .ToListAsync();

            if (registrations == null || !registrations.Any()) return null;

            foreach (var registration in registrations)
            {
                registration.Status = StatusTeamInTournament.Active;
                registration.DateRegistration = DateTime.Now;
            }

            _context.Registrations.UpdateRange(registrations);
            await _context.SaveChangesAsync();

            return registrations;
        }
        public async Task<object> CancelCheckInAllRegistrations(int id)
        {
            var registrations = await _context.Registrations
                                              .Where(x => x.TournamentId == id && x.Status == StatusTeamInTournament.Active)
                                              .ToListAsync();

            if (registrations == null || !registrations.Any()) return null;

            foreach (var registration in registrations)
            {
                registration.Status = StatusTeamInTournament.Pedding;
                registration.DateRegistration = DateTime.Now;
            }

            _context.Registrations.UpdateRange(registrations);
            await _context.SaveChangesAsync();

            return registrations;
        }
        public async Task<object> RemoveRegistration(int id)
        {
            var registration = await GetByIdRegistration(id);
            if (registration == null) return null;

            _context.Registrations.Remove(registration);
            await _context.SaveChangesAsync();
            return registration;
        }
    }
}
