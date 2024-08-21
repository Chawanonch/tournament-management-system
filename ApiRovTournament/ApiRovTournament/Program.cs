using ApiRovTournament.Data;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<Context>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

//ยืนยัน Token ที่ได้รับว่าถูกต้องหรือไม่บนเซิฟเวอร์
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                       .AddJwtBearer(opt =>
                       {
                           opt.TokenValidationParameters = new TokenValidationParameters
                           {
                               ValidateIssuer = false,
                               ValidateAudience = false,
                               ValidateLifetime = true,
                               ValidateIssuerSigningKey = true,
                               IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                                   .GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
                           };
                       });

//ใช้ AutoRefac ลงทะเบียนโดยอัตโนมัติกรณีมีหลายๆ Service
builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory(containerBuilder =>
{
    containerBuilder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly())
    .Where(t => t.Name.EndsWith("Service") || t.Name.EndsWith("Test"))
    .AsImplementedInterfaces()
    .InstancePerLifetimeScope();
}));

builder.Services.AddAutoMapper(typeof(Program).Assembly);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options => options.AddPolicy(name: MyAllowSpecificOrigins,
    policy =>
    {
        policy.AllowAnyOrigin()
        .AllowAnyMethod().
        AllowAnyHeader();
    }));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors(MyAllowSpecificOrigins);
app.MapFallbackToController("Index", "Fallback");
app.UseAuthorization();

app.MapControllers();

app.Run();
