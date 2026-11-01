// Subscription management for links like /blog/some-post/?token=<32 hex chars>
// (the link is meant to be included in emails). Without a valid token nothing is shown.
class SubscriptionManager {
  constructor() {
    this.API_BASE = '/api';
    this.token = null;
  }

  async init() {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token || !/^[a-f0-9]{32}$/i.test(token)) return;

    this.token = token;
    this.setupEventListeners();
    await this.loadSubscriptionStatus();
  }

  async request(action) {
    const response = await fetch(`${this.API_BASE}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: this.token, action })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Request failed');
    return result;
  }

  async loadSubscriptionStatus() {
    try {
      const result = await this.request('status');
      this.showSubscriptionManagement();
      this.updateSubscriptionUI(result.subscribed);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    }
  }

  async manageSubscription(action) {
    try {
      const result = await this.request(action);
      this.showNotification(result.message, 'success');
      this.updateSubscriptionUI(result.subscribed);
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

  setupEventListeners() {
    const unsubscribeBtn = document.getElementById('unsubscribe-btn');
    const resubscribeBtn = document.getElementById('resubscribe-btn');

    if (unsubscribeBtn) {
      unsubscribeBtn.addEventListener('click', () => this.manageSubscription('unsubscribe'));
    }
    if (resubscribeBtn) {
      resubscribeBtn.addEventListener('click', () => this.manageSubscription('resubscribe'));
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

document.addEventListener('DOMContentLoaded', function() {
  new SubscriptionManager().init();
});
