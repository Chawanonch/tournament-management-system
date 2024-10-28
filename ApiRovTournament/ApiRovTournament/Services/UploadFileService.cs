using ApiRovTournament.Services.IServices;

namespace ApiRovTournament.Services
{
    public class UploadFileService : IUploadFileService
    {
        private readonly IWebHostEnvironment webHostEnvironment;
        private readonly IConfiguration configuration;

        public UploadFileService(IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            this.webHostEnvironment = webHostEnvironment;   //เข้าหา wwwroot
            this.configuration = configuration;             //เข้าหา appsettings.json  
        }

        public bool IsUploads(IFormFileCollection formFiles) => formFiles != null && formFiles?.Count > 0;
        public bool IsUpload(IFormFile formFile) => formFile != null && formFile?.Length > 0;

        public async Task<List<string>> UploadImages(IFormFileCollection formFiles)
        {
            var listFileName = new List<string>();
            //จัดการเส้นทาง
            string wwwRootPath = webHostEnvironment.WebRootPath;
            var uploadPath = Path.Combine(wwwRootPath, "images");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
            foreach (var formFile in formFiles)
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(formFile.FileName);
                string fullName = Path.Combine(uploadPath, fileName);

                using (var stream = File.Create(fullName))
                {
                    await formFile.CopyToAsync(stream);
                }
                listFileName.Add(fileName);
            }
            return listFileName;
        }

        public async Task<string> UploadImage(IFormFile formFile)
        {
            string wwwRootPath = webHostEnvironment.WebRootPath;
            var uploadPath = Path.Combine(wwwRootPath, "images");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(formFile.FileName);
            string fullName = Path.Combine(uploadPath, fileName);

            using (var stream = File.Create(fullName))
            {
                await formFile.CopyToAsync(stream);
            }

            return fileName;
        }
        public string Validations(IFormFileCollection formFiles)
        {
            foreach (var file in formFiles)
            {
                if (!ValidationExtension(file.FileName)) return "Invalid File Extension";
                if (!ValidationSize(file.Length)) return "The file is too large";
            }
            return null;
        }
        public string Validation(IFormFile formFile)
        {
            if (!ValidationExtension(formFile.FileName)) return "Invalid File Extension";
            if (!ValidationSize(formFile.Length)) return "The file is too large";
            return null;
        }
        public bool ValidationExtension(string filename)
        {
            string[] permittedExtensions = { ".jpg", ".png", ".jpeg" };
            string extension = Path.GetExtension(filename).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !permittedExtensions.Contains(extension))
            {
                return false;
            };
            return true;
        }
        public bool ValidationSize(long fileSize) => configuration.GetValue<long>("FileSizeLimit") > fileSize;
        public Task DeleteFileImages(List<string> files)
        {
            string wwwRootPath = webHostEnvironment.WebRootPath;
            foreach (var item in files)
            {
                var file = Path.Combine("images", item);
                var oldImagePath = Path.Combine(wwwRootPath, file);
                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);
                }
            }
            return Task.CompletedTask;
        }
        public Task DeleteFileImage(string file)
        {
            string wwwRootPath = webHostEnvironment.WebRootPath;
            var file1 = Path.Combine("images", file);
            var oldImagePath = Path.Combine(wwwRootPath, file1);
            if (System.IO.File.Exists(oldImagePath))
            {
                System.IO.File.Delete(oldImagePath);
            }
            return Task.CompletedTask;
        }
        //input one image
        public async Task<(string errorMessage, string imageName)> UploadImageAsync(IFormFile formFile)
        {
            var errorMessage = string.Empty;
            string imageName = string.Empty;

            if (IsUpload(formFile))
            {
                errorMessage = Validation(formFile);
                if (string.IsNullOrEmpty(errorMessage))
                {
                    // Save the image to the file system
                    imageName = await UploadImage(formFile);
                }
            }
            return (errorMessage, imageName);
        }
        //input many Image
        public async Task<(string errorMessage, List<string> imageName)> UploadImagesAsync(IFormFileCollection formFiles)
        {
            var errorMessage = string.Empty;
            var imageNames = new List<string>();

            if (IsUploads(formFiles))
            {
                errorMessage = Validations(formFiles);
                if (string.IsNullOrEmpty(errorMessage))
                {
                    imageNames = await UploadImages(formFiles);
                }

            }
            return (errorMessage, imageNames);
        }
    }
}
