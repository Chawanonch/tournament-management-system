using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiRovTournament.Migrations
{
    /// <inheritdoc />
    public partial class addListCompete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ListLevelCompetes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LevelId = table.Column<int>(type: "int", nullable: false),
                    CompeteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListLevelCompetes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListLevelCompetes_Competes_CompeteId",
                        column: x => x.CompeteId,
                        principalTable: "Competes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ListLevelCompetes_Levels_LevelId",
                        column: x => x.LevelId,
                        principalTable: "Levels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListLevelCompetes_CompeteId",
                table: "ListLevelCompetes",
                column: "CompeteId");

            migrationBuilder.CreateIndex(
                name: "IX_ListLevelCompetes_LevelId",
                table: "ListLevelCompetes",
                column: "LevelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListLevelCompetes");
        }
    }
}
