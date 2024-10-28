using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompetitionsController : ControllerBase
    {
        private readonly ICompetitionService _competitionService;

        public CompetitionsController(ICompetitionService competitionService)
        {
            _competitionService = competitionService;
        }

        [HttpGet("GetCompetition")]
        public async Task<IActionResult> GetCompetitions() => Ok(await _competitionService.GetCompetitions());

        [HttpGet("GetByIdCompetition")]
        public async Task<IActionResult> GetByIdCompetition(int id)
        {
            var result = await _competitionService.GetByIdCompetition(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUCompetition"), Authorize]
        public async Task<IActionResult> CAUCompetition([FromForm] CompetitionRequest request)
        {
            var result = await _competitionService.CAUCompetition(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }
        [HttpGet("GetCompetitionList")]
        public async Task<IActionResult> GetCompetitionLists() => Ok(await _competitionService.GetCompetitionLists());


        [HttpPost("CAUCompetitionList"), Authorize]
        public async Task<IActionResult> CAUCompetitionList([FromBody] CompetitionListDto request)
        {
            var result = await _competitionService.CAUCompetitionList(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("RemoveCompetition"), Authorize]
        public async Task<IActionResult> RemoveCompetition(int id)
        {
            var result = await _competitionService.RemoveCompetition(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }

        [HttpDelete("RemoveCompetitionList"), Authorize]
        public async Task<IActionResult> RemoveCompetitionList(int id)
        {
            var result = await _competitionService.RemoveCompetitionList(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
