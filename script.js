// Slider functionality
let currentSlide = 0;
let slides;
let totalSlides;

function initializeSlider() {
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    // Show first slide
    if (slides.length > 0) {
        showSlide(0);
    }
    
    // Start auto-slide
    setInterval(nextSlide, 5000);
}

function showSlide(index) {
    if (!slides || slides.length === 0) return;
    
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Add active class to current slide
    slides[index].classList.add('active');
}

function nextSlide() {
    if (!slides || slides.length === 0) return;
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSlider();
});

// Add fade-in animation to elements when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all category cards
document.querySelectorAll('.category-card').forEach(card => {
    observer.observe(card);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Global products array
let products = [];
let searchQuery = '';

// Function to load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading products:', error);
        return null;
    }
}

// DOM Elements
const productsContainer = document.getElementById('products-container');
const noResults = document.getElementById('no-results');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const mobileSearchInput = document.getElementById('mobile-search-input');
const mobileSearchButton = document.getElementById('mobile-search-button');

// Current filter state
let currentCategory = 'all';

// Function to truncate text
function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Function to get category color class
function getCategoryColor(category) {
    switch(category) {
        case 'furniture':
            return 'bg-amber-100 text-amber-800';
        case 'electronics':
            return 'bg-blue-100 text-blue-800';
        case 'networking':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// Function to render products
function renderProducts(productsToShow) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';
        
        card.innerHTML = `
            <a href="product-detail.html?id=${product.id}" class="block">
                <div class="h-48 flex items-center justify-center bg-gray-100">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain">
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
                    <span class="inline-block px-2 py-1 text-sm rounded-full ${getCategoryColor(product.category)}">${product.category}</span>
                    <p class="mt-2 text-gray-600 text-sm">${truncateText(product.description)}</p>
                </div>
            </a>
        `;
        
        container.appendChild(card);
    });
}

// Function to filter products by category
function filterProductsByCategory(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    renderProducts(filteredProducts);
    
    // Show/hide no results message
    const noResults = document.getElementById('no-results');
    if (filteredProducts.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }
}

// Function to create search recommendations
function createSearchRecommendations(searchTerm, products) {
    const recommendations = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Show only top 5 recommendations

    const recommendationsContainer = document.getElementById('search-recommendations');
    recommendationsContainer.innerHTML = '';

    if (searchTerm.length > 0 && recommendations.length > 0) {
        recommendations.forEach(product => {
            const div = document.createElement('div');
            div.className = 'p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2';
            
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            img.className = 'w-10 h-10 object-cover rounded';
            
            const textDiv = document.createElement('div');
            textDiv.className = 'flex flex-col';
            
            const name = document.createElement('span');
            name.className = 'font-medium text-gray-800';
            name.textContent = product.name;
            
            const category = document.createElement('span');
            category.className = 'text-sm text-gray-500';
            category.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
            
            textDiv.appendChild(name);
            textDiv.appendChild(category);
            
            div.appendChild(img);
            div.appendChild(textDiv);
            
            div.addEventListener('click', () => {
                window.location.href = `product-detail.html?id=${product.id}`;
            });
            
            recommendationsContainer.appendChild(div);
        });
    } else {
        recommendationsContainer.innerHTML = '';
    }
}

// Function to handle search
function handleSearch(query) {
    searchQuery = query;
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filteredProducts);
    
    // Show/hide no results message
    const noResults = document.getElementById('no-results');
    if (filteredProducts.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }
    
    // Create search recommendations
    createSearchRecommendations(query, products);
}

// Search functionality
function handleSearch() {
    searchQuery = searchInput.value.trim();
    filterProducts();
}

if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
}

if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Mobile search functionality
function handleMobileSearch() {
    searchQuery = mobileSearchInput.value.trim();
    filterProducts();
}

if (mobileSearchButton) {
    mobileSearchButton.addEventListener('click', handleMobileSearch);
}

if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleMobileSearch();
        }
    });
}

// Function to handle category card clicks
function setupCategoryCardClicks() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.id; // The ID of the card is the category name
            filterProductsByCategory(category);
            
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.category === category) {
                    btn.classList.add('active');
                }
            });
            
            // Scroll to products section
            document.getElementById('all-products').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts().then(data => {
        if (data) {
            // Combine all products into a single array
            products = [];
            
            // Add furniture products if they exist
            if (Array.isArray(data.furniture)) {
                products = [...products, ...data.furniture];
            }
            
            // Add electronics products if they exist
            if (Array.isArray(data.electronics)) {
                products = [...products, ...data.electronics];
            }
            
            // Add networking products if they exist
            if (Array.isArray(data.networking)) {
                products = [...products, ...data.networking];
            }
            
            console.log(`Loaded ${products.length} products`);
            
            // Check for category parameter in URL
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            
            console.log('Category from URL:', category); // Debug log
            
            if (category) {
                console.log('Filtering by category:', category); // Debug log
                // Find the filter button for this category
                const filterButtons = document.querySelectorAll('.filter-btn');
                filterButtons.forEach(button => {
                    if (button.getAttribute('data-category') === category) {
                        console.log('Found matching button for category:', category); // Debug log
                        // Remove active class from all buttons
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        // Add active class to the matching button
                        button.classList.add('active');
                        // Filter products
                        filterProductsByCategory(category);
                    }
                });
            } else {
                // If no category specified, show all products
                renderProducts(products);
            }
            
            // Setup filter buttons
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const selectedCategory = button.getAttribute('data-category');
                    console.log('Filter button clicked:', selectedCategory); // Debug log
                    
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    button.classList.add('active');
                    // Filter products
                    filterProductsByCategory(selectedCategory);
                });
            });
            
            // Setup category card clicks
            setupCategoryCardClicks();
        }
    });
}); 