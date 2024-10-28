using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchsController : ControllerBase
    {
        private readonly IMatchService _matchService;

        public MatchsController(IMatchService matchService)
        {
            _matchService = matchService;
        }

        [HttpGet("GetMatch")]
        public async Task<IActionResult> GetMatchs() => Ok(await _matchService.GetMatchs());

        [HttpGet("GetByIdMatch")]
        public async Task<IActionResult> GetByIdMatch(int id)
        {
            var result = await _matchService.GetByIdMatch(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("RandomMatch") ,Authorize]
        public async Task<IActionResult> RandomMatchs(RandomMatchDto dto)
        {
            var result = await _matchService.RandomMatchs(dto);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("UpdateMatch"), Authorize]
        public async Task<IActionResult> UpdateMatch(UpdateMatchDto dto)
        {
            var result = await _matchService.UpdateMatchResult(dto);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("RemoveMatch"), Authorize]
        public async Task<IActionResult> RemoveMatch(int id)
        {
            var result = await _matchService.RemoveMatch(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }

        [HttpGet("ResetTeamsAndDeleteMatches"), Authorize]
        public async Task<IActionResult> ResetTeamsAndDeleteMatches(int id)
        {
            var result = await _matchService.ResetTeamsAndDeleteMatches(id);
            if (result == null) return BadRequest("id not found.");
            return Ok(result);
        }


        [HttpPost("ResetMatchesForRound"), Authorize]
        public async Task<IActionResult> ResetMatchesForRound(ResetMatchForRoundDto dto)
        {
            var result = await _matchService.ResetMatchesForRound(dto);
            if (result == null) return BadRequest("id not found.");
            return Ok(result);
        }
    }
}
