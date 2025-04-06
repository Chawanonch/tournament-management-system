using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeImagesController : ControllerBase
    {
        private readonly IHomeImageService _homeImageService;

        public HomeImagesController(IHomeImageService homeImageService)
        {
            _homeImageService = homeImageService;
        }

        [HttpGet("GetHomeImage")]
        public async Task<IActionResult> GetHomeImages() => Ok(await _homeImageService.GetHomeImages());

        [HttpGet("GetByIdHomeImage")]
        public async Task<IActionResult> GetByIdHomeImage(int id)
        {
            var result = await _homeImageService.GetByIdHomeImages(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUHomeImage"), Authorize]
        public async Task<IActionResult> CAUHomeImage([FromForm] HomeImagesRequest request)
        {
            var result = await _homeImageService.CAUHomeImages(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("RemoveHomeImage"), Authorize]
        public async Task<IActionResult> RemoveHomeImage(int id)
        {
            var result = await _homeImageService.RemoveHomeImages(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
