import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const readyStockUpdates = [
  { slug: "8-channels-adjustable-volume-pipettes-5-50ul-ae-8m50-aelab", image: "/images/readystock16/8-channels Adjustable Volume Pipettes 5-50μL AE-8M50 Aelab.webp" },
  { slug: "aluminum-block-bath-dtu-r-taitec", image: "/images/readystock16/Aluminum block bath DTU-R Taitec.jpg" },
  { slug: "biological-microscope-eum-4001-labex", image: "/images/readystock16/Biological Microscope EUM-4001 Labex.jpg" },
  { slug: "co2-incubator-mg-70c-taitec", image: "/images/readystock16/CO2 Incubator MG-70C Taitec.jpg" },
  { slug: "digital-orbital-shaker-sk-o330-pro-aelab", image: "/images/readystock16/Digital Orbital Shaker SK-O330-PRO Aelab.webp" },
  { slug: "incubator-shaker-br-23um-taitec", image: "/images/readystock16/Incubator Shaker BR-23UM.jpg" },
  { slug: "incubator-shaker-br-43fl-taitec", image: "/images/readystock16/Incubator shaker BR-43FL Taitec.jpg" },
  { slug: "incubator-natural-convection-ic113c-yamato", image: "/images/readystock16/Incubators Natural Convection IC113C.jpg" },
  { slug: "micropipette-single-channel-10-100ul-ae-mb05-aelab", image: "/images/readystock16/Micropipette Single Channel 10-100μl (Fully Autoclave) AE-MB05 Aelab.png" },
  { slug: "micropipette-single-channel-100-1000ul-ae-ma08-aelab", image: "/images/readystock16/Micropipette Single Channel 100-1000μl (Non Sterile) AE-MA08 Aelab.png" },
  { slug: "pcr-cabinet-pcr-1000-aelab", image: "/images/readystock16/PCR Cabinet PCR-1000 Aelab.png" },
  { slug: "precision-balance-cy223-aczet", image: "/images/readystock16/Precision Balance CY 223 Aczet.png" },
  { slug: "vortex-mixer-delta-mixer-se-04-taitec", image: "/images/readystock16/Vortex mixer Taitec Delta Mixer Se-04.jpg" },
  { slug: "ph-meter-mw-150-milwaukee", image: "/images/readystock16/pH meter MW-150 Max Milwaukee.jpg" },
];

async function main() {
  console.log(`Updating ${readyStockUpdates.length} products to ready stock...`);
  let count = 0;

  for (const update of readyStockUpdates) {
    try {
      const updated = await prisma.product.update({
        where: { slug: update.slug },
        data: {
          isReadyStock: true,
          image: update.image
        }
      });
      console.log(`✅ Updated: ${updated.slug}`);
      count++;
    } catch (e) {
      console.error(`❌ Failed to update ${update.slug}:`, e);
    }
  }

  console.log(`\n🎉 Successfully updated ${count} products!`);
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
