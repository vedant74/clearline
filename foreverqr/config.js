/*
 * Site configuration. Edit these values, commit, done. No build step.
 * Everything here is public (it ships to the browser), so never put secrets in it.
 */
window.CONFIG = {
  // Product name shown in the header, footer and download filenames.
  // (Also search-and-replace "ForeverQR" in index.html <title>/meta tags for SEO.)
  PRODUCT_NAME: "ForeverQR",

  // Where the "Dynamic codes - pay once" waitlist form POSTs (as FormData: email, source).
  // Works with Formspree / Getform / Basin / a Google Apps Script web app, e.g.
  //   "https://formspree.io/f/abcdwxyz"
  // Leave empty: the form just says "Thanks - coming soon" and stores nothing.
  SIGNUP_ENDPOINT: "",

  // Privacy-friendly analytics snippet, pasted as-is (HTML string). Empty = no analytics.
  // GoatCounter example:
  //   '<script data-goatcounter="https://YOURCODE.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'
  // Plausible example:
  //   '<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>'
  // Custom events sent when available: "generate-download", "generate-copy", "scan-result", "waitlist-signup".
  ANALYTICS_SNIPPET: "",

  // Payment link for pre-ordering dynamic codes (e.g. a Stripe Payment Link or Lemon Squeezy checkout).
  // Empty = the pre-order button is hidden.
  PAYMENT_LINK: "",

  // Contact address shown on the privacy/terms pages and footer. Empty = hidden.
  CONTACT_EMAIL: ""
};
