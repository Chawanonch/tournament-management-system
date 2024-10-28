using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiRovTournament.Migrations
{
    /// <inheritdoc />
    public partial class fixedCompetitionforNameDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prizes_CompetitionLists_CompetitionListId",
                table: "Prizes");

            migrationBuilder.DropTable(
                name: "ListCompetitionPrizes");

            migrationBuilder.DropIndex(
                name: "IX_Prizes_CompetitionListId",
                table: "Prizes");

            migrationBuilder.DropColumn(
                name: "CompetitionListId",
                table: "Prizes");

            migrationBuilder.DropColumn(
                name: "Details",
                table: "CompetitionLists");

            migrationBuilder.CreateTable(
                name: "AllDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LinkDetail = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ListNameCompetitionDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompetitionListId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListNameCompetitionDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListNameCompetitionDetails_CompetitionLists_CompetitionListId",
                        column: x => x.CompetitionListId,
                        principalTable: "CompetitionLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListNameCompetitionDetails_CompetitionListId",
                table: "ListNameCompetitionDetails",
                column: "CompetitionListId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AllDetails");

            migrationBuilder.DropTable(
                name: "ListNameCompetitionDetails");

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

            migrationBuilder.CreateTable(
                name: "ListCompetitionPrizes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompetitionListId = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    Rank = table.Column<string>(type: "nvarchar(max)", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_Prizes_CompetitionListId",
                table: "Prizes",
                column: "CompetitionListId");

            migrationBuilder.CreateIndex(
                name: "IX_ListCompetitionPrizes_CompetitionListId",
                table: "ListCompetitionPrizes",
                column: "CompetitionListId");

            migrationBuilder.AddForeignKey(
                name: "FK_Prizes_CompetitionLists_CompetitionListId",
                table: "Prizes",
                column: "CompetitionListId",
                principalTable: "CompetitionLists",
                principalColumn: "Id");
        }
    }
}
