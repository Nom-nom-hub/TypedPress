export interface EditorComponentDefinition {
  readonly id: string;
  readonly version: string;
  readonly displayName: string;
  readonly category: string;
  readonly description?: string;
  readonly defaultProps?: Readonly<Record<string, unknown>>;
  readonly allowedChildren?: readonly string[];
}

export interface EditorComponentRegistry {
  register(definition: EditorComponentDefinition): void;
  get(id: string, version?: string): EditorComponentDefinition | undefined;
  list(): readonly EditorComponentDefinition[];
  isChildAllowed(parentComponent: string | undefined, childComponent: string): boolean;
}

export function createEditorComponentRegistry(): EditorComponentRegistry {
  const components = new Map<string, EditorComponentDefinition>();

  return {
    register(definition) {
      const key = `${definition.id}@${definition.version}`;
      if (components.has(key)) {
        throw new Error(`Editor component is already registered: ${key}`);
      }
      components.set(key, definition);
    },
    get(id, version) {
      if (version) {
        return components.get(`${id}@${version}`);
      }
      return [...components.values()].find((definition) => definition.id === id);
    },
    list() {
      return [...components.values()];
    },
    isChildAllowed(parentComponent, childComponent) {
      const parent = [...components.values()].find(
        (definition) => definition.id === parentComponent,
      );
      if (!parent?.allowedChildren || parent.allowedChildren.length === 0) {
        return true;
      }
      return (
        parent.allowedChildren.includes(childComponent) || parent.allowedChildren.includes('*')
      );
    },
  };
}
