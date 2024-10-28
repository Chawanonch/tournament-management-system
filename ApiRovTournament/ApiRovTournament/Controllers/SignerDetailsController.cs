using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignerDetailsController : ControllerBase
    {
        private readonly ISignerDetailService _signerDetailService;

        public SignerDetailsController(ISignerDetailService signerDetailService)
        {
            _signerDetailService = signerDetailService;
        }


        [HttpGet("GetSignerDetail")]
        public async Task<IActionResult> GetSignerDetails() => Ok(await _signerDetailService.GetSignerDetails());

        [HttpGet("GetByIdSignerDetail")]
        public async Task<IActionResult> GetByIdSignerDetail(int id)
        {
            var result = await _signerDetailService.GetByIdSignerDetail(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUSignerDetail"), Authorize]
        public async Task<IActionResult> CAUSignerDetail([FromForm] SignerDetailRequest request)
        {
            var result = await _signerDetailService.CAUSignerDetail(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("RemoveSignerDetail"), Authorize]
        public async Task<IActionResult> RemoveSignerDetail(int id)
        {
            var result = await _signerDetailService.RemoveSignerDetail(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
