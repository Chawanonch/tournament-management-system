using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ApiRovTournament.Services
{
    public class LevelService : ILevelService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;

        public LevelService(Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<Level>> GetLevels()
        {
            return await _context.Levels.ToListAsync();
        }
        public async Task<Level> GetByIdLevel(int? id)
        {
            var level = await _context.Levels.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (level == null) return null;
            else return level;
        }

        public async Task<object> CAULevel(LevelRequest request)
        {
            var result = _mapper.Map<Level>(request);
            var level = await GetByIdLevel(request?.Id);
            if (level == null) await _context.Levels.AddAsync(result);
            else _context.Levels.Update(result);
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<object> RemoveLevel(int id)
        {
            var level = await GetByIdLevel(id);
            if (level == null) return null;

            _context.Levels.Remove(level);
            await _context.SaveChangesAsync();
            return level;
        }
    }
}
