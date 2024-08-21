using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ApiRovTournament.Services
{
    public class TournamentService : ITournamentService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly ILevelService _levelService;

        public TournamentService(Context context, IMapper mapper,ILevelService levelService)
        {
            _context = context;
            _mapper = mapper;
            _levelService = levelService;
        }
        public async Task<List<Tournament>> GetTournaments()
        {
            return await _context.Tournaments.Include(x => x.ListLevels).ToListAsync();
        }
        public async Task<Tournament> GetByIdTournament(int? id)
        {
            var tournament = await _context.Tournaments.Include(x => x.ListLevels).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (tournament == null) return null;
            else return tournament;
        }

        public async Task<object> CAUTournament(TournamentRequest request)
        {
            var result = _mapper.Map<Tournament>(request);

            if (request.ListLevels.Count() > 0)
            {
                foreach (var levelDto in request.ListLevels)
                {
                    var levelEntity = await _levelService.GetByIdLevel(levelDto.LevelId);
                    if (levelEntity == null) result.ListLevels.Clear();
                }
            }

            var tournament = await GetByIdTournament(request?.Id);

            var numberY = tournament == null ? 543 : 0;

            result.StartDate = result.StartDate.Date.AddYears(numberY);
            result.EndDate = result.EndDate.Date.AddYears(numberY);

            result.DateCreated = DateTime.Now;
            result.DateCreated = result.DateCreated.Date.AddYears(543);

            if (result.StartDate.Day == result.EndDate.Day) return "Error Day Start = End";

            if (tournament == null) await _context.Tournaments.AddAsync(result);
            else _context.Tournaments.Update(result);
            await _context.SaveChangesAsync();

            if (request.ListLevels.Count() > 0)
            {
                var tLevel = await _context.ListLevels.Where(x => x.TournamentId == result.Id).ToListAsync();
                if (tLevel.Any())
                {
                    _context.ListLevels.RemoveRange(tLevel);
                    await _context.SaveChangesAsync();
                }

                var listLevel = new List<ListLevel>();

                foreach (var levelsDTO in request.ListLevels)
                {
                    var levelEntity = await _levelService.GetByIdLevel(levelsDTO.LevelId);
                    if (levelEntity == null) return "id level not found!";

                    var newListLevel = new ListLevel
                    {
                        TournamentId = result.Id,
                        LevelId = levelsDTO.LevelId,
                    };

                    listLevel.Add(newListLevel);
                }

                result.ListLevels = listLevel;
                _context.Tournaments.Update(result);
                await _context.ListLevels.AddRangeAsync(listLevel);
                await _context.SaveChangesAsync();
            }

            return result;
        }
        public async Task<object> StatusHideTournament(int id)
        {
            var tournament = await _context.Tournaments.FirstOrDefaultAsync(x => x.Id == id);
            if (tournament == null) return null;

            if (tournament.IsHide == false) tournament.IsHide = true;
            else tournament.IsHide = false;

            _context.Tournaments.Update(tournament);
            await _context.SaveChangesAsync();
            return tournament;
        }

        public async Task<object> RemoveTournament(int id)
        {
            var tournament = await GetByIdTournament(id);
            if (tournament == null) return null;

            var registrations = await _context.Registrations
                .Where(r => r.TournamentId == id)
                .ToListAsync();

            if (registrations.Any()) _context.Registrations.RemoveRange(registrations);

            var matchs = await _context.Matchs
                .Where(r => r.TournamentId == id)
                .ToListAsync();
            if (matchs.Any()) _context.Matchs.RemoveRange(matchs);

            _context.Tournaments.Remove(tournament);
            await _context.SaveChangesAsync();
            return tournament;
        }
    }
}
