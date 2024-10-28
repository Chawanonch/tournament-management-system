using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ApiRovTournament.Services
{
    public class CompeteService : ICompeteService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly ILevelService _levelService;

        public CompeteService(Context context, IMapper mapper, ILevelService levelService)
        {
            _context = context;
            _mapper = mapper;
            _levelService = levelService;
        }
        public async Task<List<Compete>> GetCompetes()
        {
            return await _context.Competes.Include(x=>x.ListLevelCompetes).Include(x=>x.CompetitionList).OrderByDescending(x => x.Id).ToListAsync();
        }
        public async Task<Compete> GetByIdCompete(int? id)
        {
            var compete = await _context.Competes.Include(x => x.ListLevelCompetes).Include(x => x.CompetitionList).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (compete == null) return null;
            else return compete;
        }

        public async Task<object> CAUCompete(CompeteRequest request)
        {
            var result = _mapper.Map<Compete>(request);

            var competitionLists = await _context.CompetitionLists.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.CompetitionListId);
            if (competitionLists == null) return null;

            if (request.ListLevelCompetes.Count() > 0)
            {
                foreach (var levelDto in request.ListLevelCompetes)
                {
                    var levelEntity = await _levelService.GetByIdLevel(levelDto.LevelId);
                    if (levelEntity == null) result.ListLevelCompetes.Clear();
                }
            }
            result.DateCreated = DateTime.Now;

            if (result.StartDate.Day == result.EndDate.Day) return "Error Day Start = End";
            var compete = await GetByIdCompete(request?.Id);
            if (compete == null) await _context.Competes.AddAsync(result);
            else _context.Competes.Update(result);
            await _context.SaveChangesAsync();

            if (request.ListLevelCompetes.Count() > 0)
            {
                var tLevel = await _context.ListLevelCompetes.Where(x => x.CompeteId == result.Id).ToListAsync();
                if (tLevel.Any())
                {
                    _context.ListLevelCompetes.RemoveRange(tLevel);
                    await _context.SaveChangesAsync();
                }

                var listLevel = new List<ListLevelCompete>();

                foreach (var levelsDTO in request.ListLevelCompetes)
                {
                    var levelEntity = await _levelService.GetByIdLevel(levelsDTO.LevelId);
                    if (levelEntity == null) return "id level not found!";

                    var newListLevel = new ListLevelCompete
                    {
                        CompeteId = result.Id,
                        LevelId = levelsDTO.LevelId,
                    };

                    listLevel.Add(newListLevel);
                }

                result.ListLevelCompetes = listLevel;
                _context.Competes.Update(result);
                await _context.ListLevelCompetes.AddRangeAsync(listLevel);
                await _context.SaveChangesAsync();
            }

            return result;
        }
        public async Task<object> StatusHideCompete(int id)
        {
            var compete = await _context.Competes.FirstOrDefaultAsync(x => x.Id == id);
            if (compete == null) return null;

            if (compete.IsHide == false) compete.IsHide = true;
            else compete.IsHide = false;

            _context.Competes.Update(compete);
            await _context.SaveChangesAsync();
            return compete;
        }

        public async Task<object> StatusHideCompetes(int year)
        {
            var competes = await _context.Competes
                .Where(x => x.EndDate.Year + 543 == year || x.StartDate.Year + 543 == year)
                .ToListAsync();

            // ตรวจสอบว่ามีรายการหรือไม่
            if (competes == null || competes.Count == 0) return null;

            // เปลี่ยนสถานะ IsHide ของรายการที่ค้นพบ
            foreach (var compete in competes)
            {
                compete.IsHide = !compete.IsHide; // สลับสถานะ
            }

            // อัปเดตรายการทั้งหมดในฐานข้อมูล
            _context.Competes.UpdateRange(competes);
            await _context.SaveChangesAsync();

            return competes;
        }


        public async Task<object> RemoveCompete(int id)
        {
            var compete = await GetByIdCompete(id);
            if (compete == null) return null;

            _context.Competes.Remove(compete);
            await _context.SaveChangesAsync();
            return compete;
        }
    }
}
