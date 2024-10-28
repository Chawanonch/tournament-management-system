using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;
using Match = ApiRovTournament.Models.Match;

namespace ApiRovTournament.Services
{
    public class MatchService : IMatchService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MatchService(Context context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<List<Match>> GetMatchs()
        {
            return await _context.Matchs.Include(x => x.Tournament).Include(x => x.Team1).Include(x => x.Team2).ToListAsync();
        }
        public async Task<Match> GetByIdMatch(int? id)
        {
            var match = await _context.Matchs.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (match == null) return null;
            else return match;
        }

        public async Task<object> RandomMatchs(RandomMatchDto dto)
        {
            var email = string.Empty;
            if (_httpContextAccessor.HttpContext != null)
            {
                var users = _httpContextAccessor.HttpContext.User;
                if (users != null) email = users.FindFirstValue(ClaimTypes.Email);

                if (string.IsNullOrEmpty(email)) return "Email not found in HttpContext.";
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null) return "User not found.";

            var checkRound = dto.notOneRound == null || dto.notOneRound == 0;

            var query = _context.Registrations
                .Where(r => r.TournamentId == dto.tournamentId && r.Number != 0);

            if (checkRound == true) query = query.Where(r => r.TournamentId == dto.tournamentId && r.Status == StatusTeamInTournament.Active);
            else query = query.Where(r => r.TournamentId == dto.tournamentId && r.Status == StatusTeamInTournament.Winning);

            var teamsToConsider = await query.ToListAsync();

            if (teamsToConsider.Count < 2) return "Not enough teams to create matches!";

            if (teamsToConsider.Count % 2 != 0)
            {
                var numTournament = await _context.Tournaments.Include(x => x.ListLevels).FirstOrDefaultAsync(x => x.Id == dto.tournamentId);
                if (numTournament == null) return "Tournament not found!";

                var teamRequest = new TeamRequest
                {
                    SchoolName = "Bot Team",
                    Created = DateTime.Now,
                    UserId = user.Id,
                    LevelId = numTournament.ListLevels[0].LevelId,
                    ListMembers = new List<ListMemberDto>()
                };

                var botTeam = _mapper.Map<Team>(teamRequest);
                await _context.Teams.AddAsync(botTeam);
                await _context.SaveChangesAsync();

                var registrationRequest = new RegistrationRequest
                {
                    TeamId = botTeam.Id,
                    TournamentId = dto.tournamentId,
                    Status = StatusTeamInTournament.Winning,
                };
                var botRegistration = _mapper.Map<Registration>(registrationRequest);
                await _context.Registrations.AddAsync(botRegistration);
                await _context.SaveChangesAsync();

                teamsToConsider.Add(botRegistration);
            }

            Random random = new Random();
            var matches = new List<Match>();

            //teamsToConsider = teamsToConsider.OrderBy(x => checkRound ? random.Next() : x.Id).ToList();
            teamsToConsider = teamsToConsider.OrderBy(x => random.Next()).ToList();

            var maxRoundForTournament = await _context.Matchs
                .Where(m => m.TournamentId == dto.tournamentId) // กรองเฉพาะ TournamentId นี้
                .MaxAsync(m => (int?)m.Round) ?? 0;

            for (int i = 0; i < teamsToConsider.Count - 1; i += 2)
            {
                var match = new Match
                {
                    Team1Id = teamsToConsider[i].TeamId,
                    Team2Id = teamsToConsider[i + 1].TeamId,
                    MatchDate = DateTime.Now,
                    Round = checkRound ? 1 : maxRoundForTournament + 1, // ใช้ round ของ Tournament นี้
                    TournamentId = dto.tournamentId // ระบุ TournamentId ในแมตช์
                };

                matches.Add(match);
            }
            await _context.Matchs.AddRangeAsync(matches);
            await _context.SaveChangesAsync();
            return matches;
        }

        public async Task<string> UpdateMatchResult(UpdateMatchDto dto)
        {
            // Get the match by ID
            var match = await _context.Matchs
                                      .Include(m => m.Team1)
                                      .Include(m => m.Team2)
                                      .FirstOrDefaultAsync(m => m.Id == dto.matchId);

            if (match == null) return "Match not found";

            if (match.Team1Id != dto.winningTeamId && match.Team2Id != dto.winningTeamId)
                return "Invalid winning team";

            var team1 = await _context.Registrations
                .FirstOrDefaultAsync(r => r.TeamId == match.Team1Id);
            if(team1 == null) return null;

            var team2 = await _context.Registrations
                .FirstOrDefaultAsync(r => r.TeamId == match.Team2Id);
            if (team2 == null) return null;

            if (match.Team1Id == dto.winningTeamId)
            {
                team1.Status = StatusTeamInTournament.Winning;
                team2.Status = StatusTeamInTournament.Losing;
            }
            else
            {
                team1.Status = StatusTeamInTournament.Losing;
                team2.Status = StatusTeamInTournament.Winning;
            }

            match.WinnerTeamId = dto.winningTeamId;

            _context.Matchs.Update(match);
            _context.Registrations.Update(team1);
            _context.Registrations.Update(team2);
            await _context.SaveChangesAsync();

            return "Match result updated and new matches created.";
        }

        public async Task<object> RemoveMatch(int id)
        {
            var match = await GetByIdMatch(id);
            if (match == null) return null;

            _context.Matchs.Remove(match);
            await _context.SaveChangesAsync();
            return match;
        }

        public async Task<object> ResetTeamsAndDeleteMatches(int id)
        {
            // ขั้นตอนที่ 1: อัปเดตสถานะทีมทั้งหมดให้เป็น Active
            var teamsToReset = await _context.Registrations
                .Where(r => r.TournamentId == id && (r.Status == StatusTeamInTournament.Losing || r.Status == StatusTeamInTournament.Winning))
                .ToListAsync();

            if (teamsToReset.Count == 0) return "No teams to reset.";

            foreach (var team in teamsToReset)
            {
                team.Status = StatusTeamInTournament.Active;
                team.DateRegistration = DateTime.Now;
                team.DateRegistration = team.DateRegistration.Date.AddYears(543);
            }

            _context.Registrations.UpdateRange(teamsToReset);

            var matchesToDelete = await _context.Matchs
                .Where(m => m.TournamentId == id)
                .ToListAsync();

            if (matchesToDelete.Count == 0) return "No matches to delete.";

            _context.Matchs.RemoveRange(matchesToDelete);

            await _context.SaveChangesAsync();

            return teamsToReset;
        }
        public async Task<object> ResetMatchesForRound(ResetMatchForRoundDto dto)
        {
            // ขั้นตอนที่ 1: ค้นหาแมตช์ทั้งหมดในรอบที่กำหนด
            var matchesReset = await _context.Matchs
                .Where(r => r.TournamentId == dto.tournamentId && r.Round == dto.round)
                .ToListAsync();

            if (matchesReset.Count == 0) return "No matches to reset.";

            // ขั้นตอนที่ 2: ดึงข้อมูลทีมที่เกี่ยวข้องทั้งหมด
            var teamIds = matchesReset.SelectMany(m => new[] { m.Team1Id, m.Team2Id }).Distinct().ToList();

            if (teamIds.Count == 0) return "No teams to reset.";

            // ขั้นตอนที่ 3: ค้นหาข้อมูลการลงทะเบียนของทีมทั้งหมดที่เกี่ยวข้อง
            var teamsToReset = await _context.Registrations
                .Where(r => teamIds.Contains(r.TeamId))
                .ToListAsync();

            if (teamsToReset.Count == 0) return "No team registrations found.";

            // ขั้นตอนที่ 4: อัปเดตสถานะของทีมทั้งหมดให้เป็น Winning
            foreach (var team in teamsToReset)
            {
                team.Status = dto.round != 1 ? StatusTeamInTournament.Winning : StatusTeamInTournament.Active;  // หรือสถานะที่คุณต้องการ
                team.DateRegistration = DateTime.Now;
                team.DateRegistration = team.DateRegistration.Date.AddYears(543);
            }

            _context.Registrations.UpdateRange(teamsToReset);
            _context.Matchs.RemoveRange(matchesReset);

            await _context.SaveChangesAsync();

            return matchesReset;
        }

    }
}
