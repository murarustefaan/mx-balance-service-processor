import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";

@Injectable()
export class ConfigurationService extends ConfigService {
    constructor() {
        super();
    }

    getMultiversxAPIEndpoint(): string {
        return this.get('endpoints.multiversx') as string;
    }

    getRedisHost(): string {
        return this.get('redis.host') as string;
    }

    getRedisPort(): number {
        return this.get('redis.port') as number;
    }

    getRedisPassword(): string {
        return this.get('redis.password') as string;
    }
}
