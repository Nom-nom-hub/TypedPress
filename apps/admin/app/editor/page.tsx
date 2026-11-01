'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  EditorHistory,
  createEmptyEditorDocument,
  insertEditorNode,
  removeEditorNode,
  updateEditorNodeProps,
  type EditorDocument,
  type EditorNode,
} from '@typedpress/editor';

const storageKey = 'typedpress-editor-document';

function defaultHero(id: string, heading: string): EditorNode {
  return {
    id,
    component: 'core:hero',
    props: { heading, description: 'Rendered from the structured document model.' },
    children: [],
  };
}

function RenderNode({ document, nodeId }: { document: EditorDocument; nodeId: string }) {
  const node = document.nodes[nodeId];
  if (!node) return null;
  if (node.component === 'core:container') {
    return (
      <section style={{ border: '1px dashed var(--tp-color-border-strong)', padding: 16, borderRadius: 8, minHeight: 80 }}>
        <div style={{ color: 'var(--tp-color-text-subtle)', marginBottom: 8 }}>Container</div>
        {node.children.map((childId) => (
          <RenderNode key={childId} document={document} nodeId={childId} />
        ))}
      </section>
    );
  }
  return (
    <article style={{ padding: 16, marginBottom: 12, background: 'var(--tp-color-surface-raised)', borderRadius: 8 }}>
      <h3 style={{ margin: 0 }}>{String(node.props.heading ?? 'Hero')}</h3>
      <p style={{ margin: '8px 0 0', color: 'var(--tp-color-text-muted)' }}>{String(node.props.description ?? '')}</p>
    </article>
  );
}

export default function EditorPage() {
  const [history, setHistory] = useState<EditorHistory | null>(null);
  const [document, setDocument] = useState<EditorDocument | null>(null);
  const [selectedId, setSelectedId] = useState<string>('root');
  const [heading, setHeading] = useState('Build something exceptional');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const initial = saved ? (JSON.parse(saved) as EditorDocument) : createEmptyEditorDocument('root');
    const editorHistory = new EditorHistory(initial);
    setHistory(editorHistory);
    setDocument(editorHistory.document);
  }, []);

  const selectedNode = useMemo(() => (document ? document.nodes[selectedId] : undefined), [document, selectedId]);

  function push(next: EditorDocument) {
    if (!history) return;
    history.push(next);
    setDocument(history.document);
    window.localStorage.setItem(storageKey, JSON.stringify(history.document));
  }

  function addHero() {
    if (!document) return;
    const id = `hero-${Date.now().toString(36)}`;
    try {
      push(insertEditorNode(document, defaultHero(id, heading), selectedId));
      setMessage(`Inserted ${id}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Insert failed');
    }
  }

  function removeSelected() {
    if (!document || selectedId === 'root') {
      setMessage('Select a removable node');
      return;
    }
    try {
      const next = removeEditorNode(document, selectedId);
      push(next);
      setSelectedId('root');
      setMessage('Removed node');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Remove failed');
    }
  }

  function updateHeading() {
    if (!document || !selectedNode || selectedNode.component !== 'core:hero') return;
    push(updateEditorNodeProps(document, selectedId, { heading }));
  }

  if (!document || !history) return <p>Loading editor…</p>;

  return (
    <>
      <div className="tp-topbar">
        <div>
          <h1 className="tp-title">Visual editor foundation</h1>
          <p style={{ color: 'var(--tp-color-text-muted)', marginTop: 4 }}>Structured document editing with undo/redo and local persistence.</p>
        </div>
        <div className="tp-row">
          <button className="tp-button tp-button-secondary" onClick={() => { if (history.undo()) { setDocument(history.document); setMessage('Undone'); } }}>Undo</button>
          <button className="tp-button tp-button-secondary" onClick={() => { if (history.redo()) { setDocument(history.document); setMessage('Redone'); } }}>Redo</button>
        </div>
      </div>

      <div className="tp-grid tp-grid-2">
        <div className="tp-card">
          <h2 className="tp-card-title">Canvas</h2>
          <RenderNode document={document} nodeId={document.root} />
        </div>

        <div className="tp-card">
          <h2 className="tp-card-title">Inspector</h2>
          <div className="tp-form-grid">
            <label>
              Selected node
              <select className="tp-input" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                {Object.keys(document.nodes).map((id) => (
                  <option key={id} value={id}>{id} ({document.nodes[id].component})</option>
                ))}
              </select>
            </label>
            {selectedNode?.component === 'core:hero' ? (
              <input className="tp-input" value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Heading" />
            ) : null}
            <div className="tp-row">
              <input className="tp-input" value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="New hero heading" />
              <button className="tp-button" onClick={addHero}>Insert hero</button>
            </div>
            <button className="tp-button tp-button-secondary" onClick={updateHeading}>Update selected heading</button>
            <button className="tp-button tp-button-secondary" onClick={removeSelected}>Remove selected</button>
            {message ? <p style={{ color: 'var(--tp-color-text-muted)' }}>{message}</p> : null}
          </div>
          <h2 className="tp-card-title" style={{ marginTop: 20 }}>Document</h2>
          <pre className="tp-pre">{JSON.stringify(document, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}