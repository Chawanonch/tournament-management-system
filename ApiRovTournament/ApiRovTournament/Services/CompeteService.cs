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
        public async Task<object> CAUCompetes(ListCompeteRequest request)
        {
            var resultList = new List<Compete>(); // List to store all successfully added competes

            // Fetch the competition list (checks if it exists)
            var competitionLists = await _context.CompetitionLists.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.CompetitionListId);
            if (competitionLists == null) return "Error: Competition List not found!"; // Return error if not found

            if (request.StartDate.Day == request.EndDate.Day)
            {
                return "Error: Day Start = End"; // Check for invalid date range
            }

            foreach (var competeRequest in request.ListName)
            {
                var result = new Compete
                {
                    CompetitionListId = request.CompetitionListId, // Assuming this is part of the request object
                    Name = competeRequest.Name, // Set the name from ListNameDto
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    DateCreated = DateTime.Now,
                    IsHide = true,
                };

                await _context.Competes.AddAsync(result);
                await _context.SaveChangesAsync();

                if (request.ListLevelCompetes.Any())
                {
                    // Remove existing levels for this Compete (if any)
                    var existingLevels = await _context.ListLevelCompetes.Where(x => x.CompeteId == result.Id).ToListAsync();
                    if (existingLevels.Any())
                    {
                        _context.ListLevelCompetes.RemoveRange(existingLevels);
                        await _context.SaveChangesAsync();
                    }

                    var listLevel = new List<ListLevelCompete>(); // List to store levels for this compete

                    // Process each ListLevelCompetesDto
                    foreach (var levelsDTO in request.ListLevelCompetes)
                    {
                        // Ensure that levelsDTO corresponds to the current competeRequest (you may need to adjust this if the structure differs)
                        if (levelsDTO.Id == competeRequest.Id)  // Assuming ListLevelCompetesDto has CompeteId or similar to link to the compete
                        {
                            // Process each levelDTO in the current ListLevelCompetesDto
                            foreach (var levelDTO in levelsDTO.ListLevel)
                            {
                                var levelEntity = await _levelService.GetByIdLevel(levelDTO.LevelId);
                                if (levelEntity == null)
                                {
                                    return "Error: Level not found!"; // Return error if level not found
                                }

                                var newListLevel = new ListLevelCompete
                                {
                                    CompeteId = result.Id,
                                    LevelId = levelDTO.LevelId
                                };

                                listLevel.Add(newListLevel); // Add level to the list
                            }
                        }
                    }

                    // Add the levels to the database and update the Compete
                    result.ListLevelCompetes = listLevel;
                    await _context.ListLevelCompetes.AddRangeAsync(listLevel);
                    await _context.SaveChangesAsync();
                }

                // Add the result to the result list after processing it fully
                resultList.Add(result);
            }

            return resultList; // Return the list of all added competes
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
