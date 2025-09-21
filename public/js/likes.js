class LikesManager {
  constructor(slug) {
    this.slug = slug;
    this.API_BASE = '/api';
    console.log('LikesManager initialized with slug:', slug); 
    this.likedKey = `liked_${slug}`;
  }

  async init() {
    await this.loadLikes();
    this.setupEventListeners();
  }

  async loadLikes() {
    try {
      // ✅ CORRECT: Ensure we have a slug and no trailing slash
      const url = `${this.API_BASE}/likes/${this.slug}`;
      console.log('Loading likes from:', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load likes');
      const data = await response.json();
      this.updateDisplay(data.count);
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  }

  async like() {
    if (this.hasLiked()) {
      this.showNotification('You already liked this post!', 'info');
      return;
    }

    const likeBtn = document.getElementById(`like-btn-${this.slug}`);
    const originalHtml = likeBtn.innerHTML;

    try {
      // Show loading state
      likeBtn.disabled = true;
      likeBtn.classList.add('loading');
      likeBtn.innerHTML = '<span class="loading-spinner"></span> Liking...';

      const response = await fetch(`${this.API_BASE}/likes/${this.slug}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to like post');

      const data = await response.json();
      this.updateDisplay(data.count);
      this.markAsLiked();
      this.showNotification('Thanks for your like!', 'success');
    } catch (error) {
      console.error('Error liking post:', error);
      this.showNotification('Error liking post. Please try again.', 'error');
    } finally {
      // Reset button state
      likeBtn.disabled = false;
      likeBtn.classList.remove('loading');
      likeBtn.innerHTML = originalHtml;
    }
  }

  updateDisplay(count) {
    const countElement = document.getElementById(`like-count-${this.slug}`);
    if (countElement) {
      countElement.textContent = count;
    }
  }

  hasLiked() {
    return localStorage.getItem(this.likedKey) === 'true';
  }

  markAsLiked() {
    localStorage.setItem(this.likedKey, 'true');
  }

  setupEventListeners() {
    const likeButton = document.getElementById(`like-btn-${this.slug}`);
    if (likeButton) {
      likeButton.addEventListener('click', () => {
        this.like();
      });
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-3 rounded-md text-sm z-50 ${type === 'success' ? 'bg-green-100 text-green-800' :
        type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
      }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize likes
document.addEventListener('DOMContentLoaded', function () {
  const likeElements = document.querySelectorAll('.likes');
  likeElements.forEach(element => {
    const slug = element.dataset.slug;
    const manager = new LikesManager(slug);
    manager.init();
  });
});
