const { execSync } = require("child_process");

const name = process.argv[2];
if (!name) {
  console.error("Usage: npm run migration:generate -- YourMigrationName");
  process.exit(1);
}

execSync(
  `npx typeorm-ts-node-commonjs migration:generate -d src/infra/config/data-source.ts src/infra/migrations/${name}`,
  { stdio: "inherit" }
);
