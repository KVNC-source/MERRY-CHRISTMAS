/*
 * --- JAVASCRIPT LOGIC (FINAL STATIC PAGE, STAGGERED TEXT VERSION) ---
 * Handles gift reveal and staggered component fade-in.
 */

// --- IntersectionObserver Core Logic (Handles smooth scroll-in animation) ---
function addScrollObserver(el, options) {
  // Fallback if IntersectionObserver is not supported
  if (!("IntersectionObserver" in window)) {
    el.classList.add("anim-goup");
    return;
  }

  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // When the element comes into view, apply the animation class
        entry.target.classList.add("anim-goup");
        observer.unobserve(entry.target);
      }
    });
  }, options);

  observer.observe(el);
}

// --- Main Document Logic ---
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. STAGGERED PAGE LOAD FADE-IN ---

  // Define the elements to fade in and their order (Sidebar, Heading, Message, etc.)
  const elementsToStagger = [
    document.querySelector(".sidebar"),
    document.querySelector(".main-heading"),
    document.querySelector(".intro-text"),
    document.querySelector(".page-indicator"),
    document.querySelector(".gift-section"),
  ];

  let delay = 100; // Starting delay in milliseconds
  const increment = 150; // Delay increment between each item

  elementsToStagger.forEach((el) => {
    if (el) {
      setTimeout(() => {
        el.classList.add("fade-in-stagger");
      }, delay);
      delay += increment;
    }
  });

  // --- 2. GIFT REVEAL LOGIC (for index.html) ---
  const giftTicket = document.getElementById("giftTicket");
  const coverLayer = document.getElementById("coverLayer");

  if (giftTicket) {
    const giftContent = document.getElementById("giftContent");
    const revealGift = () => {
      coverLayer.classList.add("revealed");
      setTimeout(() => {
        giftTicket.classList.add("revealed-pulse");
        giftContent.style.transform = "scale(1.1)";
      }, 50);
      giftTicket.removeEventListener("click", revealGift);
    };
    giftTicket.addEventListener("click", revealGift);
  }
  // --- END GIFT REVEAL LOGIC ---

  // --- 3. SCROLL ANIMATION LOGIC (For Biodata Page) ---
  const biodataBlocks = document.querySelectorAll(".main-content .data-block");
  biodataBlocks.forEach((block) => {
    addScrollObserver(block, { rootMargin: "-10px" });
  });

  // --- 4. NAVIGATION ---
  // NO JavaScript transition handler needed. Browser handles navigation directly.
});
