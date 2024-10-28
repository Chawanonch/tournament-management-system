using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificatesController : ControllerBase
    {
        private readonly ICertificateService _certificateService;

        public CertificatesController(ICertificateService certificateService)
        {
            _certificateService = certificateService;
        }

        [HttpGet("GetCertificate")]
        public async Task<IActionResult> GetCertificates() => Ok(await _certificateService.GetCertificates());

        [HttpGet("GetByIdCertificate")]
        public async Task<IActionResult> GetByIdCertificate(int id)
        {
            var result = await _certificateService.GetByIdCertificate(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }
        [HttpPost("CAUCertificateONE"), Authorize]
        public async Task<IActionResult> CAUCertificateONE([FromBody] CertificateRequest request)
        {
            var result = await _certificateService.CAUCertificateONE(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }
        [HttpPost("CAUCertificate"), Authorize]
        public async Task<IActionResult> CAUCertificate([FromBody] ListCertificateRequest request)
        {
            var result = await _certificateService.CAUCertificate(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("RemoveCertificate"), Authorize]
        public async Task<IActionResult> RemoveCertificate(int id)
        {
            var result = await _certificateService.RemoveCertificate(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
