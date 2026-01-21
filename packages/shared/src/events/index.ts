export enum EventType {
  // User events
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',

  // Subscription events
  SUBSCRIPTION_CREATED = 'subscription.created',
  SUBSCRIPTION_PAUSED = 'subscription.paused',

  // Payment events
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',

  // Order events
  ORDER_CREATED = 'order.created',
  ORDER_SHIPPED = 'order.shipped',

  // Shipping events
  SHIPPING_CREATED = 'shipping.created',
  SHIPPING_DELIVERED = 'shipping.delivered',
}

// Minimal typed payload examples for event contracts
import type { User, Subscription, Order } from '../types';

export interface UserCreatedPayload {
  type: EventType.USER_CREATED;
  data: User;
}

export interface SubscriptionCreatedPayload {
  type: EventType.SUBSCRIPTION_CREATED;
  data: Subscription;
}

export interface OrderCreatedPayload {
  type: EventType.ORDER_CREATED;
  data: Order;
}

export type EventPayload = UserCreatedPayload | SubscriptionCreatedPayload | OrderCreatedPayload;

export * from './pubsub';
