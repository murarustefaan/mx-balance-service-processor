import {Controller} from "@nestjs/common";
import {TransactionProcessorService} from "./transaction.processor.service";

@Controller()
export class TransactionProcessorController {
    constructor(private readonly $transactions: TransactionProcessorService) {
        this.$transactions.process().then();
    }
}
