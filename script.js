/* ============================================================
   ECOMMERCE PRODUCT PAGE - JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // DATA
  // ============================================================
  const PRODUCT_IMAGES = [
    './images/image-product-1.jpg',
    './images/image-product-2.jpg',
    './images/image-product-3.jpg',
    './images/image-product-4.jpg',
  ];

  const PRODUCT_THUMBNAILS = [
    './images/image-product-1-thumbnail.jpg',
    './images/image-product-2-thumbnail.jpg',
    './images/image-product-3-thumbnail.jpg',
    './images/image-product-4-thumbnail.jpg',
  ];

  const PRODUCT_PRICE = 125;
  const PRODUCT_NAME  = 'Fall Limited Edition Sneakers';

  // ============================================================
  // STATE
  // ============================================================
  let currentMainIndex    = 0;   // currently active image in main gallery
  let currentLightboxIndex = 0;  // currently active image in lightbox
  let currentMobileIndex  = 0;   // currently active image in mobile slider
  let quantity = 0;              // quantity in stepper
  let cartQuantity = 0;          // items in cart
  let isLightboxOpen  = false;
  let isCartOpen      = false;
  let isSidebarOpen   = false;

  // ============================================================
  // DOM REFS
  // ============================================================
  const mainImage           = document.getElementById('mainImage');
  const mainImageWrapper    = document.getElementById('mainImageWrapper');
  const thumbBtns           = document.querySelectorAll('.thumbnails .thumb-btn');

  const mobilePrevBtn       = document.getElementById('mobilePrevBtn');
  const mobileNextBtn       = document.getElementById('mobileNextBtn');

  const lightboxOverlay     = document.getElementById('lightboxOverlay');
  const lightboxMainImage   = document.getElementById('lightboxMainImage');
  const lightboxClose       = document.getElementById('lightboxClose');
  const lightboxPrev        = document.getElementById('lightboxPrev');
  const lightboxNext        = document.getElementById('lightboxNext');
  const lightboxThumbs      = document.querySelectorAll('.lightbox-thumbnails .thumb-btn');

  const cartBtn             = document.getElementById('cartBtn');
  const cartDropdown        = document.getElementById('cartDropdown');
  const cartBadge           = document.getElementById('cartBadge');
  const cartBody            = document.getElementById('cartBody');

  const addToCartBtn        = document.getElementById('addToCartBtn');
  const decreaseQtyBtn      = document.getElementById('decreaseQty');
  const increaseQtyBtn      = document.getElementById('increaseQty');
  const qtyDisplay          = document.getElementById('qtyDisplay');

  const hamburgerBtn        = document.getElementById('hamburgerBtn');
  const sidebarClose        = document.getElementById('sidebarClose');
  const sidebar             = document.getElementById('sidebar');
  const sidebarOverlay      = document.getElementById('sidebarOverlay');

  // ============================================================
  // HELPERS
  // ============================================================
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // ============================================================
  // MAIN IMAGE GALLERY (DESKTOP)
  // ============================================================
  function setMainImage(index) {
    currentMainIndex = index;
    mainImage.src = PRODUCT_IMAGES[index];
    mainImage.alt = `Fall Limited Edition Sneakers - view ${index + 1}`;

    thumbBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    // Sync lightbox index
    currentLightboxIndex = index;
    setLightboxImage(index);
  }

  thumbBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index, 10);
      setMainImage(index);
    });
  });

  // Click main image to open lightbox (desktop only)
  mainImageWrapper.addEventListener('click', () => {
    if (!isMobile()) {
      openLightbox(currentMainIndex);
    }
  });

  // ============================================================
  // MOBILE SLIDER
  // ============================================================
  function setMobileImage(index) {
    currentMobileIndex = index;
    mainImage.src = PRODUCT_IMAGES[index];
    mainImage.alt = `Fall Limited Edition Sneakers - view ${index + 1}`;
  }

  if (mobilePrevBtn) {
    mobilePrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = (currentMobileIndex - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length;
      setMobileImage(newIndex);
    });
  }

  if (mobileNextBtn) {
    mobileNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = (currentMobileIndex + 1) % PRODUCT_IMAGES.length;
      setMobileImage(newIndex);
    });
  }

  // ============================================================
  // LIGHTBOX
  // ============================================================
  function setLightboxImage(index) {
    currentLightboxIndex = index;
    lightboxMainImage.src = PRODUCT_IMAGES[index];
    lightboxMainImage.alt = `Fall Limited Edition Sneakers - view ${index + 1}`;

    lightboxThumbs.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  function openLightbox(index) {
    isLightboxOpen = true;
    setLightboxImage(index);
    lightboxOverlay.classList.add('open');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    isLightboxOpen = false;
    lightboxOverlay.classList.remove('open');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightboxPrev.addEventListener('click', () => {
    const newIndex = (currentLightboxIndex - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length;
    setLightboxImage(newIndex);
    // sync main gallery
    setMainImage(newIndex);
  });

  lightboxNext.addEventListener('click', () => {
    const newIndex = (currentLightboxIndex + 1) % PRODUCT_IMAGES.length;
    setLightboxImage(newIndex);
    setMainImage(newIndex);
  });

  lightboxThumbs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index, 10);
      setLightboxImage(index);
      setMainImage(index);
    });
  });

  // Close lightbox on overlay backdrop click
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  // ============================================================
  // QUANTITY STEPPER
  // ============================================================
  function updateQtyDisplay() {
    qtyDisplay.textContent = quantity;
    qtyDisplay.setAttribute('aria-label', `Quantity: ${quantity}`);
  }

  decreaseQtyBtn.addEventListener('click', () => {
    if (quantity > 0) {
      quantity--;
      updateQtyDisplay();
    }
  });

  increaseQtyBtn.addEventListener('click', () => {
    quantity++;
    updateQtyDisplay();
  });

  // ============================================================
  // CART
  // ============================================================
  function renderCart() {
    cartBody.innerHTML = '';

    if (cartQuantity === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'cart-empty';
      emptyDiv.innerHTML = '<p>Your cart is empty.</p>';
      cartBody.appendChild(emptyDiv);
    } else {
      const total = (PRODUCT_PRICE * cartQuantity).toFixed(2);

      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <img src="${PRODUCT_THUMBNAILS[0]}" alt="${PRODUCT_NAME}" class="cart-item-thumb">
        <div class="cart-item-info">
          <p class="cart-item-name">${PRODUCT_NAME}</p>
          <p class="cart-item-price">
            $${PRODUCT_PRICE.toFixed(2)} x ${cartQuantity}
            <span class="cart-item-total">$${total}</span>
          </p>
        </div>
        <button class="cart-delete-btn" id="deleteCartItem" aria-label="Remove item from cart">
          <img src="./images/icon-delete.svg" alt="">
        </button>
      `;
      cartBody.appendChild(itemDiv);

      const checkoutBtn = document.createElement('button');
      checkoutBtn.className = 'checkout-btn';
      checkoutBtn.textContent = 'Checkout';
      checkoutBtn.setAttribute('aria-label', 'Proceed to checkout');
      cartBody.appendChild(checkoutBtn);

      // Delete button
      document.getElementById('deleteCartItem').addEventListener('click', () => {
        cartQuantity = 0;
        updateCartBadge();
        renderCart();
      });
    }
  }

  function updateCartBadge() {
    if (cartQuantity > 0) {
      cartBadge.textContent = cartQuantity;
      cartBadge.removeAttribute('hidden');
    } else {
      cartBadge.setAttribute('hidden', '');
    }
    cartBtn.setAttribute('aria-label', `Open cart (${cartQuantity} items)`);
  }

  function openCart() {
    isCartOpen = true;
    cartDropdown.classList.add('open');
    cartDropdown.setAttribute('aria-hidden', 'false');
    cartBtn.setAttribute('aria-expanded', 'true');
    renderCart();
  }

  function closeCart() {
    isCartOpen = false;
    cartDropdown.classList.remove('open');
    cartDropdown.setAttribute('aria-hidden', 'true');
    cartBtn.setAttribute('aria-expanded', 'false');
  }

  cartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isCartOpen) {
      closeCart();
    } else {
      openCart();
    }
  });

  addToCartBtn.addEventListener('click', () => {
    if (quantity === 0) return;
    cartQuantity += quantity;
    quantity = 0;
    updateQtyDisplay();
    updateCartBadge();
    // Refresh cart if open
    if (isCartOpen) renderCart();
  });

  // Close cart on outside click
  document.addEventListener('click', (e) => {
    if (isCartOpen && !cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
      closeCart();
    }
  });

  // ============================================================
  // MOBILE SIDEBAR
  // ============================================================
  function openSidebar() {
    isSidebarOpen = true;
    sidebar.classList.add('active');
    sidebar.setAttribute('aria-hidden', 'false');
    sidebarOverlay.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    sidebarClose.focus();
  }

  function closeSidebar() {
    isSidebarOpen = false;
    sidebar.classList.remove('active');
    sidebar.setAttribute('aria-hidden', 'true');
    sidebarOverlay.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  // ============================================================
  // KEYBOARD NAVIGATION
  // ============================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isLightboxOpen) closeLightbox();
      if (isCartOpen)     closeCart();
      if (isSidebarOpen)  closeSidebar();
    }

    if (isLightboxOpen) {
      if (e.key === 'ArrowLeft') {
        const newIndex = (currentLightboxIndex - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length;
        setLightboxImage(newIndex);
        setMainImage(newIndex);
      }
      if (e.key === 'ArrowRight') {
        const newIndex = (currentLightboxIndex + 1) % PRODUCT_IMAGES.length;
        setLightboxImage(newIndex);
        setMainImage(newIndex);
      }
    }
  });

  // ============================================================
  // INIT
  // ============================================================
  renderCart();
  updateQtyDisplay();
  updateCartBadge();

})();
