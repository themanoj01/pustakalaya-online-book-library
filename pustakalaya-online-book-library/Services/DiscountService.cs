using AutoMapper;
using Microsoft.EntityFrameworkCore;
using pustakalaya_online_book_library.Data;
using pustakalaya_online_book_library.DTOs;
using pustakalaya_online_book_library.Entities;
using pustakalaya_online_book_library.Services.Interfaces;

namespace pustakalaya_online_book_library.Services
{
    public class DiscountService : IDiscountService
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public DiscountService(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Discount> CreateAsync(CreateDiscountDto discountDto)
        {
            var discount = _mapper.Map<Discount>(discountDto);
            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync();
            return discount;
        }

        public async Task DeleteAsync(Guid id)
        {
            var discount =  await _context.Discounts.FirstOrDefaultAsync(d => d.Id == id);
            if(discount == null)
            {
                throw new KeyNotFoundException($"Discount with id {id} not found.");
            }
            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Discount>> GetAllAsync()
        {
            return await _context.Discounts.ToListAsync();
        }


        public async Task<Discount> GetByIdAsync(Guid id)
        {
            var discount = await _context.Discounts.FirstOrDefaultAsync(d =>d.Id == id);
            if(discount == null)
            {
                throw new KeyNotFoundException($"Discount with id {id} not found.");
            }
            return discount;
        }

        public async Task UpdateAsync(Guid id, UpdateDiscountDto discount)
        {
            var existing = _context.Discounts.FirstOrDefaultAsync(d => d.Id == id);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Discount with id {id} not found.");
            }
            _mapper.Map(discount, existing);
            await _context.SaveChangesAsync();
        }
    }
}
