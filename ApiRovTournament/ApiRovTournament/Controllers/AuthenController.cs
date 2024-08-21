using ApiRovTournament.Dtos;
using ApiRovTournament.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiRovTournament.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenController : ControllerBase
    {
        private readonly IAuthenService _authenService;

        public AuthenController(IAuthenService authenService)
        {
            _authenService = authenService;
        }

        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers() => Ok(await _authenService.GetUsers());
        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles() => Ok(await _authenService.GetRoles());

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = await _authenService.Register(dto);
            return Ok(user);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authenService.Login(dto);
            return Ok(result);
        }

        [HttpGet("GetUserDetail"), Authorize]
        public async Task<IActionResult> GetUserDetail() =>
            Ok(await _authenService.GetUserDetail());

        [HttpGet("IsTokenExpired")]
        public async Task<IActionResult> IsTokenExpired(string token)
        {
            var result = await _authenService.IsTokenExpired(token);
            return Ok(result);
        }
        [HttpDelete("RemoveUser")]
        public async Task<IActionResult> RemoveUser(int id)
        {
            var result = await _authenService.RemoveUser(id);
            return Ok(result);
        }
    }
}
