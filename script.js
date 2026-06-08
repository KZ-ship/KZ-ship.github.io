(function () {
  'use strict';

  const sidebar = document.getElementById('sidebar');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;

    let current = '';

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        current = id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  function handleScroll() {
    updateActiveNav();
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function () {
      const isOpen = sidebar.classList.toggle('open');
      mobileNavToggle.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
      mobileNavToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      sidebar.classList.remove('open');
      if (mobileNavToggle) {
        mobileNavToggle.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavToggle.setAttribute('aria-label', '메뉴 열기');
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = window.innerWidth <= 768 ? 20 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  function animateCounter(element, target, duration, isDecimal) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = isDecimal ? target.toFixed(1) : String(target);
      }
    }

    requestAnimationFrame(update);
  }

  const statValues = document.querySelectorAll('.stat-value');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          statValues.forEach(function (stat) {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = stat.hasAttribute('data-decimal');
            animateCounter(stat, target, 1600, isDecimal);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) {
    counterObserver.observe(statsRow);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();
