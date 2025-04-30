// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Function to get product ID from URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Function to load all products
async function loadAllProducts() {
    try {
        // Load main products file
        const response = await fetch('products.json');
        const data = await response.json();
        
        // Combine all products into a single array
        return [
            ...data.furniture,
            ...data.electronics,
            ...data.networking
        ];
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Function to load product details
async function loadProductDetails() {
    const productId = getProductIdFromUrl();
    if (!productId) {
        showError('Product ID not found');
        return;
    }

    const products = await loadAllProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showError('Product not found');
        return;
    }

    // Update page title
    document.title = `${product.name} - Mahaveer Enterprises`;

    // Update product information
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-description').innerHTML = `
        <p class="text-gray-600 mb-4">${product.description}</p>
        <div class="mt-4">
            <h4 class="text-lg font-semibold mb-2">Product Details:</h4>
            <ul id="product-details" class="list-none space-y-2">
                ${product.details.map(detail => `
                    <li class="flex items-center text-gray-600">
                        <span class="text-green-500 mr-2">✓</span>
                        ${detail}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    document.getElementById('product-category').textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);

    // Update main image
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.image;
    mainImage.alt = product.name;

    // Update additional images
    const image1 = document.getElementById('product-image-1');
    const image2 = document.getElementById('product-image-2');
    const image3 = document.getElementById('product-image-3');
    
    // Set up click events for additional images
    if (product.additionalImages && product.additionalImages.length > 0) {
        // Set first additional image
        if (product.additionalImages[0]) {
            image1.src = product.additionalImages[0];
            image1.alt = `${product.name} - View 1`;
            image1.addEventListener('click', () => {
                mainImage.src = product.additionalImages[0];
                mainImage.alt = `${product.name} - View 1`;
                // Update active thumbnail
                [image1, image2, image3].forEach(img => {
                    img.classList.remove('border-2', 'border-blue-500');
                    img.classList.add('border', 'border-gray-200');
                });
                image1.classList.remove('border', 'border-gray-200');
                image1.classList.add('border-2', 'border-blue-500');
            });
        }
        
        // Set second additional image
        if (product.additionalImages[1]) {
            image2.src = product.additionalImages[1];
            image2.alt = `${product.name} - View 2`;
            image2.addEventListener('click', () => {
                mainImage.src = product.additionalImages[1];
                mainImage.alt = `${product.name} - View 2`;
                // Update active thumbnail
                [image1, image2, image3].forEach(img => {
                    img.classList.remove('border-2', 'border-blue-500');
                    img.classList.add('border', 'border-gray-200');
                });
                image2.classList.remove('border', 'border-gray-200');
                image2.classList.add('border-2', 'border-blue-500');
            });
        }
        
        // Set third additional image
        if (product.additionalImages[2]) {
            image3.src = product.additionalImages[2];
            image3.alt = `${product.name} - View 3`;
            image3.addEventListener('click', () => {
                mainImage.src = product.additionalImages[2];
                mainImage.alt = `${product.name} - View 3`;
                // Update active thumbnail
                [image1, image2, image3].forEach(img => {
                    img.classList.remove('border-2', 'border-blue-500');
                    img.classList.add('border', 'border-gray-200');
                });
                image3.classList.remove('border', 'border-gray-200');
                image3.classList.add('border-2', 'border-blue-500');
            });
        }
        
        // Set main image as active initially
        [image1, image2, image3].forEach(img => {
            img.classList.add('border', 'border-gray-200');
        });
        image1.classList.remove('border', 'border-gray-200');
        image1.classList.add('border-2', 'border-blue-500');
    }

    // Update product details
    const detailsContainer = document.getElementById('product-details');
    detailsContainer.innerHTML = '';
    
    if (product.details && product.details.length > 0) {
        product.details.forEach(detail => {
            const li = document.createElement('li');
            li.textContent = detail;
            li.classList.add('mb-2', 'flex', 'items-center');
            
            const checkIcon = document.createElement('span');
            checkIcon.innerHTML = '✓';
            checkIcon.classList.add('text-green-500', 'mr-2');
            
            li.prepend(checkIcon);
            detailsContainer.appendChild(li);
        });
    } else {
        detailsContainer.innerHTML = '<li class="text-gray-500">No additional details available</li>';
    }
}

// Function to show error message
function showError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="text-center py-8">
            <h2 class="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p class="text-gray-600">${message}</p>
            <a href="index.html" class="mt-4 inline-block text-blue-500 hover:text-blue-600">Return to Home</a>
        </div>
    `;
}

// Load product details when page loads
document.addEventListener('DOMContentLoaded', loadProductDetails); 