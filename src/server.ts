import config from 'config';
import app from "./app";
import logger from "./config/logger";
import { initDb } from './db';

const startServer = async () => {

    const PORT = config.get("server.port") || 5556;
    try {


        await initDb();
        logger.info("Database connected");


        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message);
            logger.on("finish", () => {
                process.exit(1);
            });
        }
    }
};

void startServer();
