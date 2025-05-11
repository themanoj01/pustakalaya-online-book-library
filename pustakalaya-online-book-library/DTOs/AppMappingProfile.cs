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

            CreateMap<AnnouncementCreateDto, Announcement>()
                .ForMember(dest => dest.ExpiresAt, opt => opt.MapFrom(src =>
                 src.ExpiresAt.HasValue ? DateTime.SpecifyKind(src.ExpiresAt.Value, DateTimeKind.Utc) : (DateTime?)null));

            CreateMap<AnnouncementUpdateDto, Announcement>()
                .ForMember(dest => dest.ExpiresAt, opt => opt.MapFrom(src =>
                 src.ExpiresAt.HasValue ? DateTime.SpecifyKind(src.ExpiresAt.Value, DateTimeKind.Utc) : (DateTime?)null));

            CreateMap<CreateDiscountDto, Discount>()
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src =>
                    src.StartDate.HasValue ? DateTime.SpecifyKind(src.StartDate.Value, DateTimeKind.Utc) : (DateTime?)null))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src =>
                    src.EndDate.HasValue ? DateTime.SpecifyKind(src.EndDate.Value, DateTimeKind.Utc) : (DateTime?)null));
            CreateMap<UpdateDiscountDto, Discount>()
                 .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src =>
                    src.StartDate.HasValue ? DateTime.SpecifyKind(src.StartDate.Value, DateTimeKind.Utc) : (DateTime?)null))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src =>
                    src.EndDate.HasValue ? DateTime.SpecifyKind(src.EndDate.Value, DateTimeKind.Utc) : (DateTime?)null)); ;
        }
    }
}
