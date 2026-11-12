/* Edible Hope Kitchen — small site behaviors. No dependencies. */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     SETTINGS — edit these two values when you set up the services.
     ------------------------------------------------------------------ */
  var CONFIG = {
    // Where the "Donate online" buttons send people (Zeffy, Givebutter,
    // PayPal Giving Fund, St. Luke's giving page, etc.).
    donateUrl: "https://www.ediblehopekitchen.org/donate",
    // Email used as a fallback for the newsletter form until Mailchimp is connected.
    contactEmail: "meals@stlukesseattle.org"
  };

  /* ---------- Donate links ---------- */
  document.querySelectorAll("[data-donate-link]").forEach(function (a) {
    a.href = CONFIG.donateUrl;
  });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- "Open now" sign (Seattle time, Mon–Fri 8–10 AM) ---------- */
  var signs = document.querySelectorAll("[data-open-sign]");
  function seattleNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
    }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var hour = parseInt(get("hour"), 10) % 24;
    return { day: days[get("weekday")], minutes: hour * 60 + parseInt(get("minute"), 10) };
  }
  function updateSigns() {
    var n = seattleNow();
    var weekday = n.day >= 1 && n.day <= 5;
    var open = weekday && n.minutes >= 480 && n.minutes < 600;
    var status, detail;
    if (open) {
      var left = 600 - n.minutes;
      status = "Open now";
      detail = left <= 30 ? "Breakfast is served until 10 AM. Last call in " + left + " minutes." : "Breakfast is served until 10 AM. Come on in.";
    } else if (weekday && n.minutes < 480) {
      status = "Opens today at 8 AM";
      detail = "Free hot breakfast, 8–10 AM. Everyone is welcome.";
    } else {
      var next = (n.day === 5 || n.day === 6) ? "Monday" : (n.day === 0 ? "tomorrow (Monday)" : "tomorrow");
      status = "Closed now";
      detail = "We open " + next + " at 8 AM. Free hot breakfast every weekday.";
    }
    signs.forEach(function (s) {
      s.classList.toggle("is-open", open);
      s.querySelector(".status").textContent = status;
      s.querySelector(".detail").textContent = detail;
    });
  }
  if (signs.length) { updateSigns(); setInterval(updateSigns, 60000); }

  /* ---------- Newsletter form fallback ----------
     Until the Mailchimp form URL is pasted into the form's action attribute,
     submitting opens an email to the kitchen instead of failing silently. */
  document.querySelectorAll(".signup-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      var email = form.querySelector('input[type="email"]');
      var msg = form.querySelector(".form-msg");
      if (!email.value || !email.checkValidity()) {
        e.preventDefault();
        if (msg) msg.textContent = "Enter an email address like name@example.com.";
        email.focus();
        return;
      }
      if (form.getAttribute("action").indexOf("REPLACE_WITH") !== -1) {
        e.preventDefault();
        window.location.href = "mailto:" + CONFIG.contactEmail +
          "?subject=" + encodeURIComponent("Please add me to the Edible Hope newsletter") +
          "&body=" + encodeURIComponent("Please add " + email.value + " to the monthly newsletter.");
        if (msg) msg.textContent = "Your email app should open with a signup message ready to send.";
      }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var gallery = document.querySelector("[data-gallery]");
  var dialog = document.getElementById("lightbox");
  if (gallery && dialog && dialog.showModal) {
    var buttons = Array.prototype.slice.call(gallery.querySelectorAll("button"));
    var img = dialog.querySelector("img");
    var count = dialog.querySelector(".lb-count");
    var index = 0;
    var show = function (i) {
      index = (i + buttons.length) % buttons.length;
      var b = buttons[index];
      img.src = b.dataset.full;
      img.alt = b.querySelector("img").alt;
      count.textContent = "Photo " + (index + 1) + " of " + buttons.length;
    };
    buttons.forEach(function (b, i) {
      b.addEventListener("click", function () { show(i); dialog.showModal(); });
    });
    dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });
    dialog.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
    dialog.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
    dialog.addEventListener("click", function (e) { if (e.target.classList.contains("lightbox-inner")) dialog.close(); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    dialog.addEventListener("close", function () { buttons[index].focus(); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
