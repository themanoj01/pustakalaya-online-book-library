﻿namespace pustakalaya_online_book_library.Entities
{
    public class BookGenre
    {
        public Guid BookId { get; set; }
        public Book Book { get; set; }

        public Guid GenreId { get; set; }
        public Genre Genre { get; set; }
    }
}
