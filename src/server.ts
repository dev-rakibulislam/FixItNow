import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";



// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });
async function startServer() {
  try {
    await prisma.$connect();
    console.log("database connected successfully.");
    app.listen(config.port, () => {
      console.log(`running on ${config.port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.dir(error);
  }
}
startServer();
