// DOM Manipulation and Event Handling for Book Goblin - My Books Page

// 1. Cache elements using different selectors
const booksGrid = document.getElementById('booksGrid'); // getElementById
const readingTable = document.querySelector('#readingTable tbody'); // querySelector
const bookCards = document.querySelectorAll('.card-glass'); // querySelectorAll
const bookSearch = document.getElementById('bookSearch');
const searchBtn = document.getElementById('searchBtn');
const sortBooks = document.getElementById('sortBooks');
const filterRadios = document.querySelectorAll('input[name="filter"]');
const goalRange = document.getElementById('goalRange');
const goalValue = document.getElementById('goalValue');
const goalRing = document.getElementById('goalRing');
const addBookFab = document.getElementById('addBookFab');
const saveBookBtn = document.getElementById('saveBookBtn');
const bookCount = document.getElementById('bookCount');
const pageStats = document.getElementById('pageStats');

// 2. Use parent-child-sibling relationships
const tableBody = document.getElementById('tableBody');
const firstTableRow = tableBody.firstElementChild; // First child
const lastTableRow = tableBody.lastElementChild; // Last child
const headerRow = readingTable.parentElement.previousElementSibling; // Navigate up and then to sibling

// 3. Browser Object Model properties/methods
window.addEventListener('load', function() {
    // BOM: Display page info
    const loadTime = performance.now().toFixed(2);
    pageStats.textContent = `Page loaded in ${loadTime}ms | ${navigator.userAgent.substring(0, 50)}...`;
    
    // BOM: Check screen size
    if (screen.width < 768) {
        console.log('Mobile device detected');
    }
    
    // Initialize with sample data
    initializeBooks();
    updateProgressRing();
});

// 4. Create element using createElement
function createBookCard(book) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3';
    col.setAttribute('data-status', book.status);
    col.setAttribute('data-title', book.title.toLowerCase());
    col.setAttribute('data-author', book.author.toLowerCase());
    
    const card = document.createElement('div');
    card.className = 'card card-glass h-100 border-0';
    
    // Card content using template
    card.innerHTML = `
        <div class="card-body d-flex flex-column p-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">${book.title}</h5>
                <div class="book-actions">
                    <button class="btn btn-sm btn-outline-warning edit-btn" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn ms-1" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <p class="card-text text-muted small mb-2">${book.author}</p>
            <p class="card-text small mb-3">${book.genre || 'Not specified'}</p>
            
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="text-warning">
                    ${generateStars(book.rating)}
                </div>
                <span class="badge ${getStatusClass(book.status)}">${book.status}</span>
            </div>
            
            <div class="mt-auto">
                <div class="progress" style="height: 5px;">
                    <div class="progress-bar ${getProgressColor(book.progress)}" 
                         role="progressbar" 
                         style="width: ${book.progress}%"
                         aria-valuenow="${book.progress}" 
                         aria-valuemin="0" 
                         aria-valuemax="100"></div>
                </div>
                <small class="text-muted">${book.progress}% complete</small>
            </div>
            
            ${book.notes ? `<p class="card-text small mt-2 text-truncate">${book.notes}</p>` : ''}
        </div>
    `;
    
    // Add event listeners to action buttons
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        editBook(book, col);
    });
    
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteBook(col);
    });
    
    // Click to view details
    card.addEventListener('click', function() {
        viewBookDetails(book);
    });
    
    col.appendChild(card);
    return col;
}

// 5. DocumentFragment for batch adding
function addBooksToGrid(books) {
    const fragment = document.createDocumentFragment();
    
    books.forEach(book => {
        const bookCard = createBookCard(book);
        fragment.appendChild(bookCard);
    });
    
    booksGrid.appendChild(fragment);
    updateBookCount();
}

// 6. Iterate over collections
function updateBookCount() {
    const visibleBooks = Array.from(booksGrid.children).filter(col => 
        col.style.display !== 'none'
    ).length;
    
    bookCount.textContent = visibleBooks;
    
    // Update progress text based on count
    const progressText = document.getElementById('progressText');
    if (visibleBooks > 20) {
        progressText.textContent = "Excellent progress! Keep reading!";
        progressText.className = "text-center text-success small";
    } else if (visibleBooks > 10) {
        progressText.textContent = "Good progress!";
        progressText.className = "text-center text-info small";
    } else {
        progressText.textContent = "Keep adding books to your collection!";
        progressText.className = "text-center text-warning small";
    }
}

// 7. Event listeners
// Search functionality
searchBtn.addEventListener('click', performSearch);
bookSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Input validation with event-based validation
bookSearch.addEventListener('input', function() {
    const searchTerm = this.value.trim();
    const feedback = document.getElementById('searchFeedback');
    
    if (searchTerm.length > 0 && searchTerm.length < 2) {
        feedback.textContent = "Search term must be at least 2 characters";
        feedback.className = "form-text text-danger";
        this.classList.add('is-invalid');
    } else if (searchTerm.length > 50) {
        feedback.textContent = "Search term must be less than 50 characters";
        feedback.className = "form-text text-danger";
        this.classList.add('is-invalid');
    } else {
        feedback.textContent = "";
        feedback.className = "form-text text-muted";
        this.classList.remove('is-invalid');
        if (searchTerm.length >= 2) {
            performSearch();
        }
    }
});

// Sort functionality
sortBooks.addEventListener('change', function() {
    const sortValue = this.value;
    sortBooksGrid(sortValue);
});

// Filter functionality
filterRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.checked) {
            filterBooks(this.id);
        }
    });
});

// Goal range slider
goalRange.addEventListener('input', function() {
    goalValue.textContent = this.value;
    updateProgressRing();
    
    // Update goal text
    const goalText = document.getElementById('goalText');
    const currentBooks = parseInt(document.getElementById('totalBooks').textContent);
    goalText.textContent = `${currentBooks} of ${this.value} books read`;
});

// Set goal button
document.getElementById('setGoalBtn').addEventListener('click', function() {
    const newGoal = prompt("Set your yearly reading goal (number of books):", goalRange.value);
    if (newGoal && !isNaN(newGoal) && newGoal >= 10 && newGoal <= 100) {
        goalRange.value = newGoal;
        goalValue.textContent = newGoal;
        updateProgressRing();
        
        // Save to localStorage
        localStorage.setItem('readingGoal', newGoal);
        showNotification(`Reading goal set to ${newGoal} books!`, 'success');
    }
});

// Add book FAB
addBookFab.addEventListener('click', function() {
    // Animate the FAB
    this.style.transform = 'rotate(45deg)';
    setTimeout(() => {
        this.style.transform = 'rotate(0deg)';
    }, 300);
});

// Modal rating display
document.getElementById('modalBookRating').addEventListener('input', function() {
    document.getElementById('modalRatingValue').textContent = this.value;
});

// Modal character count
document.getElementById('modalBookNotes').addEventListener('input', function() {
    const count = this.value.length;
    document.getElementById('modalCharCount').textContent = count;
    
    if (count > 180) {
        document.getElementById('modalCharCount').className = "text-danger";
    } else if (count > 150) {
        document.getElementById('modalCharCount').className = "text-warning";
    } else {
        document.getElementById('modalCharCount').className = "text-muted";
    }
});

// Save book button in modal
saveBookBtn.addEventListener('click', function() {
    const form = document.getElementById('newBookForm');
    
    // DOM-based validation
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    const title = document.getElementById('modalBookTitle').value.trim();
    const author = document.getElementById('modalBookAuthor').value.trim();
    const genre = document.getElementById('modalBookGenre').value;
    const status = document.getElementById('modalBookStatus').value;
    const rating = parseFloat(document.getElementById('modalBookRating').value);
    const notes = document.getElementById('modalBookNotes').value.trim();
    
    const newBook = {
        id: Date.now(),
        title,
        author,
        genre,
        status,
        rating,
        notes,
        progress: status === 'Completed' ? 100 : (status === 'Reading' ? 50 : 0),
        dateAdded: new Date().toISOString()
    };
    
    // Add to grid using prepend (adds to beginning)
    const newCard = createBookCard(newBook);
    booksGrid.prepend(newCard);
    
    // Update counts
    updateTableStats(newBook);
    updateBookCount();
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
    modal.hide();
    form.reset();
    form.classList.remove('was-validated');
    
    showNotification(`"${title}" added to your library!`, 'success');
});

// Sign out button
document.getElementById('signOutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
        // BOM: Redirect after sign out
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        showNotification('Signed out successfully!', 'info');
    }
});

// 8. Helper functions
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

function getStatusClass(status) {
    const classes = {
        'Reading': 'bg-info',
        'TBR': 'bg-purple',
        'Completed': 'bg-success'
    };
    return classes[status] || 'bg-secondary';
}

function getProgressColor(progress) {
    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-primary';
    if (progress >= 50) return 'bg-info';
    if (progress >= 25) return 'bg-warning';
    return 'bg-danger';
}

function performSearch() {
    const searchTerm = bookSearch.value.trim().toLowerCase();
    
    Array.from(booksGrid.children).forEach(col => {
        const title = col.getAttribute('data-title');
        const author = col.getAttribute('data-author');
        
        if (searchTerm === '' || title.includes(searchTerm) || author.includes(searchTerm)) {
            col.style.display = '';
        } else {
            col.style.display = 'none';
        }
    });
    
    updateBookCount();
}

function filterBooks(filter) {
    Array.from(booksGrid.children).forEach(col => {
        const status = col.getAttribute('data-status');
        
        if (filter === 'all' || status === filter.toUpperCase()) {
            col.style.display = '';
        } else {
            col.style.display = 'none';
        }
    });
    
    updateBookCount();
}

function sortBooksGrid(sortBy) {
    const cols = Array.from(booksGrid.children);
    
    cols.sort((a, b) => {
        const cardA = a.querySelector('.card-body');
        const cardB = b.querySelector('.card-body');
        
        switch(sortBy) {
            case 'title':
                return cardA.querySelector('.card-title').textContent.localeCompare(
                    cardB.querySelector('.card-title').textContent
                );
            case 'title-desc':
                return cardB.querySelector('.card-title').textContent.localeCompare(
                    cardA.querySelector('.card-title').textContent
                );
            case 'author':
                return cardA.querySelector('.card-text').textContent.localeCompare(
                    cardB.querySelector('.card-text').textContent
                );
            case 'rating':
                const ratingA = countStars(cardA.querySelector('.text-warning').innerHTML);
                const ratingB = countStars(cardB.querySelector('.text-warning').innerHTML);
                return ratingB - ratingA;
            default:
                return 0;
        }
    });
    
    // Clear and re-add sorted elements
    booksGrid.innerHTML = '';
    cols.forEach(col => booksGrid.appendChild(col));
}

function countStars(html) {
    return (html.match(/bi-star-fill/g) || []).length;
}

function updateProgressRing() {
    const totalBooks = parseInt(document.getElementById('totalBooks').textContent);
    const goal = parseInt(goalRange.value);
    const percentage = Math.min((totalBooks / goal) * 100, 100);
    
    const circle = goalRing.querySelector('.progress-ring-circle');
    const circumference = 2 * Math.PI * 65;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDashoffset = offset;
    
    document.getElementById('goalPercentage').textContent = `${Math.round(percentage)}%`;
    document.getElementById('goalText').textContent = `${totalBooks} of ${goal} books read`;
}

function updateTableStats(newBook) {
    const totalBooksElem = document.getElementById('totalBooks');
    const totalPagesElem = document.getElementById('totalPages');
    
    // Update books count
    let totalBooks = parseInt(totalBooksElem.textContent);
    totalBooks++;
    totalBooksElem.textContent = totalBooks;
    
    // Update pages (estimate 300 pages per book)
    let totalPages = parseInt(totalPagesElem.textContent.replace(',', ''));
    totalPages += newBook.status === 'Completed' ? 300 : 150;
    totalPagesElem.textContent = totalPages.toLocaleString();
    
    // Add new row to table
    const newRow = document.createElement('tr');
    const currentDate = new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    newRow.innerHTML = `
        <td>${currentDate}</td>
        <td class="text-end">1</td>
        <td class="text-end">${newBook.status === 'Completed' ? '300' : '150'}</td>
    `;
    
    tableBody.insertBefore(newRow, tableBody.firstChild);
}

function editBook(book, element) {
    const newTitle = prompt("Edit book title:", book.title);
    if (newTitle && newTitle.trim() !== book.title) {
        const titleElement = element.querySelector('.card-title');
        titleElement.textContent = newTitle.trim();
        element.setAttribute('data-title', newTitle.trim().toLowerCase());
        
        // Modify style to indicate edit
        element.querySelector('.card').style.border = '2px solid #ffc107';
        setTimeout(() => {
            element.querySelector('.card').style.border = '';
        }, 1000);
        
        showNotification('Book updated successfully!', 'warning');
    }
}

function deleteBook(element) {
    if (confirm('Are you sure you want to remove this book from your collection?')) {
        // Animation before removal
        element.style.opacity = '0.5';
        element.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            element.remove();
            updateBookCount();
            showNotification('Book removed from your collection', 'danger');
        }, 300);
    }
}

function viewBookDetails(book) {
    // Create modal-like popup
    const detailsHTML = `
        <div class="card card-glass">
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
                <p><strong>Genre:</strong> ${book.genre || 'Not specified'}</p>
                <p><strong>Status:</strong> <span class="badge ${getStatusClass(book.status)}">${book.status}</span></p>
                <p><strong>Rating:</strong> ${generateStars(book.rating)} (${book.rating}/5)</p>
                <p><strong>Progress:</strong> ${book.progress}% complete</p>
                ${book.notes ? `<p><strong>Notes:</strong> ${book.notes}</p>` : ''}
                <p class="text-muted small"><strong>Added:</strong> ${new Date(book.dateAdded).toLocaleDateString()}</p>
            </div>
        </div>
    `;
    
    // Use alert for simplicity (in real app, use a modal)
    alert(`Book Details:\n\nTitle: ${book.title}\nAuthor: ${book.author}\nStatus: ${book.status}\nRating: ${book.rating}/5`);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        top: 1rem;
        right: 1rem;
        z-index: 9999;
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

// 9. Initialize with sample data
function initializeBooks() {
    const sampleBooks = [
        {
            id: 1,
            title: "Project Hail Mary",
            author: "Andy Weir",
            genre: "Science Fiction",
            status: "TBR",
            rating: 0,
            progress: 0,
            notes: "Excited to read this!",
            dateAdded: "2024-02-15"
        },
        {
            id: 2,
            title: "Dune",
            author: "Frank Herbert",
            genre: "Science Fiction",
            status: "Completed",
            rating: 5,
            progress: 100,
            notes: "Masterpiece!",
            dateAdded: "2024-01-20"
        },
        {
            id: 3,
            title: "The Will Of The Many",
            author: "James Islington",
            genre: "Fantasy",
            status: "Reading",
            rating: 4,
            progress: 65,
            notes: "Great world-building",
            dateAdded: "2024-03-01"
        },
        {
            id: 4,
            title: "Shadow of the Gods",
            author: "John Gwynne",
            genre: "Fantasy",
            status: "Completed",
            rating: 4.5,
            progress: 100,
            notes: "Epic Viking fantasy",
            dateAdded: "2024-02-28"
        },
        {
            id: 5,
            title: "The Name of the Wind",
            author: "Patrick Rothfuss",
            genre: "Fantasy",
            status: "Reading",
            rating: 4.5,
            progress: 80,
            notes: "Beautiful prose",
            dateAdded: "2024-03-10"
        },
        {
            id: 6,
            title: "Mistborn: The Final Empire",
            author: "Brandon Sanderson",
            genre: "Fantasy",
            status: "Completed",
            rating: 5,
            progress: 100,
            notes: "Amazing magic system",
            dateAdded: "2024-01-15"
        },
        {
            id: 7,
            title: "The Poppy War",
            author: "R.F. Kuang",
            genre: "Fantasy",
            status: "TBR",
            rating: 0,
            progress: 0,
            notes: "Highly recommended",
            dateAdded: "2024-03-05"
        },
        {
            id: 8,
            title: "Gideon the Ninth",
            author: "Tamsyn Muir",
            genre: "Science Fiction",
            status: "TBR",
            rating: 0,
            progress: 0,
            notes: "Lesbian necromancers in space!",
            dateAdded: "2024-02-20"
        }
    ];
    
    addBooksToGrid(sampleBooks);
    
    // Add CSS animation
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
    `;
    document.head.appendChild(style);
}

// 10. Load saved goal from localStorage
const savedGoal = localStorage.getItem('readingGoal');
if (savedGoal) {
    goalRange.value = savedGoal;
    goalValue.textContent = savedGoal;
    updateProgressRing();
}

console.log('My Books page initialized successfully!');