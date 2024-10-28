using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore;

namespace ApiRovTournament.Services
{
    public class CompetitionService : ICompetitionService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;

        public CompetitionService(Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<Competition>> GetCompetitions()
        {
            return await _context.Competitions.OrderByDescending(x => x.Name).ToListAsync();
        }
        public async Task<Competition> GetByIdCompetition(int? id)
        {
            var competition = await _context.Competitions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (competition == null) return null;
            else return competition;
        }

        public async Task<object> CAUCompetition(CompetitionRequest request)
        {
            var result = _mapper.Map<Competition>(request);
            var competition = await GetByIdCompetition(request?.Id);
            if (competition == null) await _context.Competitions.AddAsync(result);
            else _context.Competitions.Update(result);
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<object> RemoveCompetition(int id)
        {
            var competition = await GetByIdCompetition(id);
            if (competition == null) return null;

            _context.Competitions.Remove(competition);
            await _context.SaveChangesAsync();
            return competition;
        }

        public async Task<List<CompetitionList>> GetCompetitionLists()
        {
            return await _context.CompetitionLists.Include(x => x.Competition).Include(x => x.Details).OrderByDescending(x => x.DateTimeYear).ToListAsync();
        }

        public async Task<object> CAUCompetitionList(CompetitionListDto request)
        {
            var result = _mapper.Map<CompetitionList>(request);

            var competitionList = await _context.CompetitionLists.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id);
            var competitionListCheck = await _context.CompetitionLists.AsNoTracking()
                .FirstOrDefaultAsync(x => x.CompetitionId == request.CompetitionId && x.DateTimeYear.Year == request.DateTimeYear.Year);

            if (competitionList == null)
            { 
                if(competitionListCheck == null) await _context.CompetitionLists.AddAsync(result);
                else
                {
                    result.Id = competitionListCheck.Id;
                    _context.CompetitionLists.Update(result);
                }
            }
            else _context.CompetitionLists.Update(result);
            await _context.SaveChangesAsync();

            if (request?.Details != null && request?.Details.Count() > 0)
            {
                var details = await _context.ListNameCompetitionDetails.Where(x => x.CompetitionListId == result.Id).ToListAsync();
                if (details.Any())
                {
                    _context.ListNameCompetitionDetails.RemoveRange(details);
                    await _context.SaveChangesAsync();
                }

                var listDetail = new List<ListNameCompetitionDetails>();

                foreach (var deatailDTO in request.Details)
                {
                    var newListDetail = new ListNameCompetitionDetails
                    {
                        Name = deatailDTO.Name,
                        Text = deatailDTO.Text,
                        CompetitionListId = result.Id,
                    };

                    listDetail.Add(newListDetail);
                }

                result.Details = listDetail;
                _context.CompetitionLists.Update(result);
                await _context.ListNameCompetitionDetails.AddRangeAsync(listDetail);
                await _context.SaveChangesAsync();
            }
            await _context.SaveChangesAsync();

            return result;
        }
        public async Task<object> RemoveCompetitionList(int id)
        {
            var competition = await _context.CompetitionLists.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (competition == null) return null;

            _context.CompetitionLists.Remove(competition);
            await _context.SaveChangesAsync();
            return competition;
        }

    }
}
