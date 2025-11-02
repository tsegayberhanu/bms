import "dotenv/config";
import app from "./app.js";
import { appConfig } from "./shared/config/app.config.js";
import "./modules/reminder/reminder.cron.js"
const PORT = appConfig.port

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

