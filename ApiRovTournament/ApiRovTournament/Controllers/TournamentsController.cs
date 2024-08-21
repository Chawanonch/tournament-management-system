using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TournamentsController : ControllerBase
    {
        private readonly ITournamentService _tournamentService;

        public TournamentsController(ITournamentService tournamentService)
        {
            _tournamentService = tournamentService;
        }

        [HttpGet("GetTournament")]
        public async Task<IActionResult> GetTournaments() => Ok(await _tournamentService.GetTournaments());

        [HttpGet("GetByIdTournament")]
        public async Task<IActionResult> GetByIdTournament(int id)
        {
            var result = await _tournamentService.GetByIdTournament(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUTournament"), Authorize]
        public async Task<IActionResult> CAUGetTournament([FromBody] TournamentRequest request)
        {
            var result = await _tournamentService.CAUTournament(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("StatusHideTournament"), Authorize]
        public async Task<IActionResult> StatusHideTournament(int id)
        {
            var result = await _tournamentService.StatusHideTournament(id);
            if (result == null) return BadRequest("id not found.");
            return Ok(result);
        }

        [HttpDelete("RemoveTournament"), Authorize]
        public async Task<IActionResult> RemoveTournament(int id)
        {
            var result = await _tournamentService.RemoveTournament(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
