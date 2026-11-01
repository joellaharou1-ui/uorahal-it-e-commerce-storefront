import "dotenv/config";
import { seedDatabase } from "../src/db/seed";
import { pool } from "../src/db";

async function main() {
  const force = process.argv.includes("--force");
  const result = await seedDatabase({ force });
  if (result.seeded) {
    console.log(`✔ Seeded ${result.products} products and ${result.reviews} reviews.`);
  } else {
    console.log("• Catalogue already populated — nothing to do (use --force to reset).");
  }
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
