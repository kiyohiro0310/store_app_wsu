import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      userType: 'ADMIN',
    },
  });

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
    },
  });

  // Create products
  const mouse = await prisma.product.create({
    data: {
      name: 'Wireless Mouse',
      description: 'Smooth wireless mouse with ergonomic design.',
      price: 29.99,
      currency: 'USD',
      category: 'Electronics',
      imageUrl: 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1746576774/mouse_lq4juj.jpg',
      inStock: true,
      tags: ['electronics', 'accessory'],
      rating: 4.5,
      ownerId: alice.id,
    },
  });

  const keyboard = await prisma.product.create({
    data: {
      name: 'Mechanical Keyboard',
      description: 'Backlit mechanical keyboard with blue switches.',
      price: 79.99,
      currency: 'USD',
      category: 'Electronics',
      imageUrl: 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1746576773/keyboard_bnwylx.webp',
      inStock: true,
      tags: ['keyboard', 'mechanical'],
      rating: 4.8,
      ownerId: alice.id,
    },
  });

  const headphones = await prisma.product.create({
    data: {
      name: 'Noise Cancelling Headphones',
      description: 'Over-ear headphones with active noise cancellation.',
      price: 199.99,
      currency: 'USD',
      category: 'Audio',
      imageUrl: 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1746576776/headphone_do3n9v.jpg',
      inStock: true,
      tags: ['audio', 'headphones'],
      rating: 4.7,
      ownerId: bob.id,
    },
  });

  const monitors = await prisma.product.create({
    data: {
      name: '4K Monitor',
      description: '27-inch 4K UHD monitor with HDR support.',
      price: 499.99,
      currency: 'USD',
      category: 'Electronics',
      imageUrl: 'https://res.cloudinary.com/dtbk6m3ig/image/upload/v1746576773/monitor_ogkx9f.webp',
      inStock: true,
      tags: ['monitor', '4k'],
      rating: 4.6,
      ownerId: bob.id,
    },
  });

  // Create order for Bob
  const order = await prisma.order.create({
    data: {
      userId: bob.id,
      total: 109.98,
      status: 'PAID',
      items: {
        create: [
          {
            productId: mouse.id,
            quantity: 1,
            priceAtPurchase: 29.99,
          },
          {
            productId: keyboard.id,
            quantity: 1,
            priceAtPurchase: 79.99,
          },
        ],
      },
    },
  });

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
