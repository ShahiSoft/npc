const fs = require('fs');
const path = require('path');

const openapi = require('../shared/openapi.json');

const outDir = path.resolve(__dirname, '..', 'clients', 'generated', 'src');
fs.mkdirSync(outDir, { recursive: true });

const header = `/* AUTO-GENERATED CLIENT - safe to commit. Uses fetch and imports shared types. */\nimport type { User, Product, Order } from '@nusantara/shared';\n\n`;

const clientClass = `export class ApiClient {
  constructor(public baseUrl = 'http://localhost:3000') {}

  async getUser(id: string): Promise<User> {
    const res = await fetch(`${'{'}this.baseUrl{'}'}/users/${'{'}id{'}'}`);
    if (!res.ok) throw new Error('getUser failed');
    return res.json();
  }

  async createUser(user: User): Promise<User> {
    const res = await fetch(`${'{'}this.baseUrl{'}'}/users/${''}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
    if (!res.ok) throw new Error('createUser failed');
    return res.json();
  }

  async listProducts(): Promise<Product[]> {
    const res = await fetch(`${'{'}this.baseUrl{'}'}/products`);
    if (!res.ok) throw new Error('listProducts failed');
    return res.json();
  }

  async createOrder(order: Order): Promise<Order> {
    const res = await fetch(`${'{'}this.baseUrl{'}'}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    if (!res.ok) throw new Error('createOrder failed');
    return res.json();
  }
}

export default ApiClient;
`;

fs.writeFileSync(path.join(outDir, 'index.ts'), header + clientClass);
console.log('Generated client at', outDir);
