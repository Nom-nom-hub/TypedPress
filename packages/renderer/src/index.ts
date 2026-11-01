import type { ComponentType } from 'react';

export interface ComponentMetadata {
  readonly id: string;
  readonly version: string;
  readonly displayName: string;
  readonly category: string;
  readonly description?: string;
}

export interface RegisteredComponent {
  readonly metadata: ComponentMetadata;
  readonly component: ComponentType<Record<string, unknown>>;
}

export interface ComponentRegistry {
  register(component: RegisteredComponent): void;
  get(id: string, version?: string): RegisteredComponent | undefined;
  list(): readonly RegisteredComponent[];
}

export function createComponentRegistry(): ComponentRegistry {
  const components = new Map<string, RegisteredComponent>();

  return {
    register(component) {
      const key = `${component.metadata.id}@${component.metadata.version}`;
      if (components.has(key)) {
        throw new Error(`Component is already registered: ${key}`);
      }
      components.set(key, component);
    },
    get(id, version) {
      if (version) {
        return components.get(`${id}@${version}`);
      }
      return [...components.values()].find((component) => component.metadata.id === id);
    },
    list() {
      return [...components.values()];
    },
  };
}
