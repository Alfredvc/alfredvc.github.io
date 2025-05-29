// Mobile navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  
  if (mobileMenuToggle && siteNav) {
    mobileMenuToggle.addEventListener('click', function() {
      // Toggle the active state of the hamburger button
      mobileMenuToggle.classList.toggle('active');
      
      // Toggle the mobile navigation menu
      siteNav.classList.toggle('mobile-nav-open');
    });
    
    // Close mobile menu when clicking on navigation links
    const navLinks = siteNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuToggle.classList.remove('active');
        siteNav.classList.remove('mobile-nav-open');
      });
    });
    
    // Close mobile menu when clicking outside of it
    document.addEventListener('click', function(event) {
      const isClickInsideNav = siteNav.contains(event.target);
      const isClickOnToggle = mobileMenuToggle.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnToggle && siteNav.classList.contains('mobile-nav-open')) {
        mobileMenuToggle.classList.remove('active');
        siteNav.classList.remove('mobile-nav-open');
      }
    });
    
    // Close mobile menu on window resize if it gets too wide
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && siteNav.classList.contains('mobile-nav-open')) {
        mobileMenuToggle.classList.remove('active');
        siteNav.classList.remove('mobile-nav-open');
      }
    });
  }
});