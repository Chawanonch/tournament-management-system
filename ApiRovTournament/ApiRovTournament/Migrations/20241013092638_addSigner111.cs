using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiRovTournament.Migrations
{
    /// <inheritdoc />
    public partial class addSigner111 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SignerInfos");

            migrationBuilder.DropColumn(
                name: "CompetitorFullName",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "School",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "SignatureImageUrl",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "TextInImage",
                table: "Certificates");

            migrationBuilder.RenameColumn(
                name: "TrainerFullName",
                table: "Certificates",
                newName: "Image");

            migrationBuilder.AddColumn<int>(
                name: "SignerDetailId",
                table: "Certificates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "Certificates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TextInImageId",
                table: "Certificates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ListTrainers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListTrainers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListTrainers_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SignerDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SignatureImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignerDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TextInImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextInImages", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_SignerDetailId",
                table: "Certificates",
                column: "SignerDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_TeamId",
                table: "Certificates",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_TextInImageId",
                table: "Certificates",
                column: "TextInImageId");

            migrationBuilder.CreateIndex(
                name: "IX_ListTrainers_TeamId",
                table: "ListTrainers",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Certificates_SignerDetails_SignerDetailId",
                table: "Certificates",
                column: "SignerDetailId",
                principalTable: "SignerDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Certificates_Teams_TeamId",
                table: "Certificates",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Certificates_TextInImages_TextInImageId",
                table: "Certificates",
                column: "TextInImageId",
                principalTable: "TextInImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Certificates_SignerDetails_SignerDetailId",
                table: "Certificates");

            migrationBuilder.DropForeignKey(
                name: "FK_Certificates_Teams_TeamId",
                table: "Certificates");

            migrationBuilder.DropForeignKey(
                name: "FK_Certificates_TextInImages_TextInImageId",
                table: "Certificates");

            migrationBuilder.DropTable(
                name: "ListTrainers");

            migrationBuilder.DropTable(
                name: "SignerDetails");

            migrationBuilder.DropTable(
                name: "TextInImages");

            migrationBuilder.DropIndex(
                name: "IX_Certificates_SignerDetailId",
                table: "Certificates");

            migrationBuilder.DropIndex(
                name: "IX_Certificates_TeamId",
                table: "Certificates");

            migrationBuilder.DropIndex(
                name: "IX_Certificates_TextInImageId",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "SignerDetailId",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "TextInImageId",
                table: "Certificates");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Certificates",
                newName: "TrainerFullName");

            migrationBuilder.AddColumn<string>(
                name: "CompetitorFullName",
                table: "Certificates",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Level",
                table: "Certificates",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "School",
                table: "Certificates",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SignatureImageUrl",
                table: "Certificates",
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
                name: "SignerInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CertificateId = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SignatureImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_SignerInfos_CertificateId",
                table: "SignerInfos",
                column: "CertificateId");
        }
    }
}
