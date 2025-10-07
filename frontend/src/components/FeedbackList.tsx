import React, { useEffect, useState } from "react";
import { fetchFeedbacks } from "../api/feedbackApi";
import type { FeedbackQueryParams } from "../api/feedbackApi";
import "./FeedbackList.scss";

interface Feedback {
  id: string; // Updated to string as IDs are UUIDs
  first_name: string;
  last_name: string;
  email: string;
  mobile: string | null;
  rating: number;
  feedback: string;
  created_at: string;
}

interface PaginatedResponse {
  items: Feedback[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Feedback>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  
  // Available page size options
  const pageSizeOptions = [5, 10, 25, 50, 100];

  useEffect(() => {
    // Create a flag to prevent state updates if the component unmounts
    let isMounted = true;
    
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        
        if (isMounted) setLoading(true);
        if (isMounted) setError(null);
        
        const queryParams: FeedbackQueryParams = {
          page: currentPage,
          size: itemsPerPage,
          sortBy: sortField,
          sortDirection: sortDirection
        };
        
        const response = await fetchFeedbacks(queryParams);
        
        // Only update state if the component is still mounted
        if (!isMounted) return;
        
        // Handle the paginated response
        if (response && 'items' in response) {
          // Handle the paginated response structure
          const paginatedResponse = response as PaginatedResponse;
          setFeedbacks(paginatedResponse.items || []);
          setTotalPages(paginatedResponse.pages);
          setTotalItems(paginatedResponse.total);
        } else {
          // Fallback for backward compatibility
          setFeedbacks(response || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading feedbacks:", err);
          setError("Failed to load feedback data. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadFeedbacks();
    
    // Cleanup function to prevent memory leaks and state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [currentPage, sortField, sortDirection, itemsPerPage]);

  // Use the feedbacks directly from the API, as they're already sorted
  // This prevents unnecessary re-renders and loops
  const sortedFeedbacks = feedbacks;

  const handleSort = (field: keyof Feedback) => {
    if (field === sortField) {
      // Toggle direction if same field clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to descending for dates, ascending for others
      setSortField(field);
      setSortDirection(field === "created_at" ? "desc" : "asc");
    }
    
    // Reset to first page when sort changes
    setCurrentPage(1);
  };
  
  // Handle page navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle change of items per page
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setItemsPerPage(newSize);
    // Reset to first page when changing items per page
    setCurrentPage(1);
  };
  
  // Generate pagination numbers
  const generatePaginationItems = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range with ellipsis
      let startPage: number, endPage: number;
      
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        // Near beginning
        startPage = 1;
        endPage = maxVisiblePages - 1;
        pages.push(...Array.from({length: endPage}, (_, i) => i + 1));
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        // Near end
        startPage = totalPages - (maxVisiblePages - 2);
        pages.push(1);
        pages.push(-1); // Ellipsis
        pages.push(...Array.from({length: maxVisiblePages - 2}, (_, i) => startPage + i));
      } else {
        // Middle
        startPage = currentPage - 1;
        endPage = currentPage + 1;
        pages.push(1);
        pages.push(-1); // Left ellipsis
        pages.push(...Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i));
        pages.push(-2); // Right ellipsis
        pages.push(totalPages);
      }
    }
    
    return pages;
  };  // Format date to a readable format with explicit UTC time
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      // Create a Date object from the ISO string (server provides UTC time)
      const date = new Date(dateString);
      
      // Format with ISO string to preserve UTC and explicitly show timezone
      // Format: "Oct 7, 2025, 10:30:00 AM (UTC)"
      return `${date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}, ${date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })} (UTC)`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  // Render stars for ratings with improved display
  const renderStars = (rating: number) => {
    return (
      <div className="star-rating">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>
    );
  };

  return (
    <div className="feedback-list-container">
      <h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Recent Feedback
      </h2>
      
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>Loading feedback data...</div>
        </div>
      )}
      
      {error && (
        <div className="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div className="error-message">{error}</div>
        </div>
      )}
      
      {!loading && !error && feedbacks.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <div className="empty-message">No feedback submitted yet</div>
          <div className="empty-submessage">Be the first to share your thoughts!</div>
        </div>
      ) : (
        <div className="feedback-table-wrapper">
          <table className="feedback-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("created_at")} className={sortField === "created_at" ? `sorted ${sortDirection}` : ""}>
                  Date {sortField === "created_at" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("first_name")} className={sortField === "first_name" ? `sorted ${sortDirection}` : ""}>
                  Name {sortField === "first_name" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("rating")} className={sortField === "rating" ? `sorted ${sortDirection}` : ""}>
                  Rating {sortField === "rating" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {sortedFeedbacks.map((fb) => (
                <tr key={fb.id}>
                  <td className="date-cell">{formatDate(fb.created_at)}</td>
                  <td className="name-cell">
                    <div>{fb.first_name} {fb.last_name}</div>
                    <div className="email">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      {fb.email}
                    </div>
                    {fb.mobile && (
                      <div className="mobile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                          <line x1="12" y1="18" x2="12" y2="18"></line>
                        </svg>
                        {fb.mobile}
                      </div>
                    )}
                  </td>
                  <td className="rating-cell">{renderStars(fb.rating)}</td>
                  <td className="feedback-cell">
                    <div className="feedback-content">{fb.feedback}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination controls */}
          <div className="pagination-controls">
            <div className="pagination-row">
              <div className="items-per-page">
                <span>Show</span>
                <select 
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="items-per-page-select"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span>entries</span>
              </div>
              
              <div className="pagination-info">
                {totalItems > 0 ? (
                  <span>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                  </span>
                ) : (
                  <span>No entries to show</span>
                )}
              </div>
            </div>
            
            {totalPages > 1 && (
              <div className="pagination-buttons">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pagination-button prev"
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                
                {generatePaginationItems().map((page, index) => {
                  if (page < 0) {
                    // Render ellipsis
                    return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
                  }
                  return (
                    <button 
                      key={`page-${page}`}
                      onClick={() => handlePageChange(page)}
                      className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pagination-button next"
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
