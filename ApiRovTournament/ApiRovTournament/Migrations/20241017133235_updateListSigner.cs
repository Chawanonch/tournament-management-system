using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiRovTournament.Migrations
{
    /// <inheritdoc />
    public partial class updateListSigner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Certificates_SignerDetails_SignerDetailId",
                table: "Certificates");

            migrationBuilder.DropIndex(
                name: "IX_Certificates_SignerDetailId",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "SignerDetailId",
                table: "Certificates");

            migrationBuilder.CreateTable(
                name: "ListSignerDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SignerDetailId = table.Column<int>(type: "int", nullable: false),
                    CertificateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListSignerDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListSignerDetails_Certificates_CertificateId",
                        column: x => x.CertificateId,
                        principalTable: "Certificates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ListSignerDetails_SignerDetails_SignerDetailId",
                        column: x => x.SignerDetailId,
                        principalTable: "SignerDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListSignerDetails_CertificateId",
                table: "ListSignerDetails",
                column: "CertificateId");

            migrationBuilder.CreateIndex(
                name: "IX_ListSignerDetails_SignerDetailId",
                table: "ListSignerDetails",
                column: "SignerDetailId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListSignerDetails");

            migrationBuilder.AddColumn<int>(
                name: "SignerDetailId",
                table: "Certificates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_SignerDetailId",
                table: "Certificates",
                column: "SignerDetailId");

            migrationBuilder.AddForeignKey(
                name: "FK_Certificates_SignerDetails_SignerDetailId",
                table: "Certificates",
                column: "SignerDetailId",
                principalTable: "SignerDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
