const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const createAllProducts = require("./src/dbControllers/index");

// Syncing all the models at once.

const PORT = process.env.PORT || 3001;

async function main() {
  try {
    conn.sync({ force: true }).then(async () => {
      await createAllProducts();
      server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`); // eslint-disable-line no-console
      });
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
