using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pustakalaya_online_book_library.Migrations
{
    /// <inheritdoc />
    public partial class initialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    userId = table.Column<Guid>(type: "uuid", nullable: false),
                    userName = table.Column<string>(type: "text", nullable: false),
                    userEmail = table.Column<string>(type: "text", nullable: false),
                    userPassword = table.Column<string>(type: "text", nullable: false),
                    userContact = table.Column<string>(type: "text", nullable: false),
                    userAddress = table.Column<string>(type: "text", nullable: false),
                    profileURL = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.userId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
