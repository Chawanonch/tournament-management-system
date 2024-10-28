using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Drawing.Text;
using System.Runtime.ConstrainedExecution;
using System.Text;

namespace ApiRovTournament.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public CertificateService(Context context, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
        }
        public async Task<List<Certificate>> GetCertificates()
        {
            return await _context.Certificates.Include(x => x.Team).Include(x => x.ListSignerDetails).Include(x => x.TextInImage).OrderBy(x => x.Id).ToListAsync();
        }
        public async Task<Certificate> GetByIdCertificate(int? id)
        {
            var cer = await _context.Certificates.Include(x => x.Team).Include(x => x.ListSignerDetails).Include(x => x.TextInImage).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (cer == null) return null;
            else return cer;
        }
        public async Task<object> CAUCertificateONE(CertificateRequest request)
        {
            var result = _mapper.Map<Certificate>(request);
            var cer = await GetByIdCertificate(request?.Id);

            result.DateTime = DateTime.Now;

            var team = await _context.Teams.AsNoTracking().Include(x => x.ListMembers).Include(x => x.ListTrainers).FirstOrDefaultAsync(x => x.Id == request.TeamId);
            if (team == null) return null;

            var textInImage = await _context.TextInImages.FirstOrDefaultAsync(x => x.Id == request.TextInImageId);
            if (textInImage == null) return null;

            int currentYear = DateTime.Now.Year + 543;

            if (cer != null) result.CertificateNumber = cer.CertificateNumber;
            else
            {
                int certificateNumber = await GetNextCertificateNumber(currentYear);
                result.CertificateNumber = certificateNumber; // กำหนดเลขใบรับรองใหม่
            }

            // เพิ่มใบรับรองลงในฐานข้อมูล
            if (cer == null) await _context.Certificates.AddAsync(result);
            else _context.Certificates.Update(result);
            await _context.SaveChangesAsync();

            // ตรวจสอบลายเซ็น
            if (request.ListSignerDetails != null && request.ListSignerDetails.Count > 0)
            {
                var tSigner = await _context.ListSignerDetails.Where(x => x.CertificateId == result.Id).ToListAsync();
                if (tSigner.Any())
                {
                    _context.ListSignerDetails.RemoveRange(tSigner);
                    await _context.SaveChangesAsync();
                }

                var listSigner = new List<ListSignerDetail>();

                foreach (var signersDTO in request.ListSignerDetails)
                {
                    var signerEntity = await _context.SignerDetails.AsNoTracking().FirstOrDefaultAsync(x => x.Id == signersDTO.SignerDetailId);
                    if (signerEntity == null) return "Signer not found!";

                    var newListLevel = new ListSignerDetail
                    {
                        CertificateId = result.Id,
                        SignerDetailId = signersDTO.SignerDetailId,
                    };

                    listSigner.Add(newListLevel);
                }

                // เพิ่มลายเซ็นลงในฐานข้อมูล
                await _context.ListSignerDetails.AddRangeAsync(listSigner);
                await _context.SaveChangesAsync();
                result.ListSignerDetails = listSigner; // อัปเดตรายการลายเซ็นในใบรับรอง
            }

            // สร้างรูปภาพหลังจากเพิ่มลายเซ็นเรียบร้อย
            result.Image = await CreateCertificateImageONE(result, team, textInImage, request, currentYear, result.CertificateNumber);
            _context.Certificates.Update(result); // อัปเดตใบรับรองพร้อมรูปภาพ
            await _context.SaveChangesAsync();

            return result; // คืนค่ารายการใบรับรองทั้งหมด
        }
        public async Task<object> CAUCertificate(ListCertificateRequest request)
        {
            if (request.CertificateRequests == null || !request.CertificateRequests.Any())
            {
                return "No certificate requests found!";
            }

            var results = new List<Certificate>();

            // ดึง TextInImageId และ ListSignerDetails จาก request
            int textInImageId = request.TextInImageId;
            var listSignerDetails = request.ListSignerDetails;

            foreach (var certRequest in request.CertificateRequests)
            {
                var result = _mapper.Map<Certificate>(certRequest);
                var cer = await GetByIdCertificate(certRequest?.Id);

                result.DateTime = DateTime.Now;
                result.TextInImageId = textInImageId;

                var team = await _context.Teams.AsNoTracking().Include(x => x.ListMembers).Include(x => x.ListTrainers).FirstOrDefaultAsync(x => x.Id == certRequest.TeamId);
                if (team == null) return null;

                var textInImage = await _context.TextInImages.FirstOrDefaultAsync(x => x.Id == textInImageId);
                if (textInImage == null) return null;

                int currentYear = DateTime.Now.Year + 543;

                if (cer != null) result.CertificateNumber = cer.CertificateNumber;
                else
                {
                    int certificateNumber = await GetNextCertificateNumber(currentYear);
                    result.CertificateNumber = certificateNumber; // กำหนดเลขใบรับรองใหม่
                }

                // เพิ่มใบรับรองลงในฐานข้อมูล
                if (cer == null) await _context.Certificates.AddAsync(result);
                else _context.Certificates.Update(result);
                await _context.SaveChangesAsync();

                // ตรวจสอบลายเซ็น
                if (listSignerDetails != null && listSignerDetails.Count > 0)
                {
                    var listSigner = new List<ListSignerDetail>();
                    foreach (var signersDTO in listSignerDetails)
                    {
                        var signerEntity = await _context.SignerDetails.AsNoTracking().FirstOrDefaultAsync(x => x.Id == signersDTO.SignerDetailId);
                        if (signerEntity == null) return "Signer not found!";

                        var newListLevel = new ListSignerDetail
                        {
                            CertificateId = result.Id,
                            SignerDetailId = signersDTO.SignerDetailId,
                        };

                        listSigner.Add(newListLevel);
                    }

                    // เพิ่มลายเซ็นลงในฐานข้อมูล
                    await _context.ListSignerDetails.AddRangeAsync(listSigner);
                    await _context.SaveChangesAsync();
                    result.ListSignerDetails = listSigner; // อัปเดตรายการลายเซ็นในใบรับรอง
                }

                // สร้างรูปภาพหลังจากเพิ่มลายเซ็นเรียบร้อย
                result.Image = await CreateCertificateImage(result, team, textInImage, request, currentYear, result.CertificateNumber);
                _context.Certificates.Update(result); // อัปเดตใบรับรองพร้อมรูปภาพ
                await _context.SaveChangesAsync();

                results.Add(result);
            }

            return results; // คืนค่ารายการใบรับรองทั้งหมด
        }

        private async Task<int> GetNextCertificateNumber(int currentYear)
        {
            // ตรวจสอบจำนวนใบรับรองในปีปัจจุบัน
            var count = await _context.Certificates
                .CountAsync(c => c.DateTime.Year == currentYear - 543);

            // เพิ่มหมายเลข 1
            return count + 1;
        }
        private async Task<string> CreateCertificateImageONE(Certificate request, Team team, TextInImage textInImage, CertificateRequest listSignerDetails, int currentYear, int certificateNumber)
        {
            // Define the dimensions of the image
            int width = 2338;
            int height = 1653;

            float spacing = 100f;
            var level = await _context.Levels.AsNoTracking().FirstOrDefaultAsync(x => x.Id == team.LevelId);
            if (level == null) return null;

            using (Bitmap bitmap = new Bitmap(width, height))
            {
                using (Graphics graphics = Graphics.FromImage(bitmap))
                {
                    graphics.Clear(Color.Transparent);

                    // Load background image
                    string backgroundImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "bg/bg2.png");
                    using (Image backgroundImage = Image.FromFile(backgroundImagePath))
                    {
                        graphics.DrawImage(backgroundImage, 0, 0, width, height);
                    }

                    // Load icon image
                    string iconPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "icon/kru.png");
                    using (Image icon = Image.FromFile(iconPath))
                    {
                        graphics.DrawImage(icon, (width - 200) / 2, 150, 200, 200);
                    }

                    // Load font
                    PrivateFontCollection privateFonts = new PrivateFontCollection();
                    string fontPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "fonts/Kanit-Regular.ttf");
                    privateFonts.AddFontFile(fontPath);

                    Font mainFont = new Font(privateFonts.Families[0], 30, FontStyle.Bold);
                    Font subFont = new Font(privateFonts.Families[0], 26, FontStyle.Regular);
                    Font detailFont = new Font(privateFonts.Families[0], 42, FontStyle.Regular);
                    Font detailFixedFont = new Font(privateFonts.Families[0], 42, FontStyle.Bold);
                    float startX = width / 2;
                    float currentY = 250f + spacing;

                    void DrawWrappedText(string text, Font font, Brush brush, float x, ref float y, float maxWidth)
                    {
                        if (string.IsNullOrEmpty(text)) return;

                        string[] words = text.Split(' ');
                        StringBuilder line = new StringBuilder();
                        foreach (var word in words)
                        {
                            string testLine = line + word + " ";
                            SizeF size = graphics.MeasureString(testLine, font);
                            if (size.Width > maxWidth && line.Length > 0)
                            {
                                graphics.DrawString(line.ToString(), font, brush, x - graphics.MeasureString(line.ToString(), font).Width / 2, y);
                                line.Clear();
                                y += spacing;
                            }
                            line.Append(word + " ");
                        }
                        if (line.Length > 0)
                        {
                            graphics.DrawString(line.ToString(), font, brush, x - graphics.MeasureString(line.ToString(), font).Width / 2, y);
                        }
                    }

                    // Drawing details
                    DrawWrappedText("เกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า", detailFixedFont, Brushes.DarkBlue, startX, ref currentY, width - 100);
                    currentY += spacing;

                    // Draw members
                    if (team.ListMembers != null && team.ListMembers.Any())
                    {
                        // Join the names of members into a single string
                        string membersText = string.Join(" ", team.ListMembers.Select(member => member.Name));
                        DrawWrappedText(membersText, detailFont, Brushes.DarkViolet, startX, ref currentY, width - 100);
                        currentY += spacing;
                    }

                    // Draw trainers
                    if (team.ListTrainers != null && team.ListTrainers.Any())
                    {
                        // Join the names of trainers into a single string
                        string trainersText = $"ครูผู้ฝึกสอน {string.Join(" ", team.ListTrainers.Select(trainer => trainer.Name))}";
                        DrawWrappedText(trainersText, detailFont, Brushes.DarkSlateBlue, startX, ref currentY, width - 100);
                        currentY += spacing;
                    }

                    DrawWrappedText(team.SchoolName, detailFont, Brushes.Black, startX, ref currentY, width - 100);
                    currentY += spacing;

                    // Competition details
                    string competitionDetails = $"เข้าร่วม{request.Name} ระดับ{(level?.Name ?? "")}";
                    DrawWrappedText(competitionDetails, detailFont, Brushes.DarkOrchid, startX, ref currentY, width - 100);
                    currentY += spacing;

                    // Event and date details
                    string eventDetails = $"งานสัปดาห์วิทยาศาสตร์แห่งชาติ (ส่วนภูมิภาค ประจำปี {currentYear})";
                    DrawWrappedText(eventDetails, detailFixedFont, Brushes.DarkBlue, startX, ref currentY, width - 100);
                    currentY += spacing;

                    string dateDetails = $"ระหว่างวันที่ {textInImage.Text} {currentYear} ณ มหาวิทยาลัยราชภัฏกาญจนบุรี";
                    DrawWrappedText(dateDetails, detailFixedFont, Brushes.DarkBlue, startX, ref currentY, width - 100);
                    currentY += spacing;

                    string closingMessage = "ขออำนวยพรให้ประสบความสุข ความเจริญก้าวหน้าตลอดไป";
                    DrawWrappedText(closingMessage, mainFont, Brushes.DarkBlue, startX, ref currentY, width - 100);
                    currentY += spacing;

                    // Signature area
                    // Add spacing before signatures
                    float signatureStartY = currentY;
                    int signatureWidth = 300;
                    int signatureHeight = 200;

                    // Centering signatures
                    var currentX = (width - (signatureWidth * listSignerDetails.ListSignerDetails.Count + spacing * 2 * (listSignerDetails.ListSignerDetails.Count - 1))) / 2;

                    // Draw signatures
                    // Draw signatures
                    foreach (var signer in listSignerDetails.ListSignerDetails)
                    {
                        var signerDetail = await _context.SignerDetails.FirstOrDefaultAsync(x => x.Id == signer.SignerDetailId);
                        if (signerDetail != null)
                        {
                            string signatureImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", $"{signerDetail.SignatureImageUrl}");
                            using (Image signatureImage = Image.FromFile(signatureImagePath))
                            {
                                graphics.DrawImage(signatureImage, currentX, signatureStartY, signatureWidth, signatureHeight);

                                float lineY = signatureStartY + signatureHeight + 5;
                                float lineStartX = currentX - 50;
                                float lineEndX = currentX + signatureWidth + 50;
                                graphics.DrawLine(new Pen(Color.Black, 2), lineStartX, lineY, lineEndX, lineY);
                            }

                            float nameY = signatureStartY + signatureHeight + 10;
                            float nameWidth = graphics.MeasureString(signerDetail.FullName ?? "", mainFont).Width;
                            graphics.DrawString(signerDetail.FullName ?? "", mainFont, Brushes.Black, currentX + (signatureWidth - nameWidth) / 2, nameY);

                            float positionY = nameY + 48; // Additional spacing between name and position
                            float positionWidth = graphics.MeasureString(signerDetail.Position ?? "", subFont).Width;
                            graphics.DrawString(signerDetail.Position ?? "", subFont, Brushes.Black, currentX + (signatureWidth - positionWidth) / 2, positionY);

                            currentX += signatureWidth + (spacing * 4); // เพิ่มระยะห่างเป็น 4 เท่าเพื่อให้ห่างขึ้น
                        }
                    }


                    // Certificate number
                    string certificateNumberString = $"เลขที่ {certificateNumber:D4}/{currentYear}";
                    graphics.DrawString(certificateNumberString, mainFont, Brushes.Black, width - graphics.MeasureString(certificateNumberString, detailFont).Width - 120, 130);

                    using (MemoryStream ms = new MemoryStream())
                    {
                        bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        byte[] imageBytes = ms.ToArray();
                        string base64Image = Convert.ToBase64String(imageBytes);

                        return $"data:image/png;base64,{base64Image}";
                    }
                }
            }
        }
        private async Task<string> CreateCertificateImage(Certificate request, Team team, TextInImage textInImage, ListCertificateRequest listSignerDetails, int currentYear, int certificateNumber)
        {
            // Define the dimensions of the image
            int width = 2338;
            int height = 1653;

            float spacing = 100f;
            var level = await _context.Levels.AsNoTracking().FirstOrDefaultAsync(x => x.Id == team.LevelId);
            if (level == null) return null;

            using (Bitmap bitmap = new Bitmap(width, height))
            {
                using (Graphics graphics = Graphics.FromImage(bitmap))
                {
                    graphics.Clear(Color.Transparent);

                    // Load background image
                    string backgroundImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "bg/bg2.png");
                    using (Image backgroundImage = Image.FromFile(backgroundImagePath))
                    {
                        graphics.DrawImage(backgroundImage, 0, 0, width, height);
                    }

                    // Load icon image
                    string iconPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "icon/kru.png");
                    using (Image icon = Image.FromFile(iconPath))
                    {
                        graphics.DrawImage(icon, (width - 200) / 2, 150, 200, 200);
                    }

                    // Load font
                    PrivateFontCollection privateFonts = new PrivateFontCollection();
                    string fontPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "fonts/Kanit-Regular.ttf");
                    privateFonts.AddFontFile(fontPath);

                    Font mainFont = new Font(privateFonts.Families[0], 30, FontStyle.Bold);
                    Font subFont = new Font(privateFonts.Families[0], 26, FontStyle.Regular);
                    Font detailFont = new Font(privateFonts.Families[0], 42, FontStyle.Regular);
                    Font detailFixedFont = new Font(privateFonts.Families[0], 42, FontStyle.Bold);
                    float startX = width / 2;
                    float currentY = 250f + spacing;

                    void DrawWrappedText(string text, Font font, Brush brush, float x, ref float y, float maxWidth)
                    {
                        if (string.IsNullOrEmpty(text)) return;

                        string[] words = text.Split(' ');
                        StringBuilder line = new StringBuilder();
                        foreach (var word in words)
                        {
                            string testLine = line + word + " ";
                            SizeF size = graphics.MeasureString(testLine, font);
                            if (size.Width > maxWidth && line.Length > 0)
                            {
                                graphics.DrawString(line.ToString(), font, brush, x - graphics.MeasureString(line.ToString(), font).Width / 2, y);
                                line.Clear();
                                y += spacing;
                            }
                            line.Append(word + " ");
                        }
                        if (line.Length > 0)
                        {
                            graphics.DrawString(line.ToString(), font, brush, x - graphics.MeasureString(line.ToString(), font).Width / 2, y);
                        }
                    }

                    // Drawing details
                    DrawWrappedText("เกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า", detailFixedFont, Brushes.DarkBlue, startX, ref currentY, width - 100);
                    currentY += spacing;

                    // Draw members
                    if (team.ListMembers != null && team.ListMembers.Any())
                    {
                        // Join the names of members into a single string
                        string membersText = string.Join(" ", team.ListMembers.Select(member => member.Name));
                        DrawWrappedText(membersText, detailFont, Brushes.DarkViolet, startX, ref currentY, width - 100);
                        currentY += spacing;
                    }

                    // Draw trainers
                    if (team.ListTrainers != null && team.ListTrainers.Any())
                    {
                        // Join the names of trainers into a single string
                        string trainersText = $"ครูผู้ฝึกสอน {string.Join(" ", team.ListTrainers.Select(trainer => trainer.Name))}";
                        DrawWrappedText(trainersText, detailFont, Brushes.DarkSlateBlue, startX, ref currentY, width - 100);
                        currentY += spacing;
                    }

                    DrawWrappedText(team.SchoolName, detailFont, Brushes.Black, startX, ref currentY, width - 100);
                    currentY += spacing;

                    // Competition details
                    string competitionDetails = $"เข้าร่วม{request.Name} ระดับ{(level?.Name ?? "")}";
                    DrawWrappedText(competitionDetails, detailFont, Brushes.DarkOrchid, startX, ref currentY, width - 100);
                    currentY += spacing;

                    // Event and date details
                    string eventDetails = $"งานสัปดาห์วิทยาศาสตร์แห่งชาติ (ส่วนภูมิภาค ประจำปี {currentYear})";
                    DrawWrappedText(eventDetails, detailFixedFont, Brushes.DarkBlue, startX, ref currentY, width - 100);
                    currentY += spacing;

                    string dateDetails = $"ระหว่างวันที่ {textInImage.Text} {currentYear} ณ มหาวิทยาลัยราชภัฏกาญจนบุรี";
                    DrawWrappedText(dateDetails, detailFixedFont, Brushes.DarkBlue, startX, ref currentY, width - 100);
                    currentY += spacing;

                    string closingMessage = "ขออำนวยพรให้ประสบความสุข ความเจริญก้าวหน้าตลอดไป";
                    DrawWrappedText(closingMessage, mainFont, Brushes.DarkBlue, startX, ref currentY, width - 100);
                    currentY += spacing;

                    // Signature area
                    // Add spacing before signatures
                    float signatureStartY = currentY;
                    int signatureWidth = 300;
                    int signatureHeight = 200;

                    // Centering signatures
                    var currentX = (width - (signatureWidth * listSignerDetails.ListSignerDetails.Count + spacing * 2 * (listSignerDetails.ListSignerDetails.Count - 1))) / 2;

                    // Draw signatures
                    // Draw signatures
                    foreach (var signer in listSignerDetails.ListSignerDetails)
                    {
                        var signerDetail = await _context.SignerDetails.FirstOrDefaultAsync(x => x.Id == signer.SignerDetailId);
                        if (signerDetail != null)
                        {
                            string signatureImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", $"{signerDetail.SignatureImageUrl}");
                            using (Image signatureImage = Image.FromFile(signatureImagePath))
                            {
                                graphics.DrawImage(signatureImage, currentX, signatureStartY, signatureWidth, signatureHeight);

                                float lineY = signatureStartY + signatureHeight + 5;
                                float lineStartX = currentX - 50;
                                float lineEndX = currentX + signatureWidth + 50;
                                graphics.DrawLine(new Pen(Color.Black, 2), lineStartX, lineY, lineEndX, lineY);
                            }

                            float nameY = signatureStartY + signatureHeight + 10;
                            float nameWidth = graphics.MeasureString(signerDetail.FullName ?? "", mainFont).Width;
                            graphics.DrawString(signerDetail.FullName ?? "", mainFont, Brushes.Black, currentX + (signatureWidth - nameWidth) / 2, nameY);

                            float positionY = nameY + 48; // Additional spacing between name and position
                            float positionWidth = graphics.MeasureString(signerDetail.Position ?? "", subFont).Width;
                            graphics.DrawString(signerDetail.Position ?? "", subFont, Brushes.Black, currentX + (signatureWidth - positionWidth) / 2, positionY);

                            currentX += signatureWidth + (spacing * 4); // เพิ่มระยะห่างเป็น 4 เท่าเพื่อให้ห่างขึ้น
                        }
                    }


                    // Certificate number
                    string certificateNumberString = $"เลขที่ {certificateNumber:D4}/{currentYear}";
                    graphics.DrawString(certificateNumberString, mainFont, Brushes.Black, width - graphics.MeasureString(certificateNumberString, detailFont).Width - 120, 130);

                    using (MemoryStream ms = new MemoryStream())
                    {
                        bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        byte[] imageBytes = ms.ToArray();
                        string base64Image = Convert.ToBase64String(imageBytes);

                        return $"data:image/png;base64,{base64Image}";
                    }
                }
            }
        }

        public async Task<object> RemoveCertificate(int id)
        {
            var cer = await GetByIdCertificate(id);
            if (cer == null) return null;

            _context.Certificates.Remove(cer);

            await _context.SaveChangesAsync();
            return cer;
        }
    }
}
