import {Injectable, Logger} from "@nestjs/common";
import {ShardTransaction, TransactionProcessor} from "@multiversx/sdk-transaction-processor";
import {ConfigurationService} from "../../configuration/configuration.service";
import {InjectRedis} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import ms from "ms";

enum TransactionProcessingStatus {
    PROCESSING = 'processing',
    DONE = 'done',
}

@Injectable({})
export class TransactionProcessorService {
    private static readonly TRANSACTION_PROCESSING_KEY_TTL = ms('1d');

    private transactionProcessor: TransactionProcessor = new TransactionProcessor();
    private readonly logger: Logger;

    constructor(
        @InjectRedis() private readonly $cache: Redis,
        private readonly $config: ConfigurationService
    ) {
        this.logger = new Logger(TransactionProcessorService.name);
    }

    private static getTransactionProcessKey(txHash: string) {
        return `transaction:${txHash}`;
    }

    private static getLatestProcessedNonceKey(shardId: number) {
        return `last-processed-nonce:shard-${shardId}`;
    }

    process() {
        this.transactionProcessor.start({
            waitForFinalizedCrossShardSmartContractResults: true,
            gatewayUrl: this.$config.getMultiversxAPIEndpoint(),

            maxLookBehind: 1000,

            onTransactionsReceived: async (shardId, nonce, transactions, statistics) => {
                this.logger.log(`Received ${transactions.length} transactions on shard ${shardId} and nonce ${nonce}. Time left: ${statistics.secondsLeft}, nonces per second: ${statistics.noncesPerSecond}`);
                for (const transaction of transactions) {
                    const status = await this.$cache.setnx(TransactionProcessorService.getTransactionProcessKey(transaction.hash), TransactionProcessingStatus.PROCESSING);
                    if (status === 0) {
                        this.logger.verbose(`Transaction ${transaction.hash} was already being processed`);
                        continue;
                    }

                    await this.processTransaction(transaction);
                    await this.$cache.set(
                        TransactionProcessorService.getTransactionProcessKey(transaction.hash),
                        TransactionProcessingStatus.DONE,
                        'PX',
                        TransactionProcessorService.TRANSACTION_PROCESSING_KEY_TTL
                    );
                }
            },

            getLastProcessedNonce: async (shardId) => {
                return await this.$cache
                    .get(TransactionProcessorService.getLatestProcessedNonceKey(shardId))
                    .then(nonce => +(nonce ?? 0));
            },

            setLastProcessedNonce: async (shardId, nonce) => {
                await this.$cache
                    .set(TransactionProcessorService.getLatestProcessedNonceKey(shardId), nonce);
            },
        });
    }

    async processTransaction(transaction: ShardTransaction) {
        // TODO: Process transaction
        // This can be done in 2 steps, first check whether the receving or sender address is registered in the system
        //     This can be done by checking the cache for the address, cache that will be updated by the API on
        //     successful registration.
        //     If the address is registered, then process the transaction, otherwise ignore it.
        this.logger.verbose(`Processing transaction ${transaction.hash}`);
    }
}
