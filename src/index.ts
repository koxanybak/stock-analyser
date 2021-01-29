import app from "./app";
import { NODE_ENV } from "./utils/config";
import { log } from "./utils/logger";

const port = process.env.PORT || 3001;

app.listen(port, () => {
    log(`Server listening on port ${port} in ${NODE_ENV} mode`);
});
