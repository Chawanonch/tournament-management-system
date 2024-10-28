using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ApiRovTournament.Services
{
    public class TextInImageService : ITextInImageService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;

        public TextInImageService(Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<TextInImage>> GetTextInImages()
        {
            return await _context.TextInImages.ToListAsync();
        }
        public async Task<TextInImage> GetByIdTextInImage(int? id)
        {
            var text = await _context.TextInImages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (text == null) return null;
            else return text;
        }

        public async Task<object> CAUTextInImage(TextInImageRequest request)
        {
            var result = _mapper.Map<TextInImage>(request);
            var text = await GetByIdTextInImage(request?.Id);
            if (text == null) await _context.TextInImages.AddAsync(result);
            else _context.TextInImages.Update(result);
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<object> RemoveTextInImage(int id)
        {
            var text = await GetByIdTextInImage(id);
            if (text == null) return null;

            _context.TextInImages.Remove(text);
            await _context.SaveChangesAsync();
            return text;
        }
    }
}
