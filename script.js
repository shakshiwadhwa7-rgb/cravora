/* ============================================================
   FoodieCo — Interactive Behavior
   All UI logic lives here. Loaded at the end of <body>.
   ============================================================ */

/* ==================== AUTH MODAL INJECTION ==================== */
(function injectAuthModal() {
    const style = document.createElement('style');
    style.textContent = `
        .auth-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            z-index: 9000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            backdrop-filter: blur(4px);
        }
        .auth-box {
            background: #fff;
            border-radius: 20px;
            width: 100%;
            max-width: 460px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.25);
            overflow: hidden;
            animation: authSlideIn 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes authSlideIn {
            from { opacity: 0; transform: translateY(30px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .auth-header {
            background: linear-gradient(135deg, #ff6b35, #e55a2b);
            padding: 28px 32px 24px;
            text-align: center;
            color: #fff;
        }
        .auth-header .auth-logo {
            font-size: 1.8rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 6px;
        }
        .auth-header .auth-logo span { color: rgba(255,255,255,0.7); }
        .auth-header p {
            font-size: 0.9rem;
            opacity: 0.85;
            margin: 0;
        }
        .auth-tabs {
            display: flex;
            border-bottom: 2px solid #f0f0f0;
            background: #fafafa;
        }
        .auth-tab {
            flex: 1;
            padding: 14px;
            text-align: center;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            color: #636e72;
            border: none;
            background: none;
            border-bottom: 3px solid transparent;
            margin-bottom: -2px;
            transition: all 0.2s;
        }
        .auth-tab.active {
            color: #ff6b35;
            border-bottom-color: #ff6b35;
            background: #fff;
        }
        .auth-body { padding: 28px 32px 32px; }
        .auth-panel { display: none; }
        .auth-panel.active { display: block; }
        .auth-field { margin-bottom: 18px; }
        .auth-field label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: #2d3436;
            margin-bottom: 6px;
        }
        .auth-field label span.req { color: #ff6b35; margin-left: 2px; }
        .auth-input-wrap { position: relative; }
        .auth-input-wrap .field-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #b2bec3;
            font-size: 1rem;
            pointer-events: none;
        }
        .auth-input-wrap input {
            width: 100%;
            padding: 12px 14px 12px 40px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 0.95rem;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            color: #2d3436;
            background: #fff;
        }
        .auth-input-wrap input:focus {
            border-color: #ff6b35;
            box-shadow: 0 0 0 3px rgba(255,107,53,0.12);
        }
        .auth-input-wrap input.input-error { border-color: #e74c3c; }
        .auth-input-wrap input.input-ok { border-color: #00b894; }
        .auth-hint {
            font-size: 0.75rem;
            color: #b2bec3;
            margin-top: 4px;
        }
        .auth-err {
            font-size: 0.75rem;
            color: #e74c3c;
            margin-top: 4px;
            display: none;
        }
        .auth-err.visible { display: block; }
        .strength-bar {
            height: 4px;
            border-radius: 2px;
            background: #f0f0f0;
            margin-top: 6px;
            overflow: hidden;
        }
        .strength-fill {
            height: 100%;
            border-radius: 2px;
            transition: width 0.3s, background 0.3s;
            width: 0;
        }
        .strength-label {
            font-size: 0.72rem;
            margin-top: 3px;
            font-weight: 600;
        }
        .auth-submit {
            width: 100%;
            padding: 14px;
            background: #ff6b35;
            color: #fff;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            margin-top: 8px;
            transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
            font-family: inherit;
        }
        .auth-submit:hover {
            background: #e55a2b;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255,107,53,0.35);
        }
        .auth-submit:active { transform: translateY(0); }
        .auth-switch {
            text-align: center;
            margin-top: 18px;
            font-size: 0.85rem;
            color: #636e72;
        }
        .auth-switch button {
            background: none;
            border: none;
            color: #ff6b35;
            font-weight: 700;
            cursor: pointer;
            font-family: inherit;
            font-size: inherit;
            padding: 0;
        }
        .auth-switch button:hover { text-decoration: underline; }
        .auth-skip {
            display: block;
            text-align: center;
            margin-top: 14px;
            font-size: 0.8rem;
            color: #b2bec3;
            cursor: pointer;
            background: none;
            border: none;
            font-family: inherit;
            width: 100%;
        }
        .auth-skip:hover { color: #636e72; }
        @media (max-width: 480px) {
            .auth-box { border-radius: 16px; }
            .auth-body { padding: 20px; }
            .auth-header { padding: 22px 20px 18px; }
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    overlay.id = 'authOverlay';
    overlay.innerHTML = `
        <div class="auth-box" id="authBox">
            <div class="auth-header">
                <div class="auth-logo">Foodie<span>Co</span></div>
                <p>Sign in or create an account to continue</p>
            </div>
            <div class="auth-tabs">
                <button class="auth-tab active" id="tabLogin" type="button">Sign In</button>
                <button class="auth-tab" id="tabRegister" type="button">Create Account</button>
            </div>
            <div class="auth-body">

                <!-- LOGIN PANEL -->
                <div class="auth-panel active" id="loginPanel">
                    <div class="auth-field">
                        <label for="loginEmail">Email Address <span class="req">*</span></label>
                        <div class="auth-input-wrap">
                            <i class="fas fa-envelope field-icon"></i>
                            <input type="email" id="loginEmail" placeholder="you@example.com" autocomplete="email">
                        </div>
                        <div class="auth-err" id="loginEmailErr">Please enter a valid email address.</div>
                    </div>
                    <div class="auth-field">
                        <label for="loginPassword">Password <span class="req">*</span></label>
                        <div class="auth-input-wrap">
                            <i class="fas fa-lock field-icon"></i>
                            <input type="password" id="loginPassword" placeholder="Your password" autocomplete="current-password">
                        </div>
                        <div class="auth-err" id="loginPassErr">Password must be at least 8 characters.</div>
                    </div>
                    <button class="auth-submit" id="loginSubmit" type="button">Sign In &rarr;</button>
                    <div class="auth-switch">
                        Don't have an account?
                        <button type="button" id="goToRegister">Create one free</button>
                    </div>
                </div>

                <!-- REGISTER PANEL -->
                <div class="auth-panel" id="registerPanel">
                    <div class="auth-field">
                        <label for="regName">Full Name <span class="req">*</span></label>
                        <div class="auth-input-wrap">
                            <i class="fas fa-user field-icon"></i>
                            <input type="text" id="regName" placeholder="John Doe" maxlength="50" autocomplete="name">
                        </div>
                        <div class="auth-hint">2–50 characters, letters and spaces only.</div>
                        <div class="auth-err" id="regNameErr">Name must be 2–50 characters (letters &amp; spaces only).</div>
                    </div>
                    <div class="auth-field">
                        <label for="regEmail">Email Address <span class="req">*</span></label>
                        <div class="auth-input-wrap">
                            <i class="fas fa-envelope field-icon"></i>
                            <input type="email" id="regEmail" placeholder="you@example.com" autocomplete="email">
                        </div>
                        <div class="auth-err" id="regEmailErr">Please enter a valid email address.</div>
                    </div>
                    <div class="auth-field">
                        <label for="regPhone">Mobile Number <span class="req">*</span></label>
                        <div class="auth-input-wrap">
                            <i class="fas fa-phone field-icon"></i>
                            <input type="tel" id="regPhone" placeholder="10-digit number" maxlength="10" autocomplete="tel">
                        </div>
                        <div class="auth-hint">10 digits only, no spaces or dashes.</div>
                        <div class="auth-err" id="regPhoneErr">Enter a valid 10-digit mobile number.</div>
                    </div>
                    <div class="auth-field">
                        <label for="regPassword">Password <span class="req">*</span></label>
                        <div class="auth-input-wrap">
                            <i class="fas fa-lock field-icon"></i>
                            <input type="password" id="regPassword" placeholder="Min 8 characters" maxlength="30" autocomplete="new-password">
                        </div>
                        <div class="strength-bar"><div class="strength-fill" id="strengthFill"></div></div>
                        <div class="strength-label" id="strengthLabel" style="color:#b2bec3"></div>
                        <div class="auth-hint">8–30 characters. Mix letters, numbers &amp; symbols for a strong password.</div>
                        <div class="auth-err" id="regPassErr">Password must be 8–30 characters.</div>
                    </div>
                    <div class="auth-field">
                        <label for="regConfirm">Confirm Password <span class="req">*</span></label>
                        <div class="auth-input-wrap">
                            <i class="fas fa-lock field-icon"></i>
                            <input type="password" id="regConfirm" placeholder="Re-enter password" maxlength="30" autocomplete="new-password">
                        </div>
                        <div class="auth-err" id="regConfirmErr">Passwords do not match.</div>
                    </div>
                    <button class="auth-submit" id="registerSubmit" type="button">Create Account &rarr;</button>
                    <div class="auth-switch">
                        Already have an account?
                        <button type="button" id="goToLogin">Sign in</button>
                    </div>
                </div>

                <button class="auth-skip" id="authSkip" type="button">Skip for now &rsaquo;</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    /* --- TAB SWITCHING --- */
    function switchTab(tab) {
        if (tab === 'login') {
            document.getElementById('tabLogin').classList.add('active');
            document.getElementById('tabRegister').classList.remove('active');
            document.getElementById('loginPanel').classList.add('active');
            document.getElementById('registerPanel').classList.remove('active');
        } else {
            document.getElementById('tabRegister').classList.add('active');
            document.getElementById('tabLogin').classList.remove('active');
            document.getElementById('registerPanel').classList.add('active');
            document.getElementById('loginPanel').classList.remove('active');
        }
        clearErrors();
    }

    document.getElementById('tabLogin').addEventListener('click', () => switchTab('login'));
    document.getElementById('tabRegister').addEventListener('click', () => switchTab('register'));
    document.getElementById('goToRegister').addEventListener('click', () => switchTab('register'));
    document.getElementById('goToLogin').addEventListener('click', () => switchTab('login'));

    /* --- CLOSE --- */
    function closeAuth() {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s';
        setTimeout(() => overlay.remove(), 300);
    }
    document.getElementById('authSkip').addEventListener('click', closeAuth);

    /* --- HELPERS --- */
    function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
    function isValidName(v)  { return /^[A-Za-z\s]{2,50}$/.test(v.trim()); }
    function isValidPhone(v) { return /^\d{10}$/.test(v.trim()); }

    function setErr(input, errEl, show) {
        input.classList.toggle('input-error', show);
        input.classList.toggle('input-ok', !show && input.value.length > 0);
        errEl.classList.toggle('visible', show);
    }

    function clearErrors() {
        document.querySelectorAll('.auth-err').forEach(e => e.classList.remove('visible'));
        document.querySelectorAll('.auth-input-wrap input').forEach(i => {
            i.classList.remove('input-error', 'input-ok');
        });
    }

    /* --- PHONE: numbers only --- */
    document.getElementById('regPhone').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });

    /* --- PASSWORD STRENGTH --- */
    document.getElementById('regPassword').addEventListener('input', function() {
        const v = this.value;
        const fill = document.getElementById('strengthFill');
        const label = document.getElementById('strengthLabel');
        let score = 0;
        if (v.length >= 8)  score++;
        if (v.length >= 12) score++;
        if (/[0-9]/.test(v)) score++;
        if (/[^A-Za-z0-9]/.test(v)) score++;
        if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;

        const levels = [
            { w: '0%',   bg: '#e0e0e0', text: '',          color: '#b2bec3' },
            { w: '25%',  bg: '#e74c3c', text: 'Weak',      color: '#e74c3c' },
            { w: '50%',  bg: '#f39c12', text: 'Fair',      color: '#f39c12' },
            { w: '75%',  bg: '#00b894', text: 'Good',      color: '#00b894' },
            { w: '100%', bg: '#00b894', text: 'Strong ✓',  color: '#00b894' },
        ];
        const lvl = v.length === 0 ? levels[0] : score <= 1 ? levels[1] : score <= 2 ? levels[2] : score <= 3 ? levels[3] : levels[4];
        fill.style.width = lvl.w;
        fill.style.background = lvl.bg;
        label.textContent = lvl.text;
        label.style.color = lvl.color;
    });

    /* --- LOGIN SUBMIT --- */
    document.getElementById('loginSubmit').addEventListener('click', function() {
        const email = document.getElementById('loginEmail');
        const pass  = document.getElementById('loginPassword');
        let ok = true;

        const emailOk = isValidEmail(email.value);
        setErr(email, document.getElementById('loginEmailErr'), !emailOk);
        if (!emailOk) ok = false;

        const passOk = pass.value.length >= 8;
        setErr(pass, document.getElementById('loginPassErr'), !passOk);
        if (!passOk) ok = false;

        if (ok) {
            closeAuth();
            if (typeof showToast === 'function') {
                showToast('Welcome back! You are now signed in.');
            }
        }
    });

    /* --- REGISTER SUBMIT --- */
    document.getElementById('registerSubmit').addEventListener('click', function() {
        const name    = document.getElementById('regName');
        const email   = document.getElementById('regEmail');
        const phone   = document.getElementById('regPhone');
        const pass    = document.getElementById('regPassword');
        const confirm = document.getElementById('regConfirm');
        let ok = true;

        const nameOk = isValidName(name.value);
        setErr(name, document.getElementById('regNameErr'), !nameOk);
        if (!nameOk) ok = false;

        const emailOk = isValidEmail(email.value);
        setErr(email, document.getElementById('regEmailErr'), !emailOk);
        if (!emailOk) ok = false;

        const phoneOk = isValidPhone(phone.value);
        setErr(phone, document.getElementById('regPhoneErr'), !phoneOk);
        if (!phoneOk) ok = false;

        const passOk = pass.value.length >= 8 && pass.value.length <= 30;
        setErr(pass, document.getElementById('regPassErr'), !passOk);
        if (!passOk) ok = false;

        const confirmOk = confirm.value === pass.value && confirm.value.length > 0;
        setErr(confirm, document.getElementById('regConfirmErr'), !confirmOk);
        if (!confirmOk) ok = false;

        if (ok) {
            closeAuth();
            if (typeof showToast === 'function') {
                showToast('Account created! Welcome to FoodieCo 🎉');
            }
        }
    });

    /* --- REAL-TIME INLINE VALIDATION --- */
    function liveValidate(inputId, errId, checkFn) {
        const el = document.getElementById(inputId);
        const er = document.getElementById(errId);
        el.addEventListener('blur', () => {
            if (el.value.length > 0) setErr(el, er, !checkFn(el.value));
        });
    }
    liveValidate('loginEmail',  'loginEmailErr',  isValidEmail);
    liveValidate('regName',     'regNameErr',     isValidName);
    liveValidate('regEmail',    'regEmailErr',    isValidEmail);
    liveValidate('regPhone',    'regPhoneErr',    isValidPhone);
    liveValidate('regPassword', 'regPassErr',     v => v.length >= 8 && v.length <= 30);
    liveValidate('regConfirm',  'regConfirmErr',  v => v === document.getElementById('regPassword').value);
})();


/* ==================== MENU DATA ==================== */
const menuItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "pizza",
        price: 14.99,
        oldPrice: null,
        rating: 4.8,
        reviews: 245,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        description: "Classic tomato sauce, fresh mozzarella, basil",
        badge: "popular",
        filter: "popular"
    },
    {
        id: 2,
        name: "Double Cheese Burger",
        category: "burger",
        price: 12.99,
        oldPrice: 15.99,
        rating: 4.9,
        reviews: 189,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        description: "Double patty, cheddar, lettuce, special sauce",
        badge: "sale",
        filter: "offers"
    },
    {
        id: 3,
        name: "Dragon Roll",
        category: "sushi",
        price: 18.99,
        oldPrice: null,
        rating: 4.7,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
        description: "Shrimp tempura, avocado, eel, spicy mayo",
        badge: "new",
        filter: "new"
    },
    {
        id: 4,
        name: "Creamy Carbonara",
        category: "pasta",
        price: 15.99,
        oldPrice: null,
        rating: 4.6,
        reviews: 178,
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
        description: "Spaghetti, bacon, egg, parmesan, black pepper",
        badge: "popular",
        filter: "popular"
    },
    {
        id: 5,
        name: "Chocolate Lava Cake",
        category: "dessert",
        price: 8.99,
        oldPrice: null,
        rating: 4.9,
        reviews: 312,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
        description: "Warm chocolate cake with molten center",
        badge: "hot",
        filter: "popular"
    },
    {
        id: 6,
        name: "Tropical Smoothie",
        category: "drinks",
        price: 6.99,
        oldPrice: 8.99,
        rating: 4.5,
        reviews: 98,
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400",
        description: "Mango, pineapple, coconut milk, honey",
        badge: "sale",
        filter: "offers"
    },
    {
        id: 7,
        name: "BBQ Chicken Pizza",
        category: "pizza",
        price: 16.99,
        oldPrice: null,
        rating: 4.7,
        reviews: 167,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
        description: "BBQ sauce, grilled chicken, red onion, cilantro",
        badge: "new",
        filter: "new"
    },
    {
        id: 8,
        name: "Spicy Chicken Burger",
        category: "burger",
        price: 11.99,
        oldPrice: null,
        rating: 4.6,
        reviews: 143,
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400",
        description: "Crispy chicken, jalapeños, spicy mayo, slaw",
        badge: "hot",
        filter: "popular"
    }
];

/* ==================== STATE ==================== */
let cart = [];
let wishlist = new Set();
let activeCategory = 'all';
let activeFilter = 'all';
let currentTestimonial = 0;
let testimonialTimer = null;

/* ==================== DOM ==================== */
const $ = (id) => document.getElementById(id);

const header = $('header');
const menuToggle = $('menuToggle');
const navLinks = $('navLinks');
const cartIcon = $('cartIcon');
const cartSidebar = $('cartSidebar');
const cartOverlay = $('cartOverlay');
const closeCart = $('closeCart');
const cartItemsEl = $('cartItems');
const cartCount = $('cartCount');
const cartItemCount = $('cartItemCount');
const cartTotal = $('cartTotal');
const checkoutBtn = $('checkoutBtn');
const menuGrid = $('menuGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = $('prevBtn');
const nextBtn = $('nextBtn');
const sliderDots = document.querySelectorAll('.dot');
const backToTop = $('backToTop');
const contactForm = $('contactForm');
const newsletterForm = $('newsletterForm');
const toast = $('toast');
const toastMessage = $('toastMessage');
const modalOverlay = $('modalOverlay');
const modalBody = $('modalBody');
const modalClose = $('modalClose');
const orderNowBtn = $('orderNowBtn');
const specialOrderBtn = $('specialOrderBtn');
const currentYear = $('currentYear');

/* ==================== UTILITIES ==================== */
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.classList.toggle('error', isError);
    toast.querySelector('i').className = isError
        ? 'fas fa-exclamation-circle'
        : 'fas fa-check-circle';
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==================== MENU RENDER ==================== */
function renderMenu() {
    menuGrid.innerHTML = menuItems.map(item => {
        const oldPriceHtml = item.oldPrice
            ? `<span class="old-price">₹${item.oldPrice.toFixed(0)}</span>`
            : '';
        const isWished = wishlist.has(item.id);
        return `
            <article class="menu-card" data-category="${item.category}" data-filter="${item.filter}" data-id="${item.id}">
                <div class="menu-card-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <span class="menu-badge ${item.badge}">${item.badge.toUpperCase()}</span>
                    <button class="wishlist-btn ${isWished ? 'active' : ''}" data-wishlist="${item.id}" aria-label="Add to wishlist">
                        <i class="${isWished ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="menu-card-content">
                    <div class="menu-card-header">
                        <h3>${item.name}</h3>
                        <div class="menu-rating">
                            <i class="fas fa-star"></i>
                            <span>${item.rating} (${item.reviews})</span>
                        </div>
                    </div>
                    <p>${item.description}</p>
                    <div class="menu-card-footer">
                        <div class="menu-price">
                            ₹${item.price.toFixed(0)}
                            ${oldPriceHtml}
                        </div>
                        <button class="add-to-cart" data-add="${item.id}" aria-label="Add to cart">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function applyFilters() {
    document.querySelectorAll('.menu-card').forEach(card => {
        const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
        const matchesFilter = activeFilter === 'all' || card.dataset.filter === activeFilter;
        const visible = matchesCategory && matchesFilter;
        card.classList.toggle('hidden', !visible);
        if (visible) card.classList.add('visible');
    });

    const visible = document.querySelectorAll('.menu-card:not(.hidden)').length;
    let emptyEl = document.getElementById('menuEmpty');
    if (visible === 0) {
        if (!emptyEl) {
            emptyEl = document.createElement('div');
            emptyEl.id = 'menuEmpty';
            emptyEl.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray);';
            emptyEl.innerHTML = '<i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; display: block; color: var(--light);"></i><p>No items match these filters. Try a different combination.</p>';
            menuGrid.appendChild(emptyEl);
        }
    } else if (emptyEl) {
        emptyEl.remove();
    }
}

/* ==================== CART ==================== */
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
    cartCount.classList.remove('bump');
    void cartCount.offsetWidth;
    cartCount.classList.add('bump');
    const calInfo = (item.nutrition && item.nutrition.calories) ? ` (${item.nutrition.calories} kcal)` : '';
    showToast(`${item.name}${calInfo} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
    showToast('Item removed from cart');
}

function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
    } else {
        updateCartUI();
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
    const totalPrice = cart.reduce((sum, c) => sum + c.qty * c.price, 0);
    const totalCalories = cart.reduce((sum, c) => {
        const cal = (c.nutrition && c.nutrition.calories) || 0;
        return sum + cal * c.qty;
    }, 0);

    cartCount.textContent = totalItems;
    cartItemCount.textContent = totalItems;
    cartTotal.textContent = `₹${totalPrice.toFixed(0)}`;

    const calorieRow = document.getElementById('cartCalories');
    const calorieEl  = document.getElementById('cartTotalCalories');
    if (calorieRow && calorieEl) {
        if (totalCalories > 0) {
            calorieRow.style.display = 'flex';
            calorieEl.textContent = Math.round(totalCalories).toLocaleString();
        } else {
            calorieRow.style.display = 'none';
        }
    }

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }

    cartItemsEl.innerHTML = cart.map(item => {
        const itemCal = (item.nutrition && item.nutrition.calories) || 0;
        const calorieLine = itemCal > 0
            ? `<div class="cart-item-calories"><i class="fas fa-fire-flame-curved"></i> ${itemCal} kcal × ${item.qty} = ${Math.round(itemCal * item.qty)} kcal</div>`
            : '';
        return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="price">₹${(item.price * item.qty).toFixed(0)}</div>
                ${calorieLine}
                <div class="cart-item-quantity">
                    <button class="qty-btn" data-qty-dec="${item.id}" aria-label="Decrease quantity">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-qty-inc="${item.id}" aria-label="Increase quantity">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="remove-item" data-remove="${item.id}" aria-label="Remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    }).join('');
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartFn() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==================== WISHLIST ==================== */
function toggleWishlist(id) {
    const item = menuItems.find(i => i.id === id);
    if (wishlist.has(id)) {
        wishlist.delete(id);
        showToast(`${item.name} removed from wishlist`);
    } else {
        wishlist.add(id);
        showToast(`${item.name} added to wishlist!`);
    }
    const btn = document.querySelector(`[data-wishlist="${id}"]`);
    if (btn) {
        const isActive = wishlist.has(id);
        btn.classList.toggle('active', isActive);
        const icon = btn.querySelector('i');
        icon.className = `${isActive ? 'fas' : 'far'} fa-heart`;
    }
}

/* ==================== MODAL (Quick View) ==================== */
function openModal(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <div class="modal-price">₹${item.price.toFixed(0)} ${item.oldPrice ? `<span class="old-price" style="font-size:0.9rem;color:var(--gray);text-decoration:line-through;margin-left:8px;font-weight:500;">₹${item.oldPrice.toFixed(0)}</span>` : ''}</div>
        <div class="menu-rating" style="margin-bottom: 15px;">
            <i class="fas fa-star" style="color:#f39c12;"></i>
            <span style="color:var(--gray);"> ${item.rating} (${item.reviews} reviews)</span>
        </div>
        <p class="modal-desc">${item.description}</p>
        <button class="btn btn-primary" data-modal-add="${item.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
    `;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==================== TESTIMONIALS SLIDER ==================== */
function showTestimonial(index) {
    testimonialCards.forEach((card, i) => card.classList.toggle('active', i === index));
    sliderDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentTestimonial = index;
}

function nextTestimonial() {
    showTestimonial((currentTestimonial + 1) % testimonialCards.length);
}

function prevTestimonial() {
    showTestimonial((currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length);
}

function startTestimonialAutoplay() {
    stopTestimonialAutoplay();
    testimonialTimer = setInterval(nextTestimonial, 6000);
}

function stopTestimonialAutoplay() {
    if (testimonialTimer) clearInterval(testimonialTimer);
}

/* ==================== COUNTDOWN ==================== */
function startCountdown() {
    function update() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const diff = tomorrow - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        $('hours').textContent = String(hours).padStart(2, '0');
        $('minutes').textContent = String(minutes).padStart(2, '0');
        $('seconds').textContent = String(seconds).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
}

/* ==================== STAT COUNTER ==================== */
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    counters.forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const isDecimal = counter.dataset.decimal === 'true';
        const duration = 1500;
        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;

            if (isDecimal) {
                counter.textContent = value.toFixed(1);
            } else if (target >= 1000) {
                counter.textContent = Math.floor(value / 1000) + 'K+';
            } else {
                counter.textContent = Math.floor(value) + '+';
            }

            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}

/* ==================== SCROLL REVEAL ==================== */
function setupScrollReveal() {
    const elements = document.querySelectorAll('.section-title, .menu-card, .step-card, .category-card, .info-item, .contact-form');
    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

/* ==================== FORM HANDLERS ==================== */
function handleContactSubmit(e) {
    e.preventDefault();
    const name = $('name');
    const email = $('email');
    const message = $('message');

    let valid = true;
    [name, email, message].forEach(field => field.classList.remove('error'));

    if (!name.value.trim()) { name.classList.add('error'); valid = false; }
    if (!email.value.trim() || !isValidEmail(email.value)) { email.classList.add('error'); valid = false; }
    if (!message.value.trim()) { message.classList.add('error'); valid = false; }

    if (!valid) {
        showToast('Please fill out all required fields correctly.', true);
        return;
    }

    showToast('Message sent! We\'ll get back to you soon.');
    contactForm.reset();
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const input = $('newsletterEmail');
    input.classList.remove('error');

    if (!isValidEmail(input.value)) {
        input.classList.add('error');
        showToast('Please enter a valid email address.', true);
        return;
    }

    showToast('Thanks for subscribing!');
    newsletterForm.reset();
}

/* ==================== EVENT LISTENERS ==================== */
function setupEventListeners() {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 50);
        backToTop.classList.toggle('active', y > 500);
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    cartIcon.addEventListener('click', openCart);
    cartIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCart(); }
    });
    closeCart.addEventListener('click', closeCartFn);
    cartOverlay.addEventListener('click', closeCartFn);

    cartItemsEl.addEventListener('click', (e) => {
        const inc = e.target.closest('[data-qty-inc]');
        const dec = e.target.closest('[data-qty-dec]');
        const rm = e.target.closest('[data-remove]');
        if (inc) changeQty(Number(inc.dataset.qtyInc), 1);
        if (dec) changeQty(Number(dec.dataset.qtyDec), -1);
        if (rm) removeFromCart(Number(rm.dataset.remove));
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty. Add some items first!', true);
            return;
        }
        const total = cart.reduce((s, c) => s + c.qty * c.price, 0);
        showToast(`Checkout placeholder — total: ₹${total.toFixed(0)}`);
        console.log('[Checkout]', { items: cart, total });
    });

    menuGrid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('[data-add]');
        const wishBtn = e.target.closest('[data-wishlist]');
        if (addBtn) {
            e.stopPropagation();
            addToCart(Number(addBtn.dataset.add));
            return;
        }
        if (wishBtn) {
            e.stopPropagation();
            toggleWishlist(Number(wishBtn.dataset.wishlist));
            return;
        }
        const card = e.target.closest('.menu-card');
        if (card) openModal(Number(card.dataset.id));
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    modalBody.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-modal-add]');
        if (btn) {
            addToCart(Number(btn.dataset.modalAdd));
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) closeModal();
            else if (cartSidebar.classList.contains('active')) closeCartFn();
            else if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });

    categoryCards.forEach(card => {
        const activate = () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            activeCategory = card.dataset.category;

            filterBtns.forEach(b => b.classList.remove('active'));
            const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allFilterBtn) allFilterBtn.classList.add('active');
            activeFilter = 'all';

            applyFilters();

            const menuSection = document.getElementById('menu');
            const rect = menuSection.getBoundingClientRect();
            if (rect.top < -100 || rect.top > window.innerHeight) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
            }
        };
        card.addEventListener('click', activate);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
        });
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;

            categoryCards.forEach(c => c.classList.remove('active'));
            const allCatCard = document.querySelector('.category-card[data-category="all"]');
            if (allCatCard) allCatCard.classList.add('active');
            activeCategory = 'all';

            applyFilters();
        });
    });

    nextBtn.addEventListener('click', () => { nextTestimonial(); startTestimonialAutoplay(); });
    prevBtn.addEventListener('click', () => { prevTestimonial(); startTestimonialAutoplay(); });
    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            showTestimonial(Number(dot.dataset.index));
            startTestimonialAutoplay();
        });
    });

    const slider = $('testimonialsSlider');
    if (slider) {
        slider.addEventListener('mouseenter', stopTestimonialAutoplay);
        slider.addEventListener('mouseleave', startTestimonialAutoplay);
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    contactForm.addEventListener('submit', handleContactSubmit);
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);

    orderNowBtn.addEventListener('click', () => {
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    });

    specialOrderBtn.addEventListener('click', () => {
        cart.push({
            id: 999,
            name: 'Ultimate Gourmet Burger Combo',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            qty: 1
        });
        updateCartUI();
        showToast('Today\'s Special added to cart!');
        openCart();
    });

    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.dataset.social || 'social';
            showToast(`${platform.charAt(0).toUpperCase() + platform.slice(1)} link (placeholder)`);
        });
    });

    document.querySelectorAll('[data-cat]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = link.dataset.cat;
            const target = document.querySelector(`.category-card[data-category="${cat}"]`);
            if (target) target.click();
            document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        });
    });

    document.querySelectorAll('[data-info]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(`${link.dataset.info} — coming soon`);
        });
    });

    document.querySelectorAll('.payment-methods i').forEach(icon => {
        icon.addEventListener('click', () => {
            showToast('Payment method info — placeholder');
        });
        icon.style.cursor = 'pointer';
    });
}

/* ==================== DARK MODE TOGGLE ==================== */
function initDarkMode() {
    const toggleBtn = document.getElementById('darkModeToggle');
    const icon = document.getElementById('darkModeIcon');
    if (!toggleBtn) return;

    // Restore saved preference
    if (localStorage.getItem('foodieco-dark') === 'true') {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
        localStorage.setItem('foodieco-dark', isDark);
    });
}

/* ==================== INIT ==================== */
function init() {
    currentYear.textContent = new Date().getFullYear();
    renderMenu();
    applyFilters();
    setupEventListeners();
    startCountdown();
    startTestimonialAutoplay();
    setupScrollReveal();
    initDarkMode();

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(heroStats);
    }
}

document.addEventListener('DOMContentLoaded', init);

/* ============================================================
   BUILD YOUR MEAL — Salad & Pizza Builder
   Powered by USDA FoodData Central API
   ============================================================ */
(function buildYourMealModule() {

    /* -------- USDA API CONFIG -------- */
    // DEMO_KEY is rate-limited (30 req/h, 50 req/day per IP). Replace with
    // your own free key from https://fdc.nal.usda.gov/api-key-signup/ for
    // production use.
    const USDA_API_KEY = 'DEMO_KEY';
    const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1/foods/search';

    // In-memory cache so the same ingredient is never fetched twice.
    const nutritionCache = new Map();

    /* -------- INGREDIENT CONFIG --------
       Each ingredient has:
         id      — unique slug
         label   — UI display name
         query   — what we send to USDA
         price   — ₹ to add to total
         portion — grams used to scale USDA per-100g values
         fallback — used if USDA fails (offline / rate-limited)
    */
    const SALAD_CONFIG = {
        title: 'Custom Salad Bowl',
        subtitle: 'Pick your ingredients — nutrition updates live',
        basePrice: 199,
        steps: [
            {
                id: 'base', label: 'Base', hint: 'Pick 1', mode: 'single',
                options: [
                    { id: 'romaine',   label: 'Romaine Lettuce', query: 'romaine lettuce raw', price: 30, portion: 80 },
                    { id: 'spinach',   label: 'Baby Spinach',    query: 'spinach raw',          price: 40, portion: 80 },
                    { id: 'kale',      label: 'Kale',            query: 'kale raw',             price: 50, portion: 80 },
                    { id: 'quinoa',    label: 'Quinoa',          query: 'quinoa cooked',        price: 80, portion: 100 },
                    { id: 'mixgreen',  label: 'Mixed Greens',    query: 'mixed salad greens raw', price: 40, portion: 80 }
                ]
            },
            {
                id: 'protein', label: 'Protein', hint: 'Pick 1', mode: 'single',
                options: [
                    { id: 'chicken',  label: 'Grilled Chicken', query: 'chicken breast grilled', price: 140, portion: 100 },
                    { id: 'tofu',     label: 'Tofu',            query: 'tofu firm',              price: 110, portion: 100 },
                    { id: 'paneer',   label: 'Paneer',          query: 'paneer cheese',          price: 130, portion: 80  },
                    { id: 'chickpea', label: 'Chickpeas',       query: 'chickpeas cooked',       price: 90,  portion: 80  },
                    { id: 'egg',      label: 'Boiled Egg',      query: 'egg boiled',             price: 60,  portion: 100 },
                    { id: 'shrimp',   label: 'Shrimp',          query: 'shrimp cooked',          price: 180, portion: 80  }
                ]
            },
            {
                id: 'veggies', label: 'Veggies', hint: 'Pick any', mode: 'multi',
                options: [
                    { id: 'tomato',   label: 'Cherry Tomato',   query: 'cherry tomatoes raw', price: 25, portion: 50 },
                    { id: 'cucumber', label: 'Cucumber',        query: 'cucumber raw',        price: 20, portion: 50 },
                    { id: 'carrot',   label: 'Carrot',          query: 'carrot raw',          price: 25, portion: 50 },
                    { id: 'onion',    label: 'Red Onion',       query: 'red onion raw',       price: 20, portion: 30 },
                    { id: 'olives',   label: 'Olives',          query: 'olives black',        price: 45, portion: 30 },
                    { id: 'corn',     label: 'Sweet Corn',      query: 'corn sweet yellow cooked', price: 35, portion: 50 },
                    { id: 'avocado',  label: 'Avocado',         query: 'avocado raw',         price: 90, portion: 50 },
                    { id: 'pepper',   label: 'Bell Pepper',     query: 'bell pepper red raw', price: 30, portion: 40 }
                ]
            },
            {
                id: 'extras', label: 'Toppings', hint: 'Pick any', mode: 'multi',
                options: [
                    { id: 'feta',     label: 'Feta Cheese', query: 'feta cheese',          price: 70, portion: 30 },
                    { id: 'nuts',     label: 'Almonds',     query: 'almonds raw',          price: 60, portion: 20 },
                    { id: 'seeds',    label: 'Sunflower Seeds', query: 'sunflower seeds raw', price: 45, portion: 15 },
                    { id: 'croutons', label: 'Croutons',    query: 'croutons plain',       price: 35, portion: 20 },
                    { id: 'cranberry',label: 'Cranberries', query: 'dried cranberries',    price: 40, portion: 20 }
                ]
            },
            {
                id: 'dressing', label: 'Dressing', hint: 'Pick 1', mode: 'single',
                options: [
                    { id: 'ranch',    label: 'Ranch',           query: 'ranch dressing',           price: 30, portion: 30 },
                    { id: 'caesar',   label: 'Caesar',          query: 'caesar dressing',          price: 30, portion: 30 },
                    { id: 'olive',    label: 'Olive Oil & Lemon', query: 'olive oil',              price: 25, portion: 15 },
                    { id: 'balsamic', label: 'Balsamic Vinaigrette', query: 'balsamic vinaigrette dressing', price: 30, portion: 30 },
                    { id: 'honey',    label: 'Honey Mustard',   query: 'honey mustard dressing',   price: 35, portion: 30 }
                ]
            }
        ]
    };

    const PIZZA_CONFIG = {
        title: 'Custom Pizza',
        subtitle: 'Build your dream slice — USDA nutrition live',
        basePrice: 299,
        steps: [
            {
                id: 'crust', label: 'Crust', hint: 'Pick 1', mode: 'single',
                options: [
                    { id: 'thin',    label: 'Thin Crust',      query: 'pizza crust thin',  price: 50,  portion: 80  },
                    { id: 'regular', label: 'Regular Hand-Tossed', query: 'pizza dough',  price: 70,  portion: 100 },
                    { id: 'cheesy',  label: 'Cheese Burst',    query: 'pizza crust cheese stuffed', price: 130, portion: 110 },
                    { id: 'wheat',   label: 'Whole Wheat',     query: 'whole wheat bread',         price: 80,  portion: 100 }
                ]
            },
            {
                id: 'sauce', label: 'Sauce', hint: 'Pick 1', mode: 'single',
                options: [
                    { id: 'tomato', label: 'Classic Tomato',  query: 'tomato pizza sauce',  price: 20, portion: 60 },
                    { id: 'bbq',    label: 'BBQ',             query: 'barbecue sauce',      price: 35, portion: 50 },
                    { id: 'pesto',  label: 'Pesto',           query: 'pesto sauce',         price: 50, portion: 40 },
                    { id: 'white',  label: 'White Garlic',    query: 'alfredo sauce',       price: 45, portion: 50 }
                ]
            },
            {
                id: 'cheese', label: 'Cheese', hint: 'Pick 1', mode: 'single',
                options: [
                    { id: 'mozz',     label: 'Mozzarella',     query: 'mozzarella cheese',     price: 80,  portion: 60 },
                    { id: 'cheddar',  label: 'Cheddar Mix',    query: 'cheddar cheese',        price: 90,  portion: 60 },
                    { id: 'parmesan', label: 'Parmesan Blend', query: 'parmesan cheese',      price: 100, portion: 40 },
                    { id: 'vegan',    label: 'Vegan Cheese',   query: 'vegan cheese',          price: 110, portion: 50 }
                ]
            },
            {
                id: 'veggies', label: 'Veg Toppings', hint: 'Pick any', mode: 'multi',
                options: [
                    { id: 'mushroom', label: 'Mushroom',       query: 'mushrooms raw',     price: 35, portion: 40 },
                    { id: 'capsicum', label: 'Bell Pepper',    query: 'bell pepper green raw', price: 30, portion: 40 },
                    { id: 'olives',   label: 'Black Olives',   query: 'olives black',      price: 45, portion: 30 },
                    { id: 'onion',    label: 'Onion',          query: 'onion raw',         price: 20, portion: 30 },
                    { id: 'jalapeno', label: 'Jalapeño',       query: 'jalapeno peppers',  price: 30, portion: 20 },
                    { id: 'tomato',   label: 'Sun-dried Tomato', query: 'sun dried tomato', price: 50, portion: 25 },
                    { id: 'corn',     label: 'Sweet Corn',     query: 'corn sweet yellow cooked', price: 30, portion: 40 },
                    { id: 'spinach',  label: 'Spinach',        query: 'spinach raw',       price: 30, portion: 30 }
                ]
            },
            {
                id: 'meat', label: 'Non-Veg Toppings', hint: 'Pick any (optional)', mode: 'multi',
                options: [
                    { id: 'pepperoni', label: 'Pepperoni',  query: 'pepperoni',          price: 80,  portion: 30 },
                    { id: 'chicken',   label: 'Grilled Chicken', query: 'chicken breast grilled', price: 90, portion: 50 },
                    { id: 'sausage',   label: 'Italian Sausage', query: 'italian sausage cooked', price: 90, portion: 40 },
                    { id: 'bacon',     label: 'Bacon',       query: 'bacon cooked',       price: 100, portion: 25 },
                    { id: 'ham',       label: 'Ham',         query: 'ham sliced',         price: 85,  portion: 30 }
                ]
            },
            {
                id: 'extras', label: 'Finishing Touch', hint: 'Pick any', mode: 'multi',
                options: [
                    { id: 'oregano',  label: 'Oregano',        query: 'oregano dried',     price: 0,  portion: 2  },
                    { id: 'chili',    label: 'Chili Flakes',   query: 'red chili pepper flakes', price: 0, portion: 2 },
                    { id: 'basil',    label: 'Fresh Basil',    query: 'basil fresh',       price: 15, portion: 5  },
                    { id: 'garlic',   label: 'Garlic Drizzle', query: 'garlic raw',        price: 20, portion: 5  }
                ]
            }
        ]
    };

    /* -------- USDA API FETCH --------
       Returns nutrition scaled to the ingredient's portion size.
       Falls back gracefully if the API is rate-limited or offline.
    */
    async function fetchNutrition(ingredient) {
        const cacheKey = ingredient.id;
        if (nutritionCache.has(cacheKey)) {
            return nutritionCache.get(cacheKey);
        }

        const url = `${USDA_BASE}?api_key=${USDA_API_KEY}` +
                    `&query=${encodeURIComponent(ingredient.query)}` +
                    `&pageSize=1&dataType=Foundation,SR%20Legacy,Survey%20%28FNDDS%29`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`USDA HTTP ${res.status}`);
            const data = await res.json();

            if (!data.foods || data.foods.length === 0) {
                throw new Error('No USDA match');
            }

            const food = data.foods[0];
            // USDA nutrient numbers we care about:
            //   1008 = Energy (kcal)
            //   1003 = Protein (g)
            //   1005 = Carbohydrate (g)
            //   1004 = Total Fat (g)
            //   1079 = Fiber (g)
            const nutrMap = { 1008: 0, 1003: 0, 1005: 0, 1004: 0, 1079: 0 };
            (food.foodNutrients || []).forEach(n => {
                if (n.nutrientId in nutrMap) {
                    nutrMap[n.nutrientId] = n.value || 0;
                }
            });

            // Values from USDA are typically per 100g. Scale to portion.
            const scale = (ingredient.portion || 100) / 100;
            const scaled = {
                calories: nutrMap[1008] * scale,
                protein:  nutrMap[1003] * scale,
                carbs:    nutrMap[1005] * scale,
                fat:      nutrMap[1004] * scale,
                fiber:    nutrMap[1079] * scale,
                source:   'usda'
            };

            nutritionCache.set(cacheKey, scaled);
            return scaled;
        } catch (err) {
            console.warn(`USDA fetch failed for "${ingredient.query}":`, err.message);
            // Reasonable rough fallback (not used if API works)
            const fallback = {
                calories: 50, protein: 2, carbs: 5, fat: 2, fiber: 1,
                source: 'estimate'
            };
            nutritionCache.set(cacheKey, fallback);
            return fallback;
        }
    }

    /* -------- BUILDER STATE -------- */
    let activeConfig = null;
    let activeType = null;         // 'salad' | 'pizza'
    let selections = {};           // { stepId: Set(optionIds) }
    let aggregateNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    let aggregatePrice = 0;
    let pendingFetches = 0;
    let usingFallback = false;

    /* -------- DOM REFS -------- */
    const overlay      = document.getElementById('builderOverlay');
    const panel        = document.getElementById('builderPanel');
    const titleEl      = document.getElementById('builderTitle');
    const subEl        = document.getElementById('builderSub');
    const stepsWrap    = document.getElementById('builderSteps');
    const selectedEl   = document.getElementById('builderSelected');
    const nutrGrid     = document.getElementById('builderNutrGrid');
    const nutrSource   = document.getElementById('builderNutrSource');
    const priceEl      = document.getElementById('builderPrice');
    const addBtn       = document.getElementById('builderAddBtn');
    const resetBtn     = document.getElementById('builderReset');
    const closeBtn     = document.getElementById('builderClose');
    const nameInput    = document.getElementById('builderName');

    if (!overlay || !panel) return; // safety net if HTML missing

    /* -------- OPEN / CLOSE -------- */
    function openBuilder(type) {
        activeType = type;
        activeConfig = (type === 'salad') ? SALAD_CONFIG : PIZZA_CONFIG;
        selections = {};
        activeConfig.steps.forEach(s => selections[s.id] = new Set());
        aggregateNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        aggregatePrice = activeConfig.basePrice;
        usingFallback = false;
        if (nameInput) nameInput.value = '';

        titleEl.textContent = activeConfig.title;
        subEl.textContent   = activeConfig.subtitle;
        renderSteps();
        renderSummary();

        overlay.classList.add('active');
        panel.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBuilder() {
        overlay.classList.remove('active');
        panel.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* -------- RENDER -------- */
    function renderSteps() {
        stepsWrap.innerHTML = activeConfig.steps.map((step, i) => `
            <div class="builder-step" data-step="${step.id}">
                <div class="builder-step-header">
                    <span class="builder-step-num">${i + 1}</span>
                    <h4 class="builder-step-title">${step.label}</h4>
                    <span class="builder-step-hint">${step.hint}</span>
                </div>
                <div class="builder-chips">
                    ${step.options.map(opt => `
                        <button type="button"
                                class="builder-chip"
                                data-step-id="${step.id}"
                                data-opt-id="${opt.id}">
                            <span>${opt.label}</span>
                            ${opt.price > 0 ? `<span class="chip-price">+₹${opt.price}</span>` : ''}
                            <span class="chip-check"><i class="fas fa-check"></i></span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Wire chip clicks
        stepsWrap.querySelectorAll('.builder-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const stepId = chip.dataset.stepId;
                const optId  = chip.dataset.optId;
                handleChipToggle(stepId, optId, chip);
            });
        });
    }

    function handleChipToggle(stepId, optId, chipEl) {
        const step = activeConfig.steps.find(s => s.id === stepId);
        if (!step) return;
        const selSet = selections[stepId];

        if (step.mode === 'single') {
            // Clear any previously selected chip in this step
            const allChips = stepsWrap.querySelectorAll(`[data-step-id="${stepId}"]`);
            allChips.forEach(c => c.classList.remove('selected'));

            if (selSet.has(optId)) {
                selSet.clear();
            } else {
                selSet.clear();
                selSet.add(optId);
                chipEl.classList.add('selected');
            }
        } else {
            // multi
            if (selSet.has(optId)) {
                selSet.delete(optId);
                chipEl.classList.remove('selected');
            } else {
                selSet.add(optId);
                chipEl.classList.add('selected');
            }
        }

        recalcAll();
    }

    /* -------- RECALCULATE NUTRITION + PRICE -------- */
    async function recalcAll() {
        // Reset price + nutrition, then re-add base and every selected ingredient
        aggregatePrice = activeConfig.basePrice;
        aggregateNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        usingFallback = false;

        const selectedIngredients = [];
        activeConfig.steps.forEach(step => {
            step.options.forEach(opt => {
                if (selections[step.id].has(opt.id)) {
                    selectedIngredients.push({ step, opt });
                }
            });
        });

        // Update price immediately (synchronous)
        selectedIngredients.forEach(({ opt }) => { aggregatePrice += opt.price; });

        renderSummary(true /* nutritionLoading */);

        // Fetch nutrition (cached after first call)
        pendingFetches = selectedIngredients.length;
        if (pendingFetches === 0) {
            renderSummary(false);
            return;
        }

        const results = await Promise.all(
            selectedIngredients.map(({ opt }) => fetchNutrition(opt))
        );

        results.forEach(n => {
            aggregateNutrition.calories += n.calories;
            aggregateNutrition.protein  += n.protein;
            aggregateNutrition.carbs    += n.carbs;
            aggregateNutrition.fat      += n.fat;
            aggregateNutrition.fiber    += n.fiber;
            if (n.source === 'estimate') usingFallback = true;
        });

        renderSummary(false);
    }

    function renderSummary(nutritionLoading = false) {
        // Selected items breakdown
        const groups = activeConfig.steps.map(step => {
            const picked = step.options.filter(o => selections[step.id].has(o.id));
            if (picked.length === 0) return null;
            return `
                <div class="builder-selected-group">
                    <strong>${step.label}</strong>
                    <span>${picked.map(p => p.label).join(', ')}</span>
                </div>`;
        }).filter(Boolean);

        selectedEl.innerHTML = groups.length === 0
            ? '<p class="builder-empty">No items selected yet.</p>'
            : groups.join('');

        // Price (base + ingredient adds)
        priceEl.textContent = `₹${Math.round(aggregatePrice)}`;

        // Nutrition pills
        const n = aggregateNutrition;
        nutrGrid.innerHTML = `
            <div class="bnutr-pill cal"><span>Calories</span><strong>${Math.round(n.calories)}</strong></div>
            <div class="bnutr-pill prot"><span>Protein</span><strong>${Math.round(n.protein)}g</strong></div>
            <div class="bnutr-pill carb"><span>Carbs</span><strong>${Math.round(n.carbs)}g</strong></div>
            <div class="bnutr-pill fat"><span>Fat</span><strong>${Math.round(n.fat)}g</strong></div>
            <div class="bnutr-pill fiber"><span>Fiber</span><strong>${Math.round(n.fiber)}g</strong></div>
        `;

        // Source indicator
        if (nutritionLoading) {
            nutrSource.innerHTML = '<i class="fas fa-spinner"></i> fetching USDA…';
            nutrSource.classList.add('loading');
        } else {
            nutrSource.classList.remove('loading');
            if (usingFallback) {
                nutrSource.innerHTML = '<i class="fas fa-circle-info"></i> estimated (USDA unavailable)';
                nutrSource.style.color = 'var(--gray)';
            } else {
                nutrSource.innerHTML = '<i class="fas fa-leaf"></i> live USDA data';
                nutrSource.style.color = '';
            }
        }

        // Validate "ready to add"
        const requiredSteps = activeConfig.steps.filter(s => s.mode === 'single' && s.hint.includes('Pick 1'));
        // A meal is valid when ≥1 ingredient is picked overall
        const totalPicked = Object.values(selections).reduce((acc, set) => acc + set.size, 0);
        addBtn.disabled = totalPicked === 0;
    }

    /* -------- ADD TO CART --------
       We reuse the existing global `cart` and `updateCartUI`/`openCart`/`showToast`
       helpers that live earlier in this file.
    */
    function addBuiltMealToCart() {
        const totalPicked = Object.values(selections).reduce((acc, set) => acc + set.size, 0);
        if (totalPicked === 0) return;

        // Build a unique cart id so multiple custom meals coexist
        const cartId = `custom-${activeType}-${Date.now()}`;

        // Compose a name
        const customName = (nameInput && nameInput.value.trim()) ||
            `Custom ${activeType === 'salad' ? 'Salad Bowl' : 'Pizza'}`;

        // Description: list ingredients
        const ingredientsList = activeConfig.steps
            .map(step => {
                const picked = step.options.filter(o => selections[step.id].has(o.id));
                return picked.length ? `${step.label}: ${picked.map(p => p.label).join(', ')}` : null;
            })
            .filter(Boolean)
            .join(' | ');

        // Default image based on type
        const image = activeType === 'salad'
            ? 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
            : 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400';

        // Push directly into the existing global cart
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart.push({
                id: cartId,
                name: customName,
                price: Math.round(aggregatePrice),
                image,
                qty: 1,
                isCustom: true,
                description: ingredientsList,
                nutrition: {
                    calories: Math.round(aggregateNutrition.calories),
                    protein:  Math.round(aggregateNutrition.protein),
                    carbs:    Math.round(aggregateNutrition.carbs),
                    fat:      Math.round(aggregateNutrition.fat),
                    fiber:    Math.round(aggregateNutrition.fiber)
                }
            });
            if (typeof updateCartUI === 'function') updateCartUI();
            const cartCountEl = document.getElementById('cartCount');
            if (cartCountEl) {
                cartCountEl.classList.remove('bump');
                void cartCountEl.offsetWidth;
                cartCountEl.classList.add('bump');
            }
            if (typeof showToast === 'function') showToast(`${customName} added to cart!`);
            closeBuilder();
            if (typeof openCart === 'function') openCart();
        } else {
            // Fallback if cart variable isn't in scope for some reason
            alert(`Added ${customName} (₹${Math.round(aggregatePrice)}) to your order.`);
            closeBuilder();
        }
    }

    /* -------- WIRE-UP EVENT LISTENERS -------- */
    function initBuilder() {
        // Section cards
        document.querySelectorAll('[data-build-start]').forEach(btn => {
            btn.addEventListener('click', () => openBuilder(btn.dataset.buildStart));
        });

        // Close
        closeBtn.addEventListener('click', closeBuilder);
        overlay.addEventListener('click', closeBuilder);

        // Reset
        resetBtn.addEventListener('click', () => {
            if (!activeConfig) return;
            Object.values(selections).forEach(set => set.clear());
            stepsWrap.querySelectorAll('.builder-chip.selected')
                .forEach(c => c.classList.remove('selected'));
            if (nameInput) nameInput.value = '';
            aggregatePrice = activeConfig.basePrice;
            aggregateNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
            renderSummary();
        });

        // Add to cart
        addBtn.addEventListener('click', addBuiltMealToCart);

        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('active')) {
                closeBuilder();
            }
        });
    }

    // Defer until DOM is ready (script may already be at end of body, but be safe)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBuilder);
    } else {
        initBuilder();
    }
})();



/* ============================================================
   MESSAGE WORD COUNTER — 120 word limit on contact form
   ============================================================ */
(function setupMessageWordCounter() {
    function init() {
        const messageEl = document.getElementById('message');
        const countEl   = document.getElementById('messageWordCount');
        const wrapEl    = document.getElementById('messageWordCounter');
        if (!messageEl || !countEl || !wrapEl) return;
        const WORD_LIMIT = 120;

        function countWords(text) {
            const trimmed = text.trim();
            return trimmed ? trimmed.split(/\s+/).length : 0;
        }
        function trimToWordLimit(text, limit) {
            const words = text.trim().split(/\s+/);
            if (words.length <= limit) return text;
            return words.slice(0, limit).join(' ') + ' ';
        }
        function update() {
            let words = countWords(messageEl.value);
            if (words > WORD_LIMIT) {
                messageEl.value = trimToWordLimit(messageEl.value, WORD_LIMIT);
                words = WORD_LIMIT;
            }
            countEl.textContent = words;
            wrapEl.classList.remove('warning', 'limit');
            if (words >= WORD_LIMIT) wrapEl.classList.add('limit');
            else if (words >= WORD_LIMIT * 0.85) wrapEl.classList.add('warning');
        }
        messageEl.addEventListener('input', update);
        messageEl.addEventListener('paste', function () { setTimeout(update, 0); });
        update();

        // Hook into contact form submit to block over-limit
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', function (e) {
                const w = countWords(messageEl.value);
                if (w > WORD_LIMIT) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    messageEl.classList.add('error');
                    if (typeof showToast === 'function') {
                        showToast('Message must be 120 words or fewer.', true);
                    }
                }
            }, true); // capture phase so we run before other handlers
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();