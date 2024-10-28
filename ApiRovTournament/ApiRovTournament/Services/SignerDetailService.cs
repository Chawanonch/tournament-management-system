using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ApiRovTournament.Services
{
    public class SignerDetailService : ISignerDetailService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IUploadFileService _uploadFileService;

        public SignerDetailService(Context context, IMapper mapper, IUploadFileService uploadFileService)
        {
            _context = context;
            _mapper = mapper;
            _uploadFileService = uploadFileService;
        }
        public async Task<List<SignerDetail>> GetSignerDetails()
        {
            return await _context.SignerDetails.OrderByDescending(x=>x.Id).ToListAsync();
        }
        public async Task<SignerDetail> GetByIdSignerDetail(int? id)
        {
            var detail = await _context.SignerDetails.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (detail == null) return null;
            else return detail;
        }

        public async Task<object> CAUSignerDetail(SignerDetailRequest request)
        {
            (string errorMessage, string imageName) = await _uploadFileService.UploadImageAsync(request.SignatureImageUrl);
            if (!string.IsNullOrEmpty(errorMessage)) return errorMessage;

            var result = _mapper.Map<SignerDetail>(request);
            result.SignatureImageUrl = imageName;

            var detail = await GetByIdSignerDetail(request?.Id);
            if (detail == null) await _context.SignerDetails.AddAsync(result);
            else
            {
                if (request?.SignatureImageUrl == null) result.SignatureImageUrl = detail.SignatureImageUrl;
                _context.SignerDetails.Update(result);
                if (request?.SignatureImageUrl != null && detail.SignatureImageUrl != imageName) await _uploadFileService.DeleteFileImage(detail.SignatureImageUrl);
            }
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<object> RemoveSignerDetail(int id)
        {
            var detail = await GetByIdSignerDetail(id);
            if (detail == null) return null;

            _context.SignerDetails.Remove(detail);
            await _uploadFileService.DeleteFileImage(detail.SignatureImageUrl);
            await _context.SaveChangesAsync();
            return detail;
        }
    }
}
