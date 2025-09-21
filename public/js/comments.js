class CommentsManager {
  constructor(slug) {
    this.slug = slug;
    this.API_BASE = '/api';
  }

  async loadComments() {
    try {
        // ✅ CORRECT: Ensure proper URL format
        const url = `${this.API_BASE}/comments/${this.slug}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load comments');
        const comments = await response.json();
        this.renderComments(comments);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

  renderComments(comments) {
    const container = document.getElementById('comments-container');

    if (!comments || comments.length === 0) {
      container.innerHTML = '<p class="text-gray-600">No comments yet. Be the first to comment!</p>';
      return;
    }

    container.innerHTML = comments.map(comment => `
      <div class="comment bg-white p-4 rounded-lg shadow-sm border mb-4">
        <div class="comment-header flex justify-between items-center mb-2">
          <strong class="text-gray-900">${this.escapeHtml(comment.author_name)}</strong>
          <span class="comment-date text-sm text-gray-500">${new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
        <p class="text-gray-700">${this.escapeHtml(comment.content)}</p>
      </div>
    `).join('');
  }

  async submitComment(formData) {
    const submitBtn = document.querySelector('.comment-form button');
    const originalText = submitBtn.textContent;

    try {
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Posting...';

      const response = await fetch(`${this.API_BASE}/comments/${this.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        this.showNotification(result.message, 'success');
        document.getElementById('comment-form').reset();

        // Trigger subscription event
        document.dispatchEvent(new CustomEvent('commentSubmitted', {
          detail: { email: formData.email }
        }));

        await this.loadComments();
      } else {
        throw new Error(result.error || 'Failed to submit comment');
      }
    } catch (error) {
      this.showNotification('Error submitting comment: ' + error.message, 'error');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = originalText;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError(message) {
    const container = document.getElementById('comments-container');
    container.innerHTML = `<p class="text-red-600 bg-red-50 p-3 rounded">${message}</p>`;
  }

  // showNotification(message, type = 'info') {
  //   const notification = document.createElement('div');
  //       notification.className = `notification ${type}`;
  //       notification.textContent = message;

  //       document.body.appendChild(notification);

  //       setTimeout(() => {
  //           notification.remove();
  //   }, 5000);
  // }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        background: var(--card-bg);
        color: var(--text-color);
        border: 1px solid var(--border-color);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Initialize comments when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  const commentsSection = document.querySelector('.comments');
  if (!commentsSection) return;

  const slug = commentsSection.dataset.slug;
  const manager = new CommentsManager(slug);

  manager.loadComments();

  document.getElementById('comment-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('authorName').value,
      email: document.getElementById('authorEmail').value,
      content: document.getElementById('content').value
    };

    await manager.submitComment(formData);
  });
});
