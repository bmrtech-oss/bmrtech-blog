class HomeStats {
  constructor() {
    this.API_BASE = '/api';
  }

  async init() {
    await this.loadPostStats();
  }

  async loadPostStats() {
    const postElements = document.querySelectorAll('.post-preview');
    
    for (const element of postElements) {
      const slug = element.querySelector('.likes-count')?.dataset.slug;
      if (slug) {
        await this.updatePostStats(element, slug);
      }
    }
  }

  async updatePostStats(element, slug) {
    try {
      // Load likes count
      const likesResponse = await fetch(`${this.API_BASE}/likes/${slug}`);
      if (likesResponse.ok) {
        const likesData = await likesResponse.json();
        const likesCount = element.querySelector('.likes-count .count');
        if (likesCount) {
          likesCount.textContent = likesData.count;
        }
      }

      // Load comments count
      const commentsResponse = await fetch(`${this.API_BASE}/comments/${slug}`);
      if (commentsResponse.ok) {
        const comments = await commentsResponse.json();
        const commentsCount = element.querySelector('.comments-count .count');
        if (commentsCount) {
          commentsCount.textContent = comments.length;
        }
      }
    } catch (error) {
      console.error('Error loading post stats:', error);
    }
  }
}

// Initialize homepage stats
document.addEventListener('DOMContentLoaded', function() {
  const homeStats = new HomeStats();
  homeStats.init();
});