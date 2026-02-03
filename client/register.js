// DOM Manipulation and Event Handling for Book Goblin Registration Page

// 1. Cache elements using different selectors
const registerForm = document.getElementById('registerForm'); // getElementById
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordStrength = document.getElementById('passwordStrength');
const passwordFeedback = document.getElementById('passwordFeedback');
const genreContainer = document.getElementById('genreContainer');
const selectedGenresCount = document.getElementById('selectedGenresCount');
const termsCheckbox = document.getElementById('termsCheckbox');
const registerBtn = document.getElementById('registerBtn');
const formMessage = document.getElementById('formMessage');
const goblinImage = document.getElementById('goblinImage');
const welcomeText = document.getElementById('welcomeText');
const welcomeSubtext = document.getElementById('welcomeSubtext');
const successModal = document.getElementById('successModal');
const profileSetupModal = document.getElementById('profileSetupModal');
const termsModal = document.getElementById('termsModal');
const termsContent = document.getElementById('termsContent');
const footerText = document.getElementById('footerText');
const pageStats = document.getElementById('pageStats');
const mainHeader = document.getElementById('mainHeader');

// 2. Cache multiple elements using querySelectorAll
const formInputs = document.querySelectorAll('#registerForm .form-control'); // querySelectorAll
const allModals = document.querySelectorAll('.modal'); // querySelectorAll
const socialButtons = document.querySelectorAll('#socialRegister .btn'); // querySelectorAll

// 3. Browser Object Model properties/methods
window.addEventListener('load', function() {
    // BOM: Display page info
    pageStats.textContent = `Registration Page | ${window.location.href} | Loaded at: ${new Date().toLocaleTimeString()}`;
    
    // BOM: Check if user is already logged in
    if (sessionStorage.getItem('userLoggedIn')) {
        window.location.href = 'dashboard.html';
    }
    
    // Initialize the page
    initializeRegistrationPage();
});

// 4. Use parent-child-sibling relationship to navigate elements
const registrationContainer = document.getElementById('registrationContainer');
const formParent = registerForm.parentElement; // Parent
const formFirstChild = registerForm.firstElementChild; // First child
const socialRegister = document.getElementById('socialRegister');
const socialRegisterSibling = socialRegister.nextElementSibling; // Next sibling
const genreContainerParent = genreContainer.parentElement; // Parent of genre container

// 5. Create element using createElement
function createGenreTag(genre, isSelected = false) {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4';
    
    const genreTag = document.createElement('div');
    genreTag.className = `genre-tag border border-secondary text-center ${isSelected ? 'selected' : ''}`;
    genreTag.textContent = genre;
    genreTag.dataset.genre = genre.toLowerCase();
    
    // Add click event
    genreTag.addEventListener('click', function() {
        toggleGenreSelection(this);
    });
    
    col.appendChild(genreTag);
    return col;
}

// 6. DocumentFragment interface for batch adding
function initializeGenreSelection() {
    const genres = [
        'Fantasy', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Horror',
        'Historical Fiction', 'Biography', 'Self-Help', 'Science', 'Poetry', 'Classics'
    ];
    
    const fragment = document.createDocumentFragment();
    
    genres.forEach(genre => {
        const genreTag = createGenreTag(genre);
        fragment.appendChild(genreTag);
    });
    
    genreContainer.appendChild(fragment);
    updateSelectedGenresCount();
}

// 7. HTML templating with cloneNode method
function createTermsContent() {
    const termsTemplate = document.createElement('template');
    termsTemplate.innerHTML = `
        <div class="terms-section mb-4">
            <h6 class="text-purple mb-2">1. Account Registration</h6>
            <p class="small text-light">By creating an account, you agree to provide accurate information and maintain the security of your account credentials.</p>
        </div>
        <div class="terms-section mb-4">
            <h6 class="text-purple mb-2">2. Content Usage</h6>
            <p class="small text-light">Book Goblin provides book recommendations and tracking features. We respect copyright and expect users to do the same.</p>
        </div>
        <div class="terms-section mb-4">
            <h6 class="text-purple mb-2">3. Privacy Policy</h6>
            <p class="small text-light">We collect minimal data to personalize your experience. Your reading preferences and book lists are private by default.</p>
        </div>
        <div class="terms-section">
            <h6 class="text-purple mb-2">4. User Responsibilities</h6>
            <p class="small text-light">Users are responsible for maintaining appropriate content and respecting community guidelines.</p>
        </div>
    `;
    
    return termsTemplate.content.cloneNode(true);
}

// 8. Iterate over a collection of elements
function validateAllInputs() {
    let isValid = true;
    
    // Iterate over form inputs collection
    formInputs.forEach(input => {
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });
    
    return isValid;
}

// 9. AppendChild and prepend methods
function setupSuccessMessage(username) {
    const successMessage = successModal.querySelector('#successMessage');
    
    // Create personalized message element
    const personalizedMessage = document.createElement('p');
    personalizedMessage.className = 'text-light mb-2';
    personalizedMessage.textContent = `Welcome, ${username}!`;
    
    // Append to existing message
    const existingMessage = successMessage.firstChild;
    successMessage.prepend(personalizedMessage);
    
    // Create additional info element
    const additionalInfo = document.createElement('p');
    additionalInfo.className = 'small text-muted mt-3';
    additionalInfo.textContent = 'You can always update your preferences in settings.';
    
    // Append to success message container
    successMessage.appendChild(additionalInfo);
}

// 10. Event listeners and handlers
// Password strength checker with event-based validation
passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strength = calculatePasswordStrength(password);
    updatePasswordStrengthDisplay(strength);
    
    // Event-based validation for password match
    if (confirmPasswordInput.value && password !== confirmPasswordInput.value) {
        confirmPasswordInput.classList.add('is-invalid');
        confirmPasswordInput.classList.remove('is-valid');
    } else if (confirmPasswordInput.value) {
        confirmPasswordInput.classList.remove('is-invalid');
        confirmPasswordInput.classList.add('is-valid');
    }
});

// Confirm password validation
confirmPasswordInput.addEventListener('input', function() {
    if (this.value !== passwordInput.value) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    } else {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
    }
});

// Username real-time validation
usernameInput.addEventListener('input', function() {
    const username = this.value;
    
    // Event-based validation: Check for reserved usernames
    const reservedUsernames = ['admin', 'moderator', 'support', 'bookgoblin'];
    if (reservedUsernames.includes(username.toLowerCase())) {
        this.setCustomValidity('This username is reserved');
        this.classList.add('is-invalid');
    } else {
        this.setCustomValidity('');
        if (this.checkValidity()) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    }
});

// Email validation with custom pattern
emailInput.addEventListener('input', function() {
    const email = this.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Event-based validation
    if (!emailPattern.test(email)) {
        this.setCustomValidity('Please enter a valid email address');
        this.classList.add('is-invalid');
    } else {
        this.setCustomValidity('');
        if (this.checkValidity()) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    }
});

// Terms and Privacy links
document.getElementById('termsLink').addEventListener('click', function(e) {
    e.preventDefault();
    showTermsModal('terms');
});

document.getElementById('privacyLink').addEventListener('click', function(e) {
    e.preventDefault();
    showTermsModal('privacy');
});

// Form submission with both HTML and event-based validation
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous messages
    formMessage.classList.add('d-none');
    
    // HTML attribute validation
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        validateAllInputs();
        return;
    }
    
    // Additional event-based validation
    const selectedGenres = getSelectedGenres();
    if (selectedGenres.length === 0) {
        showFormMessage('Please select at least one genre for personalized recommendations.', 'warning');
        genreContainerParent.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    if (!termsCheckbox.checked) {
        showFormMessage('You must agree to the terms and conditions.', 'danger');
        termsCheckbox.focus();
        return;
    }
    
    // All validation passed - process registration
    processRegistration();
});

// Social sign-up buttons
socialButtons.forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.id === 'googleSignUp' ? 'Google' : 'GitHub';
        
        // Change button appearance
        this.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Connecting to ${provider}...`;
        this.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showFormMessage(`${provider} registration is not yet implemented. Please use email registration.`, 'info');
            this.innerHTML = this.id === 'googleSignUp' 
                ? '<i class="bi bi-google me-2"></i>Google' 
                : '<i class="bi bi-github me-2"></i>GitHub';
            this.disabled = false;
        }, 1500);
    });
});

// Profile setup button
document.getElementById('setupProfileBtn').addEventListener('click', function() {
    const modal = bootstrap.Modal.getInstance(successModal);
    modal.hide();
    
    setTimeout(() => {
        const profileModal = new bootstrap.Modal(profileSetupModal);
        profileModal.show();
    }, 300);
});

// Save profile button
document.getElementById('saveProfileBtn').addEventListener('click', function() {
    const displayName = document.getElementById('displayName').value;
    const readingGoal = document.getElementById('readingGoal').value;
    
    // Save profile data to localStorage (BOM)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.profile = {
        displayName: displayName || usernameInput.value,
        readingGoal: parseInt(readingGoal) || 52,
        formats: {
            physical: document.getElementById('formatPhysical').checked,
            ebook: document.getElementById('formatEbook').checked,
            audio: document.getElementById('formatAudio').checked
        },
        setupCompleted: true
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Close modal and redirect
    const modal = bootstrap.Modal.getInstance(profileSetupModal);
    modal.hide();
    
    showNotification('Profile setup complete!', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
});

// 11. Helper functions
function toggleGenreSelection(element) {
    element.classList.toggle('selected');
    updateSelectedGenresCount();
    
    // Update image based on selected genres
    updateWelcomeImage();
}

function getSelectedGenres() {
    const selectedTags = genreContainer.querySelectorAll('.genre-tag.selected');
    return Array.from(selectedTags).map(tag => tag.textContent);
}

function updateSelectedGenresCount() {
    const selectedCount = getSelectedGenres().length;
    selectedGenresCount.textContent = `${selectedCount} genre${selectedCount !== 1 ? 's' : ''} selected`;
    
    // Update style based on count
    if (selectedCount === 0) {
        selectedGenresCount.classList.add('text-danger');
        selectedGenresCount.classList.remove('text-success');
    } else {
        selectedGenresCount.classList.remove('text-danger');
        selectedGenresCount.classList.add('text-success');
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special characters
    
    return Math.min(strength, 5); // Cap at 5
}

function updatePasswordStrengthDisplay(strength) {
    const strengthColors = ['#dc3545', '#dc3545', '#ffc107', '#ffc107', '#28a745', '#28a745'];
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthTips = [
        'Add more characters',
        'Include uppercase letters',
        'Add numbers',
        'Add special characters',
        'Great password!',
        'Excellent password!'
    ];
    
    passwordStrength.style.width = `${(strength / 5) * 100}%`;
    passwordStrength.style.backgroundColor = strengthColors[strength];
    
    passwordFeedback.textContent = `${strengthText[strength]} - ${strengthTips[strength]}`;
    passwordFeedback.className = `password-feedback text-${strength >= 4 ? 'success' : strength >= 2 ? 'warning' : 'danger'}`;
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `alert alert-${type} alert-dismissible fade show`;
    formMessage.classList.remove('d-none');
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');
    formMessage.appendChild(closeButton);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (formMessage.parentElement) {
            formMessage.classList.add('d-none');
        }
    }, 5000);
}

function showTermsModal(type) {
    // Clear previous content
    termsContent.innerHTML = '';
    
    // Create new content based on type
    if (type === 'terms') {
        const terms = createTermsContent();
        termsContent.appendChild(terms);
        document.getElementById('termsModalLabel').textContent = 'Terms of Service';
    } else {
        const privacyContent = document.createElement('div');
        privacyContent.className = 'privacy-content';
        privacyContent.innerHTML = `
            <div class="privacy-section mb-4">
                <h6 class="text-purple mb-2">Data Collection</h6>
                <p class="small text-light">We collect only the information necessary to provide personalized book recommendations and track your reading progress.</p>
            </div>
            <div class="privacy-section mb-4">
                <h6 class="text-purple mb-2">Data Usage</h6>
                <p class="small text-light">Your data is used solely to improve your experience on Book Goblin. We never sell your personal information.</p>
            </div>
            <div class="privacy-section">
                <h6 class="text-purple mb-2">Your Rights</h6>
                <p class="small text-light">You can request to view, update, or delete your personal data at any time through your account settings.</p>
            </div>
        `;
        termsContent.appendChild(privacyContent);
        document.getElementById('termsModalLabel').textContent = 'Privacy Policy';
    }
    
    // Show modal
    const modal = new bootstrap.Modal(termsModal);
    modal.show();
}

function updateWelcomeImage() {
    const selectedGenres = getSelectedGenres();
    
    // Change image and text based on selected genres
    if (selectedGenres.length > 3) {
        welcomeText.textContent = 'Voracious Reader!';
        welcomeSubtext.textContent = 'With so many interests, you\'ll never run out of great books to read!';
    } else if (selectedGenres.length > 0) {
        welcomeText.textContent = 'Tailored Discoveries';
        welcomeSubtext.textContent = 'We\'ll find books that match your specific interests.';
    } else {
        welcomeText.textContent = 'Discover Your Next Favorite';
        welcomeSubtext.textContent = 'Tell us your reading preferences and we\'ll help you discover books tailored to your taste.';
    }
}

function processRegistration() {
    // Disable submit button
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';
    
    // Get form data
    const userData = {
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        genres: getSelectedGenres(),
        registeredAt: new Date().toISOString(),
        readingStats: {
            booksRead: 0,
            pagesRead: 0,
            currentStreak: 0
        }
    };
    
    // Simulate API call delay
    setTimeout(() => {
        // Save to localStorage (BOM)
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userLoggedIn', 'true');
        
        // Update session (BOM)
        sessionStorage.setItem('userSession', JSON.stringify({
            username: userData.username,
            email: userData.email,
            loggedInAt: new Date().toISOString()
        }));
        
        // Show success modal
        setupSuccessMessage(userData.username);
        const modal = new bootstrap.Modal(successModal);
        modal.show();
        
        // Reset button
        registerBtn.disabled = false;
        registerBtn.innerHTML = '<i class="bi bi-person-plus me-2"></i>Create Account';
        
        // Log registration to console (BOM)
        console.log('User registered:', {
            username: userData.username,
            email: userData.email,
            genres: userData.genres.length,
            timestamp: new Date().toLocaleString()
        });
        
        // Send analytics event (simulated)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', {
                method: 'email'
            });
        }
    }, 1500);
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

// 12. Initialize the page
function initializeRegistrationPage() {
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
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .genre-tag.selected {
            animation: pulse 0.3s ease;
        }
        
        .bg-pink {
            background-color: #e83e8c !important;
        }
        
        .bg-orange {
            background-color: #fd7e14 !important;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize genre selection
    initializeGenreSelection();
    
    // Load terms content template
    const termsTemplate = createTermsContent();
    
    // Add footer animation
    footerText.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    footerText.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Add header animation on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 50) {
            mainHeader.style.transform = 'translateY(-100%)';
            mainHeader.style.transition = 'transform 0.3s ease';
        } else {
            mainHeader.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    console.log('Registration page initialized successfully!');
}

// 13. Clean up on page unload
window.addEventListener('beforeunload', function() {
    // Clear any temporary data
    sessionStorage.removeItem('registrationInProgress');
});

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRegistrationPage);