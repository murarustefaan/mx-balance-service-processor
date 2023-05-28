import z from 'zod';

const _config = Object.freeze({
    service: {
        host: process.env.SERVICE_HOST,
        port: process.env.SERVICE_PORT,
        logLevel: process.env.SERVICE_LOG_LEVEL,
    },

    cache: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },

    endpoints: {
        multiversx: process.env.MX_API_ENDPOINT,
    },

    authentication: {},
});

const configSchema = z.object({
    service: z.object({
        host: z.string().nonempty().default('0.0.0.0'),
        port: z.coerce.number().nonnegative().default(4000),
        logLevel: z
            .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
            .optional()
            .default('info'),
    }),

    cache: z
        .object({
            host: z.string().nonempty(),
            port: z.coerce.number().nonnegative().default(6379),
            password: z.string().optional(),
        })
        .required({
            host: true,
        }),

    endpoints: z.object({
        multiversx: z.string().nonempty(),
    }),

    authentication: z.object({}),
});

export default configSchema.parse(_config);
export type ConfigurationType = z.infer<typeof configSchema>;
