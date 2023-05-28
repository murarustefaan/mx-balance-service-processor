import {Module} from "@nestjs/common";
import {ConfigurationService} from "./configuration.service";
import {ConfigModule} from "@nestjs/config";

@Module({
    providers: [ConfigurationService],
    exports: [ConfigurationService],
})
export class ConfigurationModule extends ConfigModule {
}
