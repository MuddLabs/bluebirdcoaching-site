/* Loaded with defer, so the page has been read before this runs.
   Sets the copyright year, shows the sticky bar and handles the contact form. */
(function () {
  "use strict";

  /* ---------- Copyright year ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Sticky bar ---------- */

  // Shows the slim bar while the header is off screen. The browser reports
  // when that changes, so nothing runs during scrolling. Browsers too old to
  // report it never show the bar, and the page works the same without it.
  var masthead = document.querySelector(".masthead");
  var topbar = document.querySelector(".topbar");

  if (masthead && topbar && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      topbar.classList.toggle("is-visible", !entries[0].isIntersecting);
    }).observe(masthead);
  }

  /* ---------- Contact form ---------- */

  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = form.querySelector(".form-status");
  var field = function (name) { return form.elements.namedItem(name); };

  form.addEventListener("submit", function (event) {
    var name = field("name");
    var email = field("email");
    var missing = [];

    name.removeAttribute("aria-invalid");
    email.removeAttribute("aria-invalid");

    if (!name.value.trim()) {
      missing.push("your name");
      name.setAttribute("aria-invalid", "true");
    }
    if (!email.value.trim() || !email.checkValidity()) {
      missing.push("a valid email address");
      email.setAttribute("aria-invalid", "true");
    }

    if (missing.length) {
      event.preventDefault();
      status.classList.add("is-error");
      status.textContent = "Please enter " + missing.join(" and ") + ".";
      (name.hasAttribute("aria-invalid") ? name : email).focus();
      return;
    }

    status.classList.remove("is-error");

    // If a form service URL has been set as the form's action, submit to it normally.
    if (form.getAttribute("action")) return;

    // Otherwise open the visitor's email app with the message filled in.
    event.preventDefault();
    var to = form.getAttribute("data-email");
    var company = field("company").value.trim();
    var subject = "Website inquiry from " + name.value.trim() + (company ? " (" + company + ")" : "");
    var body = [
      "Name: " + name.value.trim(),
      "Company: " + (company || "-"),
      "Email: " + email.value.trim(),
      "",
      field("message").value.trim()
    ].join("\r\n");

    window.location.href =
      "mailto:" + to +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    status.textContent =
      "Your email app should now open with your message ready to send. " +
      "If it doesn’t, please email us at " + to + ".";
  });
})();
