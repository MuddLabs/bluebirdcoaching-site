/* Loaded in <head>. Marks straight away that JavaScript is running (so the
   "Read more" text is shortened before the page first appears), then sets
   up the page once it has loaded. */
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* ---------- "Read more" on the three services ---------- */

  document.querySelectorAll(".read-more").forEach(function (button) {
    var text = document.getElementById(button.getAttribute("aria-controls"));
    if (!text) return;

    function updateVisibility() {
      var open = text.classList.contains("is-open");
      // Only show the button when the text is actually cut short.
      button.hidden = !open && text.scrollHeight <= text.clientHeight + 1;
    }

    button.addEventListener("click", function () {
      var open = text.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "Read less" : "Read more";
    });

    updateVisibility();
    window.addEventListener("resize", updateVisibility);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateVisibility);
    }
  });

  /* ---------- Copyright year ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

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
    var subject = "Website enquiry from " + name.value.trim() + (company ? " (" + company + ")" : "");
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
});
