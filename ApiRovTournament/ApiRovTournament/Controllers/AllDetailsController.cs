using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AllDetailsController : ControllerBase
    {
        private readonly IAllDetailService _allDetailSerivce;

        public AllDetailsController(IAllDetailService allDetailSerivce)
        {
            _allDetailSerivce = allDetailSerivce;
        }


        [HttpGet("GetAllDetail")]
        public async Task<IActionResult> GetAllDetails() => Ok(await _allDetailSerivce.GetAllDetails());

        [HttpGet("GetByIdAllDetail")]
        public async Task<IActionResult> GetByIdAllDetail(int id)
        {
            var result = await _allDetailSerivce.GetByIdAllDetail(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("CAUAllDetail"), Authorize]
        public async Task<IActionResult> CAUAllDetail([FromForm] AllDetailRequest request)
        {
            var result = await _allDetailSerivce.CAUAllDetail(request);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("RemoveAllDetail"), Authorize]
        public async Task<IActionResult> RemoveAllDetail(int id)
        {
            var result = await _allDetailSerivce.RemoveAllDetail(id);
            if (result == null) return BadRequest("id not found.");
            return Ok($"Success Remove id : {id}");
        }
    }
}
