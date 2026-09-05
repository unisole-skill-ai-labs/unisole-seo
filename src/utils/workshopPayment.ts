const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface WorkshopPaymentParams {
  orderData: {
    orderId: string;
    amount: number; // in paise, e.g. 3900 for ₹39
    currency?: string;
    registrationId?: string;
    keyId?: string;
  };
  user?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  onSuccess: (paymentResponse: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature?: string;
  }) => void;
  onError?: (err: any) => void;
  onDismiss?: () => void;
}

/**
 * Initiates the ₹39 Token Commitment Payment via Razorpay
 */
export async function startWorkshopTokenPayment({
  orderData,
  user,
  onSuccess,
  onError,
  onDismiss,
}: WorkshopPaymentParams) {
  try {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Failed to load secure Razorpay gateway. Please check your network connection.');
    }

    const options = {
      key: orderData.keyId || RAZORPAY_KEY_ID,
      amount: orderData.amount || 3900,
      currency: orderData.currency || 'INR',
      name: 'UNISOLE Academic Initiative',
      description: 'AI Masterclass: Token Commitment Fee (₹39)',
      image: 'https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png',
      order_id: orderData.orderId,
      prefill: {
        name: user?.name || '',
        contact: user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : '',
        email: user?.email || '',
      },
      notes: {
        registrationId: orderData.registrationId || '',
        product: 'AI_MASTERCLASS_2026_TOKEN',
      },
      theme: {
        color: '#2563eb', // Indigo / Royal Blue
        backdrop_color: 'rgba(15, 23, 42, 0.85)',
      },
      config: {
        display: {
          blocks: {
            upi: {
              name: 'Fast UPI Payment (GPay, PhonePe, Paytm)',
              instruments: [{ method: 'upi' }],
            },
            cards: {
              name: 'Cards & NetBanking',
              instruments: [{ method: 'card' }, { method: 'netbanking' }],
            },
          },
          sequence: ['block.upi', 'block.cards'],
          preferences: { show_default_blocks: true },
        },
      },
      handler: function (response: any) {
        if (response.razorpay_payment_id) {
          onSuccess({
            razorpay_order_id: response.razorpay_order_id || orderData.orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature || 'token_verified',
          });
        } else {
          onError?.(new Error('Payment was not completed.'));
        }
      },
      modal: {
        ondismiss: function () {
          onDismiss?.();
        },
        escape: true,
        backdropclose: false,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      console.error('[Razorpay] Payment failed:', response.error);
      onError?.(new Error(response.error?.description || 'Payment transaction failed. Please try again.'));
    });
    rzp.open();
  } catch (err: any) {
    console.error('[Workshop Payment] Initialization error:', err);
    onError?.(err?.message || 'Unable to open checkout modal');
  }
}
