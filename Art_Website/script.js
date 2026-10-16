document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Hero reveal (one entrance moment) ---------- */
  const heroFrame = document.getElementById("heroFrame");
  setTimeout(() => heroFrame.classList.add("revealed"), 150);

  /* ---------- Footer year ---------- */
  document.getElementById("footerYear").textContent = `© ${new Date().getFullYear()} Celeste Norwood`;

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  /* ---------- Smooth scroll for in-page nav links ---------- */
  document.querySelectorAll(".cn-nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      navLinks.classList.remove("open");
      menuBtn.textContent = "☰";
    });
  });

  /* ---------- Inquiry cart ---------- */
  const cart = new Map(); // id -> { title, price }
  const cartCountEls = document.querySelectorAll(".cn-cart-count");
  const cartPanel = document.getElementById("cartPanel");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartTotalAmountEl = document.getElementById("cartTotalAmount");
  const cartActionEl = document.getElementById("cartAction");
  const cartFab = document.getElementById("cartFab");
  const cartTabTop = document.getElementById("cartTabTop");

  function renderCart() {
    cartCountEls.forEach((el) => (el.textContent = cart.size));

    if (cart.size === 0) {
      cartItemsEl.innerHTML = `<p class="cn-cart-empty">No pieces selected yet.</p>`;
      cartTotalEl.hidden = true;
      cartActionEl.hidden = true;
      return;
    }

    let total = 0;
    cartItemsEl.innerHTML = "";
    cart.forEach(({ title, price }) => {
      total += price;
      const row = document.createElement("div");
      row.className = "cn-cart-item";
      row.innerHTML = `<span>${title}</span><span>$${price.toLocaleString()}</span>`;
      cartItemsEl.appendChild(row);
    });
    cartTotalAmountEl.textContent = `$${total.toLocaleString()}`;
    cartTotalEl.hidden = false;
    cartActionEl.hidden = false;
  }

  function toggleCartPanel(force) {
    const willShow = force !== undefined ? force : cartPanel.hidden;
    cartPanel.hidden = !willShow;
    cartTabTop.setAttribute("aria-expanded", String(willShow));
  }

  cartFab.addEventListener("click", () => toggleCartPanel());
  cartTabTop.addEventListener("click", () => toggleCartPanel());

  document.querySelectorAll(".cn-card").forEach((card) => {
    const btn = card.querySelector(".cn-add-btn");
    if (!btn || btn.disabled) return; // sold pieces have no working button
    const { id, title, price } = card.dataset;
    btn.addEventListener("click", () => {
      if (cart.has(id)) {
        cart.delete(id);
        btn.textContent = "Add to inquiry";
        btn.classList.remove("added");
      } else {
        cart.set(id, { title, price: Number(price) });
        btn.textContent = "Added ✓";
        btn.classList.add("added");
      }
      renderCart();
    });
  });

  /* ---------- "Continue to inquiry form" ---------- */
  const messageEl = document.getElementById("message");
  const reasonEl = document.getElementById("reason");
  document.getElementById("continueToForm").addEventListener("click", () => {
    reasonEl.value = "Purchase inquiry";
    const lines = Array.from(cart.values())
      .map((w) => `• ${w.title} — $${w.price.toLocaleString()}`)
      .join("\n");
    messageEl.value = `I'd like to ask about:\n${lines}\n`;
    toggleCartPanel(false);
    document.getElementById("contact").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ---------- Contact form submit (front-end only) ---------- */
  const form = document.getElementById("contactForm");
  const confirmEl = document.getElementById("confirm");
  const confirmNameEl = document.getElementById("confirmName");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    if (!nameEl.value || !emailEl.value) return;

    confirmNameEl.textContent = `Thank you, ${nameEl.value.split(" ")[0]}.`;
    form.hidden = true;
    confirmEl.hidden = false;
  });
});
