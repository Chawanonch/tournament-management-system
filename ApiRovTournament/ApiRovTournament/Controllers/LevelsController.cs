using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LevelsController : ControllerBase
    {
        private readonly ILevelService _levelService;

        public LevelsController(ILevelService levelService)
        {
            _levelService = levelService;
        }

        [HttpGet("GetLevel")]
        public async Task<IActionResult> GetLevels() => Ok(await _levelService.GetLevels());

        [HttpGet("GetByIdLevel")]
        public async Task<IActionResult> GetByIdLevel(int id)
        {
            var result = await _levelService.GetByIdLevel(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAULevel"), Authorize]
        public async Task<IActionResult> CAULevel([FromForm] LevelRequest request)
        {
            var result = await _levelService.CAULevel(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("RemoveLevel"), Authorize]
        public async Task<IActionResult> RemoveLevel(int id)
        {
            var result = await _levelService.RemoveLevel(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
