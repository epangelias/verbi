#!/usr/bin/env -S deno run -A

import type Stripe from 'stripe';
import { site } from '../app/site.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe.ts';

async function createProduct(stripe: Stripe) {
  return await stripe.products.create({
    name: 'Premium',
    description: 'Unlock premium features.',
    default_price_data: {
      unit_amount: 470,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    },
  });
}

async function createPortal(
  stripe: Stripe,
  product: Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product,
) {
  return await stripe.billingPortal.configurations.create({
    features: {
      payment_method_update: {
        enabled: true,
      },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ['price'],
        products: [product],
      },
      subscription_cancel: {
        enabled: true,
        mode: 'immediately',
      },
      invoice_history: { enabled: true },
    },
    business_profile: {
      headline: site.description,
    },
  });
}

if (!import.meta.main) throw new Error('Must run stripe_init as main');

if (!isStripeEnabled()) throw new Error('Stripe is disabled.');

const product = await createProduct(stripe);

if (typeof product.default_price !== 'string') throw new Error('No default price');

await createPortal(stripe, {
  prices: [product.default_price],
  product: product.id,
});

console.log('Set the ENV key: STRIPE_PREMIUM_PLAN_PRICE_ID=' + product.default_price);
