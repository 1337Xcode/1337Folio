(function () {
  // Utility to get baseurl from <base> tag or window.location
  function getBaseUrl() {
    const baseTag = document.querySelector('base[href]');
    if (baseTag) {
      let href = baseTag.getAttribute('href');
      if (href.endsWith('/')) href = href.slice(0, -1);
      return href;
    }
    const path = window.location.pathname;
    const regex = /^\/[^/]+/;
    const match = regex.exec(path);
    if (match && match[0] !== '/index.html') {
      return match[0];
    }
    return '';
  }
  const BASEURL = getBaseUrl();

  // Check if device is mobile (to match CSS media query)
  function isMobileDevice() {
    return window.innerWidth <= 768;
  }

  // Only run on home page
  const isHome = window.location.pathname === '/' || window.location.pathname === (BASEURL + '/');
  if (!isHome) {
    // Exit early if not on home page
    return;
  }

  const className = 'smiley__wrapper';
  let smiley = null;

  // Wait for DOM to be ready before getting the element
  const initSmiley = () => {
    smiley = document.getElementById(className);

    if (!smiley) {
      console.warn('Smiley element not found on home page');
      return false;
    }
    return true;
  };

  const mouseFunction = (mouse) => {
    // Add null check for smiley element
    if (!smiley) return;

    let clientX;
    if (mouse.clientX) {
      clientX = mouse.clientX;
    } else if (mouse.touches && mouse.touches[0]) {
      clientX = mouse.touches[0].clientX;
    } else {
      clientX = 0;
    }
    let clientY;
    if (mouse.clientY) {
      clientY = mouse.clientY;
    } else if (mouse.touches && mouse.touches[0]) {
      clientY = mouse.touches[0].clientY;
    } else {
      clientY = 0;
    }

    if (clientX > window.innerWidth / 2 + 20) {
      smiley.classList.add(`${className}--right`);
      smiley.classList.remove(`${className}--left`);
    } else if (clientX < window.innerWidth / 2 - 20) {
      smiley.classList.add(`${className}--left`);
      smiley.classList.remove(`${className}--right`);
    } else {
      smiley.classList.remove(`${className}--right`);
      smiley.classList.remove(`${className}--left`);
    }

    if (clientY > window.innerHeight / 2 + 20) {
      smiley.classList.add(`${className}--bottom`);
      smiley.classList.remove(`${className}--top`);
    } else if (clientY < window.innerHeight / 2 - 20) {
      smiley.classList.add(`${className}--top`);
      smiley.classList.remove(`${className}--bottom`);
    } else {
      smiley.classList.remove(`${className}--bottom`);
      smiley.classList.remove(`${className}--top`);
    }
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // Double check we're on home page
    if (!isHome) return;

    // Try to initialize smiley element
    if (!initSmiley()) return;

    // Only add event listeners if smiley element exists
    window.addEventListener('mousemove', mouseFunction);
    window.addEventListener('touchstart', mouseFunction);

    // Handle mouth animations
    const smileyWrapper = document.getElementById('smiley__wrapper');
    if (!smileyWrapper) return;

    const mouth = smileyWrapper.querySelector('.smiley__mouth');
    if (!mouth) return;

    // Helper to remove both mouth classes
    function resetMouth() {
      mouth.classList.remove('smiley__mouth--big', 'smiley__mouth--o');
    }

    // Big smile on link hover
    const clickableLinks = document.querySelectorAll('a, button, .social-link, .nav-links a');
    clickableLinks.forEach(link => {
      link.addEventListener('mouseenter', function () {
        if (!smileyWrapper.matches(':hover')) { // Don't override O if hovering face
          resetMouth();
          mouth.classList.add('smiley__mouth--big');
        }
      });
      link.addEventListener('mouseleave', function () {
        if (!smileyWrapper.matches(':hover')) {
          resetMouth();
        }
      });
    });

    // --- Speech bubble logic --- (only on desktop)
    if (!isMobileDevice()) {
      const speechBubble = document.getElementById('smiley__speech-bubble');
      const speechText = document.getElementById('smiley__speech-text');
      const speechMessages = [
        "This site has 11,000+ lines of code!",
        "Hover over me to hear me out!",
        "I can blink, smile, and even talk!",
        "Only 1 guy made this site! Who? Me!",
        "There are Easter eggs hidden around!",
        "Check this site on desktop for the full experience!",
        "It took almost a month to build this site!",
        "Follow me on Github!",
        "Think this is cool? go see my projects!",
        "You can send your feedback through the contact form!",
        "Check out my blog for more stuff!", "Let's connect on LinkedIn!",
        "I'm always open to collaborations!",
        "This site is mobile-friendly!",
        "Wondering if I should open source this 🤔",
        "I been coding since I was 12!",
        "Lua was my first programming language!"];

      let lastSpeechIndex = -1; // Track last message index
      let mouthAnimInterval = null;
      let bubbleAnimInterval = null;
      let isSpeaking = false; // Prevent spam

    function getRandomSpeechMessage() {
      let idx;
      do {
        idx = Math.floor(Math.random() * speechMessages.length);
      } while (speechMessages.length > 1 && idx === lastSpeechIndex);
      lastSpeechIndex = idx;
      return speechMessages[idx];
    }

    function animateSpeechBubble() {
      if (!speechBubble) return;
      let t = 0;
      clearInterval(bubbleAnimInterval);
      bubbleAnimInterval = setInterval(() => {
        t += 0.08;
        const y = Math.sin(t) * 7;
        speechBubble.style.transform = `translateY(${y - 10}px) scale(1)`;
      }, 33);
    }

    function stopSpeechBubbleAnim() {
      clearInterval(bubbleAnimInterval);
      if (speechBubble) speechBubble.style.transform = "translateY(-10px) scale(0.95)";
    }

    function animateMouthAndText(msg, onDone) {
      if (!mouth || !speechText) return;
      let open = false;
      clearInterval(mouthAnimInterval);

      const chars = msg.split('');
      let idx = 0;
      speechText.textContent = '';
      const minSpeed = 40, maxSpeed = 90;
      const speed = Math.max(minSpeed, Math.min(maxSpeed, 2200 / chars.length));
      mouth.classList.remove('smiley__mouth--o');

      mouthAnimInterval = setInterval(() => {
        if (idx < chars.length) {
          speechText.textContent += chars[idx];
          if (open) {
            mouth.classList.remove('smiley__mouth--o');
          } else {
            mouth.classList.add('smiley__mouth--o');
          }
          open = !open;
          idx++;
        } else {
          clearInterval(mouthAnimInterval);
          mouth.classList.remove('smiley__mouth--o');
          if (typeof onDone === 'function') onDone();
        }
      }, speed);
    }

    // Helper function to hide the speech bubble after animation
    function hideSpeechBubble() {
      speechBubble.classList.remove('show');
      setTimeout(finishHideSpeechBubble, 300);
    }

    function finishHideSpeechBubble() {
      speechBubble.style.display = 'none';
      stopSpeechBubbleAnim();
      isSpeaking = false;
    }

    function onMouthAnimDone() {
      setTimeout(hideSpeechBubble, 1200);
    }

    function showSpeechBubble(msg) {
      if (!speechBubble || !speechText) return;
      if (isSpeaking) return; // Prevent overlap
      isSpeaking = true;
      speechBubble.classList.add('show');
      speechBubble.style.display = 'block';
      animateSpeechBubble();
      animateMouthAndText(msg, onMouthAnimDone);
    }

    // Randomly trigger speech every 8-16 seconds
    function randomSpeechLoop() {
      const delay = 8000 + Math.random() * 8000;
      setTimeout(() => {
        if (document.visibilityState === 'visible' && !isSpeaking) {
          const msg = getRandomSpeechMessage();
          showSpeechBubble(msg);
        }
        randomSpeechLoop();
      }, delay);
    }
    randomSpeechLoop();

    // Speak on smiley hover, but don't spam
    smileyWrapper.addEventListener('mouseenter', function () {
      if (isSpeaking) return;
      const msg = getRandomSpeechMessage();
      showSpeechBubble(msg);
    });

    } // Close mobile device check

  });

  // Also check if DOM is already loaded
  if (document.readyState === 'loading') {
    // DOM is still loading, event listener will handle it
  }
  // DOM is already loaded, run immediately
  else if (initSmiley()) {
    window.addEventListener('mousemove', mouseFunction);
    window.addEventListener('touchstart', mouseFunction);
  }
})();