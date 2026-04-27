// src/components/SearchBar.js

import React, { useState } from "react";
import { FaSearch, FaTimes, FaSlidersH } from "react-icons/fa";

const SearchBar = ({
  onSearch,
  onFilterClick,
  placeholder = "Search products...",
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");

    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className="searchbar-wrapper">
      <form className="searchbar" onSubmit={handleSubmit}>
        {/* Search Icon */}
        <div className="icon-left">
          <FaSearch />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);

            if (onSearch) {
              onSearch(e.target.value);
            }
          }}
        />

        {/* Clear */}
        {query && (
          <button
            type="button"
            className="clear-btn"
            onClick={clearSearch}
          >
            <FaTimes />
          </button>
        )}

        {/* Submit */}
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {/* Filter Button */}
      <button
        className="filter-btn"
        onClick={onFilterClick}
      >
        <FaSlidersH />
        <span>Filters</span>
      </button>

      {/* CSS */}
      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      .searchbar-wrapper{
        width:100%;
        display:flex;
        align-items:center;
        gap:14px;
        padding:20px 0;
        font-family:Arial,sans-serif;
      }

      .searchbar{
        flex:1;
        display:flex;
        align-items:center;
        background:#fff;
        border:1px solid #e5e5e5;
        border-radius:16px;
        padding:10px 12px;
        gap:10px;
        transition:.3s ease;
      }

      .searchbar:focus-within{
        border-color:#111;
        box-shadow:0 8px 20px rgba(0,0,0,0.06);
      }

      .icon-left{
        width:38px;
        height:38px;
        border-radius:12px;
        background:#f5f5f5;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#555;
        flex-shrink:0;
      }

      .searchbar input{
        flex:1;
        border:none;
        outline:none;
        font-size:15px;
        background:transparent;
        min-width:0;
      }

      .clear-btn{
        width:38px;
        height:38px;
        border:none;
        border-radius:12px;
        background:#f5f5f5;
        color:#444;
        cursor:pointer;
        flex-shrink:0;
        transition:.3s;
      }

      .clear-btn:hover{
        background:#111;
        color:#fff;
      }

      .search-btn{
        border:none;
        background:#111;
        color:#fff;
        padding:12px 18px;
        border-radius:12px;
        cursor:pointer;
        font-weight:700;
        white-space:nowrap;
        transition:.3s;
      }

      .search-btn:hover{
        background:#222;
      }

      .filter-btn{
        border:none;
        background:#111;
        color:#fff;
        padding:14px 18px;
        border-radius:14px;
        cursor:pointer;
        display:flex;
        align-items:center;
        gap:10px;
        font-weight:700;
        white-space:nowrap;
        transition:.3s;
      }

      .filter-btn:hover{
        background:#222;
      }

      /* Tablet */
      @media(max-width:992px){

        .searchbar-wrapper{
          gap:10px;
        }

        .search-btn{
          padding:12px 14px;
        }

        .filter-btn{
          padding:14px 16px;
        }

      }

      /* Mobile */
      @media(max-width:768px){

        .searchbar-wrapper{
          flex-direction:column;
          align-items:stretch;
          gap:12px;
          padding:16px 0;
        }

        .searchbar{
          width:100%;
          padding:10px;
        }

        .search-btn{
          padding:11px 14px;
          font-size:14px;
        }

        .filter-btn{
          width:100%;
          justify-content:center;
          padding:13px 16px;
        }

      }

      /* Small Mobile */
      @media(max-width:480px){

        .icon-left,
        .clear-btn{
          width:34px;
          height:34px;
          border-radius:10px;
        }

        .searchbar{
          gap:8px;
          border-radius:14px;
        }

        .searchbar input{
          font-size:14px;
        }

        .search-btn{
          padding:10px 12px;
          border-radius:10px;
          font-size:13px;
        }

        .filter-btn{
          padding:12px;
          border-radius:12px;
          font-size:14px;
        }

      }

      `}</style>
    </div>
  );
};

export default SearchBar;