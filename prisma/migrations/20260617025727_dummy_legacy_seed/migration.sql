-- Seed legacy Customer
INSERT INTO "Customer" ("id", "name", "email", "phone", "createdAt", "updatedAt")
VALUES ('cust-legacy-1', 'Legacy Cust', 'legacy@test.local', '081234567890', NOW(), NOW());

-- Seed Legacy Orders with various paymentMethod strings (before enum conversion)
INSERT INTO "Order" ("id", "orderNo", "orderType", "customerId", "status", "subtotal", "taxAmount", "shippingFee", "totalAmount", "paidAmount", "paymentMethod", "shippingAddress", "createdAt", "updatedAt")
VALUES 
  ('order-legacy-1', 'ORD-LEG-001', 'DIRECT', 'cust-legacy-1', 'PENDING_PAYMENT', 10000, 1100, 0, 11100, 0, 'cash', 'Jl. Legacy', NOW(), NOW()),
  ('order-legacy-2', 'ORD-LEG-002', 'DIRECT', 'cust-legacy-1', 'PENDING_PAYMENT', 20000, 2200, 0, 22200, 0, 'bank transfer', 'Jl. Legacy', NOW(), NOW()),
  ('order-legacy-3', 'ORD-LEG-003', 'DIRECT', 'cust-legacy-1', 'PENDING_PAYMENT', 30000, 3300, 0, 33300, 0, 'midtrans gateway', 'Jl. Legacy', NOW(), NOW());

-- Seed Legacy PaymentTerm entries before they are unified into Invoice
INSERT INTO "PaymentTerm" ("id", "orderId", "name", "amount", "dueDate", "status", "createdAt", "updatedAt")
VALUES
  ('term-1', 'order-legacy-1', 'DP 50%', 5000, NOW() + INTERVAL '7 days', 'UNPAID', NOW(), NOW()),
  ('term-2', 'order-legacy-2', 'Pelunasan', 10000, NOW() + INTERVAL '7 days', 'WAITING_VERIFICATION', NOW(), NOW()),
  ('term-3', 'order-legacy-3', 'Termin 1', 15000, NOW() + INTERVAL '7 days', 'PAID', NOW(), NOW());
