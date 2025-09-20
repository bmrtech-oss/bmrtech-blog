class SubscriptionManager {
  constructor() {
    this.API_BASE = '/api';
    this.currentEmail = null;
  }

  async init() {
    this.checkUrlForEmail();
    this.setupEventListeners();
  }

  checkUrlForEmail() {
    // Check if email is in URL parameters (for unsubscribe links)
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email) {
      this.currentEmail = email;
      this.showSubscriptionManagement();
      this.loadSubscriptionStatus();
    }
  }

  async loadSubscriptionStatus() {
    if (!this.currentEmail) return;

    try {
      const response = await fetch(`${this.API_BASE}/author/${encodeURIComponent(this.currentEmail)}`);
      if (response.ok) {
        const author = await response.json();
        this.updateSubscriptionUI(author.subscribed);
      }
    } catch (error) {
      console.error('Error loading subscription status:', error);
    }
  }

  async manageSubscription(action) {
    if (!this.currentEmail) {
      this.showNotification('Please submit a comment first to manage subscriptions', 'error');
      return;
    }

    try {
      const response = await fetch(`${this.API_BASE}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.currentEmail,
          action: action
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        this.showNotification(result.message, 'success');
        this.updateSubscriptionUI(action === 'subscribe');
        
        // Update URL if unsubscribing
        if (action === 'unsubscribe') {
          this.updateUrlWithEmail();
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.showNotification('Error managing subscription: ' + error.message, 'error');
    }
  }

  showSubscriptionManagement() {
    const managementDiv = document.getElementById('subscription-management');
    if (managementDiv) {
      managementDiv.style.display = 'block';
    }
  }

  updateSubscriptionUI(isSubscribed) {
    const unsubscribeBtn = document.getElementById('unsubscribe-btn');
    const resubscribeBtn = document.getElementById('resubscribe-btn');
    const statusDiv = document.getElementById('subscription-status');

    if (unsubscribeBtn) {
      unsubscribeBtn.style.display = isSubscribed ? 'block' : 'none';
    }
    if (resubscribeBtn) {
      resubscribeBtn.style.display = isSubscribed ? 'none' : 'block';
    }
    if (statusDiv) {
      statusDiv.textContent = isSubscribed ? 
        'You are subscribed to email notifications.' : 
        'You are unsubscribed from email notifications.';
    }
  }

  updateUrlWithEmail() {
    if (this.currentEmail) {
      const url = new URL(window.location);
      url.searchParams.set('email', this.currentEmail);
      window.history.replaceState({}, '', url);
    }
  }

  setupEventListeners() {
    // Comment form success handler
    document.addEventListener('commentSubmitted', (event) => {
      this.currentEmail = event.detail.email;
      this.showSubscriptionManagement();
      this.updateSubscriptionUI(true);
    });

    // Subscription buttons
    const unsubscribeBtn = document.getElementById('unsubscribe-btn');
    const resubscribeBtn = document.getElementById('resubscribe-btn');

    if (unsubscribeBtn) {
      unsubscribeBtn.addEventListener('click', () => {
        this.manageSubscription('unsubscribe');
      });
    }

    if (resubscribeBtn) {
      resubscribeBtn.addEventListener('click', () => {
        this.manageSubscription('subscribe');
      });
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-3 rounded-md text-sm z-50 ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
      type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
      'bg-blue-100 text-blue-800 border border-blue-200'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Initialize subscription management
document.addEventListener('DOMContentLoaded', function() {
  const subscriptionManager = new SubscriptionManager();
  subscriptionManager.init();
});

// Custom event for comment submission success
class CommentSubmittedEvent extends Event {
  constructor(email) {
    super('commentSubmitted');
    this.detail = { email };
  }
}
