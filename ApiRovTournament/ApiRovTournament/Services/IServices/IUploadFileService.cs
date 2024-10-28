namespace ApiRovTournament.Services.IServices
{
    public interface IUploadFileService
    {
        //ตรวจสอบมีการอัพโหลดไฟล์เข้ามาหรือไม่
        bool IsUploads(IFormFileCollection formFiles);
        bool IsUpload(IFormFile formFile);

        //ตรวจสอบนามสกุลไฟล์หรือรูปแบบที่่ต้องการ
        string Validations(IFormFileCollection formFiles);
        string Validation(IFormFile formFile);

        //อัพโหลดและส่งรายชื่อไฟล์ออกมา
        Task<List<string>> UploadImages(IFormFileCollection formFiles);
        Task<string> UploadImage(IFormFile formFile);
        Task DeleteFileImages(List<string> files);
        Task DeleteFileImage(string file);

        Task<(string errorMessage, string imageName)> UploadImageAsync(IFormFile formFile);
        Task<(string errorMessage, List<string> imageName)> UploadImagesAsync(IFormFileCollection formFiles);
    }
}
