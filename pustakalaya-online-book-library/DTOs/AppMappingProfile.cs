using AutoMapper;
using pustakalaya_online_book_library.Entities;

namespace pustakalaya_online_book_library.DTOs
{
    public class AppMappingProfile : Profile
    {
            public AppMappingProfile()
            {
                CreateMap<GenreCreateDto, Genre>();
                CreateMap<GenreUpdateDto, Genre>();

                CreateMap<ReviewCreateDto, Review>();
                CreateMap<ReviewUpdateDto, Review>();

                CreateMap<AuthorCreateDto, Author>();
                CreateMap<AuthorUpdateDto, Author>();

                CreateMap<AnnouncementCreateDto, Announcement>();
                CreateMap<AnnouncementUpdateDto, Announcement>();

                CreateMap<CreateDiscountDto, Discount>();
                CreateMap<UpdateDiscountDto, Discount>();
        }
    }
}
