import {Module} from "@nestjs/common";
import {TransactionProcessorService} from "./transaction.processor.service";
import {TransactionProcessorController} from "./transaction.processor.controller";
import {ConfigurationModule} from "../../configuration/configuration.module";
import {ConfigurationService} from "../../configuration/configuration.service";
import {RedisModule} from "@liaoliaots/nestjs-redis";

@Module({
    imports: [
        ConfigurationModule,
        RedisModule.forRootAsync({
            imports: [ConfigurationModule],
            inject: [ConfigurationService],
            useFactory: ($config: ConfigurationService) => ({
                config: {
                    host: $config.getRedisHost(),
                    port: $config.getRedisPort(),
                    password: $config.getRedisPassword(),
                },
            }),
        }),
    ],
    providers: [TransactionProcessorService],
    controllers: [TransactionProcessorController],
})
export class TransactionProcessorModule {
}
