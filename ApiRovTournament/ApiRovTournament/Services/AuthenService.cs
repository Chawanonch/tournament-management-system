using ApiRovTournament.Data;
using ApiRovTournament.Dtos;
using ApiRovTournament.Models;
using ApiRovTournament.Services.IServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ApiRovTournament.Services
{
    public class AuthenService : IAuthenService
    {
        private readonly Context _context;
        private readonly IConfiguration configuration;
        private readonly IHttpContextAccessor httpContextAccessor;

        public AuthenService(Context context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            this.configuration = configuration;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<User>> GetUsers()
        {
            return await _context.Users.Include(x => x.Role).ToListAsync();
        }
        public async Task<List<Role>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }
        public async Task<User> GetUser()
        {
            var email = string.Empty;
            if (httpContextAccessor.HttpContext != null) email = httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);

            var user = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Email == email);
            if (user == null) return null;
            return user;
        }
        public async Task<User> Register(RegisterDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email || x.Username == dto.Username);
            if (user != null) return null;

            var role = await _context.Roles.FirstOrDefaultAsync(x => x.Id == dto.RoleId);
            if (role == null) return null;

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var User = new User()
            {
                Email = dto.Email,
                Username = dto.Username,
                PasswordHash = passwordHash,
                RoleId = dto.RoleId,
            };
            await _context.Users.AddAsync(User);
            await _context.SaveChangesAsync();
            return User;
        }
        public async Task<string> Login(LoginDto dto)
        {
            var user = await _context.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Username == dto.Email || x.Email == dto.Email);
            if (user == null) return null;

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return null;

            string token = CreateToken(user);
            return token;
        }
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name),
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                configuration.GetSection("JWTSettings:TokenKey").Value!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(30),
                    signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public async Task<bool> IsTokenExpired(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            if (jwtToken == null)
            {
                return true; // Token ไม่ถูกต้องหรือไม่สามารถอ่านได้
            }

            var expiryDateUnix =
                long.Parse(jwtToken.Claims.FirstOrDefault(x => x.Type == "exp")?.Value);

            var expiryDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                .AddSeconds(expiryDateUnix);

            if (expiryDateTimeUtc > DateTime.UtcNow)
            {
                return false; // Token ยังไม่หมดอายุ
            }

            return true; // Token หมดอายุ
        }

        public async Task<object> GetUserDetail()
        {
            var id = 0;
            var username = string.Empty;
            var role = string.Empty;
            var email = string.Empty;

            var user = await GetUser();
            if (user == null) return "user not found.";

            if (httpContextAccessor.HttpContext != null)
            {
                id = user.Id;
                username = user.Username;
                role = user.Role.Name;
                email = user.Email;
            }
            return new { id, username, role, email };
        }
        public async Task<object> RemoveUser(int id)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (user == null) return null;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return "success";
        }
    }
}
