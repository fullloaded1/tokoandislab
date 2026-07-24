const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateImages() {
  console.log("Updating images in database...");
  
  const updates = [
    { slug: "kabinet-termostatik-bod", image: "/images/products/lovibond-bod.jpg" },
    { slug: "thermoreactor-rd-125", image: "/images/products/lovibond-rd125.jpg" },
    { slug: "seri-handheld-sd", image: "/images/products/lovibond-sd.jpg" },
    { slug: "floc-tester-et-730", image: "/images/products/lovibond-et730.jpg" },
    { slug: "kit-uji-air-pendingin", image: "/images/products/lovibond-kit.jpg" },
    { slug: "incubator-oven-do-150f", image: "/images/products/daihan-do150f.png" },
    { slug: "centrifuge-cf-10", image: "/images/products/daihan-cf10.jpg" },
    { slug: "hotplate-hp-300", image: "/images/products/daihan-hp300.jpg" },
    { slug: "water-bath-wb-22", image: "/images/products/daihan-wb22.jpg" },
    { slug: "labu-takar-volumetrik-250ml", image: "/images/products/pyrex-volumetric.avif" },
    { slug: "pipet-ukur", image: "/images/products/pyrex-pipette.webp" },
    { slug: "labu-erlenmeyer-250ml", image: "/images/products/pyrex-erlenmeyer.jpeg" },
    { slug: "silinder-ukur", image: "/images/products/pyrex-cylinder.jpeg" },
    { slug: "lemari-penyimpanan-korosif", image: "/images/products/corrosive-storage.jpeg" },
    { slug: "lemari-penyimpanan-mudah-terbakar", image: "/images/products/flammable-storage.jpeg" },
    { slug: "flokulator-portabel-fb-4s", image: "/images/products/flokulator.png" },
    { slug: "lemari-asam-fume-hood", image: "/images/products/fume-hood.jpeg" },
    { slug: "wet-scrubber", image: "/images/products/wet-scrubber.jpeg" }
  ];

  for (const update of updates) {
    try {
      await prisma.product.update({
        where: { slug: update.slug },
        data: { image: update.image }
      });
      console.log(`Updated ${update.slug}`);
    } catch (error) {
      console.log(`Failed or not found: ${update.slug}`);
    }
  }

  console.log("Done!");
}

updateImages()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
