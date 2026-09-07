import { API_BASE_URL } from '../config/api';
import { setAuthSession, getToken } from './auth';

const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TZACmk4obIcqzg';

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

export interface StudentEnrollData {
  name: string;
  phone: string;
  email?: string;
  collegeName?: string;
  branch?: string;
  yearOfStudy?: string;
  occupation?: string;
}

export interface PathwayItem {
  id: string;
  title: string;
  price?: number;
  mrp?: number;
  duration?: string;
  level?: string;
}

export interface InitiatePaymentParams {
  pathway: PathwayItem;
  student: StudentEnrollData;
  couponCode?: string;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
  onDismiss?: () => void;
}

/**
 * Initiates the Pathway Enrollment Payment via Razorpay and verifies on Unisole Engine.
 */
export async function initiatePathwayPayment({
  pathway,
  student,
  couponCode,
  onSuccess,
  onError,
  onDismiss,
}: InitiatePaymentParams): Promise<void> {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load secure Razorpay gateway. Please check your network connection.');
    }

    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 1. Create Checkout Order on Engine API
    const orderRes = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customerName: student.name.trim(),
        customerPhone: student.phone.trim(),
        customerEmail: student.email?.trim() || undefined,
        couponCode: couponCode?.trim() || undefined,
        items: [
          {
            itemType: 'PATHWAY',
            itemId: pathway.id,
            itemTitle: pathway.title,
            quantity: 1,
          },
        ],
        metadata: {
          collegeName: student.collegeName?.trim() || undefined,
          branch: student.branch?.trim() || undefined,
          yearOfStudy: student.yearOfStudy?.trim() || undefined,
          occupation: student.occupation?.trim() || 'STUDENT',
          source: 'SEO_PROGRAMS_PORTAL',
        },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.success) {
      throw new Error(orderData.message || 'Failed to initialize payment checkout with server');
    }

    const checkout = orderData.checkout;
    if (!checkout || !checkout.razorpayOrderId) {
      throw new Error('Invalid checkout session received from gateway');
    }

    // 2. Configure and Open Razorpay Checkout Modal
    const options = {
      key: checkout.keyId || RAZORPAY_KEY_ID,
      amount: checkout.amountPaise,
      currency: checkout.currency || 'INR',
      name: 'Unisole Innovation Lab',
      description: `Enrollment: ${pathway.title}`,
      order_id: checkout.razorpayOrderId,
      image: 'https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png',
      prefill: {
        name: checkout.customerName || student.name,
        email: checkout.customerEmail || student.email || '',
        contact: checkout.customerPhone || student.phone,
      },
      notes: {
        pathwayId: pathway.id,
        pathwayTitle: pathway.title,
        orderNumber: checkout.orderNumber,
      },
      theme: {
        color: '#4f46e5', // Indigo-600
      },
      handler: async function (response: any) {
        try {
          if (!response.razorpay_payment_id) {
            throw new Error('Payment was not completed by provider');
          }

          // 3. Verify Payment Signature & Fulfill Enrollment Atomically
          const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              providerOrderId: response.razorpay_order_id || checkout.razorpayOrderId,
              providerPaymentId: response.razorpay_payment_id,
              providerSignature: response.razorpay_signature,
              orderId: checkout.orderId,
              phone: student.phone,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.message || 'Payment signature verification failed');
          }

          // Update local session if user object returned
          if (verifyData.user) {
            setAuthSession({ token: verifyData.token || token, user: verifyData.user });
          }

          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderNumber: checkout.orderNumber || orderData.order?.orderNumber,
            amount: (checkout.amountPaise / 100),
            pathway,
            order: verifyData.order || orderData.order,
          });
        } catch (verifyErr: any) {
          console.error('[Pathway Payment] Verification error:', verifyErr);
          onError(verifyErr.message || 'Verification failed. If amount was deducted, our team will confirm within 1 hour.');
        }
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) onDismiss();
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp: any) {
      console.error('[Razorpay] Payment failed event:', resp.error);
      onError(resp.error?.description || 'Payment was declined or cancelled');
    });

    rzp.open();
  } catch (err: any) {
    console.error('[Pathway Payment] Initialization error:', err);
    onError(err.message || 'Failed to initialize payment gateway');
  }
}
