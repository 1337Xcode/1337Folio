/* assets/js/main.js
 * Core client-side behaviour for the template: theme toggle, navigation helpers,
 * text-transform modes and utility helpers.
 *
 * NOTE: This file contains behaviour only. Styling remains in CSS files.
 * If you are turning this into a template, edit visible strings in the HTML
 * (see `_layouts/default.html`) or override via Jekyll `_config.yml`.
 */


// DOM cache utility
const domCache = new Map();
function getCached(selector) {
  if (!domCache.has(selector)) {
    domCache.set(selector, document.querySelector(selector));
  }
  return domCache.get(selector);
}
function clearDomCache() {
  domCache.clear();
}

// Clean up all timeouts/intervals on page unload to avoid leaks
const _timeouts = [];
const _intervals = [];
const _origSetTimeout = window.setTimeout;
const _origSetInterval = window.setInterval;
window.setTimeout = function(fn, delay, ...args) {
  const id = _origSetTimeout(fn, delay, ...args);
  _timeouts.push(id);
  return id;
};
window.setInterval = function(fn, delay, ...args) {
  const id = _origSetInterval(fn, delay, ...args);
  _intervals.push(id);
  return id;
};
window.addEventListener('beforeunload', () => {
  _timeouts.forEach(clearTimeout);
  _intervals.forEach(clearInterval);
  clearDomCache();
});

// Utility to get baseurl from <base> tag or window.location
function getBaseUrl() {
  // Try <base href="...">
  const baseTag = document.querySelector('base[href]');
  if (baseTag) {
    let href = baseTag.getAttribute('href');
    // Remove trailing slash for consistency
    if (href.endsWith('/')) href = href.slice(0, -1);
    return href;
  }
  // Try to get from window.location.pathname if deployed in subdir
  // e.g. /portfolio/ or /
  const path = window.location.pathname;
  const regex = /^\/[^/]+/;
  const match = regex.exec(path);
  if (match && match[0] !== '/index.html') {
    return match[0];
  }
  return '';
}

// Use this everywhere instead of hardcoded '/portfolio'
const BASEURL = getBaseUrl();

class SiteManager {
  constructor() {
    this._tocScrollTimeout = null;
    this.init();
  }
  
  init() {
    this.initIntroScreen();
    this.initNavigation();
    this.initTableOfContents();
    this.initCodeCopyButtons();
    this.initCodeLineHighlighting();
    this.initHamburgerMenu();
    this.initCryptoLogo();
    this.initScrollToTop();
    this.initMathCopyButtons();
  }

  initIntroScreen() {
    // Only show intro on homepage and only if not already played in this session
    const isHome = window.location.pathname === '/' || window.location.pathname === (BASEURL + '/');
    const introPlayed = sessionStorage.getItem('introPlayed');
    if (!isHome || introPlayed) {
      document.body.classList.remove('pre-intro');
      return;
    }

    // Add homepage and pre-intro class to body for CSS targeting
    document.body.classList.add('homepage', 'pre-intro');

    const greetings = ['HELLO', 'DIA DHUIT', 'नमस्ते', '你好', 'こんにちは', '안녕하세요', 'BONJOUR'];
    let currentIndex = 0;

    const introScreen = document.createElement('div');
    introScreen.className = 'intro-screen';

    const introContent = document.createElement('div');
    introContent.className = 'intro-content';

    const introText = document.createElement('div');
    introText.className = 'intro-text';
    introText.textContent = greetings[0];

    introContent.appendChild(introText);
    introScreen.appendChild(introContent);
    document.body.appendChild(introScreen);
    document.body.classList.add('intro-active');

    // Consistent and slightly longer timing
    const greetingDuration = 650;
    const fadeDuration = 180;
    const finalHold = 900;

    const cycleGreetings = () => {
      currentIndex++;
      if (currentIndex < greetings.length) {
        introText.style.opacity = '0';
        introText.style.transform = 'translateY(15px) scale(0.95)';
        setTimeout(() => {
          introText.textContent = greetings[currentIndex];
          introText.style.opacity = '1';
          introText.style.transform = 'translateY(0) scale(1)';
        }, fadeDuration);
        setTimeout(cycleGreetings, greetingDuration);
      } else {
        setTimeout(() => {
          introScreen.classList.add('fade-out');
          document.body.classList.remove('intro-active');
          setTimeout(() => {
            introScreen.remove();
            document.body.classList.remove('pre-intro');
            sessionStorage.setItem('introPlayed', '1');
          }, 700); // Match the CSS transition duration
        }, finalHold);
      }
    };

    setTimeout(cycleGreetings, 800); // Increased from 400ms to 800ms for longer HELLO display
  }

  initCryptoLogo() {
  const logo = document.querySelector('.logo');
  const logoText = logo?.textContent;

  if (!logo || !logoText) return;

  // Wrap the text
  logo.innerHTML = `<span class="logo-text" data-original="${logoText}">${logoText}</span>`;
  const logoTextElement = logo.querySelector('.logo-text');

  const originalText = logoText;
  const cryptoChars = '!@#$%^&*():{};|,.<>/?';
  let animationFrameId = null;
  let isAnimating = false;
  let isHovering = false;

  const lockStyle = () => {
    const width = logoTextElement.offsetWidth;
    logoTextElement.style.width = `${width}px`;
    logoTextElement.style.display = 'inline-block';
    logoTextElement.style.whiteSpace = 'nowrap';
  };

  const unlockStyle = () => {
    logoTextElement.style.removeProperty('width');
    logoTextElement.style.removeProperty('display');
    logoTextElement.style.removeProperty('white-space');
  };

  const scrambleText = (revealCount) => {
    let scrambled = '';
    for (let i = 0; i < originalText.length; i++) {
      if (i < revealCount) {
        scrambled += originalText[i];
      } else {
        scrambled += cryptoChars[Math.floor(Math.random() * cryptoChars.length)];
      }
    }
    return scrambled;
  };

  const animateScramble = (totalDuration = 1024) => {
    if (isAnimating) return;
    isAnimating = true;
    const startTime = performance.now();
    const totalSteps = originalText.length;
    const interval = totalDuration / totalSteps;

    const step = (now) => {
      if (!isHovering) {
        cancelAnimationFrame(animationFrameId);
        logoTextElement.textContent = originalText;
        isAnimating = false;
        return;
      }

      const elapsed = now - startTime;
      const revealCount = Math.floor(elapsed / interval);

      if (revealCount <= originalText.length) {
        logoTextElement.textContent = scrambleText(revealCount);
        animationFrameId = requestAnimationFrame(step);
      } else {
        logoTextElement.textContent = originalText;
        isAnimating = false;
      }
    };

    lockStyle();
    animationFrameId = requestAnimationFrame(step);
  };

  logo.addEventListener('mouseenter', () => {
    isHovering = true;
    animateScramble();
  });

  logo.addEventListener('mouseleave', () => {
    isHovering = false;
    cancelAnimationFrame(animationFrameId);
    isAnimating = false;
    logoTextElement.textContent = originalText;
    unlockStyle();
  });
}

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    // Cycle: light → dark → night → light
    let newTheme;
    if (currentTheme === 'light') newTheme = 'dark';
    else if (currentTheme === 'dark') newTheme = 'night';
    else newTheme = 'light';
    this.applyTheme(newTheme, true);
  }
  
  initNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-sidebar-nav a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Remove any existing active class
      link.classList.remove('active');
      
      // Handle baseurl and path matching
      const cleanPath = currentPath.replace(BASEURL, ''); // Remove baseurl
      const cleanHref = href.replace(BASEURL, ''); // Remove baseurl from href
      
      // Check if current path matches the link
      if (cleanPath === cleanHref || 
          cleanPath === '/' && cleanHref === '/' ||
          (cleanHref !== '/' && cleanPath.startsWith(cleanHref))) {
        link.classList.add('active');
      }
    });
  }

  initTableOfContents() {
    // Only run on post pages
    const postContent = getCached('.post-full-content');
    const tocContainers = [
      getCached('.toc-sticky-desktop'),
      getCached('.toc-sticky-mobile')
    ].filter(Boolean);

    if (!postContent || tocContainers.length === 0) return;

    // Find all headings
    const headings = postContent.querySelectorAll('h1, h2, h3, h4');

    if (headings.length === 0) {
      tocContainers.forEach(tc => tc.style.display = 'none');
      return;
    }

    // Generate TOC HTML
    let tocHTML = '<div class="toc-title">Contents</div><ul class="toc-list">';
    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      const level = heading.tagName.toLowerCase();
      const text = heading.textContent;
      const className = `toc-${level}`;
      tocHTML += `<li><a href="#${id}" class="${className}">${text}</a></li>`;
    });
    tocHTML += '</ul>';

    tocContainers.forEach(tc => tc.innerHTML = tocHTML);

    // Helper function to remove 'active' class from all TOC links in all containers
    function removeActiveClassFromAllTocLinks() {
      tocContainers.forEach(tc2 => {
        const links = tc2.querySelectorAll('a');
        links.forEach(l => l.classList.remove('active'));
      });
    }

    // Helper function to update active class on TOC links
    function updateActiveClassOnTocLinks(activeIndex) {
      tocContainers.forEach(tc => {
        const tocLinks = tc.querySelectorAll('a');
        tocLinks.forEach((link, index) => {
          link.classList.toggle('active', index === activeIndex);
        });
      });
    }

    // Use event delegation for TOC links
    tocContainers.forEach(tc => {
      tc.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Update active link in all containers
          removeActiveClassFromAllTocLinks();
          link.classList.add('active');
        }
      });
    });

    // Debounced scroll event for performance
    const updateActiveHeading = () => {
      if (this._tocScrollTimeout) return;
      this._tocScrollTimeout = setTimeout(() => {
        const scrollPos = window.scrollY + 150;
        let activeIndex = 0;
        headings.forEach((heading, index) => {
          if (heading.offsetTop <= scrollPos) {
            activeIndex = index;
          }
        });
        updateActiveClassOnTocLinks(activeIndex);
        this._tocScrollTimeout = null;
      }, 16);
    };

    updateActiveHeading();
    window.addEventListener('scroll', updateActiveHeading, { passive: true });
  }

  initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.post-full-content pre');
    codeBlocks.forEach(preElement => {
      // Check if already processed
      if (preElement.parentElement.classList.contains('code-block-container')) {
        return;
      }

      const container = document.createElement('div');
      container.classList.add('code-block-container');
      
      // Wrap the pre element
      preElement.parentNode.insertBefore(container, preElement);
      container.appendChild(preElement);
      
      const copyButton = document.createElement('button');
      copyButton.classList.add('copy-code-button');
      // Set smaller icon size via inline style
      copyButton.innerHTML = '<i data-lucide="copy" style="width:18px;height:18px;"></i>';
      container.appendChild(copyButton);
      
      copyButton.addEventListener('click', () => {
        const codeElement = preElement.querySelector('code');
        const codeToCopy = codeElement ? codeElement.innerText : preElement.innerText;
        
        function resetCopyButton() {
          copyButton.innerHTML = '<i data-lucide="copy" style="width:18px;height:18px;"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        function resetCopyButtonError() {
          copyButton.innerHTML = '<i data-lucide="copy" style="width:18px;height:18px;"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        navigator.clipboard.writeText(codeToCopy).then(() => {
          copyButton.innerHTML = '<i data-lucide="check" style="width:18px;height:18px;"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
          setTimeout(resetCopyButton, 1200); // Increased tick duration
        }).catch(err => {
          console.error('Failed to copy: ', err);
          copyButton.innerHTML = '<i data-lucide="copy" style="width:18px;height:18px;"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
          setTimeout(resetCopyButtonError, 2000);
        });
      });
    });
  }

  initCodeLineHighlighting() {
    const codeBlocks = document.querySelectorAll('.post-full-content pre code');
    const highlightKeyword = 'hl';

    codeBlocks.forEach(codeElement => {
      let htmlContent = codeElement.innerHTML;
      const lines = htmlContent.split('\n');
      let modified = false;

      const processedLines = lines.map(lineHtml => {
        // Use a temporary div to safely get textContent of the current HTML line
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = lineHtml;
        const lineText = tempDiv.textContent || "";

        // Regex to find various comment styles ending with 'hl'
        // Catches: // hl, # hl, -- hl, <!-- hl -->, /* hl */
        const highlightRegex = new RegExp(
          `(\\s*(?://|#|--)\\s*${highlightKeyword}\\s*$)|` + // For //, #, --
          `(\\s*<!--\\s*${highlightKeyword}\\s*-->)|` +      // For HTML
          `(\\s*/\\*\\s*${highlightKeyword}\\s*\\*/)`         // For CSS
        );

        if (highlightRegex.test(lineText)) {
          modified = true;
          // Replace the found marker in the raw HTML of the line
          const cleanedLineHtml = lineHtml.replace(highlightRegex, '');
          return `<span class="highlighted-line">${cleanedLineHtml}</span>`;
        }
        return lineHtml;
      });

      if (modified) {
        codeElement.innerHTML = processedLines.join('\n');
      }
    });
  }

  initMathCopyButtons() {
    const mathBlocks = document.querySelectorAll('.post-full-content .katex-display');
    mathBlocks.forEach(katexDisplayElement => {
      const container = katexDisplayElement.parentElement;

      // Avoid re-wrapping
      if (!container || container.parentElement.classList.contains('math-block-container')) {
        return;
      }

      const mathContainer = document.createElement('div');
      mathContainer.classList.add('math-block-container');

      // Wrap the existing container
      container.parentNode.insertBefore(mathContainer, container);
      mathContainer.appendChild(container);

      const copyButton = document.createElement('button');
      copyButton.classList.add('copy-math-button');
      copyButton.innerHTML = '<i data-lucide="copy" style="width:18px;height:18px;"></i>';
      mathContainer.appendChild(copyButton);

      copyButton.addEventListener('click', () => {
        const latexSourceElement = katexDisplayElement.querySelector('annotation[encoding="application/x-tex"]');
        const codeToCopy = latexSourceElement ? latexSourceElement.textContent.trim() : '';

        function resetCopyButton() {
          copyButton.innerHTML = '<i data-lucide="copy" style="width:18px;height:18px;"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        function resetCopyButtonError() {
          copyButton.innerHTML = '<i data-lucide="copy" style="width:18px;height:18px;"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        function showCopyErrorIcon() {
          copyButton.innerHTML = '<i data-lucide="x" style="width:18px;height:18px;"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
          setTimeout(resetCopyButtonError, 2000);
        }
        if (codeToCopy) {
          navigator.clipboard.writeText(codeToCopy).then(() => {
            copyButton.innerHTML = '<i data-lucide="check" style="width:18px;height:18px;"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
            setTimeout(resetCopyButton, 1200);
          }).catch(err => {
            console.error('Failed to copy LaTeX: ', err);
            showCopyErrorIcon();
          });
        } else {
          console.warn('Could not find LaTeX source to copy.');
          showCopyErrorIcon();
        }
      });
    });
  }

  initHamburgerMenu() {
    // Create the middle bar for hamburger animation
    const hamburgerButton = document.querySelector('.mobile-menu-toggle');
    if (hamburgerButton) {
      const middleBar = document.createElement('span');
      middleBar.className = 'hamburger-middle';
      hamburgerButton.appendChild(middleBar);
    }
  }

  initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i data-lucide="chevron-up"></i>';
    scrollButton.setAttribute('title', 'Scroll to top');
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);

    // Initialize the icon
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Show/hide button based on scroll position
    const toggleButtonVisibility = () => {
      if (window.scrollY > 300) {
        scrollButton.classList.add('visible');
      } else {
        scrollButton.classList.remove('visible');
      }
    };

    // Keep button above footer, with smoother transition
    function adjustScrollButtonPosition() {
      const footer = document.querySelector('.site-footer');
      if (!footer) return;
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const defaultBottom = 32; // px, matches var(--space-xl)
      // Distance from bottom of viewport to top of footer
      const overlap = windowHeight - footerRect.top;
      let targetBottom;
      if (overlap > 0) {
      // Footer is visible, move button up
      targetBottom = overlap + defaultBottom;
      } else {
      // Footer not visible, use default
      targetBottom = defaultBottom;
      }
      // Much smoother animation with longer duration and easing
      scrollButton.style.transition = 'bottom 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      scrollButton.style.bottom = `${targetBottom}px`;
    }

    // Smooth scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Event listeners
    window.addEventListener('scroll', () => {
      toggleButtonVisibility();
      adjustScrollButtonPosition();
    });
    window.addEventListener('resize', adjustScrollButtonPosition);
    scrollButton.addEventListener('click', scrollToTop);

    // Initial check
    toggleButtonVisibility();
    adjustScrollButtonPosition();
  }

  applyTheme(theme, animateIcon = false) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark', theme === 'dark' || theme === 'night');
    
    // Animate icon on desktop toggle
    const desktopThemeIcon = document.getElementById('themeIcon');
    const mobileSidebarThemeIcon = document.getElementById('mobileSidebarThemeIcon');
    const mobileSidebarThemeText = document.getElementById('mobileSidebarThemeText');

    // Set icon and label for each mode
    let iconName, mobileIconName, label;
    if (theme === 'light') {
      iconName = 'moon';
      mobileIconName = 'moon';
      label = 'Dark Mode';
    } else if (theme === 'dark') {
      iconName = 'star';
      mobileIconName = 'star';
      label = 'Night Mode';
    } else { // night
      iconName = 'sun';
      mobileIconName = 'sun';
      label = 'Light Mode';
    }

    if (desktopThemeIcon) {
      desktopThemeIcon.setAttribute('data-lucide', iconName);
      if (animateIcon) {
        desktopThemeIcon.classList.add('spin-theme');
        setTimeout(() => desktopThemeIcon.classList.remove('spin-theme'), 500);
      }
    }
    if (mobileSidebarThemeIcon) {
      mobileSidebarThemeIcon.setAttribute('data-lucide', mobileIconName);
      if (animateIcon) {
        mobileSidebarThemeIcon.classList.add('spin-theme');
        setTimeout(() => mobileSidebarThemeIcon.classList.remove('spin-theme'), 500);
      }
    }
    if (mobileSidebarThemeText) {
      mobileSidebarThemeText.textContent = label;
    }
    
    // Update site title in hero section based on theme. Use client-side defaults if present.
    const heroTitle = document.querySelector('.hero-home-title');
    if (heroTitle) {
      const siteOwner = (typeof window !== 'undefined' && window.SITE_OWNER) ? window.SITE_OWNER : (document.querySelector('.logo') ? document.querySelector('.logo').textContent.trim() : 'Your Name');
      heroTitle.textContent = siteOwner;
    }
    
    // Re-initialize Lucide icons after changing attributes
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    localStorage.setItem('theme', theme);
  }
}

// Global instance
let siteManager;

// Global functions
function toggleTheme() {
  if (siteManager) {
    siteManager.toggleTheme();
  } else {
    console.error('SiteManager not initialized yet');
  }
}

function toggleMobileMenu() {
  const sidebar = getCached('#mobileSidebar');
  const overlay = getCached('.mobile-sidebar-overlay');
  const hamburgerButton = getCached('.mobile-menu-toggle');
  const closeButton = getCached('.mobile-sidebar-close');
  
  const isOpen = sidebar.classList.toggle('open');
  
  // Force hardware acceleration and prepare for animation
  if (sidebar) {
    sidebar.style.willChange = isOpen ? 'transform' : 'auto';
  }
  
  if (overlay) {
    overlay.classList.toggle('active', isOpen);
    overlay.style.willChange = isOpen ? 'opacity' : 'auto';
  }
  
  if (hamburgerButton) {
    hamburgerButton.classList.toggle('open', isOpen);
  }
  
  if (closeButton) {
    if (isOpen) {
      closeButton.classList.add('spin');
    } else {
      closeButton.classList.remove('spin');
    }
  }
  
  // Use requestAnimationFrame for smoother body scroll lock
  requestAnimationFrame(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

// Add this function to allow closing from overlay or close button
function closeMobileMenu() {
  const sidebar = getCached('#mobileSidebar');
  const overlay = getCached('.mobile-sidebar-overlay');
  const hamburgerButton = getCached('.mobile-menu-toggle');
  const closeButton = getCached('.mobile-sidebar-close');
  
  if (sidebar) {
    sidebar.classList.remove('open');
    // Clean up will-change after animation completes
    setTimeout(() => {
      sidebar.style.willChange = 'auto';
    }, 300);
  }
  
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.willChange = 'auto';
    }, 300);
  }
  
  if (hamburgerButton) hamburgerButton.classList.remove('open');
  if (closeButton) closeButton.classList.remove('spin');
  
  // Use requestAnimationFrame for smoother body scroll unlock
  requestAnimationFrame(() => {
    document.body.style.overflow = '';
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  siteManager = new SiteManager();
  
  // Initialize Lucide icons first
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Then, apply the current theme to ensure icons are correctly set
  // Get theme from localStorage or default to 'dark'
  const currentTheme = localStorage.getItem('theme') || 'night';
  // Apply theme without animation on initial load
  if (siteManager) {
    siteManager.applyTheme(currentTheme, false); 
  }

  // Initialize button state for text mode (if on a post page)
  // This is handled inside siteManager.initTextTransformers if a .mode-toggle button exists
  const modeToggleButton = document.querySelector('.mode-toggle');
  if (modeToggleButton) {
    updateModeButton('normal');
  }
  
  const overlay = getCached('.mobile-sidebar-overlay');
  const closeButton = getCached('.mobile-sidebar-close');
  
  // Use passive listeners for better performance
  if (overlay) overlay.addEventListener('click', closeMobileMenu, { passive: true });
  if (closeButton) closeButton.addEventListener('click', closeMobileMenu, { passive: true });

  // Pre-warm the mobile menu elements for better performance
  const sidebar = getCached('#mobileSidebar');
  if (sidebar) {
    sidebar.style.transform = 'translateX(-100%)';
    requestAnimationFrame(() => {
      sidebar.style.transform = '';
    });
  }

  const galleryImages = document.querySelectorAll('.gallery-image-container');

  galleryImages.forEach(container => {
    const img = container.querySelector('.gallery-image');
    const skeleton = document.createElement('div');
    skeleton.className = 'gallery-skeleton';
    container.appendChild(skeleton);

    const stopSkeletonEffect = () => {
      // First fade out the skeleton
      skeleton.classList.add('skeleton-fade-out');
      
      // After skeleton fades out, show the image and remove skeleton
      setTimeout(() => {
        img.classList.add('skeleton-loaded');
        if (skeleton.parentNode) {
          skeleton.remove();
        }
      }, 300); // Match the skeleton fade-out transition duration
    };

    img.onload = stopSkeletonEffect;
    img.onerror = () => {
      // If image fails to load, just fade out skeleton
      skeleton.classList.add('skeleton-fade-out');
      setTimeout(() => {
        if (skeleton.parentNode) {
          skeleton.remove();
        }
      }, 300);
    };
  });
});