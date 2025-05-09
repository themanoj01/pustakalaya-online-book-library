using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pustakalaya_online_book_library.Migrations
{
    /// <inheritdoc />
    public partial class Discountadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Books_BookId",
                table: "Books");

            migrationBuilder.RenameColumn(
                name: "BookId",
                table: "Books",
                newName: "DiscountId");

            migrationBuilder.RenameIndex(
                name: "IX_Books_BookId",
                table: "Books",
                newName: "IX_Books_DiscountId");

            migrationBuilder.CreateTable(
                name: "Discounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DiscountPercent = table.Column<double>(type: "double precision", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Discounts", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Discounts_DiscountId",
                table: "Books",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Discounts_DiscountId",
                table: "Books");

            migrationBuilder.DropTable(
                name: "Discounts");

            migrationBuilder.RenameColumn(
                name: "DiscountId",
                table: "Books",
                newName: "BookId");

            migrationBuilder.RenameIndex(
                name: "IX_Books_DiscountId",
                table: "Books",
                newName: "IX_Books_BookId");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Books_BookId",
                table: "Books",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id");
        }
    }
}
