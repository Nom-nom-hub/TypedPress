import { z } from 'zod';

export const editorNodeSchema = z.object({
  id: z.string().min(1),
  component: z.string().min(1),
  version: z.string().optional(),
  props: z.record(z.unknown()).default({}),
  children: z.array(z.string()).default([]),
  styles: z.record(z.record(z.string())).optional(),
});

export const editorDocumentSchema = z.object({
  version: z.number().int().positive(),
  root: z.string().min(1),
  nodes: z.record(editorNodeSchema),
});

export type ResponsiveStyles = Record<string, Record<string, string>>;
export type EditorNode = z.infer<typeof editorNodeSchema>;
export type EditorDocument = z.infer<typeof editorDocumentSchema>;

export function parseEditorDocument(input: unknown): EditorDocument {
  const document = editorDocumentSchema.parse(input);
  if (!document.nodes[document.root]) {
    throw new Error('Editor document root node is missing');
  }
  return validateNodeReferences(document);
}

function validateNodeReferences(document: EditorDocument): EditorDocument {
  const ids = new Set(Object.keys(document.nodes));
  for (const node of Object.values(document.nodes)) {
    for (const childId of node.children) {
      if (!ids.has(childId)) {
        throw new Error(`Editor node references missing child: ${childId}`);
      }
    }
  }
  return document;
}

export function createEmptyEditorDocument(rootId = 'root'): EditorDocument {
  return {
    version: 1,
    root: rootId,
    nodes: {
      [rootId]: {
        id: rootId,
        component: 'core:container',
        props: {},
        children: [],
      },
    },
  };
}

function cloneDocument(document: EditorDocument): EditorDocument {
  return JSON.parse(JSON.stringify(document)) as EditorDocument;
}

export function insertEditorNode(
  document: EditorDocument,
  node: EditorNode,
  parentId: string,
  index?: number,
): EditorDocument {
  const next = cloneDocument(document);
  if (next.nodes[node.id]) {
    throw new Error(`Editor node already exists: ${node.id}`);
  }
  const parent = next.nodes[parentId];
  if (!parent) {
    throw new Error(`Parent node does not exist: ${parentId}`);
  }
  next.nodes[node.id] = node;
  const position =
    index === undefined
      ? parent.children.length
      : Math.max(0, Math.min(index, parent.children.length));
  parent.children.splice(position, 0, node.id);
  return validateNodeReferences(next);
}

export function removeEditorNode(document: EditorDocument, nodeId: string): EditorDocument {
  if (nodeId === document.root) {
    throw new Error('Cannot remove the document root');
  }
  const next = cloneDocument(document);
  if (!next.nodes[nodeId]) {
    throw new Error(`Editor node does not exist: ${nodeId}`);
  }

  const removed = new Set<string>();
  const collect = (id: string) => {
    removed.add(id);
    for (const childId of next.nodes[id]?.children ?? []) {
      collect(childId);
    }
  };
  collect(nodeId);

  for (const parent of Object.values(next.nodes)) {
    parent.children = parent.children.filter((id) => id !== nodeId);
  }

  for (const id of removed) {
    delete next.nodes[id];
  }

  return validateNodeReferences(next);
}

export function moveEditorNode(
  document: EditorDocument,
  nodeId: string,
  parentId: string,
  index?: number,
): EditorDocument {
  const next = removeEditorNode(document, nodeId);
  const node = document.nodes[nodeId];
  if (!node) {
    throw new Error(`Editor node does not exist: ${nodeId}`);
  }
  return insertEditorNode(next, JSON.parse(JSON.stringify(node)) as EditorNode, parentId, index);
}

export function updateEditorNodeProps(
  document: EditorDocument,
  nodeId: string,
  props: Record<string, unknown>,
): EditorDocument {
  const next = cloneDocument(document);
  const node = next.nodes[nodeId];
  if (!node) {
    throw new Error(`Editor node does not exist: ${nodeId}`);
  }
  node.props = { ...node.props, ...props };
  return next;
}

export class EditorHistory {
  private past: EditorDocument[] = [];
  private future: EditorDocument[] = [];
  private current: EditorDocument;

  constructor(initial: EditorDocument) {
    this.current = cloneDocument(initial);
  }

  get document() {
    return this.current;
  }

  push(next: EditorDocument) {
    this.past.push(cloneDocument(this.current));
    this.current = cloneDocument(next);
    this.future = [];
  }

  undo() {
    const previous = this.past.pop();
    if (!previous) {
      return false;
    }
    this.future.push(cloneDocument(this.current));
    this.current = previous;
    return true;
  }

  redo() {
    const next = this.future.pop();
    if (!next) {
      return false;
    }
    this.past.push(cloneDocument(this.current));
    this.current = next;
    return true;
  }
}
