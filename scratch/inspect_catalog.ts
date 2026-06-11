import { daihanKatalog } from "./daihan-products";

daihanKatalog.forEach(cat => {
  console.log(`\nCategory: ${cat.nama}`);
  cat.produk.forEach(p => {
    console.log(`- Model: "${p.model}" | Name: "${p.nama}"`);
  });
});
