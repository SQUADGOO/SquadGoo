import { colors } from '@/theme';

/**
 * Extract numeric price from price string
 * @param {string|number} priceString - Price string like "1200 SG" or number
 * @returns {number} - Numeric price value
 */
export const getPriceNumber = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  if (!priceString) return 0;
  const match = priceString.toString().match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
};

/**
 * Calculate total price for cart items
 * @param {Array} items - Array of cart items with price and quantity
 * @returns {number} - Total price
 */
export const calculateCartTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => {
    const price = getPriceNumber(item.price);
    return total + price * (item.quantity || 1);
  }, 0);
};

/**
 * Calculate delivery fee based on delivery method
 * @param {string} deliveryMethod - Delivery method: "pickup", "sellerDelivery", "squadCourier"
 * @returns {number} - Delivery fee in AUD
 */
export const calculateDeliveryFee = (deliveryMethod) => {
  if (!deliveryMethod) return 0;
  switch (deliveryMethod) {
    case 'pickup':
      return 0;
    case 'sellerDelivery':
      return 10;
    case 'squadCourier':
      return 15;
    default:
      return 0;
  }
};

/**
 * Get color for order status badge
 * @param {string} status - Order status
 * @returns {string} - Color hex code
 */
export const getOrderStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return colors.orange;
    case 'confirmed':
      return colors.primary;
    case 'processing':
      return colors.darkBlue;
    case 'shipped':
      return colors.secondary;
    case 'delivered':
      return colors.green;
    case 'cancelled':
      return colors.red;
    default:
      return colors.gray;
  }
};

/**
 * Get icon name for order status
 * @param {string} status - Order status
 * @returns {string} - Icon name for Ionicons
 */
export const getOrderStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return 'time-outline';
    case 'confirmed':
      return 'checkmark-circle-outline';
    case 'processing':
      return 'sync-outline';
    case 'shipped':
      return 'car-outline';
    case 'delivered':
      return 'checkmark-done-circle-outline';
    case 'cancelled':
      return 'close-circle-outline';
    default:
      return 'ellipse-outline';
  }
};

/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time in the format
 * @returns {string} - Formatted date string
 */
export const formatOrderDate = (dateString, includeTime = false) => {
  if (!dateString) return 'Date not available';
  const date = new Date(dateString);
  
  if (includeTime) {
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format price to display string with currency
 * @param {string|number} price - Price value
 * @param {string} currency - Currency code (default: 'AUD')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = 'AUD') => {
  const priceNum = getPriceNumber(price);
  return `${priceNum.toFixed(2)} ${currency}`;
};

/**
 * Get delivery method display name
 * @param {string} deliveryMethod - Delivery method code
 * @returns {string} - Display name
 */
export const getDeliveryMethodName = (deliveryMethod) => {
  switch (deliveryMethod) {
    case 'pickup':
      return 'Pickup';
    case 'sellerDelivery':
      return 'Seller Delivery';
    case 'squadCourier':
      return 'Squad Courier';
    default:
      return 'Not specified';
  }
};

/**
 * Generate unique order ID
 * @returns {string} - Unique order ID
 */
export const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Format card number with spaces (e.g., "1234 5678 9012 3456")
 * @param {string} text - Card number input
 * @returns {string} - Formatted card number
 */
export const formatCardNumber = (text) => {
  const cleaned = text.replace(/\s/g, '');
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  return formatted.slice(0, 19);
};

/**
 * Format expiry date (e.g., "12/25")
 * @param {string} text - Expiry date input
 * @returns {string} - Formatted expiry date
 */
export const formatExpiryDate = (text) => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  }
  return cleaned;
};

/**
 * Validate card number
 * @param {string} cardNumber - Card number with or without spaces
 * @returns {boolean} - True if valid
 */
export const validateCardNumber = (cardNumber) => {
  const cleaned = (cardNumber || '').replace(/\s/g, '');
  return cleaned.length >= 16 && /^\d+$/.test(cleaned);
};

/**
 * Validate expiry date
 * @param {string} expiryDate - Expiry date in MM/YY format
 * @returns {boolean} - True if valid
 */
export const validateExpiryDate = (expiryDate) => {
  if (!expiryDate || expiryDate.length < 5) return false;
  const [month, year] = expiryDate.split('/');
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt('20' + year, 10);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (monthNum < 1 || monthNum > 12) return false;
  if (yearNum < currentYear) return false;
  if (yearNum === currentYear && monthNum < currentMonth) return false;
  
  return true;
};

/**
 * Validate CVV
 * @param {string} cvv - CVV code
 * @returns {boolean} - True if valid
 */
export const validateCVV = (cvv) => {
  return cvv && cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
};

