using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiRovTournament.Migrations
{
    /// <inheritdoc />
    public partial class addCompeteAndUpdateCertificate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompetitionListId",
                table: "Prizes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Details",
                table: "CompetitionLists",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TextInImage",
                table: "Certificates",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Competes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsHide = table.Column<bool>(type: "bit", nullable: false),
                    CompetitionListId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Competes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Competes_CompetitionLists_CompetitionListId",
                        column: x => x.CompetitionListId,
                        principalTable: "CompetitionLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListCompetitionPrizes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Rank = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    CompetitionListId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListCompetitionPrizes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListCompetitionPrizes_CompetitionLists_CompetitionListId",
                        column: x => x.CompetitionListId,
                        principalTable: "CompetitionLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SignerInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SignatureImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CertificateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignerInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SignerInfos_Certificates_CertificateId",
                        column: x => x.CertificateId,
                        principalTable: "Certificates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RegistrationCompetes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompeteId = table.Column<int>(type: "int", nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    DateRegistration = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Number = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrationCompetes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrationCompetes_Competes_CompeteId",
                        column: x => x.CompeteId,
                        principalTable: "Competes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RegistrationCompetes_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Prizes_CompetitionListId",
                table: "Prizes",
                column: "CompetitionListId");

            migrationBuilder.CreateIndex(
                name: "IX_Competes_CompetitionListId",
                table: "Competes",
                column: "CompetitionListId");

            migrationBuilder.CreateIndex(
                name: "IX_ListCompetitionPrizes_CompetitionListId",
                table: "ListCompetitionPrizes",
                column: "CompetitionListId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationCompetes_CompeteId",
                table: "RegistrationCompetes",
                column: "CompeteId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationCompetes_TeamId",
                table: "RegistrationCompetes",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_SignerInfos_CertificateId",
                table: "SignerInfos",
                column: "CertificateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Prizes_CompetitionLists_CompetitionListId",
                table: "Prizes",
                column: "CompetitionListId",
                principalTable: "CompetitionLists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prizes_CompetitionLists_CompetitionListId",
                table: "Prizes");

            migrationBuilder.DropTable(
                name: "ListCompetitionPrizes");

            migrationBuilder.DropTable(
                name: "RegistrationCompetes");

            migrationBuilder.DropTable(
                name: "SignerInfos");

            migrationBuilder.DropTable(
                name: "Competes");

            migrationBuilder.DropIndex(
                name: "IX_Prizes_CompetitionListId",
                table: "Prizes");

            migrationBuilder.DropColumn(
                name: "CompetitionListId",
                table: "Prizes");

            migrationBuilder.DropColumn(
                name: "Details",
                table: "CompetitionLists");

            migrationBuilder.DropColumn(
                name: "TextInImage",
                table: "Certificates");
        }
    }
}
