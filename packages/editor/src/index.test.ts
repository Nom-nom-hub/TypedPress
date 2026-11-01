import { describe, expect, it } from 'vitest';

import {
  createEmptyEditorDocument,
  insertEditorNode,
  parseEditorDocument,
  removeEditorNode,
  updateEditorNodeProps,
  EditorHistory,
} from './index.js';

describe('@typedpress/editor', () => {
  it('validates a structured document', () => {
    const document = createEmptyEditorDocument('root');
    const child = { id: 'hero', component: 'core:hero', props: {}, children: [] };
    const withChild = insertEditorNode(document, child, 'root');
    expect(parseEditorDocument(withChild).nodes.hero!.component).toBe('core:hero');
  });

  it('updates and removes nodes', () => {
    const document = createEmptyEditorDocument('root');
    const child = { id: 'hero', component: 'core:hero', props: { heading: 'Hi' }, children: [] };
    let current = insertEditorNode(document, child, 'root');
    current = updateEditorNodeProps(current, 'hero', { heading: 'Hello' });
    expect(current.nodes.hero!.props.heading).toBe('Hello');

    current = removeEditorNode(current, 'hero');
    expect(current.nodes.hero).toBeUndefined();
    expect(current.nodes.root!.children).toEqual([]);
  });

  it('supports undo and redo', () => {
    const document = createEmptyEditorDocument('root');
    const hero = { id: 'hero', component: 'core:hero', props: {}, children: [] };
    const history = new EditorHistory(document);
    const withHero = insertEditorNode(history.document, hero, 'root');
    history.push(withHero);
    expect(history.undo()).toBe(true);
    expect(history.document.nodes.hero).toBeUndefined();
    expect(history.redo()).toBe(true);
    expect(history.document.nodes.hero).toBeDefined();
  });
});
