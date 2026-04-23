/* ============================================================
   ISC Java — Main Script
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   🔑 EMAILJS CONFIGURATION (Replace with your actual keys!)
    ──────────────────────────────────────────────────────────── */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'A9iCYmQBS3FbnG9HG', // ← Replace with your Public Key
  SERVICE_ID: 'service_yvhlc44', // ← Replace with your Service ID
  TEMPLATE_ID: 'template_0sbxwu9' // ← Replace with your Template ID
};

// Initialize EmailJS with Public Key
(function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }
})();

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

// ── Navbar scroll behaviour ──────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Hamburger / Mobile nav ───────────────────────────────────
const hamburger  = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    if (isOpen) {
      mobileNav.style.display = 'flex';
      // Force reflow then apply opacity for transition
      mobileNav.getBoundingClientRect();
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      // Wait for opacity transition to finish before hiding
      setTimeout(() => {
        if (!mobileNav.classList.contains('open')) {
          mobileNav.style.display = 'none';
        }
      }, 320);
    }
  });
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { mobileNav.style.display = 'none'; }, 320);
    });
  });
}

// ── Scroll Reveal (Intersection Observer) ───────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const siblings = [...e.target.parentElement.children].filter(c =>
          c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right')
        );
        const idx = siblings.indexOf(e.target);
        e.target.style.transitionDelay = `${idx * 0.08}s`;
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}

// ── Scroll to Top ────────────────────────────────────────────
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Active nav link highlight ────────────────────────────────
function setActiveNavLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('active', href.includes(current) && current !== '');
  });
}
setActiveNavLink();

// ── Counter Animations ────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 1600;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const counterEls = document.querySelectorAll('[data-counter]');
if (counterEls.length) {
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el     = e.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterIO.observe(el));
}

// ── Class Tabs (classes.html) ────────────────────────────────
const tabs    = document.querySelectorAll('.class-tab');
const panels  = document.querySelectorAll('.class-panel');

if (tabs.length && panels.length) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => {
        p.style.display = p.id === target ? 'grid' : 'none';
      });
      tab.classList.add('active');
    });
  });
  if (panels[0]) panels[0].style.display = 'grid';
}

// ── Contact Form Validation & EmailJS Integration ──────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const successMsg = document.getElementById('success-message');
  const inputs = contactForm.querySelectorAll('[required]');

  function showError(input, msg) {
    input.classList.add('error');
    const errEl = input.nextElementSibling;
    if (errEl && errEl.classList.contains('form-error')) {
      errEl.textContent = msg;
      errEl.classList.add('show');
    }
  }
  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.nextElementSibling;
    if (errEl && errEl.classList.contains('form-error')) errEl.classList.remove('show');
  }

  inputs.forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // 1. Frontend Validation
    inputs.forEach(input => {
      clearError(input);
      if (!input.value.trim()) {
        showError(input, 'This field is required.');
        valid = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        showError(input, 'Please enter a valid email address.');
        valid = false;
      }
    });

    if (!valid) return;

    // 2. UI Update: Sending state
    const btn = contactForm.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // 3. Send email using EmailJS
    if (typeof emailjs !== 'undefined') {
      emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID, 
        EMAILJS_CONFIG.TEMPLATE_ID, 
        '#contact-form'
      ).then(
        function(response) {
          // Success: Show success message
          contactForm.style.display = 'none';
          if (successMsg) successMsg.classList.add('show');
        },
        function(error) {
          // Error: Notify user and reset button
          alert('Oops! Your doubt could not be sent. Please check your internet connection or try again later. If the problem persists, contact the teacher directly.');
          btn.disabled = false;
          btn.textContent = originalText;
        }
      );
    } else {
      // Fallback if EmailJS SDK fails to load
      alert('Unable to send message at this time. Please check your connection.');
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });

  const resetBtn = document.getElementById('reset-form');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      contactForm.reset();
      contactForm.style.display = '';
      if (successMsg) successMsg.classList.remove('show');
      const btn = contactForm.querySelector('.form-submit');
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
      
      // Reset subject dropdown to default state
      const subjectSelect = document.getElementById('subject');
      if (subjectSelect) {
        subjectSelect.value = '';
        filterSubjectsByClass(); 
      }
    });
  }

  // --- Dynamic Subject Filtering (NEW) ---
  const classSelect = document.getElementById('class');
  const subjectSelect = document.getElementById('subject');
  
  function filterSubjectsByClass() {
    const selectedClass = classSelect.value;
    const options = subjectSelect.querySelectorAll('option');
    let hasVisibleOption = false;
    
    // Hide all options except the first disabled placeholder
    options.forEach(option => {
      if (option.disabled && option.value === '') {
        option.style.display = ''; // Keep placeholder visible
        return;
      }
      const parentOptgroup = option.parentNode;
      const optgroupLabel = parentOptgroup.label;
      
      let shouldShow = false;
      if (selectedClass === '9' && optgroupLabel === 'Class 9') shouldShow = true;
      else if (selectedClass === '10' && optgroupLabel === 'Class 10') shouldShow = true;
      else if (selectedClass === '11' && optgroupLabel === 'Class 11') shouldShow = true;
      else if (selectedClass === '12' && optgroupLabel === 'Class 12') shouldShow = true;
      else if (optgroupLabel === 'Others') shouldShow = true; // Always show "Others" group
      
      option.style.display = shouldShow ? '' : 'none';
      if (shouldShow) hasVisibleOption = true;
    });
    
    // Show/hide optgroups as well 
    const optgroups = subjectSelect.querySelectorAll('optgroup');
    optgroups.forEach(group => {
      const label = group.label;
      let showGroup = false;
      if (selectedClass === '9' && label === 'Class 9') showGroup = true;
      else if (selectedClass === '10' && label === 'Class 10') showGroup = true;
      else if (selectedClass === '11' && label === 'Class 11') showGroup = true;
      else if (selectedClass === '12' && label === 'Class 12') showGroup = true;
      else if (label === 'Others') showGroup = true;
      group.style.display = showGroup ? '' : 'none';
    });
      
    // If current selected subject is now hidden, reset selection
    const currentSelected = subjectSelect.value;
    const selectedOption = subjectSelect.querySelector(`option[value="${currentSelected}"]`);
    if (selectedOption && selectedOption.style.display === 'none') {
      subjectSelect.value = '';
    }
    
    // Update placeholder text based on whether a class is selected
    const placeholderOption = subjectSelect.querySelector('option[disabled][value=""]');
    if (placeholderOption) {
      if (selectedClass) {
        placeholderOption.textContent = `-- Select a topic for Class ${selectedClass} --`;
      } else {
        placeholderOption.textContent = '-- First select your class above --';
      }
    }
  }
  
  if (classSelect && subjectSelect) {
    classSelect.addEventListener('change', filterSubjectsByClass);
    filterSubjectsByClass();
  }
}

// ── Load More Articles (blog.html) ───────────────────────────
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
  const hiddenCards = document.querySelectorAll('.blog-card.hidden-card');
  let visibleCount = 0;
  const cardsPerLoad = 6;

  function showNextCards() {
    let cardsShown = 0;
    for (let i = visibleCount; i < hiddenCards.length && cardsShown < cardsPerLoad; i++) {
      hiddenCards[i].classList.remove('hidden-card');
      hiddenCards[i].classList.add('reveal');
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.12 });
      io.observe(hiddenCards[i]);
      cardsShown++;
      visibleCount++;
    }
    // Hide button if no more hidden cards
    if (visibleCount >= hiddenCards.length) {
      loadMoreBtn.style.display = 'none';
    }
    // Scroll button into view after new cards are added
    setTimeout(() => {
      loadMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  loadMoreBtn.addEventListener('click', showNextCards);
}

// ── Filter Pills (blog.html) ─────────────────────────────────
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    // Filter functionality can be added here later
  });
});

// ── Smooth page-out on link click ────────────────────────────
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && href.endsWith('.html')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity .3s ease';
      setTimeout(() => { window.location.href = href; }, 300);
    });
  }
});
window.addEventListener('pageshow', () => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity .4s ease';
});

// ── Share functionality (SVG-only) ─────────────────
(function() {
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);
  const description = "Check out this article on ISC Java!";

  const copyBtn = document.getElementById('copyLinkBtn');
  if (copyBtn) {
    const originalHTML = copyBtn.innerHTML;

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Success feedback with checkmark icon
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-right:6px;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
        }, 2000);
      }).catch(() => {
        alert('Failed to copy link. Please copy manually.');
      });
    });
  }

  // WhatsApp Share
  const waBtn = document.getElementById('whatsappShareBtn');
  if (waBtn) {
    waBtn.href = `https://wa.me/?text=${pageTitle}%20-%20${pageUrl}`;
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
  }

  // Email Share
  const emailBtn = document.getElementById('emailShareBtn');
  if (emailBtn) {
    emailBtn.href = `mailto:?subject=${pageTitle}&body=${description}%0A%0A${pageUrl}`;
  }
})();

// ── Preloader with minimum display time & scroll lock ─────────
(function() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Lock body scroll immediately
  document.body.classList.add('preloader-active');

  const MIN_DISPLAY_TIME = 2500; // 2.5 seconds
  const startTime = Date.now();
  let pageLoaded = false;

  function hidePreloader() {
    preloader.classList.add('fade-out');
    // Restore scroll after fade animation completes
    setTimeout(() => {
      preloader.style.display = 'none';
      document.body.classList.remove('preloader-active');
    }, 500);
  }

  // When page is fully loaded
  window.addEventListener('load', function() {
    pageLoaded = true;
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);
    
    setTimeout(() => {
      if (pageLoaded) {
        hidePreloader();
      }
    }, remaining);
  });

  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    pageLoaded = true;
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);
    setTimeout(hidePreloader, remaining);
  }
})();

// ── Protecting assets and styles ──────────────────────────────
(function() {
  'use strict';

  // Configuration - Easily adjust protection levels
  const config = {
    blockRightClick: true,      // Block right-click context menu
    blockKeyboardShortcuts: true, // Block dev tools shortcuts
    blockTextSelection: true,    // Prevent text selection
    blockCopyPaste: true,        // Prevent copy/cut actions  
    blockImageDrag: true,        // Prevent image dragging
    blockPrinting: true,         // Disable printing
    allowConsoleDuringDev: false, // Keep console disabled even in dev
    showWarning: false           // Don't show alerts, just block silently
  };

  // Block right-click silently
  if (config.blockRightClick) {
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
        return false;
      });
  }

  // Block keyboard shortcuts silently
  if (config.blockKeyboardShortcuts) {
    document.addEventListener('keydown', function(e) {
      // Block F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
            
      // Block Ctrl+Shift+I (DevTools)
      if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.keyCode === 73)) || 
        (e.metaKey && e.altKey && e.keyCode === 73)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
            
      // Block Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.keyCode === 74)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
            
      // Block Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
            
      // Block Ctrl+S (Save)
      if (e.ctrlKey && (e.key === 's' || e.keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
            
      // Block Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.keyCode === 67)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
            
      // Block Print Screen
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);
  }

  // Block copy/cut if enabled
  if (config.blockCopyPaste) {
    document.addEventListener('copy', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, true);

    document.addEventListener('cut', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, true);
  }

  // Block text selection if enabled
  if (config.blockTextSelection) {
    document.addEventListener('selectstart', function(e) {
      e.preventDefault();
      return false;
    }, false);
  }

  // Block drag and drop for images
  if (config.blockImageDrag) {
    document.addEventListener('dragstart', function(e) {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    });
  }

  // Apply protections on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Make images non-draggable
    if (config.blockImageDrag) {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.setAttribute('draggable', 'false');
      });
    }
        
    // Add CSS protection styles
    const style = document.createElement('style');
        
    // Build CSS based on configuration
    let cssContent = '/* Website Protection Styles */\n';
      
    if (config.blockTextSelection) {
      cssContent += `
        /* Prevent text selection on non-interactive elements */
        body, div, p, h1, h2, h3, h4, h5, h6, span, li, td, th, section, article {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
                
        /* Allow text selection in form elements */
        input, textarea {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }`;
    }
        
    if (config.blockImageDrag) {
      cssContent += `
        img {
          -webkit-user-drag: none !important;
          -moz-user-drag: none !important;
          -ms-user-drag: none !important;
          user-drag: none !important;
          pointer-events: none !important;
        }`;
    }
        
    // Preserve interactive hover effects for site elements
    cssContent += `
      /* Keep all interactive elements clickable */
      a, button, .btn, .phone-chip, .logo-wrap, .pkg-card, .pop-card, 
      .call-btn, .wa-float, .contact-row a, .cert-block, [role="button"] {
          cursor: pointer !important;
      }
      
      /* Allow pointer on hover for links and buttons */
      a:hover, button:hover, .phone-chip:hover, .logo-wrap:hover,
      .pkg-card:hover, .pop-card:hover, .call-btn:hover, .wa-float:hover,
      .contact-row a:hover, .cert-block:hover {
          cursor: pointer !important;
      }
      
      /* Preserve your existing hover effects */
      .pkg-card:hover {
          border-color: var(--gold) !important;
          box-shadow: var(--shadow-md) !important;
          transform: translateY(-3px) !important;
      }
      
      .pop-card:hover {
          border-color: var(--navy-light) !important;
          box-shadow: var(--shadow-md) !important;
      }
      
      .call-btn:hover {
          background: #d49a00 !important;
      }
      
      .wa-float:hover {
          transform: scale(1.1) !important;
          background: #1dbb5a !important;
      }`;
        
    // Add print protection if enabled
    if (config.blockPrinting) {
        cssContent += `
          @media print {
            body * {
              visibility: hidden !important;
              display: none !important;
            }
            
            body::after {
              content: "© Dr Lal PathLabs – Haider Market, Aligarh. All Rights Reserved.";
              display: block;
              visibility: visible !important;
              text-align: center;
              padding: 20px;
              font-family: 'DM Sans', sans-serif;
              font-size: 14px;
              color: #0b3d6e;
            }
          }`;
    }
        
    // Add selection color override
    cssContent += `
    /* Custom selection color */
    ::selection {
      background: #d6e8f7 !important;
      color: #0b3d6e !important;
    }
    
    ::-moz-selection {
      background: #d6e8f7 !important;
      color: #0b3d6e !important;
    }`;
        
      style.textContent = cssContent;
      document.head.appendChild(style);
  });

  // Disable console functions
  if (!config.allowConsoleDuringDev) {
    const noop = function(){};
    const methods = [
      'log', 'debug', 'info', 'warn', 'error', 'assert', 
      'clear', 'dir', 'dirxml', 'trace', 'group', 'groupCollapsed', 
      'groupEnd', 'time', 'timeEnd', 'timeStamp', 'profile', 
      'profileEnd', 'count', 'exception', 'table'
    ];
    
    // Override console methods
    methods.forEach(function(method) {
      window.console[method] = noop;
    });
  }

  // Detect iframe embedding
  if (window.top !== window.self) {
    // Redirect to main page
    window.top.location.href = window.self.location.href;
  }

})();

/**
 * Focus Manager: Hides default browser outlines on mouse click, 
 * but restores them for keyboard navigation .
 */
const initFocusManagement = () => {
  // When the user clicks or touches the screen, they are using a pointer.
  // We add a class to the body to hide focus outlines.
  document.body.addEventListener('mousedown', () => {
    document.body.classList.add('using-pointer');
  });

  document.body.addEventListener('touchstart', () => {
    document.body.classList.add('using-pointer');
  });

  // If the user presses the 'Tab' key, they are navigating via keyboard.
  document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.remove('using-pointer');
    }
  });
};

// Initialize the script once the DOM is ready
document.addEventListener('DOMContentLoaded', initFocusManagement);