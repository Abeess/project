// DOM Elements
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const navLinks = document.querySelectorAll('.sidebar-nav a');

// Modal Elements
const createEventBtn = document.getElementById('create-event-btn');
const addEventModal = document.getElementById('add-event-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelBtn = document.getElementById('cancel-btn');
const addEventForm = document.getElementById('add-event-form');
const eventsTableBody = document.getElementById('events-table-body');
const modalTitle = document.querySelector('.modal-header h2');
const submitBtn = document.querySelector('.form-actions button[type="submit"]');
const totalEventsCount = document.getElementById('total-events-count');
const upcomingEventsCount = document.getElementById('upcoming-events-count');
const searchInput = document.getElementById('search-input');

// State for Edit Mode
let isEditMode = false;
let editEventIndex = null;

// Toggle Sidebar
if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
    });
}

if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (sidebar && !sidebar.contains(e.target) && !openSidebarBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Active Link Handling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Remove active class from all parent lis
        navLinks.forEach(l => l.parentElement.classList.remove('active'));
        // Add active class to clicked link's parent li
        e.currentTarget.parentElement.classList.add('active');
        
        // Mobile: close sidebar after click
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
    });
});

// Event Data
let events = [
    {
        name: "Tech Hackathon 2024",
        category: "Technology",
        organizer: "Computer Science Dept",
        date: "2024-10-24", // Changed format for consistency
        formattedDate: "Oct 24, 2024",
        status: "Upcoming",
        icon: "fa-code",
        color: "#0284c7",
        bg: "#e0f2fe"
    },
    {
        name: "Fall Music Fest",
        category: "Cultural",
        organizer: "Student Council",
        date: "2024-11-05",
        formattedDate: "Nov 05, 2024",
        status: "Ongoing",
        icon: "fa-music",
        color: "#d97706",
        bg: "#fef3c7"
    },
    {
        name: "Eco Awareness Setup",
        category: "Social",
        organizer: "Green Club",
        date: "2024-10-28",
        formattedDate: "Oct 28, 2024",
        status: "Finished",
        icon: "fa-leaf",
        color: "#16a34a",
        bg: "#dcfce7"
    }
];

// Helper to get Icon and Colors based on Category
function getCategoryStyles(category) {
    switch(category) {
        case 'Technology': 
            return { icon: 'fa-code', color: '#0284c7', bg: '#e0f2fe' };
        case 'Cultural': 
            return { icon: 'fa-music', color: '#d97706', bg: '#fef3c7' };
        case 'Social': 
            return { icon: 'fa-leaf', color: '#16a34a', bg: '#dcfce7' };
        case 'Sports': 
            return { icon: 'fa-basketball', color: '#dc2626', bg: '#fee2e2' };
        default: 
            return { icon: 'fa-calendar-day', color: '#4f46e5', bg: '#e0e7ff' };
    }
}

// Update Dashboard Metrics
function updateDashboardMetrics() {
    if (totalEventsCount) {
        totalEventsCount.textContent = events.length;
    }
    if (upcomingEventsCount) {
        const upcomingCount = events.filter(event => event.status === 'Upcoming').length;
        upcomingEventsCount.textContent = upcomingCount;
    }
}

// Render Events Table
function renderEvents(limit = 5, data = events) { // Default limit to 5
    if (!eventsTableBody) return;
    eventsTableBody.innerHTML = '';
    
    // Determine which events to show based on limit
    const eventsToShow = limit === 'all' ? data : data.slice(0, limit);

    if (eventsToShow.length === 0) {
        eventsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No events found</td></tr>';
        return;
    }

    eventsToShow.forEach((event, index) => {
        const styles = getCategoryStyles(event.category);
        const statusClass = `status-${event.status.toLowerCase()}`;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="event-cell">
                    <div class="event-img" style="background-color: ${styles.bg};">
                        <i class="fa-solid ${styles.icon}" style="color: ${styles.color};"></i>
                    </div>
                    <div>
                        <div class="event-name">${event.name}</div>
                        <div class="event-cat">${event.category}</div>
                    </div>
                </div>
            </td>
            <td>${event.organizer}</td>
            <td>${event.formattedDate || event.date}</td>
            <td><span class="status-badge ${statusClass}">${event.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="icon-btn edit" onclick="openEditModal(${index})"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete" onclick="deleteEvent(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        eventsTableBody.appendChild(tr);
    });
}

// Global View All Handler
const viewAllLink = document.querySelector('.view-all');
if (viewAllLink) {
    viewAllLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderEvents('all');
        // Optional: Hide the link after clicking
        viewAllLink.style.display = 'none';
    });
}

// Search Functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEvents = events.filter(event => 
            event.name.toLowerCase().includes(searchTerm) || 
            event.category.toLowerCase().includes(searchTerm) ||
            event.organizer.toLowerCase().includes(searchTerm)
        );
        renderEvents('all', filteredEvents);
    });
}

// Global Logout Handler
const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Clear any stored session data if implemented later
        window.location.href = 'admin_login.html';
    });
}


// Delete Event
window.deleteEvent = function(index) {
    if (confirm('Are you sure you want to delete this event?')) {
        events.splice(index, 1);
        renderEvents();
        updateDashboardMetrics();
    }
};

// Open Modal for Editing
window.openEditModal = function(index) {
    isEditMode = true;
    editEventIndex = index;
    const event = events[index];

    // Populate form
    document.getElementById('event-name').value = event.name;
    document.getElementById('event-date').value = event.date;
    document.getElementById('event-category').value = event.category;
    document.getElementById('event-organizer').value = event.organizer;
    document.getElementById('event-status').value = event.status;

    // Change Modal UI
    modalTitle.textContent = 'Edit Event';
    submitBtn.textContent = 'Update Event';

    openModal();
};

// Modal Logic
function openModal() {
    addEventModal.classList.add('active');
}

function closeModal() {
    addEventModal.classList.remove('active');
    addEventForm.reset();
    
    // Reset Edit State
    isEditMode = false;
    editEventIndex = null;
    modalTitle.textContent = 'Add New Event';
    submitBtn.textContent = 'Add Event';
}

if (createEventBtn) {
    createEventBtn.addEventListener('click', () => {
        // Ensure we are in Add Mode when clicking the main Create button
        isEditMode = false;
        editEventIndex = null;
        modalTitle.textContent = 'Add New Event';
        submitBtn.textContent = 'Add Event';
        openModal();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside
if (addEventModal) {
    addEventModal.addEventListener('click', (e) => {
        if (e.target === addEventModal) {
            closeModal();
        }
    });
}

// Form Submission
if (addEventForm) {
    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('event-name').value;
        const date = document.getElementById('event-date').value;
        const category = document.getElementById('event-category').value;
        const organizer = document.getElementById('event-organizer').value;
        const status = document.getElementById('event-status').value;

        // Simple date formatting (YYYY-MM-DD to MMM DD, YYYY)
        const dateObj = new Date(date);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        const eventData = {
            name,
            category,
            organizer,
            date,
            formattedDate,
            status
        };

        if (isEditMode && editEventIndex !== null) {
            // Update Existing Event
            events[editEventIndex] = eventData;
        } else {
            // Add New Event
            events.unshift(eventData);
        }
        
        // Re-render
        renderEvents();
        updateDashboardMetrics();
        
        // Close modal
        closeModal();

        // Optional: Show success message/toast
        // alert(isEditMode ? 'Event updated!' : 'Event added!');
    });
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderEvents();
    updateDashboardMetrics();
});
