// DOM Manipulation and Event Handling for Book Goblin Dashboard

// 1. Cache elements using different selectors
const pageTransition = document.getElementById('pageTransition'); // getElementById
const activityContainer = document.querySelector('#activityContainer'); // querySelector
const statCards = document.querySelectorAll('.stat-card'); // querySelectorAll
const addBookForm = document.getElementById('addBookForm');
const bookRating = document.getElementById('bookRating');
const ratingValue = document.getElementById('ratingValue');
const bookNotes = document.getElementById('bookNotes');
const charCount = document.getElementById('charCount');
const refreshButton = document.getElementById('refreshActivity');
const pageInfo = document.getElementById('pageInfo');

// 2. Use parent-child-sibling relationships
const statsSection = document.getElementById('statsSection');
const statsHeader = statsSection.firstElementChild; // firstChild equivalent
const statsRow = statsHeader.nextElementSibling; // Using nextElementSibling

// 3. Browser Object Model properties/methods
window.addEventListener('load', function() {
    // BOM: Display page info
    pageInfo.textContent = `Page loaded at: ${new Date().toLocaleTimeString()} | URL: ${window.location.pathname}`;
    
    // BOM: Check if user has visited before
    if (!localStorage.getItem('firstVisit')) {
        localStorage.setItem('firstVisit', new Date().toISOString());
        console.log('First visit recorded:', localStorage.getItem('firstVisit'));
    }
    
    // Initialize rating display
    updateRatingDisplay();
});

// 4. Iterate over a collection of elements
function updateStatCards() {
    statCards.forEach((card, index) => {
        // Add animation class on hover
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
        
        // Add click effect
        card.addEventListener('click', () => {
            const currentCount = parseInt(card.querySelector('h2').textContent);
            card.querySelector('h2').textContent = currentCount + 1;
            card.classList.add('pulse-animation');
            
            setTimeout(() => {
                card.classList.remove('pulse-animation');
            }, 500);
        });
    });
}

// 5. Create element using createElement
function createBookCard(bookData) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3';
    
    const card = document.createElement('div');
    card.className = 'card card-glass h-100 border-0';
    card.setAttribute('data-book-id', Date.now()); // Unique ID
    
    // Card image
    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.src = bookData.image || 'https://m.media-amazon.com/images/I/41xaiGpGo5L._SY466_.jpg';
    img.alt = bookData.title;
    img.style.height = '250px';
    img.style.objectFit = 'cover';
    
    // Card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = bookData.title;
    
    const author = document.createElement('p');
    author.className = 'card-text text-muted small';
    author.textContent = bookData.author;
    
    const footer = document.createElement('div');
    footer.className = 'd-flex justify-content-between align-items-center mt-3';
    
    // Rating stars
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'text-warning';
    
    const fullStars = Math.floor(bookData.rating);
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        star.className = i < fullStars ? 'bi bi-star-fill' : 'bi bi-star';
        ratingDiv.appendChild(star);
    }
    
    // Status badge
    const badge = document.createElement('span');
    badge.className = `badge bg-${getStatusColor(bookData.status)}`;
    badge.textContent = bookData.status;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-danger';
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm(`Are you sure you want to remove "${bookData.title}"?`)) {
            col.remove();
            showMessage('Book removed successfully!', 'success');
        }
    });
    
    // Assemble card
    footer.appendChild(ratingDiv);
    footer.appendChild(badge);
    footer.appendChild(deleteBtn);
    
    cardBody.appendChild(title);
    cardBody.appendChild(author);
    cardBody.appendChild(footer);
    
    if (bookData.notes) {
        const notes = document.createElement('p');
        notes.className = 'card-text small mt-2';
        notes.textContent = bookData.notes.substring(0, 100) + '...';
        cardBody.appendChild(notes);
    }
    
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
    
    return col;
}

// 6. DocumentFragment for templated content
function createBookCardsFragment(booksArray) {
    const fragment = document.createDocumentFragment();
    
    booksArray.forEach(book => {
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="col-md-6 col-lg-3">
                <div class="card card-glass h-100 border-0">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}" style="height: 250px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text text-muted small">${book.author}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="text-warning">
                                ${generateStars(book.rating)}
                            </div>
                            <span class="badge bg-${getStatusColor(book.status)}">${book.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        fragment.appendChild(template.content.cloneNode(true));
    });
    
    return fragment;
}

// Helper functions
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
    }
    return stars;
}

function getStatusColor(status) {
    const colors = {
        'Reading': 'info',
        'TBR': 'purple',
        'Completed': 'success',
        'DNF': 'warning'
    };
    return colors[status] || 'secondary';
}

function updateRatingDisplay() {
    ratingValue.textContent = `Rating: ${bookRating.value} stars`;
    ratingValue.style.fontWeight = 'bold';
    ratingValue.style.color = bookRating.value >= 3 ? '#28a745' : '#dc3545';
}

function updateCharCount() {
    const currentLength = bookNotes.value.length;
    charCount.textContent = `${currentLength}/500 characters`;
    
    if (currentLength > 450) {
        charCount.style.color = '#dc3545';
        charCount.style.fontWeight = 'bold';
    } else if (currentLength > 400) {
        charCount.style.color = '#ffc107';
    } else {
        charCount.style.color = '#6c757d';
    }
}

function showMessage(message, type = 'info') {
    const formMessage = document.getElementById('formMessage');
    formMessage.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = formMessage.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// 7. Event listeners and handlers
// Rating slider event
bookRating.addEventListener('input', updateRatingDisplay);

// Notes character count event
bookNotes.addEventListener('input', updateCharCount);

// Refresh activity button event
refreshButton.addEventListener('click', function() {
    // Add loading animation
    this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Refreshing...';
    this.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Using cloneNode for templating
        const sampleBooks = [
            {
                title: "The Name of the Wind",
                author: "Patrick Rothfuss",
                image: "https://m.media-amazon.com/images/I/81d-7F+DVhL._SL1500_.jpg",
                rating: 5,
                status: "Reading"
            },
            {
                title: "Mistborn: The Final Empire",
                author: "Brandon Sanderson",
                image: "https://m.media-amazon.com/images/I/71xL5+QK5VL._SL1360_.jpg",
                rating: 4.5,
                status: "Completed"
            }
        ];
        
        // Clear and add new books using DocumentFragment
        activityContainer.innerHTML = '';
        const fragment = createBookCardsFragment(sampleBooks);
        activityContainer.appendChild(fragment);
        
        // Reset button
        this.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Refresh';
        this.disabled = false;
        
        showMessage('Activity refreshed successfully!', 'success');
    }, 1500);
});

// Form submission with validation
addBookForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // DOM-based validation
    const titleInput = document.getElementById('bookTitle');
    const authorInput = document.getElementById('bookAuthor');
    let isValid = true;
    
    // Custom validation for title
    if (titleInput.value.trim().length < 2) {
        titleInput.classList.add('is-invalid');
        isValid = false;
    } else {
        titleInput.classList.remove('is-invalid');
        titleInput.classList.add('is-valid');
    }
    
    // Custom validation for author
    if (authorInput.value.trim().length < 2) {
        authorInput.classList.add('is-invalid');
        isValid = false;
    } else {
        authorInput.classList.remove('is-invalid');
        authorInput.classList.add('is-valid');
    }
    
    if (!isValid) {
        showMessage('Please fix the errors in the form.', 'danger');
        return;
    }
    
    // Collect form data
    const formData = {
        title: titleInput.value.trim(),
        author: document.getElementById('bookAuthor').value.trim(),
        genre: document.getElementById('bookGenre').value,
        status: document.getElementById('bookStatus').value,
        rating: parseFloat(document.getElementById('bookRating').value),
        notes: document.getElementById('bookNotes').value.trim(),
        image: `https://m.media-amazon.com/images/I/71${Math.random().toString(36).substr(2, 10)}._SL1500_.jpg`
    };
    
    // Create and add new book card using createElement
    const newBookCard = createBookCard(formData);
    
    // Use prepend to add to beginning of activity container
    activityContainer.prepend(newBookCard);
    
    // Update stats
    const booksReadElement = statCards[0].querySelector('h2');
    const currentCount = parseInt(booksReadElement.textContent);
    booksReadElement.textContent = currentCount + 1;
    
    // Show success message
    showMessage(`"${formData.title}" added successfully to your library!`, 'success');
    
    // Reset form
    addBookForm.reset();
    updateRatingDisplay();
    updateCharCount();
    
    // Remove validation classes
    titleInput.classList.remove('is-valid');
    authorInput.classList.remove('is-valid');
});

// Form reset handler
addBookForm.addEventListener('reset', function() {
    // Clear validation classes
    const inputs = this.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
    
    // Reset displays
    updateRatingDisplay();
    updateCharCount();
    
    showMessage('Form has been reset.', 'info');
});

// 8. Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateStatCards();
    updateCharCount();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .pulse-animation {
            animation: pulse 0.5s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .card-glass {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .bg-purple {
            background-color: #6f42c1 !important;
        }
    `;
    document.head.appendChild(style);
    
    // Add click event to existing activity cards
    const existingCards = activityContainer.querySelectorAll('.card');
    existingCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.card-title').textContent;
            console.log(`Clicked on: ${title}`);
            
            // Modify style on click
            this.style.boxShadow = '0 0 20px rgba(0, 123, 255, 0.5)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 1000);
        });
    });
    
    console.log('Book Goblin Dashboard initialized successfully!');
});