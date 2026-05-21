const menuIcon = document.querySelector('.menu__icon');
const nav = document.querySelector('.main__navigation');
const closeButton = document.querySelector('.close__button');
const overlay = document.querySelector('.overlay');

function openNav() {
    nav.classList.add('open');
    overlay.classList.add('active');
    menuIcon.setAttribute('aria-expanded', 'true');
    closeButton.focus();
}

function closeNav() {
    nav.classList.remove('open');
    overlay.classList.remove('active');
    menuIcon.setAttribute('aria-expanded', 'false');
    menuIcon.focus();
}

menuIcon.addEventListener('click', openNav);
closeButton.addEventListener('click', closeNav);
overlay.addEventListener('click', closeNav);

// Add to cart functionality

const decreaseButton = document.querySelector('.quantity__button--decrease');
const increaseButton = document.querySelector('.quantity__button--increase');
const quantityInput = document.querySelector('.quantity__value');

let quantity = 0;

increaseButton.addEventListener('click', () => {
    quantity++;
    quantityInput.textContent = quantity;
});

decreaseButton.addEventListener('click', () => {
    if (quantity > 0) {
        quantity--;
        quantityInput.textContent = quantity;
    }
});


// Cart Dropdown

const cartButton = document.querySelector('.cart__button');
const cartDropdown = document.querySelector('.cart__dropdown');

function openCart() {
    cartDropdown.removeAttribute('hidden');
    cartDropdown.setAttribute('aria-hidden', 'false');
    cartButton.setAttribute('aria-expanded', 'true');
}

function closeCart() {
    cartDropdown.setAttribute('hidden', '');
    cartDropdown.setAttribute('aria-hidden', 'true');
    cartButton.setAttribute('aria-expanded', 'false');
    cartButton.focus();
}

cartButton.addEventListener('click', () => {
    if (cartDropdown.hasAttribute('hidden')) {
        openCart();
    } else {
        closeCart();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (nav.classList.contains('open')) closeNav();
        if (!cartDropdown.hasAttribute('hidden')) closeCart();
    }
});


const PRICE = 125.00;
let cartQuantity = 0;
const cartContent = document.querySelector('.cart__content');
const cartCount = document.querySelector('.cart__count');
const addToCartBtn = document.querySelector('.add__product');

function renderCart() {
    if (cartQuantity === 0 ) {
        cartContent.innerHTML = '<p class="cart__status">Your cart is empty.</p>';
        cartCount.textContent = '0';
        cartCount.style.display = 'none';
    } else {
        cartContent.innerHTML = `<div class="cart__item">
            <img src="./images/image-product-1-thumbnail.jpg" alt="Product thumbnail" class="cart__item--thumbnail">
            <div class="cart__item--details">
                <p class="cart__item--name">Fall Limited Edition Sneakers</p>
                <p class="cart__item--price">$${PRICE.toFixed(2)} x ${cartQuantity} <span class="cart__item--total">$${(PRICE * cartQuantity).toFixed(2)}</span></p>
            </div>
            <button class="cart__item--delete" aria-label="Remove item from cart"><img src="./images/icon-delete.svg" alt=""></button>
        </div>
        <button class="checkout__button">Checkout</button>`;
        cartCount.textContent = cartQuantity.toString();
        cartCount.style.display = 'flex';
        const deleteButton = cartContent.querySelector('.cart__item--delete');
        deleteButton.addEventListener('click', () => {
            cartQuantity = 0;
            renderCart();
        }); 
    }
}   

addToCartBtn.addEventListener('click', () => {
    if (quantity === 0) return;
    cartQuantity += quantity;
    quantity = 0;
    quantityInput.textContent = 0;
    renderCart();
});

// Slider

const images = [
    './images/image-product-1.jpg',
    './images/image-product-2.jpg',
    './images/image-product-3.jpg',
    './images/image-product-4.jpg'
];

let currentIndex = 0;

const mainImage = document.querySelector('.product__main-image');
const prevButton = document.querySelector('.slidebar');
const nextButton = document.querySelector('.slider');

const thumbnails = document.querySelectorAll('.product__thumbnail');

function updateMainImage(index, direction) {
    mainImage.classList.remove('slide-in-right', 'slide-in-left');
    void mainImage.offsetWidth;
    mainImage.src = images[index];
    if (direction === 'next') {
        mainImage.classList.add('slide-in-right');
    } else {
        mainImage.classList.add('slide-in-left');
    }

    thumbnails.forEach((btn, i) => {
        btn.closest('button').setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
    
}


prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateMainImage(currentIndex, 'prev');
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateMainImage(currentIndex, 'next');
});

thumbnails.forEach((thumbnail, index) => {

    thumbnail.addEventListener('click', () => {
            const direction = index > currentIndex ? 'next' : 'prev';
            currentIndex = index;
            updateMainImage(currentIndex, direction);
    });
});

const dialog = document.querySelector('#lightboxModal');
const lightboxImage = document.querySelector('.lightbox__main-image');
const lightboxClose = document.querySelector('.lightbox__close');
const lightboxPrev = document.querySelector('.lightbox__slidebar');
const lightboxNext = document.querySelector('.lightbox__slider');
const lightboxThumbs = document.querySelectorAll('.lightbox__thumbnails button');

function syncLightboxThumbs(index) {
    lightboxThumbs.forEach((btn, i) => {
        btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
}

mainImage.addEventListener('click', () => {
    if (window.innerWidth < 900) return;
    dialog.showModal();
    lightboxImage.src = images[currentIndex];
    syncLightboxThumbs(currentIndex);
});

lightboxClose.addEventListener('click', () => {
    dialog.close();
});

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
});

lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentIndex];
    updateMainImage(currentIndex, 'prev');
    syncLightboxThumbs(currentIndex);
});

lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImage.src = images[currentIndex];
    updateMainImage(currentIndex, 'next');
    syncLightboxThumbs(currentIndex);
});

lightboxThumbs.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        const direction = index > currentIndex ? 'next' : 'prev';
        currentIndex = index;
        lightboxImage.src = images[currentIndex];
        updateMainImage(currentIndex, direction);
        syncLightboxThumbs(currentIndex);
    });
});