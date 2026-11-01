import { createLogger, type Logger } from '@typedpress/logger';

export interface ServiceToken<TService> {
  readonly key: string;
  readonly _serviceType?: TService;
}

export function createServiceToken<TService>(key: string): ServiceToken<TService> {
  return { key };
}

export class ServiceNotFoundError extends Error {
  constructor(key: string) {
    super(`Service is not registered: ${key}`);
    this.name = 'ServiceNotFoundError';
  }
}

export class DuplicateServiceError extends Error {
  constructor(key: string) {
    super(`Service is already registered: ${key}`);
    this.name = 'DuplicateServiceError';
  }
}

export interface ServiceContainer {
  register<TService>(token: ServiceToken<TService>, service: TService): void;
  resolve<TService>(token: ServiceToken<TService>): TService;
  has(token: ServiceToken<unknown>): boolean;
}

function createServiceContainer(): ServiceContainer {
  const services = new Map<object, unknown>();

  return {
    register(token, service) {
      if (services.has(token)) {
        throw new DuplicateServiceError(token.key);
      }
      services.set(token, service);
    },
    resolve(token) {
      const service = services.get(token);
      if (service === undefined) {
        throw new ServiceNotFoundError(token.key);
      }
      return service as never;
    },
    has(token) {
      return services.has(token);
    },
  };
}

export type EventHandler<TPayload = unknown> = (payload: TPayload) => void | Promise<void>;

export interface EventBus {
  on<TPayload = unknown>(event: string, handler: EventHandler<TPayload>): () => void;
  emit<TPayload = unknown>(event: string, payload: TPayload): Promise<void>;
}

function createEventBus(logger: Logger): EventBus {
  const handlers = new Map<string, Set<EventHandler<unknown>>>();

  return {
    on(event, handler) {
      const existing = handlers.get(event) ?? new Set();
      existing.add(handler as EventHandler<unknown>);
      handlers.set(event, existing);
      return () => {
        existing.delete(handler as EventHandler<unknown>);
      };
    },
    async emit(event, payload) {
      const existing = handlers.get(event);
      if (!existing) {
        return;
      }
      for (const handler of existing as Set<EventHandler<unknown>>) {
        try {
          await handler(payload as unknown);
        } catch (error) {
          logger.error('Event handler failed', {
            event,
            error: error instanceof Error ? error.message : String(error),
          });
          throw error;
        }
      }
    },
  };
}

export interface Platform {
  readonly container: ServiceContainer;
  readonly events: EventBus;
  readonly logger: Logger;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface PlatformOptions {
  readonly logger?: Logger;
}

export function createPlatform(options: PlatformOptions = {}): Platform {
  const logger = options.logger ?? createLogger();
  const container = createServiceContainer();
  const events = createEventBus(logger);
  let running = false;

  return {
    container,
    events,
    logger,
    async start() {
      if (running) {
        return;
      }
      running = true;
      try {
        await events.emit('platform.started', undefined);
      } catch (error) {
        running = false;
        throw error;
      }
    },
    async stop() {
      if (!running) {
        return;
      }
      running = false;
      try {
        await events.emit('platform.stopped', undefined);
      } catch (error) {
        running = true;
        throw error;
      }
    },
  };
}
