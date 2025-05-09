using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pustakalaya_online_book_library.Migrations
{
    /// <inheritdoc />
    public partial class UserChangeData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "userPassword",
                table: "Users",
                newName: "UserPassword");

            migrationBuilder.RenameColumn(
                name: "userName",
                table: "Users",
                newName: "UserName");

            migrationBuilder.RenameColumn(
                name: "userEmail",
                table: "Users",
                newName: "UserEmail");

            migrationBuilder.RenameColumn(
                name: "userContact",
                table: "Users",
                newName: "UserContact");

            migrationBuilder.RenameColumn(
                name: "userAddress",
                table: "Users",
                newName: "UserAddress");

            migrationBuilder.RenameColumn(
                name: "profileURL",
                table: "Users",
                newName: "ProfileURL");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "Users",
                newName: "UserId");

            migrationBuilder.AddColumn<int>(
                name: "OrderCount",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderCount",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "UserPassword",
                table: "Users",
                newName: "userPassword");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Users",
                newName: "userName");

            migrationBuilder.RenameColumn(
                name: "UserEmail",
                table: "Users",
                newName: "userEmail");

            migrationBuilder.RenameColumn(
                name: "UserContact",
                table: "Users",
                newName: "userContact");

            migrationBuilder.RenameColumn(
                name: "UserAddress",
                table: "Users",
                newName: "userAddress");

            migrationBuilder.RenameColumn(
                name: "ProfileURL",
                table: "Users",
                newName: "profileURL");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "userId");
        }
    }
}
