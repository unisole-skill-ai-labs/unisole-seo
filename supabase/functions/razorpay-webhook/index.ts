import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';

  if (!(await isValidSignature(rawBody, signature))) {
    return new Response('Invalid signature', { status: 400 });
  }

  const { event, payload } = JSON.parse(rawBody);
  if (!['payment_link.paid', 'payment.captured'].includes(event)) {
    return new Response('Ignored', { status: 200 });
  }

  const payment = payload.payment?.entity;
  const paymentLink = payload.payment_link?.entity;

  const amount = (payment?.amount ?? 0) / 100;
  const email = (payment?.email || '').toLowerCase();
  const paymentId = payment?.id;
  const plan = paymentLink?.reference_id || 'unisoleai-subscription';

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('email', email)
    .maybeSingle();
  const userId = profile?.id || null;
  const customerName =
    profile?.full_name ||
    paymentLink?.customer?.name ||
    payment?.notes?.name ||
    (email ? email.split('@')[0] : null);

  const { data: existing } = await supabase
    .from('transactions')
    .select('id')
    .eq('razorpay_payment_id', paymentId)
    .maybeSingle();

  if (!existing) {
    const { error: txError } = await supabase.from('transactions').insert({
      user_id: userId,
      customer_name: customerName,
      email,
      amount,
      currency: payment?.currency || 'INR',
      plan,
      razorpay_payment_id: paymentId,
      status: 'completed',
    });
    if (txError) {
      return new Response(`Insert failed: ${txError.message}`, { status: 500 });
    }
  }

  if (userId) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { error: subError } = await supabase.from('subscriptions').upsert(
      {
        user_id: userId,
        email,
        plan,
        status: 'active',
        started_at: now.toISOString(),
        expires_at: expiresAt,
      },
      { onConflict: 'user_id' }
    );
    if (subError) {
      return new Response(`Subscription failed: ${subError.message}`, { status: 500 });
    }
  }

  return new Response('OK', { status: 200 });
});

async function isValidSignature(body: string, signature: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const digest = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return digest === signature;
}
