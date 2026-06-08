/**
 * WebSocket Service for Quick Search Real-time Updates
 * Handles real-time notifications for offers, location, timer, and payments
 */

import { SOCKET_URL } from '@/utilities/var';

class QuickSearchSocket {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Connect to WebSocket
   * @param {string} userId - Current user ID
   * @param {string} token - Auth token
   */
  connect(userId, token) {
    if (this.socket && this.isConnected) {
      return; // Already connected
    }

    try {
      const url = `${SOCKET_URL}quick-search/${userId}/?token=${token}`;
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('Quick Search WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected', { userId });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('Quick Search WebSocket error:', error);
        this.isConnected = false;
      };

      this.socket.onclose = () => {
        console.log('Quick Search WebSocket closed');
        this.isConnected = false;
        this.attemptReconnect(userId, token);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  /**
   * Attempt to reconnect
   */
  attemptReconnect(userId, token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect(userId, token);
      }, delay);
    }
  }

  /**
   * Handle incoming messages
   */
  handleMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case 'new_offer':
        this.emit('newOffer', payload);
        break;
      case 'offer_accepted':
        this.emit('offerAccepted', payload);
        break;
      case 'offer_declined':
        this.emit('offerDeclined', payload);
        break;
      case 'location_update':
        this.emit('locationUpdate', payload);
        break;
      case 'stage_change':
        this.emit('stageChange', payload);
        break;
      case 'timer_started':
        this.emit('timerStarted', payload);
        break;
      case 'timer_stopped':
        this.emit('timerStopped', payload);
        break;
      case 'timer_resumed':
        this.emit('timerResumed', payload);
        break;
      case 'payment_requested':
        this.emit('paymentRequested', payload);
        break;
      case 'code_generated':
        this.emit('codeGenerated', payload);
        break;
      case 'job_completed':
        this.emit('jobCompleted', payload);
        break;
      default:
        console.log('Unknown message type:', type);
    }
  }

  /**
   * Subscribe to events
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Send message to server
   */
  send(type, payload) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected. Cannot send message.');
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }
}

// Export singleton instance
export const quickSearchSocket = new QuickSearchSocket();

// Export class for testing
export default QuickSearchSocket;

