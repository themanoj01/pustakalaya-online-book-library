﻿namespace pustakalaya_online_book_library.Entities
{
    public class BookAuthor
    {
        public Guid BookId { get; set; }
        public Book Book { get; set; }

        public Guid AuthorId { get; set; }
        public Author Author { get; set; }


    }
}
