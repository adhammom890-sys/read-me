const books = [
  {
    id: 'midnight-library',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 18.99,
    tag: 'Fiction',
    accent: 'linear-gradient(135deg, #b76547, #7c4a34)'
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 16.5,
    tag: 'Self-help',
    accent: 'linear-gradient(135deg, #2a6a6d, #1d4654)'
  },
  {
    id: 'little-prince',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    price: 12.75,
    tag: 'Classic',
    accent: 'linear-gradient(135deg, #d59a3d, #a1651c)'
  },
  {
    id: 'pride-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    price: 14.2,
    tag: 'Classic',
    accent: 'linear-gradient(135deg, #7a6bc2, #3d3675)'
  },
  {
    id: 'four-agreements',
    title: 'The Four Agreements',
    author: 'Don Miguel Ruiz',
    price: 13.89,
    tag: 'Philosophy',
    accent: 'linear-gradient(135deg, #c86d7a, #7d3640)'
  },
  {
    id: 'alchemist',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 15.4,
    tag: 'Adventure',
    accent: 'linear-gradient(135deg, #3f8c67, #234d39)'
  }
];

const filters = ['All', 'Fiction', 'Classic', 'Self-help', 'Adventure', 'Philosophy'];
const state = {
  activeFilter: 'All',
  query: '',
  cart: []
};

const getVisibleBooks = () => {
  return books.filter((book) => {
    const matchesFilter = state.activeFilter === 'All' || book.tag === state.activeFilter;
    const haystack = `${book.title} ${book.author} ${book.tag}`.toLowerCase();
    const matchesQuery = haystack.includes(state.query.toLowerCase());
    return matchesFilter && matchesQuery;
  });
};

const renderFilters = () => {
  const filterContainer = document.getElementById('filters');
  filterContainer.innerHTML = filters
    .map(
      (filter) => `
        <button class="filter-btn ${state.activeFilter === filter ? 'active' : ''}" data-filter="${filter}">
          ${filter}
        </button>
      `
    )
    .join('');
};

const renderBooks = () => {
  const bookGrid = document.getElementById('bookGrid');
  const visibleBooks = getVisibleBooks();

  if (!visibleBooks.length) {
    bookGrid.innerHTML = '<p class="empty-cart">No books matched your search.</p>';
    return;
  }

  bookGrid.innerHTML = visibleBooks
    .map(
      (book) => `
        <article class="book-card">
          <div class="book-cover-small" style="background: ${book.accent};">${book.title.charAt(0)}</div>
          <h3>${book.title}</h3>
          <div class="book-meta">
            <span>${book.author}</span>
            <span class="book-tag">${book.tag}</span>
          </div>
          <div class="book-meta">
            <span class="book-price">$${book.price.toFixed(2)}</span>
          </div>
          <button class="primary-btn small" data-add-book="${book.id}">Add to cart</button>
        </article>
      `
    )
    .join('');
};

const renderCart = () => {
  const cartItems = document.getElementById('cartItems');
  const subtotal = document.getElementById('subtotal');

  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
    subtotal.textContent = '$0.00';
    document.getElementById('cartCount').textContent = '0';
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="mini-cover" style="background: ${item.accent};">${item.title.charAt(0)}</div>
          <div class="cart-item-info">
            <h4>${item.title}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <div class="cart-actions">
              <button class="qty-btn" data-qty="decrease" data-book-id="${item.id}">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" data-qty="increase" data-book-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    )
    .join('');

  subtotal.textContent = `$${total.toFixed(2)}`;
  document.getElementById('cartCount').textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0).toString();
};

const addToCart = (bookId) => {
  const selected = books.find((book) => book.id === bookId);
  if (!selected) return;

  const existingItem = state.cart.find((item) => item.id === bookId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...selected, quantity: 1 });
  }

  renderCart();
  toggleCart(true);
};

const changeQuantity = (bookId, delta) => {
  const item = state.cart.find((entry) => entry.id === bookId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== bookId);
  }

  renderCart();
};

const toggleCart = (isOpen) => {
  document.getElementById('cartPanel').classList.toggle('open', isOpen);
};

document.addEventListener('click', (event) => {
  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) {
    state.activeFilter = filterButton.dataset.filter;
    renderFilters();
    renderBooks();
    return;
  }

  const addBookButton = event.target.closest('[data-add-book]');
  if (addBookButton) {
    addToCart(addBookButton.dataset.addBook);
    return;
  }

  const qtyButton = event.target.closest('[data-qty]');
  if (qtyButton) {
    const delta = qtyButton.dataset.qty === 'increase' ? 1 : -1;
    changeQuantity(qtyButton.dataset.bookId, delta);
    return;
  }

  if (event.target.id === 'cartToggle') {
    toggleCart(true);
    return;
  }

  if (event.target.id === 'closeCart') {
    toggleCart(false);
  }
});

document.getElementById('searchInput').addEventListener('input', (event) => {
  state.query = event.target.value.trim();
  renderBooks();
});

renderFilters();
renderBooks();
renderCart();
