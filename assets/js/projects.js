document.addEventListener('DOMContentLoaded', function() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const sortToggle = document.getElementById('sort-toggle');
    const projectsGrid = document.getElementById('projects-grid');
    const noResults = document.getElementById('no-results');
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
  
    function filterProjects() {
      const category = categoryFilter.value.toLowerCase();
      const searchTerm = searchInput.value.toLowerCase();
      let visibleCount = 0;
  
      projectCards.forEach(card => {
        const cardCategory = card.dataset.category.toLowerCase();
        const cardTitle = card.dataset.title;
        const cardTags = card.dataset.tags;
        
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
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  
      sortedCards.forEach(card => projectsGrid.appendChild(card));
      
      // Toggle sort order
      if (sortOrder === 'newest') {
        sortToggle.dataset.sort = 'oldest';
        sortToggle.textContent = 'Oldest ↕︎';
      } else {
        sortToggle.dataset.sort = 'newest';
        sortToggle.textContent = 'Newest ↕︎';
      }
    }
  
    categoryFilter.addEventListener('change', filterProjects);
    searchInput.addEventListener('input', filterProjects);
    sortToggle.addEventListener('click', sortProjects);
  });