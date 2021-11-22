import chalk from "chalk";
import express from "express";

import { showBanner } from "src/scripts/build";

let port = 3000;
let server = express();

server.use(express.static('dist'));

server.listen(port, () => {
    showBanner();
    console.log('\n' + chalk.bgGreen.black(' СЕРВЕР ЗАПУЩЕН! ') + ' http://localhost:' + port);
});