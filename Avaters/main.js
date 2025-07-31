// main.js - Handles dynamic image loading and search

// Fetch and display images from list.txt
document.addEventListener('DOMContentLoaded', function () {
  const imageGrid = document.getElementById('imageGrid');
  fetch('list.txt')
    .then(response => response.text())
    .then(text => {
      const lines = text.split('\n').filter(Boolean);
      let html = '';
      for (const line of lines) {
        const filename = line.split('/').pop();
        html += `<div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-3">
          <img src="${line}" class="gallery-img" alt="${filename}">
        </div>`;
      }
      imageGrid.innerHTML = html;
    });

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const images = imageGrid.querySelectorAll('img');
    images.forEach(img => {
      const filename = img.alt.toLowerCase();
      img.parentElement.style.display = filename.includes(filter) ? '' : 'none';
    });
  });
});
