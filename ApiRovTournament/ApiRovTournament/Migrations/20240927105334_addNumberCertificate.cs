using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiRovTournament.Migrations
{
    /// <inheritdoc />
    public partial class addNumberCertificate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CertificateNumber",
                table: "Certificates",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CertificateNumber",
                table: "Certificates");
        }
    }
}
