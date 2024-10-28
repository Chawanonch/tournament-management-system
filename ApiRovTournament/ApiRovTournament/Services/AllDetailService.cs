using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ApiRovTournament.Services
{
    public class AllDetailService : IAllDetailService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;

        public AllDetailService(Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<AllDetail>> GetAllDetails()
        {
            return await _context.AllDetails.ToListAsync();
        }
        public async Task<AllDetail> GetByIdAllDetail(int? id)
        {
            var detail = await _context.AllDetails.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (detail == null) return null;
            else return detail;
        }

        public async Task<object> CAUAllDetail(AllDetailRequest request)
        {
            var result = _mapper.Map<AllDetail>(request);
            var detail = await GetByIdAllDetail(request?.Id);
            if (detail == null) await _context.AllDetails.AddAsync(result);
            else _context.AllDetails.Update(result);
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<object> RemoveAllDetail(int id)
        {
            var detail = await GetByIdAllDetail(id);
            if (detail == null) return null;

            _context.AllDetails.Remove(detail);
            await _context.SaveChangesAsync();
            return detail;
        }
    }
}
