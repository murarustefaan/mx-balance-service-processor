import {Module} from "@nestjs/common";
import {TransactionProcessorModule} from "./workers/transaction-processor/transaction.processor.module";
import configuration from "../config/configuration";
import {ConfigurationModule} from "./configuration/configuration.module";

@Module({
    imports: [
        ConfigurationModule.forRoot({
            load: [() => configuration],
        }),
        TransactionProcessorModule
    ],
    providers: [],
    controllers: [],
})
export class ApplicationModule {
}
