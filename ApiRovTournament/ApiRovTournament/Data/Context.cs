using ApiRovTournament.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiRovTournament.Data
{
    public class Context : DbContext
    {
        private readonly IConfiguration _config;

        public Context(DbContextOptions options, IConfiguration config) : base(options)
        {
            _config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            //optionsBuilder.UseSqlServer(_config.GetConnectionString("DatabaseConnect"));
            //optionsBuilder.UseSqlServer("Server=DESKTOP-DTGB06O\\SQLEXPRESS; Database=ApiTournament; Trusted_Connection=True; TrustServerCertificate=True");
            //optionsBuilder.UseSqlServer("Server=10.103.0.16,1433; Database=TournamentRovDb; Trusted_connection=false; TrustServerCertificate=true; User Id=student; Password=Cs@2700; Encrypt=false;");
            optionsBuilder.UseSqlServer("Server=10.103.0.15,1433; Database=tournamentrov; Trusted_connection=false; TrustServerCertificate=true; User Id=studentrov; Password=Stu@2600; Encrypt=false;");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>().HasData(
                new Role() { Id = 1, Name = "Admin" },
                new Role() { Id = 2, Name = "User" });

            modelBuilder.Entity<Level>().HasData(
                new Level() { Id = 1, Name = "อายุไม่เกิน 15 ปี" },
                new Level() { Id = 2, Name = "อายุ 15 ปีขึ้นไป" });

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Tournament)
                .WithMany()
                .HasForeignKey(m => m.TournamentId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Team1)
                .WithMany()
                .HasForeignKey(m => m.Team1Id)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Team2)
                .WithMany()
                .HasForeignKey(m => m.Team2Id)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Registration>()
                .HasOne(r => r.Tournament)
                .WithMany()
                .HasForeignKey(r => r.TournamentId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Registration>()
                .HasOne(r => r.Team)
                .WithMany()
                .HasForeignKey(r => r.TeamId)
                .OnDelete(DeleteBehavior.NoAction);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<Level> Levels { get; set; }
        public DbSet<Match> Matchs { get; set; }
        public DbSet<Registration> Registrations { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<ListLevel> ListLevels { get; set; }
        public DbSet<ListMember> ListMembers { get; set; }
        public DbSet<ListTrainer> ListTrainers { get; set; }
        public DbSet<TextInImage> TextInImages { get; set; }
        public DbSet<Certificate> Certificates { get; set; }
        public DbSet<ListPrize> Prizes { get; set; }
        public DbSet<Competition> Competitions { get; set; }
        public DbSet<CompetitionList> CompetitionLists { get; set; }
        public DbSet<ListNameCompetitionDetails> ListNameCompetitionDetails { get; set; }
        public DbSet<Compete> Competes { get; set; }
        public DbSet<RegistrationCompete> RegistrationCompetes { get; set; }
        public DbSet<AllDetail> AllDetails { get; set; }
        public DbSet<ListLevelCompete> ListLevelCompetes { get; set; }
        public DbSet<SignerDetail> SignerDetails { get; set; }
        public DbSet<ListSignerDetail> ListSignerDetails { get; set; }


    }
}
