const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Kicks off a purchase for one or more courses.
 * @param {Object} params
 * @param {Array<Object>} params.courses - array of course objects (each needs _id, title; first course's thumbnail used for display)
 * @param {string} params.token - JWT
 * @param {Object} params.user - { fullName, email } for prefill (optional)
 * @param {Function} params.onSuccess - called after verify succeeds
 * @param {Function} params.onError - called with an error message
 * @param {Function} params.onDismiss - called if modal closed without paying
 */
export async function buyCourses({ courses, token, user, onSuccess, onError, onDismiss }) {
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load payment gateway. Check your connection.');
    }

    const courseIds = courses.map((c) => c._id);

    const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseIds }),
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      throw new Error(orderData.message || 'Could not start payment');
    }

    const isSingle = courses.length === 1;

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'Unisole',
      description: isSingle ? courses[0].title : `${courses.length} courses`,
      image: 'https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png',
      prefill: user ? { name: user.fullName, email: user.email } : undefined,
      config: {
        display: {
            blocks: {
            upi: {
                name: 'Pay via UPI',
                instruments: [{ method: 'upi' }],
            },
            },
            sequence: ['block.upi'],
            preferences: { show_default_blocks: true },
        },
      },
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            throw new Error(verifyData.message || 'Payment verification failed');
          }
          onSuccess?.();
        } catch (err) {
          onError?.(err.message || 'Payment verification failed. Contact support if money was deducted.');
        }
      },
      modal: {
        ondismiss: function () {
          onDismiss?.();
        },
      },
      theme: { color: '#000000' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    onError?.(err.message || 'Something went wrong');
  }
}