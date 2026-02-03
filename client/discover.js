// DOM Manipulation and Event Handling for Book Goblin - Discover Page

// 1. Cache elements using different selectors
const discoverSearch = document.getElementById('discoverSearch'); // getElementById
const booksGrid = document.querySelector('#booksGrid'); // querySelector
const quickFilters = document.querySelectorAll('.genre-filter'); // querySelectorAll
const searchDiscoverBtn = document.getElementById('searchDiscoverBtn');
const sortDiscover = document.getElementById('sortDiscover');
const genreFilter = document.getElementById('genreFilter');
const ratingFilter = document.getElementById('ratingFilter');
const yearFrom = document.getElementById('yearFrom');
const yearTo = document.getElementById('yearTo');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const resultsCount = document.getElementById('resultsCount');
const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const recommendationForm = document.getElementById('recommendationForm');
const recDescription = document.getElementById('recDescription');
const charCounter = document.getElementById('charCounter');
const formMessage = document.getElementById('formMessage');
const bookDetailsModal = document.getElementById('bookDetailsModal');
const addToTbrBtn = document.getElementById('addToTbrBtn');
const trendingBooks = document.getElementById('trendingBooks');
const discoverCarousel = document.querySelector('#discoverCarousel .carousel-inner');
const pageInfo = document.getElementById('pageInfo');

// 2. Use parent-child-sibling relationships
const advancedFilters = document.getElementById('advancedFilters');
const filtersParent = advancedFilters.parentElement; // Parent
const firstFilter = advancedFilters.firstElementChild; // First child
const lastFilter = advancedFilters.lastElementChild; // Last child
const genreDropdown = document.getElementById('genreDropdown');
const firstGenreItem = genreDropdown.firstElementChild; // First child of dropdown

// 3. Browser Object Model properties/methods
window.addEventListener('load', function() {
    // BOM: Display page info
    pageInfo.textContent = `Discover Page | ${window.location.hostname} | ${new Date().toLocaleDateString()}`;
    
    // BOM: Set focus to search input
    discoverSearch.focus();
    
    // BOM: Check online status
    if (!navigator.onLine) {
        showNotification('You are offline. Some features may be limited.', 'warning');
    }
    
    // Initialize page
    initializeDiscoverPage();
});

// 4. Create element using createElement
function createBookCard(book) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3';
    col.setAttribute('data-book-id', book.id);
    col.setAttribute('data-genre', book.genre);
    col.setAttribute('data-rating', book.rating);
    col.setAttribute('data-year', book.year);
    
    const card = document.createElement('div');
    card.className = 'card card-glass h-100 border-0 book-card';
    
    // Card content
    card.innerHTML = `
        <div class="d-flex justify-content-center p-3 pb-0">
            <img src="${book.image}" 
                 class="card-img-top" alt="${book.title}" 
                 style="width: 150px; height: 225px; object-fit: cover;">
        </div>
        <div class="card-body d-flex flex-column">
            <h5 class="card-title fs-6 mb-1">${book.title}</h5>
            <p class="card-text text-muted small mb-2">${book.author}</p>
            <div class="text-warning mb-2 small">
                ${generateStars(book.rating)}
            </div>
            <div class="mt-auto">
                <span class="badge ${getGenreBadgeClass(book.genre)}">${book.genre}</span>
                <span class="badge bg-secondary ms-1">${book.rating}★</span>
            </div>
        </div>
    `;
    
    // Add click event to view details
    card.addEventListener('click', function() {
        showBookDetails(book);
    });
    
    // Add hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    col.appendChild(card);
    return col;
}

// 5. DocumentFragment for batch adding
function addBooksToGrid(books, clearExisting = false) {
    if (clearExisting) {
        booksGrid.innerHTML = '';
    }
    
    const fragment = document.createDocumentFragment();
    
    books.forEach(book => {
        const bookCard = createBookCard(book);
        fragment.appendChild(bookCard);
    });
    
    booksGrid.appendChild(fragment);
    updateResultsCount();
}

// 6. Create trending book item using createElement
function createTrendingBook(book) {
    const trendingItem = document.createElement('div');
    trendingItem.className = 'col-12 mb-3';
    
    trendingItem.innerHTML = `
        <div class="card-glass p-3">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${book.image}" 
                         class="img-fluid rounded-3" alt="${book.title}" 
                         style="height: 100px; width: 70px; object-fit: cover;">
                </div>
                <div class="col-md-7">
                    <h5 class="mb-1">${book.title}</h5>
                    <p class="text-muted small mb-2">${book.author}</p>
                    <p class="small mb-0">${book.description}</p>
                </div>
                <div class="col-md-3 text-md-end">
                    <div class="text-warning mb-2">
                        ${generateStars(book.rating)}
                    </div>
                    <button class="btn btn-sm btn-gradient add-to-tbr" data-book-id="${book.id}">
                        <i class="bi bi-plus me-1"></i>Add to TBR
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listener to the button
    const addButton = trendingItem.querySelector('.add-to-tbr');
    addButton.addEventListener('click', function(e) {
        e.stopPropagation();
        addBookToTbr(book);
    });
    
    return trendingItem;
}

// 7. Carousel item template using cloneNode
function createCarouselItem(book, isActive = false) {
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="carousel-item ${isActive ? 'active' : ''}">
            <div class="d-flex justify-content-start">
                <img src="${book.image}" 
                     class="d-block" alt="${book.title}" 
                     style="height: 300px; width: 200px; object-fit: cover;">
            </div>
            <div class="carousel-caption bg-dark bg-opacity-75 p-3" 
                 style="text-align: left; right: auto; left: 220px; bottom: 20px; width: auto;">
                <h5>${book.title}</h5>
                <p>${book.author} • ${book.genre} • ${book.rating}★</p>
                <button class="btn btn-sm btn-primary view-details-btn" data-book-id="${book.id}">
                    View Details
                </button>
            </div>
        </div>
    `;
    
    return template.content.cloneNode(true);
}

// 8. Event listeners
// Search functionality with event-based validation
discoverSearch.addEventListener('input', function() {
    const searchTerm = this.value.trim();
    const feedback = document.getElementById('searchFeedback');
    
    // Event-based validation
    if (searchTerm.length > 0 && searchTerm.length < 2) {
        feedback.textContent = "Search term must be at least 2 characters";
        feedback.className = "form-text text-danger";
        this.classList.add('is-invalid');
    } else if (searchTerm.length > 100) {
        feedback.textContent = "Search term must be less than 100 characters";
        feedback.className = "form-text text-danger";
        this.classList.add('is-invalid');
    } else {
        feedback.textContent = "";
        feedback.className = "form-text text-muted";
        this.classList.remove('is-invalid');
        
        // Auto-search after delay
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (searchTerm.length >= 2) {
                performSearch();
            }
        }, 500);
    }
});

searchDiscoverBtn.addEventListener('click', performSearch);

// Sort functionality
sortDiscover.addEventListener('change', function() {
    filterAndSortBooks();
});

// Rating filter stars
const stars = ratingFilter.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', function() {
        const rating = parseInt(this.getAttribute('data-rating'));
        setRatingFilter(rating);
    });
});

// Year input validation with event-based validation
yearFrom.addEventListener('input', function() {
    validateYearRange(this, yearTo);
    filterAndSortBooks();
});

yearTo.addEventListener('input', function() {
    validateYearRange(yearFrom, this);
    filterAndSortBooks();
});

// Genre filter
genreFilter.addEventListener('change', filterAndSortBooks);

// Quick genre filters
quickFilters.forEach(filter => {
    filter.addEventListener('click', function() {
        // Update active state
        quickFilters.forEach(f => f.classList.remove('active'));
        this.classList.add('active');
        
        // Update dropdown
        const genre = this.getAttribute('data-genre');
        genreFilter.value = genre;
        filterAndSortBooks();
    });
});

// Genre dropdown items
const genreDropdownItems = genreDropdown.querySelectorAll('.dropdown-item');
genreDropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active state
        genreDropdownItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Update filter
        const genre = this.getAttribute('data-genre');
        genreFilter.value = genre;
        
        // Update quick filters
        quickFilters.forEach(f => {
            if (f.getAttribute('data-genre') === genre) {
                f.classList.add('active');
            } else {
                f.classList.remove('active');
            }
        });
        
        filterAndSortBooks();
    });
});

// Load more books
loadMoreBtn.addEventListener('click', loadMoreBooks);

// Toggle advanced filters
toggleFiltersBtn.addEventListener('click', function() {
    advancedFilters.classList.toggle('d-none');
    const icon = this.querySelector('i');
    if (advancedFilters.classList.contains('d-none')) {
        icon.className = 'bi bi-funnel';
        this.innerHTML = '<i class="bi bi-funnel"></i> Show Filters';
    } else {
        icon.className = 'bi bi-funnel-fill';
        this.innerHTML = '<i class="bi bi-funnel-fill"></i> Hide Filters';
    }
});

// Reset all filters
resetFiltersBtn.addEventListener('click', function() {
    discoverSearch.value = '';
    genreFilter.value = '';
    setRatingFilter(0);
    yearFrom.value = '';
    yearTo.value = '';
    sortDiscover.value = 'relevance';
    
    // Reset quick filters
    quickFilters.forEach(f => {
        if (f.getAttribute('data-genre') === '') {
            f.classList.add('active');
        } else {
            f.classList.remove('active');
        }
    });
    
    // Reset dropdown
    genreDropdownItems.forEach(item => {
        if (item.getAttribute('data-genre') === '') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Clear validation
    discoverSearch.classList.remove('is-invalid');
    document.getElementById('searchFeedback').textContent = '';
    
    // Reload all books
    filterAndSortBooks();
});

// Recommendation form
recDescription.addEventListener('input', function() {
    const count = this.value.length;
    charCounter.textContent = `${count}/500 characters`;
    
    // Event-based validation
    if (count > 450) {
        charCounter.className = "form-text text-danger";
    } else if (count > 400) {
        charCounter.className = "form-text text-warning";
    } else {
        charCounter.className = "form-text text-muted";
    }
});

recommendationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // HTML attribute validation check
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }
    
    // Additional event-based validation
    const title = document.getElementById('recTitle').value.trim();
    const description = recDescription.value.trim();
    const email = document.getElementById('recEmail').value.trim();
    
    if (description.length < 10) {
        showFormMessage('Please provide more details about what you\'re looking for.', 'danger');
        recDescription.classList.add('is-invalid');
        return;
    }
    
    if (email && !validateEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'danger');
        document.getElementById('recEmail').classList.add('is-invalid');
        return;
    }
    
    // Simulate API call
    showFormMessage('Processing your recommendation request...', 'info');
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processing...';
    
    setTimeout(() => {
        // Create recommendation card
        const recommendation = {
            id: Date.now(),
            title,
            description,
            timestamp: new Date().toLocaleString(),
            status: 'pending'
        };
        
        // Save to localStorage (BOM)
        saveRecommendation(recommendation);
        
        // Show success message
        showFormMessage(`Thank you! We've received your request for "${title}". We'll notify you when we find matching books!`, 'success');
        
        // Reset form
        this.reset();
        this.classList.remove('was-validated');
        charCounter.textContent = '0/500 characters';
        charCounter.className = "form-text text-muted";
        
        // Re-enable button
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Load More Books';
        
        // Show notification
        showNotification('Recommendation request submitted successfully!', 'success');
    }, 1500);
});

// Add to TBR button in modal
addToTbrBtn.addEventListener('click', function() {
    const modal = bootstrap.Modal.getInstance(bookDetailsModal);
    const bookId = this.getAttribute('data-book-id');
    const book = findBookById(bookId);
    
    if (book) {
        addBookToTbr(book);
        modal.hide();
    }
});

// Logout button
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
        // BOM: Clear session data
        sessionStorage.removeItem('discoverFilters');
        
        // BOM: Redirect
        window.location.href = 'index.html';
    }
});

// 9. Helper functions
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="bi bi-star-fill"></i>';
        } else if (i === fullStars && hasHalf) {
            stars += '<i class="bi bi-star-half"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }
    return stars;
}

function getGenreBadgeClass(genre) {
    const classes = {
        'fantasy': 'bg-purple',
        'sci-fi': 'bg-info',
        'mystery': 'bg-dark',
        'horror': 'bg-danger',
        'romance': 'bg-pink',
        'non-fiction': 'bg-success'
    };
    return classes[genre] || 'bg-secondary';
}

function setRatingFilter(rating) {
    const stars = ratingFilter.querySelectorAll('.star');
    const ratingValueText = document.getElementById('ratingValueText');
    
    stars.forEach((star, index) => {
        const starRating = index + 1;
        if (starRating <= rating) {
            star.className = 'bi bi-star-fill star text-warning';
        } else {
            star.className = 'bi bi-star star';
        }
    });
    
    ratingValueText.textContent = rating === 0 ? 'Any rating' : `${rating}+ stars`;
    filterAndSortBooks();
}

function validateYearRange(fromInput, toInput) {
    const from = parseInt(fromInput.value);
    const to = parseInt(toInput.value);
    
    if (from && to && from > to) {
        toInput.classList.add('is-invalid');
        toInput.setCustomValidity('"To" year must be greater than or equal to "From" year');
    } else {
        toInput.classList.remove('is-invalid');
        toInput.setCustomValidity('');
    }
    
    if (from && (from < 1900 || from > 2024)) {
        fromInput.classList.add('is-invalid');
        fromInput.setCustomValidity('Year must be between 1900 and 2024');
    } else if (from) {
        fromInput.classList.remove('is-invalid');
        fromInput.setCustomValidity('');
    }
    
    if (to && (to < 1900 || to > 2024)) {
        toInput.classList.add('is-invalid');
        toInput.setCustomValidity('Year must be between 1900 and 2024');
    } else if (to) {
        toInput.classList.remove('is-invalid');
        toInput.setCustomValidity('');
    }
}

function performSearch() {
    filterAndSortBooks();
    showNotification('Search completed!', 'info');
}

function filterAndSortBooks() {
    const searchTerm = discoverSearch.value.trim().toLowerCase();
    const selectedGenre = genreFilter.value;
    const minRating = getCurrentRatingFilter();
    const minYear = yearFrom.value ? parseInt(yearFrom.value) : null;
    const maxYear = yearTo.value ? parseInt(yearTo.value) : null;
    const sortBy = sortDiscover.value;
    
    // Get all book cards
    const bookCards = booksGrid.querySelectorAll('.col-md-6');
    let visibleCount = 0;
    
    // Iterate over collection to filter
    bookCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const author = card.querySelector('.card-text').textContent.toLowerCase();
        const genre = card.getAttribute('data-genre');
        const rating = parseFloat(card.getAttribute('data-rating'));
        const year = parseInt(card.getAttribute('data-year'));
        
        let shouldShow = true;
        
        // Apply filters
        if (searchTerm && !title.includes(searchTerm) && !author.includes(searchTerm)) {
            shouldShow = false;
        }
        
        if (selectedGenre && genre !== selectedGenre) {
            shouldShow = false;
        }
        
        if (minRating > 0 && rating < minRating) {
            shouldShow = false;
        }
        
        if (minYear && year < minYear) {
            shouldShow = false;
        }
        
        if (maxYear && year > maxYear) {
            shouldShow = false;
        }
        
        // Show/hide card
        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
    });
    
    // Sort visible cards
    sortVisibleCards(sortBy);
    updateResultsCount(visibleCount);
}

function sortVisibleCards(sortBy) {
    const visibleCards = Array.from(booksGrid.querySelectorAll('.col-md-6'))
        .filter(card => card.style.display !== 'none');
    
    visibleCards.sort((a, b) => {
        switch(sortBy) {
            case 'rating-desc':
                return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
            case 'rating-asc':
                return parseFloat(a.getAttribute('data-rating')) - parseFloat(b.getAttribute('data-rating'));
            case 'title':
                return a.querySelector('.card-title').textContent.localeCompare(
                    b.querySelector('.card-title').textContent
                );
            case 'author':
                return a.querySelector('.card-text').textContent.localeCompare(
                    b.querySelector('.card-text').textContent
                );
            default:
                return 0;
        }
    });
    
    // Reorder in DOM
    visibleCards.forEach(card => {
        booksGrid.appendChild(card);
    });
}

function getCurrentRatingFilter() {
    const filledStars = ratingFilter.querySelectorAll('.bi-star-fill').length;
    return filledStars;
}

function updateResultsCount(count = null) {
    if (count === null) {
        const visibleCards = booksGrid.querySelectorAll('.col-md-6[style*="display: none"]');
        const totalCards = booksGrid.querySelectorAll('.col-md-6').length;
        count = totalCards - visibleCards.length;
    }
    
    resultsCount.textContent = count;
    
    // Update load more button state
    loadMoreBtn.disabled = count >= 100; // Limit to 100 books
    if (count >= 100) {
        loadMoreBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>All Books Loaded';
    } else {
        loadMoreBtn.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Load More Books';
    }
}

function loadMoreBooks() {
    // Simulate loading more books
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
    
    setTimeout(() => {
        const newBooks = generateMoreBooks(8); // Load 8 more books
        addBooksToGrid(newBooks, false);
        
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Load More Books';
        
        showNotification(`${newBooks.length} more books loaded!`, 'success');
    }, 1000);
}

function showBookDetails(book) {
    const modalContent = document.getElementById('bookDetailsContent');
    
    // Create book details using createElement
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'row';
    
    detailsDiv.innerHTML = `
        <div class="col-md-4">
            <img src="${book.image}" class="img-fluid rounded-3" alt="${book.title}">
        </div>
        <div class="col-md-8">
            <h4>${book.title}</h4>
            <h5 class="text-muted">${book.author}</h5>
            <div class="mb-3">
                <span class="badge ${getGenreBadgeClass(book.genre)} me-2">${book.genre}</span>
                <span class="badge bg-secondary">Published: ${book.year}</span>
            </div>
            <div class="text-warning mb-3">
                ${generateStars(book.rating)} <span class="text-light">(${book.rating}/5)</span>
            </div>
            <p>${book.description}</p>
            <div class="mt-4">
                <h6>Details:</h6>
                <ul class="list-unstyled">
                    <li><strong>Pages:</strong> ${book.pages}</li>
                    <li><strong>Publisher:</strong> ${book.publisher}</li>
                    <li><strong>ISBN:</strong> ${book.isbn}</li>
                </ul>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = '';
    modalContent.appendChild(detailsDiv);
    
    // Set book ID on add button
    addToTbrBtn.setAttribute('data-book-id', book.id);
    
    // Show modal
    const modal = new bootstrap.Modal(bookDetailsModal);
    modal.show();
}

function addBookToTbr(book) {
    // Get existing TBR from localStorage (BOM)
    let tbrList = JSON.parse(localStorage.getItem('tbrList') || '[]');
    
    // Check if already in TBR
    if (tbrList.some(item => item.id === book.id)) {
        showNotification('This book is already in your TBR list!', 'warning');
        return;
    }
    
    // Add to TBR
    tbrList.push({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        added: new Date().toISOString()
    });
    
    // Save to localStorage (BOM)
    localStorage.setItem('tbrList', JSON.stringify(tbrList));
    
    // Update button style
    const addButtons = document.querySelectorAll(`[data-book-id="${book.id}"]`);
    addButtons.forEach(btn => {
        btn.innerHTML = '<i class="bi bi-check me-1"></i>Added to TBR';
        btn.classList.remove('btn-gradient');
        btn.classList.add('btn-success');
        btn.disabled = true;
    });
    
    showNotification(`"${book.title}" added to your TBR list!`, 'success');
}

function findBookById(id) {
    // Search in sample books
    return sampleBooks.find(book => book.id === id) || moreBooks.find(book => book.id === id);
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function showFormMessage(message, type) {
    formMessage.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        top: 1rem;
        right: 1rem;
        z-index: 1050;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close btn-close-white float-end" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function saveRecommendation(recommendation) {
    // BOM: Save to localStorage
    let recommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    recommendations.push(recommendation);
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
}

function initializeDiscoverPage() {
    // Load initial books
    addBooksToGrid(sampleBooks, true);
    
    // Load trending books
    loadTrendingBooks();
    
    // Load carousel items
    loadCarouselItems();
    
    // Set initial rating filter
    setRatingFilter(0);
    
    // Hide advanced filters initially
    advancedFilters.classList.add('d-none');
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .col-md-6 {
            animation: fadeIn 0.5s ease-out;
        }
        
        .bg-pink {
            background-color: #e83e8c !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Discover page initialized successfully!');
}

function loadTrendingBooks() {
    const trendingFragment = document.createDocumentFragment();
    
    trendingBooksData.forEach((book, index) => {
        const trendingItem = createTrendingBook(book);
        
        // Add delay animation
        trendingItem.style.animationDelay = `${index * 0.1}s`;
        trendingItem.style.animation = 'fadeIn 0.5s ease-out forwards';
        trendingItem.style.opacity = '0';
        
        trendingFragment.appendChild(trendingItem);
    });
    
    trendingBooks.innerHTML = '';
    trendingBooks.appendChild(trendingFragment);
}

function loadCarouselItems() {
    discoverCarousel.innerHTML = '';
    const carouselFragment = document.createDocumentFragment();
    
    carouselBooks.forEach((book, index) => {
        const carouselItem = createCarouselItem(book, index === 0);
        
        // Add event listener to view details button
        const viewDetailsBtn = carouselItem.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showBookDetails(book);
        });
        
        carouselFragment.appendChild(carouselItem);
    });
    
    discoverCarousel.appendChild(carouselFragment);
}

// Sample data
const sampleBooks = [
    {
        id: 1,
        title: "The Will Of The Many",
        author: "James Islington",
        genre: "fantasy",
        rating: 4.3,
        year: 2023,
        pages: 640,
        publisher: "Orbit",
        isbn: "978-0316434812",
        description: "A thrilling fantasy epic about power, sacrifice, and the will to survive in a world of ancient magic.",
        image: "https://m.media-amazon.com/images/I/71p5luifDjL._SL1500_.jpg"
    },
    {
        id: 2,
        title: "Shadow of the Gods",
        author: "John Gwynne",
        genre: "fantasy",
        rating: 4.4,
        year: 2021,
        pages: 528,
        publisher: "Orbit",
        isbn: "978-0316539913",
        description: "A Norse-inspired epic fantasy of vengeance, redemption, and battle.",
        image: "https://m.media-amazon.com/images/I/815EJibD9DL._SY466_.jpg"
    },
    {
        id: 3,
        title: "Mistborn: The Final Empire",
        author: "Brandon Sanderson",
        genre: "fantasy",
        rating: 4.5,
        year: 2006,
        pages: 541,
        publisher: "Tor Books",
        isbn: "978-0765311788",
        description: "A young street urchin discovers she has magical powers and joins a crew of thieves to overthrow an immortal emperor.",
        image: "https://m.media-amazon.com/images/I/91U6rc7u0yL._SL1500_.jpg"
    },
    {
        id: 4,
        title: "Dungeon Crawler Carl",
        author: "Matt Dinniman",
        genre: "sci-fi",
        rating: 4.7,
        year: 2020,
        pages: 412,
        publisher: "Mountaindale Press",
        isbn: "978-1735341100",
        description: "A LitRPG adventure where a man and his cat must survive a deadly dungeon game show.",
        image: "https://m.media-amazon.com/images/I/71agPjqADHL._SL1500_.jpg"
    },
    {
        id: 5,
        title: "The Poppy War",
        author: "R. F. Kuang",
        genre: "fantasy",
        rating: 4.2,
        year: 2018,
        pages: 544,
        publisher: "Harper Voyager",
        isbn: "978-0062662569",
        description: "A historical fantasy that follows a war orphan's journey through military academy and into a brutal war.",
        image: "https://m.media-amazon.com/images/I/41bnANqltqL._SY445_SX342_QL70_FMwebp_.jpg"
    },
    {
        id: 6,
        title: "Gideon The Ninth",
        author: "Tamsyn Muir",
        genre: "sci-fi",
        rating: 4.2,
        year: 2019,
        pages: 448,
        publisher: "Tor.com",
        isbn: "978-1250313195",
        description: "Lesbian necromancers explore a haunted gothic palace in space.",
        image: "https://m.media-amazon.com/images/I/71GHKo78YBL._SL1500_.jpg"
    },
    {
        id: 7,
        title: "Project Hail Mary",
        author: "Andy Weir",
        genre: "sci-fi",
        rating: 4.6,
        year: 2021,
        pages: 476,
        publisher: "Ballantine Books",
        isbn: "978-0593135204",
        description: "A lone astronaut must save humanity in this high-stakes sci-fi thriller.",
        image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg"
    },
    {
        id: 8,
        title: "The Priory of the Orange Tree",
        author: "Samantha Shannon",
        genre: "fantasy",
        rating: 4.3,
        year: 2019,
        pages: 848,
        publisher: "Bloomsbury Publishing",
        isbn: "978-1635570298",
        description: "A feminist high fantasy epic about a queendom threatened by a dragon-riding foe.",
        image: "https://m.media-amazon.com/images/I/91NXdVnMoGL._SL1500_.jpg"
    }
];

const trendingBooksData = [
    {
        id: 7,
        title: "Project Hail Mary",
        author: "Andy Weir",
        rating: 4.6,
        description: "A lone astronaut must save humanity in this high-stakes sci-fi thriller.",
        image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg"
    },
    {
        id: 9,
        title: "The Night Circus",
        author: "Erin Morgenstern",
        rating: 4.3,
        description: "A magical competition between two young illusionists in a mysterious circus.",
        image: "https://m.media-amazon.com/images/I/91tLpZ+7R7L._SL1500_.jpg"
    },
    {
        id: 10,
        title: "Mexican Gothic",
        author: "Silvia Moreno-Garcia",
        rating: 4.0,
        description: "A socialite investigates her cousin's mysterious illness at a remote mansion.",
        image: "https://m.media-amazon.com/images/I/81R6p9SyKgL._SL1500_.jpg"
    }
];

const carouselBooks = [
    sampleBooks[4], // The Poppy War
    sampleBooks[5], // Gideon The Ninth
    sampleBooks[7]  // The Priory of the Orange Tree
];

function generateMoreBooks(count) {
    const genres = ['fantasy', 'sci-fi', 'mystery', 'horror', 'romance', 'non-fiction'];
    const newBooks = [];
    
    for (let i = 0; i < count; i++) {
        const genre = genres[Math.floor(Math.random() * genres.length)];
        const bookId = sampleBooks.length + i + 1;
        
        newBooks.push({
            id: bookId,
            title: `Book Title ${bookId}`,
            author: `Author ${String.fromCharCode(65 + (i % 26))}. Writer`,
            genre: genre,
            rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
            year: 2000 + Math.floor(Math.random() * 24),
            pages: 300 + Math.floor(Math.random() * 500),
            publisher: "Sample Publisher",
            isbn: `978-${Math.floor(Math.random() * 1000000000)}`,
            description: `This is a sample description for book ${bookId}. It's a ${genre} book that explores interesting themes.`,
            image: `https://picsum.photos/seed/book${bookId}/200/300`
        });
    }
    
    return newBooks;
}

const moreBooks = generateMoreBooks(20);

console.log('Discover page loaded successfully!');