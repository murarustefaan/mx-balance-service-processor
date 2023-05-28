import {ApplicationModule} from "./application.module";
import {NestFactory} from "@nestjs/core";
import {Logger} from "@nestjs/common";

(async function () {
    const application = await NestFactory.create(ApplicationModule);

    const logger = new Logger('entrypoint');
    await application.init()
        .then(() => logger.log(`application started`))
})();
