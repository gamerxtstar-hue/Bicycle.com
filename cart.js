/* ============================================================
   BYCYCLE — Cart Engine
   Simple localStorage-backed cart shared across every page.
   Not a payment processor — this is a front-end cart/checkout
   flow suitable for a portfolio/demo storefront.
   ============================================================ */

const Cart = (function () {
  const STORAGE_KEY = 'bycycle_cart_v1';

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadge();
  }

  function getItems() {
    return read();
  }

  function count() {
    return read().reduce((sum, i) => sum + i.qty, 0);
  }

  function subtotal() {
    return read().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function addItem(product, qty, options) {
    qty = qty || 1;
    options = options || {};
    const items = read();
    // treat same product + same size/color combo as the same line item
    const key = product.id + '::' + (options.size || '') + '::' + (options.color || '');
    const existing = items.find((i) => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        key: key,
        id: product.id,
        name: product.name,
        badge: product.badge,
        price: product.price,
        size: options.size || null,
        color: options.color || null,
        qty: qty
      });
    }
    write(items);
  }

  function setQty(key, qty) {
    let items = read();
    if (qty <= 0) {
      items = items.filter((i) => i.key !== key);
    } else {
      const item = items.find((i) => i.key === key);
      if (item) item.qty = qty;
    }
    write(items);
  }

  function removeItem(key) {
    const items = read().filter((i) => i.key !== key);
    write(items);
  }

  function clear() {
    write([]);
  }

  function updateBadge() {
    document.querySelectorAll('.cart-badge').forEach((el) => {
      el.textContent = count();
    });
  }

  document.addEventListener('DOMContentLoaded', updateBadge);

  return {
    getItems, count, subtotal, addItem, setQty, removeItem, clear, updateBadge
  };
})();
