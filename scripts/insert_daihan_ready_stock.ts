import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  { model: "LOM-205RM", name: "ROLLER MIXER", price: 6000000 },
  { model: "LOM-210RM", name: "ROLLER MIXER", price: 9900000 },
  { model: "LWB-211A", name: "ANALOG WATER BATH", price: 4450000 },
  { model: "LWD-104S", name: "S/S BASIC WATER STILL", price: 8400000 },
  { model: "GMC-361", name: "MICROCENTRIFUGE WITH TIMER", price: 3000000 },
  { model: "LBH-T02", name: "DRY BLOCK HEATER", price: 6000000 },
  { model: "LDO-060E", name: "UNIVERSAL DRYING OVEN", price: 11600000 },
  { model: "LDO-030E", name: "UNIVERSAL DRYING OVEN", price: 10400000 },
  { model: "LDO-080F", name: "FORCED CONVECTION OVEN", price: 18400000 },
  { model: "LCO-065AI", name: "AIR JACKET CO2 INCUBATOR", price: 63850000 },
  { model: "LCO-165AI", name: "AIR JACKET CO2 INCUBATOR", price: 70250000 },
  { model: "LAC-1011SV", name: "AUTOCLAVE", price: 47300000 },
  { model: "LAC-1021SV", name: "AUTOCLAVE", price: 53300000 },
  { model: "LAC-1031SV", name: "AUTOCLAVE", price: 65650000 },
  { model: "LAC-1031SVF", name: "AUTOCLAVE", price: 69850000 },
  { model: "LCV-203GR", name: "VACCINE / PHARMACY REFRIGERATOR", price: 57900000 },
  { model: "LDF-9015S", name: "ULTRA LOW TEMP. FREEZER", price: 115050000 },
  { model: "LDF-9010U", name: "ULTRA LOW TEMP. FREEZER", price: 111350000 },
  { model: "LDF-9020U", name: "ULTRA LOW TEMP. FREEZER", price: 131700000 },
  { model: "LDF-9110C", name: "ULTRA LOW TEMP. FREEZER", price: 97400000 },
  { model: "LLF-403SR", name: "LABORATORY FREEZER", price: 63900000 }
];

const DEFAULT_VARIANT_STOCK = 5;

async function upsertDefaultVariant(productId: string, model: string, price: number) {
  const sku = `DH-${model}`;
  await prisma.productVariant.upsert({
    where: { sku },
    create: {
      productId,
      sku,
      name: "Default",
      price,
      stock: DEFAULT_VARIANT_STOCK,
      reservedStock: 0,
    },
    update: {
      price,
      // Jangan reset stock kalau sudah ada riwayat — cuma sync harga.
    },
  });
}

async function main() {
  for (const p of products) {
    const slug = `daihan-${p.model.toLowerCase()}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    // check if it already exists by model
    const existing = await prisma.product.findFirst({
        where: { model: p.model }
    });

    let productId: string;

    if (existing) {
        console.log(`Product ${p.model} already exists. Updating to ready stock...`);
        await prisma.product.update({
            where: { id: existing.id },
            data: { isReadyStock: true, price: p.price }
        });
        productId = existing.id;
    } else {
        console.log(`Creating product ${p.model}...`);

        // Ensure slug is unique
        let isUnique = false;
        let counter = 1;
        let currentSlug = slug;
        while(!isUnique) {
            const exists = await prisma.product.findUnique({ where: { slug: currentSlug }});
            if (exists) {
                currentSlug = `${slug}-${counter}`;
                counter++;
            } else {
                isUnique = true;
            }
        }

        const created = await prisma.product.create({
            data: {
                slug: currentSlug,
                name: p.name,
                category: "daihan-labtech",
                categoryLabel: "Daihan Labtech",
                brand: "Daihan Labtech",
                model: p.model,
                subcategory: "General Laboratory",
                image: "/images/daihanlabtechlogo.png", // fallback image
                description: `High quality ${p.name} from Daihan Labtech. Ready stock item.`,
                price: p.price,
                isRequestPricing: false,
                isReadyStock: true
            }
        });
        productId = created.id;
    }

    // T3.1: pastikan ada minimal 1 varian "Default" supaya tampil sbg ready-stock available
    await upsertDefaultVariant(productId, p.model, p.price);
  }
  console.log("Done inserting ready stock products + default variants.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  });
