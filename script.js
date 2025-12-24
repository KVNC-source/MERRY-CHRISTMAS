/*
 * --- JAVASCRIPT LOGIC ---
 * Handles gift reveal, staggered animations, and persistent background music.
 */

// --- IntersectionObserver Core Logic (Handles smooth scroll-in animation) ---
function addScrollObserver(el, options) {
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

// --- Audio Persistence Logic ---
// This ensures the music continues from the same spot even when changing pages
function initPersistentAudio() {
  const audio = document.getElementById("bgMusic");
  if (!audio) return;

  // 1. Restore the playback position from the previous page
  const savedTime = localStorage.getItem("audioTime");
  if (savedTime) {
    audio.currentTime = parseFloat(savedTime);
  }

  // 2. Save the playback position frequently
  setInterval(() => {
    if (!audio.paused) {
      localStorage.setItem("audioTime", audio.currentTime);
    }
  }, 500);

  // 3. Handle browser autoplay restrictions
  // Most browsers block audio until a user clicks something.
  // This function tries to play immediately, or waits for the first click.
  const playAudio = () => {
    audio
      .play()
      .then(() => {
        // Success: music is playing
        document.removeEventListener("click", playAudio);
      })
      .catch(() => {
        // Still blocked by browser, will try again on the next click
      });
  };

  playAudio();
  document.addEventListener("click", playAudio);
}

// --- Main Document Logic ---
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. PERSISTENT AUDIO ---
  initPersistentAudio();

  // --- 2. STAGGERED PAGE LOAD FADE-IN ---
  // Elements that will "slide up" one by one when the page loads
  const elementsToStagger = [
    document.querySelector(".sidebar"),
    document.querySelector(".main-heading"),
    document.querySelector(".intro-text"),
    document.querySelector(".page-indicator"),
    document.querySelector(".gift-section"),
    document.querySelector(".ornament-container"),
    document.querySelector(".letter-content"),
  ];

  let delay = 100; // Initial delay
  const increment = 150; // Delay between each element

  elementsToStagger.forEach((el) => {
    if (el) {
      setTimeout(() => {
        el.classList.add("fade-in-stagger");
      }, delay);
      delay += increment;
    }
  });

  // --- 3. GIFT REVEAL LOGIC ---
  const giftTicket = document.getElementById("giftTicket");
  const giftContentWrap = document.getElementById("giftContentWrap");
  const paybackText = document.getElementById("paybackText");

  if (giftTicket && giftContentWrap) {
    giftTicket.addEventListener("click", () => {
      // Fade out the reveal button
      giftTicket.classList.add("fade-out");

      // Delay to let button fade before showing the image
      setTimeout(() => {
        giftTicket.style.display = "none";
        giftContentWrap.style.display = "block";

        // Trigger the elegant scale-up animation for the image
        setTimeout(() => {
          giftContentWrap.classList.add("reveal-active");

          // Show "Silit payback" after the image animation is halfway through
          if (paybackText) {
            setTimeout(() => {
              paybackText.style.opacity = "1";
            }, 800);
          }
        }, 50);
      }, 400);
    });
  }

  // --- 4. SCROLL ANIMATION LOGIC ---
  // Apply the scroll-in observer to all bio/wish data blocks
  const biodataBlocks = document.querySelectorAll(".data-block");
  biodataBlocks.forEach((block) => {
    addScrollObserver(block, { rootMargin: "-10px" });
  });
});
