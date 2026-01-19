import React from 'react';
import { Calendar, Search, AlertCircle } from 'lucide-react';

const BrowseEvents = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDateFilter,
  setSelectedDateFilter,
  browsePage,
  setBrowsePage,
  categories,
  uniqueDates,
  loading,
  error,
  fetchEvents,
  paginatedBrowseEvents,
  filteredEvents,
  EventCard,
  BROWSE_EVENTS_PER_PAGE
}) => {
  return (
    <>
      {/* Search and Filters */}
      <div className="mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by event name, college, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setBrowsePage(1); // Reset pagination on search
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* All Events Button */}
            <button
              onClick={() => { 
                setSearchTerm(''); 
                setSelectedCategory('all'); 
                setSelectedDateFilter('all'); 
                setBrowsePage(1); // Reset pagination
              }}
              className="bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base order-3 sm:order-1"
            >
              All Events
            </button>

            {/* Filter Dropdowns Container */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 sm:flex-none order-1 sm:order-2">
              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setBrowsePage(1); // Reset pagination
                }}
                className="w-full sm:w-auto px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white"
              >
                <option value="all" disabled hidden>
                  Filter by Category
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>                    
              
              {/* Date Dropdown */}
              <select
                value={selectedDateFilter}                  
                onChange={(e) => {
                  setSelectedDateFilter(e.target.value);
                  setBrowsePage(1); // Reset pagination
                }}
                className="w-full sm:w-auto px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white"
              >
                {/* Placeholder heading */}
                <option value="all" disabled hidden>                  
                  Filter by Dates
                </option>
              
                {/* Default option */}                  
                <option value="all">All Dates</option>
              
                {/* Event dates */}
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Events</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : paginatedBrowseEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBrowseEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          {/* Load More Button for Browse Events */}
          {paginatedBrowseEvents.length < filteredEvents.length && (
            <div className="text-center py-8">
              <button
                onClick={() => setBrowsePage(prev => prev + 1)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Load More Events ({filteredEvents.length - paginatedBrowseEvents.length} remaining)
              </button>
            </div>
          )}

          {/* Reset button when all events loaded */}
          {paginatedBrowseEvents.length === filteredEvents.length && filteredEvents.length > BROWSE_EVENTS_PER_PAGE && (
            <div className="text-center py-6">
              <button
                onClick={() => setBrowsePage(1)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Show Less Events
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default BrowseEvents;