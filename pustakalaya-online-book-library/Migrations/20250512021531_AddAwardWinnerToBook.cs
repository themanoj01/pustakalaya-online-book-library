using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pustakalaya_online_book_library.Migrations
{
    /// <inheritdoc />
    public partial class AddAwardWinnerToBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AwardWinner",
                table: "Books",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AwardWinner",
                table: "Books");
        }
    }
}
