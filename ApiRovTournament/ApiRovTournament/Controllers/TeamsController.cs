using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamsController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpGet("GetTeam")]
        public async Task<IActionResult> GetTeams() => Ok(await _teamService.GetTeams());
        [HttpGet("GetTeamByUser"), Authorize]
        public async Task<IActionResult> GetTeamByUser() => Ok(await _teamService.GetTeamByUser());

        [HttpGet("GetByIdTeam")]
        public async Task<IActionResult> GetByIdTeam(int id)
        {
            var result = await _teamService.GetByIdTeam(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUTeam"), Authorize]
        public async Task<IActionResult> CAUTeam([FromBody] TeamRequest request)
        {
            var result = await _teamService.CAUTeam(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("RemoveTeam"), Authorize]
        public async Task<IActionResult> RemoveTeam(int id)
        {
            var result = await _teamService.RemoveTeam(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
