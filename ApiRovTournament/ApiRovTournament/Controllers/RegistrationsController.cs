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
    public class RegistrationsController : ControllerBase
    {
        private readonly IRegistrationService _registrationService;

        public RegistrationsController(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        [HttpGet("GetRegistrations")]
        public async Task<IActionResult> GetRegistrations() => Ok(await _registrationService.GetRegistrations());

        [HttpGet("GetByIdRegistration")]
        public async Task<IActionResult> GetByIdRegistration(int id)
        {
            var result = await _registrationService.GetByIdRegistration(id);
            if (result == null) return NotFound("id not found.");
            return Ok(result);
        }

        [HttpPost("Registration"), Authorize]
        public async Task<IActionResult> Registration(RegistrationRequest dto)
        {
            var result = await _registrationService.Registration(dto);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("CheckInRegistrations"), Authorize]
        public async Task<IActionResult> CheckInRegistrations(int id)
        {
            var result = await _registrationService.CheckInRegistrations(id);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }
        [HttpGet("CheckInAllRegistrations"), Authorize]
        public async Task<IActionResult> CheckInAllRegistrations(int id)
        {
            var result = await _registrationService.CheckInAllRegistrations(id);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }
        [HttpGet("CancelCheckInAllRegistrations"), Authorize]
        public async Task<IActionResult> CancelCheckInAllRegistrations(int id)
        {
            var result = await _registrationService.CancelCheckInAllRegistrations(id);
            if (result == null) return BadRequest(result);
            return Ok(result);
        }
        [HttpDelete("RemoveRegistration"), Authorize]
        public async Task<IActionResult> RemoveRegistration(int id)
        {
            var result = await _registrationService.RemoveRegistration(id);
            if (result == null) return BadRequest("id not found.");
            return Ok(result);
        }
    }
}
