import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';

export const isDevEnv = process.env.NODE_ENV === 'development';
export const isTestEnv = process.env.NODE_ENV === 'test';
export const isProdEnv =
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'prod' ||
  !process.env.NODE_ENV ||
  (!isTestEnv && !isDevEnv);

const schema = Type.Object({
  /**
   * Run mode for this service. Allows you to control how the API runs, typically in an auto-scaled
   * environment. Available values are:
   * * `default`: Runs the chainhook server and the REST API server (this is the default)
   * * `writeonly`: Runs only the chainhook server
   * * `readonly`: Runs only the REST API server
   */
  RUN_MODE: Type.Enum(
    { default: 'default', readonly: 'readonly', writeonly: 'writeonly' },
    { default: 'default' }
  ),

  /** Hostname of the API server */
  API_HOST: Type.String({ default: '0.0.0.0' }),
  /** Port in which to serve the API */
  API_PORT: Type.Number({ default: 3000, minimum: 0, maximum: 65535 }),
  /** Port in which to receive chainhook events */
  EVENT_PORT: Type.Number({ default: 3099, minimum: 0, maximum: 65535 }),
  /** Event server body limit (bytes) */
  EVENT_SERVER_BODY_LIMIT: Type.Integer({ default: 20971520 }),
  /** Hostname that will be reported to the chainhook node so it can call us back with events */
  EXTERNAL_HOSTNAME: Type.String({ default: '127.0.0.1:3099' }),

  /** Hostname of the chainhook node we'll use to register predicates */
  CHAINHOOK_NODE_RPC_HOST: Type.String({ default: '127.0.0.1' }),
  /** Control port of the chainhook node */
  CHAINHOOK_NODE_RPC_PORT: Type.Number({ default: 20456, minimum: 0, maximum: 65535 }),
  /**
   * Authorization token that the chainhook node must send with every event to make sure it's
   * coming from the valid instance
   */
  CHAINHOOK_NODE_AUTH_TOKEN: Type.String({ default: 'a' }),

  PGHOST: Type.String({ default: 'localhost' }),
  PGPORT: Type.Number({ default: 5433, minimum: 0, maximum: 65535 }),
  PGUSER: Type.String({ default: 'postgres' }),
  PGPASSWORD: Type.String({ default: 'postgres' }),
  PGDATABASE: Type.String({ default: 'postgres' }),
  /** Limit to how many concurrent connections can be created */
  PG_CONNECTION_POOL_MAX: Type.Number({ default: 10 }),
  PG_IDLE_TIMEOUT: Type.Number({ default: 30 }),
  PG_MAX_LIFETIME: Type.Number({ default: 60 }),
});
type Env = Static<typeof schema>;

export const ENV = envSchema<Env>({
  schema: schema,
  dotenv: true,
});
