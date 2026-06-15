import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  let order;

  if (args.length > 0) {
    const orderId = args[0];
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: true,
        AuditLog: true,
      }
    });
  } else {
    // get latest order
    order = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        items: true,
        AuditLog: true,
      }
    });
  }

  if (!order) {
    console.log('No order found.');
    return;
  }

  console.log('--- ORDER ---');
  console.log(`ID: ${order.id}`);
  console.log(`Order No: ${order.orderNo}`);
  console.log(`Type: ${order.type}`);
  console.log(`Status: ${order.status}`);
  console.log(`Subtotal: ${order.subtotal}`);
  console.log(`Tax: ${order.tax}`);
  console.log(`Total: ${order.total}`);
  console.log(`Display Mode: ${order.priceDisplayMode}`);
  console.log(`Guest Access Token: ${order.guestAccessToken}`);
  
  console.log('\n--- CUSTOMER ---');
  console.log(order.customer);
  
  console.log('\n--- ORDER ITEMS ---');
  console.log(order.items);
  
  console.log('\n--- AUDIT LOGS ---');
  console.log(order.AuditLog);

  // Check Reservations
  const reservations = await prisma.reservation.findMany({
    where: { orderId: order.id }
  });
  console.log('\n--- RESERVATIONS ---');
  console.log(reservations);

  // Check WhatsAppLog
  const whatsappLogs = await prisma.whatsAppLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('\n--- RECENT WHATSAPP LOGS ---');
  console.log(whatsappLogs);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
