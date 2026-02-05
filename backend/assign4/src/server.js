const { env } = require("./config/env");
const { connectMongo, closeMongo } = require("./config/mongo");
const { createApp } = require("./app");

async function main() {
    await connectMongo();
    const app = createApp();

    const server = app.listen(env.port, () => {
        console.log(`API listening on port ${env.port} (${env.nodeEnv})`);
    });

    const shutdown = async () => {
        console.log("Shutting down...");
        server.close(async () => {
            await closeMongo();
            process.exit(0);
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
