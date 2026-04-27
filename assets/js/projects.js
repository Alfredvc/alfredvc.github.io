document.addEventListener('DOMContentLoaded', function() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const sortToggle = document.getElementById('sort-toggle');
    const projectsGrid = document.getElementById('projects-grid');
    const noResults = document.getElementById('no-results');

    if (!categoryFilter || !searchInput || !sortToggle || !projectsGrid || !noResults) return;

    const projectCards = Array.from(document.querySelectorAll('.project-card'));

    function filterProjects() {
      const category = categoryFilter.value.toLowerCase();
      const searchTerm = searchInput.value.toLowerCase();
      let visibleCount = 0;

      projectCards.forEach(card => {
        const cardCategory = (card.dataset.category || '').toLowerCase();
        const cardTitle = (card.dataset.title || '').toLowerCase();
        const cardTags = (card.dataset.tags || '').toLowerCase();
        
        const matchesCategory = !category || cardCategory === category;
        const matchesSearch = !searchTerm || 
          cardTitle.includes(searchTerm) || 
          cardTags.includes(searchTerm);
  
        if (matchesCategory && matchesSearch) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
  
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  
    function sortProjects() {
      const sortOrder = sortToggle.dataset.sort;
      const sortedCards = projectCards.slice().sort((a, b) => {
        const dateA = new Date(a.dataset.date || 0);
        const dateB = new Date(b.dataset.date || 0);
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });

      const fragment = document.createDocumentFragment();
      sortedCards.forEach(card => fragment.appendChild(card));
      projectsGrid.appendChild(fragment);
      
      // Toggle sort order
      if (sortOrder === 'newest') {
        sortToggle.dataset.sort = 'oldest';
        sortToggle.textContent = 'Oldest ↕︎';
      } else {
        sortToggle.dataset.sort = 'newest';
        sortToggle.textContent = 'Newest ↕︎';
      }
    }
  
    let searchTimer;
    categoryFilter.addEventListener('change', filterProjects);
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(filterProjects, 200);
    });
    sortToggle.addEventListener('click', sortProjects);
  });