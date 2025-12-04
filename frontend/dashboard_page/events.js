// events.js

document.addEventListener('DOMContentLoaded', () => {
    const filterTabs = document.querySelectorAll('.filter-tabs .tab');
    const searchInput = document.getElementById('eventSearch');
    const tableBody = document.getElementById('eventsTableBody');
    const noResults = document.getElementById('noResults');
    const allRows = tableBody ? Array.from(tableBody.querySelectorAll('tr')) : [];

    // --- Core Filtering Function ---
    function filterEvents(searchTerm, statusFilter) {
        let rowsShown = 0;
        
        allRows.forEach(row => {
            const rowTitle = row.cells[0].textContent.toLowerCase();
            const rowStatus = row.getAttribute('data-status');
            
            const matchesSearch = rowTitle.includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || rowStatus === statusFilter;
            
            if (matchesSearch && matchesStatus) {
                row.style.display = '';
                rowsShown++;
            } else {
                row.style.display = 'none';
            }
        });

        // Show/Hide No Results Message
        noResults.style.display = (rowsShown === 0) ? 'block' : 'none';
    }

    // --- Tab Click Handler ---
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const status = tab.getAttribute('data-status');
            const currentSearch = searchInput.value;
            filterEvents(currentSearch, status);
        });
    });

    // --- Search Input Handler ---
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const currentStatusTab = document.querySelector('.filter-tabs .tab.active');
            const status = currentStatusTab ? currentStatusTab.getAttribute('data-status') : 'all';
            const searchTerm = searchInput.value;
            filterEvents(searchTerm, status);
        });
    }

    // Initialize: Ensure the 'All' tab is active on load
    if (filterTabs.length > 0) {
        filterEvents(searchInput ? searchInput.value : '', filterTabs[0].getAttribute('data-status'));
    }
});

// NOTE: You would need a separate common.js for the sidebar functionality
// to avoid repeating it on every page, or include that logic here.