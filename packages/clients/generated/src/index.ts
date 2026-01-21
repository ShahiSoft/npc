/* Generated client - small, dependency-free, uses global fetch. */
import type { User, Product, Order } from '@nusantara/shared';

export class ApiClient {
  constructor(public baseUrl = 'http://localhost:3000') {}

  async getUser(id: string): Promise<User> {
    const res = await fetch(`${this.baseUrl}/users/${id}`);
    if (!res.ok) throw new Error('getUser failed');
    return res.json();
  }

  async createUser(user: User): Promise<User> {
    const res = await fetch(`${this.baseUrl}/users/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
    if (!res.ok) throw new Error('createUser failed');
    return res.json();
  }

  async listProducts(): Promise<Product[]> {
    const res = await fetch(`${this.baseUrl}/products`);
    if (!res.ok) throw new Error('listProducts failed');
    return res.json();
  }

  async createOrder(order: Order): Promise<Order> {
    const res = await fetch(`${this.baseUrl}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    if (!res.ok) throw new Error('createOrder failed');
    return res.json();
  }
}

export default ApiClient;
