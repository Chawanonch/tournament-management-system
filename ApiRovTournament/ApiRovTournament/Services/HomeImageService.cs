using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ApiRovTournament.Services
{
    public class HomeImageService : IHomeImageService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IUploadFileService _uploadFileService;

        public HomeImageService(Context context, IMapper mapper, IUploadFileService uploadFileService)
        {
            _context = context;
            _mapper = mapper;
            _uploadFileService = uploadFileService;
        }
        public async Task<List<HomeImage>> GetHomeImages()
        {
            return await _context.HomeImages.Include(x=>x.HoomImages).ToListAsync();
        }
        public async Task<HomeImage> GetByIdHomeImages(int? id)
        {
            var homeImages = await _context.HomeImages.Include(x => x.HoomImages).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (homeImages == null) return null;
            else return homeImages;
        }

        public async Task<object> CAUHomeImages(HomeImagesRequest request)
        {
            (string errorMessage, List<string> imageNames) = await _uploadFileService.UploadImagesAsync(request.images);
            if (!string.IsNullOrEmpty(errorMessage)) return errorMessage;

            var result = _mapper.Map<HomeImage>(request);
            var detail = await GetByIdHomeImages(request?.Id);

            if (detail == null) await _context.HomeImages.AddAsync(result);
            else _context.HomeImages.Update(result);

            if (imageNames.Count() > 0)
            {
                var roomImages = await _context.HomeImagess.Where(x => x.HomeImageId.Equals(result.Id)).ToListAsync();
                if (roomImages is not null)
                {
                    _context.HomeImagess.RemoveRange(roomImages);
                    await _context.SaveChangesAsync();

                    var file = roomImages.Select(x => x.Image).ToList();
                    await _uploadFileService.DeleteFileImages(file);
                }

                var images = new List<HomeImages>();
                imageNames.ForEach(imageName =>
                {
                    images.Add(new HomeImages
                    {
                        Image = imageName,
                        HomeImageId = result.Id
                    });
                });

                await _context.HomeImagess.AddRangeAsync(images);
                await _context.SaveChangesAsync();
            }

            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<object> RemoveHomeImages(int id)
        {
            var detail = await GetByIdHomeImages(id);
            if (detail == null) return null;

            _context.HomeImages.Remove(detail);
            await _context.SaveChangesAsync();
            return detail;
        }
    }
}
