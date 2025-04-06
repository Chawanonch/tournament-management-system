using ApiRovTournament.Dtos;
using ApiRovTournament.Services;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompetesController : ControllerBase
    {
        private readonly ICompeteService _competeService;

        public CompetesController(ICompeteService competeService)
        {
            _competeService = competeService;
        }

        [HttpGet("GetCompete")]
        public async Task<IActionResult> GetCompetes() => Ok(await _competeService.GetCompetes());

        [HttpGet("GetByIdCompete")]
        public async Task<IActionResult> GetByIdCompete(int id)
        {
            var result = await _competeService.GetByIdCompete(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUCompete"), Authorize]
        public async Task<IActionResult> CAUCompete([FromBody] CompeteRequest request)
        {
            var result = await _competeService.CAUCompete(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }
        [HttpPost("CAUCompetes"), Authorize]
        public async Task<IActionResult> CAUCompetes([FromBody] ListCompeteRequest request)
        {
            var result = await _competeService.CAUCompetes(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("StatusHideCompete"), Authorize]
        public async Task<IActionResult> StatusHideCompete(int id)
        {
            var result = await _competeService.StatusHideCompete(id);
            if (result == null) return BadRequest("id not found.");
            return Ok(result);
        }
        [HttpGet("StatusHideCompetes"), Authorize]
        public async Task<IActionResult> StatusHideCompetes(int year)
        {
            var result = await _competeService.StatusHideCompetes(year);
            if (result == null) return BadRequest("id not found.");
            return Ok(result);
        }

        [HttpDelete("RemoveCompete"), Authorize]
        public async Task<IActionResult> RemoveCompete(int id)
        {
            var result = await _competeService.RemoveCompete(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
