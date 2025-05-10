import React, { useState } from 'react';
import { Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { genres } from '../../data/books';
import './FilterBar.css';

const FilterBar = ({ 
  filters, 
  setFilters, 
  sortOption, 
  setSortOption, 
  applyFilters 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handlePriceChange = (e, field) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: value === '' ? null : parseFloat(value)
      }
    }));
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  const handleApplyFilters = () => {
    applyFilters();
    setIsFilterOpen(false);
  };
  
  const handleClearFilters = () => {
    setFilters({
      search: filters.search || '',
      author: '',
      genre: '',
      availability: true,
      priceRange: { min: null, max: null },
      rating: 0,
      format: '',
      publisher: ''
    });
    setSortOption('relevance');
  };
  
  return (
    <div className="filter-bar">
      <div className="filter-bar-main">
        <div className="filter-toggle">
          <button 
            className={`filter-toggle-btn ${isFilterOpen ? 'active' : ''}`} 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={18} />
            <span>Filter</span>
            <ChevronDown size={16} className={isFilterOpen ? 'rotated' : ''} />
          </button>
        </div>
        
        <div className="sort-control">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort" 
            value={sortOption} 
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="relevance">Relevance</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="rating_desc">Rating (Highest)</option>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>
        
        <div className="view-controls">
          <SlidersHorizontal size={18} />
        </div>
      </div>
      
      <div className={`filter-dropdown ${isFilterOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>Filter Options</h3>
          <button 
            className="filter-close" 
            onClick={() => setIsFilterOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="filter-groups">
          <div className="filter-group">
            <h4>Genre</h4>
            <select 
              name="genre" 
              value={filters.genre} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Genres</option>
              {genres.map((genre, index) => (
                <option key={index} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <h4>Author</h4>
            <input 
              type="text" 
              name="author" 
              value={filters.author} 
              onChange={handleFilterChange}
              placeholder="Author name"
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-range">
              <input 
                type="number" 
                placeholder="Min" 
                value={filters.priceRange.min || ''} 
                onChange={(e) => handlePriceChange(e, 'min')}
                className="filter-input price-input"
                min="0"
                step="0.01"
              />
              <span>to</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={filters.priceRange.max || ''} 
                onChange={(e) => handlePriceChange(e, 'max')}
                className="filter-input price-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <h4>Format</h4>
            <select 
              name="format" 
              value={filters.format} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Formats</option>
              <option value="Hardcover">Hardcover</option>
              <option value="Paperback">Paperback</option>
              <option value="eBook">eBook</option>
              <option value="Audiobook">Audiobook</option>
            </select>
          </div>
          
          <div className="filter-group">
            <h4>Rating</h4>
            <div className="rating-filter">
              <input 
                type="range" 
                name="rating" 
                min="0" 
                max="5" 
                step="0.5" 
                value={filters.rating} 
                onChange={handleFilterChange}
                className="rating-slider"
              />
              <span className="rating-value">{filters.rating > 0 ? `${filters.rating}+ stars` : 'Any rating'}</span>
            </div>
          </div>
          
          <div className="filter-group checkbox-group">
            <label className="filter-checkbox">
              <input 
                type="checkbox" 
                name="availability" 
                checked={filters.availability} 
                onChange={handleFilterChange}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>
        
        <div className="filter-actions">
          <button className="btn-clear" onClick={handleClearFilters}>Clear All</button>
          <button className="btn-apply" onClick={handleApplyFilters}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;