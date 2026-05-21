document.addEventListener('DOMContentLoaded', () => {
  // ===== STAN =====
  const state = {
    quantity: 0,
    cartItems: [],
    currentImageIndex: 0,
    isLightboxOpen: false,
    isCartOpen: false
  };

  const product = {
    id: 1,
    name: 'Fall Limited Edition Sneakers',
    price: 125.00,
    thumbnail: './images/image-product-1-thumbnail.jpg'
  };

  // ===== SELECTORY DOM =====
  const cartBtn = document.querySelector('.cart-btn');
  const cartDropdown = document.getElementById('cart-dropdown');
  const cartContent = document.querySelector('.cart-content');
  const cartCountBadge = document.querySelector('.cart-count');

  const mainImage = document.querySelector('.main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const carouselBtns = document.querySelectorAll('.carousel-btn');

  // Lightbox - teraz <dialog>
  const lightbox = document.querySelector('.lightbox-overlay');
  const lightboxMainImg = document.querySelector('.lightbox-main-image');
  const lightboxThumbs = document.querySelectorAll('.lightbox-thumbnail');
  const lightboxNavBtns = document.querySelectorAll('.lightbox-nav');
  const closeLightboxBtn = document.querySelector('.close-lightbox');
  const lightboxTrigger = document.querySelector('.lightbox-trigger');

  const qtyBtns = document.querySelectorAll('.qty-btn');
  const qtyDisplay = document.querySelector('.qty-display');

  const addToCartBtn = document.querySelector('.add-to-cart-btn');

  // Mobile Menu - teraz <dialog>
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeMobileMenu = document.querySelector('.close-menu-btn');

  // ===== FUNKCJE =====
  const updateQuantity = (change) => {
    state.quantity = Math.max(0, state.quantity + change);
    qtyDisplay.textContent = state.quantity;
  };

  const renderCart = () => {
    if (state.cartItems.length === 0) {
      cartCountBadge.classList.remove('active');
      cartCountBadge.textContent = '0';
      cartContent.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
      return;
    }

    const totalCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalCount;
    cartCountBadge.classList.add('active');

    let html = '';
    let totalPrice = 0;
    state.cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      html += `
        <div class="cart-item">
          <img src="${item.thumbnail}" alt="${item.name}">
          <div class="cart-item-details">
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)} x ${item.quantity} <span class="cart-item-total">$${itemTotal.toFixed(2)}</span></span>
          </div>
          <button type="button" class="delete-item-btn" aria-label="Remove item from cart" data-index="${index}">
            <img src="./images/icon-delete.svg" alt="Delete">
          </button>
        </div>
      `;
    });

    html += `<button type="button" class="checkout-btn">Checkout</button>`;
    cartContent.innerHTML = html;

    cartContent.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete-item-btn');
      if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index, 10);
        removeFromCart(index);
      }
    });
  };

  const addToCart = () => {
    if (state.quantity === 0) return;

    const existingItem = state.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += state.quantity;
    } else {
      state.cartItems.push({
        ...product,
        quantity: state.quantity,
        thumbnail: thumbnails[state.currentImageIndex].querySelector('img').src
      });
    }

    state.quantity = 0;
    qtyDisplay.textContent = '0';
    renderCart();
    if (!state.isCartOpen) toggleCart();
  };

  const removeFromCart = (index) => {
    state.cartItems.splice(index, 1);
    renderCart();
  };

  const toggleCart = () => {
    state.isCartOpen = !state.isCartOpen;
    cartDropdown.classList.toggle('open', state.isCartOpen);
    cartBtn.setAttribute('aria-expanded', state.isCartOpen);
  };

  const updateMainImage = (index) => {
    state.currentImageIndex = index;
    const newSrc = `./images/image-product-${index + 1}.jpg`;
    mainImage.src = newSrc;
    mainImage.dataset.index = index;
    
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
      thumb.setAttribute('aria-selected', i === index);
    });

    if (lightbox.open) {
      lightboxMainImg.src = newSrc;
      lightboxThumbs.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
      });
    }
  };

  // ===== OBSŁUGA ZDARZEŃ =====

  cartBtn.addEventListener('click', toggleCart);

  qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isMinus = btn.classList.contains('minus');
      updateQuantity(isMinus ? -1 : 1);
    });
  });

  addToCartBtn.addEventListener('click', addToCart);

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateMainImage(index));
  });

  carouselBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let newIndex = state.currentImageIndex;
      if (btn.classList.contains('prev')) {
        newIndex = (newIndex - 1 + 4) % 4;
      } else {
        newIndex = (newIndex + 1) % 4;
      }
      updateMainImage(newIndex);
    });
  });

  // Lightbox - Otwieranie (show())
  lightboxTrigger.addEventListener('click', () => {
    lightbox.showModal(); // showModal() zapewnia nakładkę i zablokowanie tła
  });

  // Lightbox - Zamykanie (close())
  closeLightboxBtn.addEventListener('click', () => lightbox.close());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.open) lightbox.close();
  });

  lightboxThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      updateMainImage(index);
      lightboxMainImg.src = `./images/image-product-${index + 1}.jpg`;
      lightboxThumbs.forEach((t, i) => t.classList.toggle('active', i === index));
    });
  });

  lightboxNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let newIndex = state.currentImageIndex;
      if (btn.classList.contains('prev')) {
        newIndex = (newIndex - 1 + 4) % 4;
      } else {
        newIndex = (newIndex + 1) % 4;
      }
      updateMainImage(newIndex);
      lightboxMainImg.src = `./images/image-product-${newIndex + 1}.jpg`;
      lightboxThumbs.forEach((t, i) => t.classList.toggle('active', i === newIndex));
    });
  });

  // Mobile Menu - Otwieranie (show())
  mobileMenuToggle.addEventListener('click', () => {
    if (mobileNav.open) {
      mobileNav.close();
    } else {
      mobileNav.showModal();
    }
  });

  closeMobileMenu.addEventListener('click', () => mobileNav.close());

  // Zamknij menu po kliknięciu linku
  document.querySelectorAll('.mobile-nav-list a').forEach(link => {
    link.addEventListener('click', () => mobileNav.close());
  });

  // ===== INICJALIZACJA =====
  renderCart();
});
