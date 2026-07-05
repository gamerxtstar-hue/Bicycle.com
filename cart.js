<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Your Cart — BYCYCLE</title>
<meta name="description" content="Review your BYCYCLE order before checkout.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230A0A0C'/%3E%3Ccircle cx='9' cy='22' r='5' stroke='%23B6FF3C' stroke-width='2' fill='none'/%3E%3Ccircle cx='23' cy='22' r='5' stroke='%23B6FF3C' stroke-width='2' fill='none'/%3E%3Cpath d='M9 22l6-11h5l3 11M15 11l3 5' stroke='%23E4E7EC' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<style>
.cart-hero{padding:150px 0 40px;}
.cart-layout{display:grid;grid-template-columns:1.6fr 1fr;gap:48px;align-items:start;padding-bottom:120px;}
.cart-items{border-top:1px solid var(--border);}
.cart-row{display:grid;grid-template-columns:70px 1fr auto auto auto;gap:20px;align-items:center;padding:24px 0;border-bottom:1px solid var(--border);}
.cart-thumb{width:70px;height:70px;border-radius:12px;background:var(--bg-1);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;}
.cart-thumb svg{width:46px;}
.cart-name{font-family:var(--font-display);font-size:1.02rem;font-weight:700;margin-bottom:4px;}
.cart-meta{font-size:.8rem;color:var(--text-dim);}
.cart-meta button{color:var(--text-dim);text-decoration:underline;margin-top:6px;font-size:.78rem;}
.cart-meta button:hover{color:#ff6b6b;}
.cart-qty{display:flex;align-items:center;border:1px solid var(--border-strong);border-radius:10px;overflow:hidden;height:38px;}
.cart-qty button{width:34px;height:100%;background:var(--surface);color:var(--text);}
.cart-qty span{width:34px;text-align:center;font-family:var(--font-mono);font-size:.85rem;}
.cart-price{font-family:var(--font-mono);font-weight:600;white-space:nowrap;}
.summary-card{border:1px solid var(--border);border-radius:18px;padding:32px;background:var(--surface);position:sticky;top:120px;}
.summary-row{display:flex;justify-content:space-between;padding:10px 0;font-size:.92rem;color:var(--text-muted);}
.summary-row.total{border-top:1px solid var(--border);margin-top:10px;padding-top:18px;font-size:1.15rem;color:var(--text);font-weight:700;font-family:var(--font-display);}
.promo-row{display:flex;gap:10px;margin:20px 0;}
.promo-row input{flex:1;padding:11px 14px;border-radius:10px;background:var(--bg-1);border:1px solid var(--border-strong);color:var(--text);font-size:.85rem;}
.empty-cart{text-align:center;padding:100px 0;}
.empty-cart svg{margin:0 auto 20px;color:var(--text-dim);}
@media (max-width:900px){
  .nav-links,.nav-cta .btn{display:none;}
  .nav-toggle{display:flex;}
  .cart-layout{grid-template-columns:1fr;}
  .cart-row{grid-template-columns:56px 1fr;grid-template-areas:"thumb name" "thumb qty" "thumb price";row-gap:10px;}
  .cart-thumb{grid-area:thumb;}
  .summary-card{position:static;}
}
</style>
</head>
<body>

<a href="#main" class="skip-link">Skip to content</a>
<div class="bg-fixed" aria-hidden="true"></div>

<header class="nav" id="nav">
  <div class="container">
    <a href="index.html" class="logo" aria-label="BYCYCLE home">BYCYCLE<span>.</span></a>
    <nav class="nav-links" aria-label="Primary">
      <a href="shop.html">Shop</a>
      <a href="index.html#tech">Technology</a>
      <a href="index.html#why">Why Us</a>
      <a href="contact.html">Contact</a>
    </nav>
    <div class="nav-cta">
      <a href="cart.html" class="cart-icon" aria-label="Cart">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.4a2 2 0 002 1.6h8.2a2 2 0 002-1.6L21 8H6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>
        <span class="cart-badge">0</span>
      </a>
      <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false"><span></span></button>
  </div>
</header>

<div class="mobile-panel" id="mobilePanel">
  <a href="shop.html">Shop</a>
  <a href="index.html#tech">Technology</a>
  <a href="index.html#why">Why Us</a>
  <a href="contact.html">Contact</a>
  <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
</div>

<main id="main">
  <section class="cart-hero">
    <div class="container">
      <div class="eyebrow">Step 1 of 2</div>
      <h1 style="font-size:clamp(2rem,4vw,2.8rem);">Your Cart</h1>
    </div>
  </section>

  <section style="padding-top:20px;">
    <div class="container" id="cartContainer">
      <!-- filled by JS -->
    </div>
  </section>
</main>

<footer>
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="index.html" class="logo">BYCYCLE<span>.</span></a>
        <p>Precision bicycles with aerospace-grade alloy frames and a hand-finished metallic black shell.</p>
      </div>
      <div class="footer-col">
        <h5>Shop</h5>
        <ul><li><a href="product.html?id=urban">Urban</a></li><li><a href="product.html?id=trail">Trail</a></li><li><a href="product.html?id=race">Race</a></li><li><a href="product.html?id=fold">Fold</a></li></ul>
      </div>
      <div class="footer-col">
        <h5>Company</h5>
        <ul><li><a href="index.html#why">Why Us</a></li><li><a href="index.html#tech">Technology</a></li><li><a href="contact.html">Contact</a></li></ul>
      </div>
      <div class="footer-col">
        <h5>Support</h5>
        <ul><li><a href="mailto:purchase@bycycle.com">purchase@bycycle.com</a></li><li><a href="tel:+14155550142">+1 (415) 555-0142</a></li></ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 BYCYCLE. All rights reserved.</p>
      <div class="legal"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>
    </div>
  </div>
</footer>

<script src="catalog.js"></script>
<script src="cart.js"></script>
<script>
(function(){
  "use strict";
  var SHIPPING_THRESHOLD = 0; // free shipping always, matches product copy
  var TAX_RATE = 0.0;         // demo store — no tax engine; shown as $0.00 for clarity

  function money(n){ return '$' + n.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}); }

  function iconFor(id){
    var p = CATALOG[id];
    return p ? p.icon : '';
  }

  function render(){
    var items = Cart.getItems();
    var container = document.getElementById('cartContainer');

    if(items.length === 0){
      container.innerHTML =
        '<div class="empty-cart reveal in">' +
          '<svg width="56" height="56" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.4a2 2 0 002 1.6h8.2a2 2 0 002-1.6L21 8H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>' +
          '<h3 style="margin-bottom:10px;">Your cart is empty</h3>' +
          '<p style="margin-bottom:28px;">Looks like you haven\'t added a Blackline yet.</p>' +
          '<a href="shop.html" class="btn btn-primary">Browse the Collection <span class="btn-arrow">→</span></a>' +
        '</div>';
      return;
    }

    var rows = items.map(function(item){
      var meta = [];
      if(item.size) meta.push('Size: ' + item.size);
      if(item.color) meta.push('Finish: ' + item.color);
      return (
        '<div class="cart-row reveal in" data-key="' + item.key + '">' +
          '<div class="cart-thumb"><svg viewBox="0 0 200 90" fill="none">' + iconFor(item.id) + '</svg></div>' +
          '<div>' +
            '<div class="cart-name">' + item.name + '</div>' +
            '<div class="cart-meta">' + meta.join(' · ') + '</div>' +
            '<button type="button" class="remove-btn" data-key="' + item.key + '">Remove</button>' +
          '</div>' +
          '<div class="cart-qty">' +
            '<button type="button" class="qty-dec" data-key="' + item.key + '">−</button>' +
            '<span>' + item.qty + '</span>' +
            '<button type="button" class="qty-inc" data-key="' + item.key + '">+</button>' +
          '</div>' +
          '<div class="cart-price">' + money(item.price * item.qty) + '</div>' +
        '</div>'
      );
    }).join('');

    var subtotal = Cart.subtotal();
    var tax = subtotal * TAX_RATE;
    var total = subtotal + tax;

    container.innerHTML =
      '<div class="cart-layout">' +
        '<div class="cart-items">' + rows + '</div>' +
        '<div class="summary-card reveal in">' +
          '<h3 style="margin-bottom:20px;">Order Summary</h3>' +
          '<div class="summary-row"><span>Subtotal</span><span>' + money(subtotal) + '</span></div>' +
          '<div class="summary-row"><span>Shipping</span><span>Free</span></div>' +
          '<div class="summary-row"><span>Estimated tax</span><span>' + money(tax) + '</span></div>' +
          '<div class="summary-row total"><span>Total</span><span>' + money(total) + '</span></div>' +
          '<a href="checkout.html" class="btn btn-primary" style="width:100%;margin-top:22px;justify-content:center;">Proceed to Checkout <span class="btn-arrow">→</span></a>' +
          '<p style="font-size:.76rem;color:var(--text-dim);margin-top:14px;">Free worldwide shipping · 30-day test ride · Lifetime frame warranty</p>' +
        '</div>' +
      '</div>';

    container.querySelectorAll('.qty-inc').forEach(function(btn){
      btn.addEventListener('click', function(){
        var item = items.find(function(i){ return i.key === btn.dataset.key; });
        Cart.setQty(item.key, item.qty + 1);
        render();
      });
    });
    container.querySelectorAll('.qty-dec').forEach(function(btn){
      btn.addEventListener('click', function(){
        var item = items.find(function(i){ return i.key === btn.dataset.key; });
        Cart.setQty(item.key, item.qty - 1);
        render();
      });
    });
    container.querySelectorAll('.remove-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        Cart.removeItem(btn.dataset.key);
        render();
      });
    });
  }

  render();

  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY > 30); });
  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('mobilePanel');
  toggle.addEventListener('click', function(){
    var open = panel.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  panel.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ panel.classList.remove('open'); toggle.classList.remove('open'); });
  });
})();
</script>
</body>
</html>
