using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ApiRovTournament.Services
{
    public class TeamService : ITeamService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly ILevelService _levelService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TeamService(Context context, IMapper mapper, ILevelService levelService, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _levelService = levelService;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<List<Team>> GetTeams()
        {
            return await _context.Teams.Include(x => x.ListMembers).Include(x => x.ListTrainers).OrderBy(x=>x.SchoolName).ToListAsync();
        }
        public async Task<List<Team>> GetTeamByUser()
        {
            var email = string.Empty;
            if (_httpContextAccessor.HttpContext != null) email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);

            return await _context.Teams
                .Include(x => x.ListMembers)
                .Include(x => x.ListTrainers)
                .Where(x => x.User.Email == email)
                .OrderByDescending(x => x.Id)
                .ToListAsync();
        }

        public async Task<Team> GetByIdTeam(int? id)
        {
            var team = await _context.Teams.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (team == null) return null;
            else return team;
        }

        public async Task<object> CAUTeam(TeamRequest request)
        {
            #region user
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
            #endregion

            var result = _mapper.Map<Team>(request);

            result.ListMembers.Clear();
            result.ListTrainers.Clear();

            var numLevel = await _levelService.GetByIdLevel(request.LevelId);
            if (numLevel == null) return "Level not found!";

            result.UserId = user.Id;

            var team = await GetByIdTeam(request?.Id);
            if (team == null) await _context.Teams.AddAsync(result);
            else _context.Teams.Update(result);
            await _context.SaveChangesAsync();

            if (request?.ListMembers != null && request?.ListMembers.Count() > 0)
            {
                var lMember = await _context.ListMembers.Where(x => x.TeamId == result.Id).ToListAsync();
                if (lMember.Any())
                {
                    _context.ListMembers.RemoveRange(lMember);
                    await _context.SaveChangesAsync();
                }

                var listMember = new List<ListMember>();

                foreach (var memberDTO in request.ListMembers)
                {
                    var newListMember = new ListMember
                    {
                        Name = memberDTO.Name,
                        Position = memberDTO.Position,
                        TeamId = result.Id
                    };

                    listMember.Add(newListMember);
                }

                result.ListMembers = listMember;
                _context.Teams.Update(result);
                await _context.ListMembers.AddRangeAsync(listMember);
                await _context.SaveChangesAsync();
            }

            if (request?.ListTrainers != null && request?.ListTrainers.Count() > 0)
            {
                var lTrainer = await _context.ListTrainers.Where(x => x.TeamId == result.Id).ToListAsync();
                if (lTrainer.Any())
                {
                    _context.ListTrainers.RemoveRange(lTrainer);
                    await _context.SaveChangesAsync();
                }

                var listTrainer = new List<ListTrainer>();

                foreach (var trainerDTO in request.ListTrainers)
                {
                    var newListTrainer = new ListTrainer
                    {
                        Name = trainerDTO.Name,
                        Position = trainerDTO.Position,
                        TeamId = result.Id
                    };

                    listTrainer.Add(newListTrainer);
                }

                result.ListTrainers = listTrainer;
                _context.Teams.Update(result);
                await _context.ListTrainers.AddRangeAsync(listTrainer);
                await _context.SaveChangesAsync();
            }
            return result;
        }

        public async Task<object> RemoveTeam(int id)
        {
            var team = await GetByIdTeam(id);
            if (team == null) return null;

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();
            return team;
        }
    }
}
