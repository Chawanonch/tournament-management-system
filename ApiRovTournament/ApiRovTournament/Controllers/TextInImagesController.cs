using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TextInImagesController : ControllerBase
    {
        private readonly ITextInImageService _textInImageService;

        public TextInImagesController(ITextInImageService textInImageService)
        {
            _textInImageService = textInImageService;
        }


        [HttpGet("GetTextInImage")]
        public async Task<IActionResult> GetTextInImages() => Ok(await _textInImageService.GetTextInImages());

        [HttpGet("GetByIdTextInImage")]
        public async Task<IActionResult> GetByIdTextInImage(int id)
        {
            var result = await _textInImageService.GetByIdTextInImage(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUTextInImage"), Authorize]
        public async Task<IActionResult> CAUTextInImage([FromForm] TextInImageRequest request)
        {
            var result = await _textInImageService.CAUTextInImage(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("RemoveTextInImage"), Authorize]
        public async Task<IActionResult> RemoveTextInImage(int id)
        {
            var result = await _textInImageService.RemoveTextInImage(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
