# EDITOR-SPEC.md

# Visual Website Editor Specification

**Status:** Core product specification  
**Applies to:** `packages/editor`, `packages/components`, `packages/renderer`, `apps/admin`

## 1. Product Objective

Build a professional visual React website editor.

The editor must allow non-developers to construct complete websites visually while preserving the underlying React component architecture.

It must not be a screenshot editor, static HTML generator, or proprietary page format disconnected from React.

Every visual element must resolve to a registered React component.

## 2. Core Experience

The editor must provide:

- Visual page construction.
- Drag-and-drop components.
- Component hierarchy management.
- Responsive editing.
- Component property editing.
- Reusable sections.
- Reusable components.
- Global design tokens.
- Page templates.
- Undo and redo.
- Autosave.
- Draft previews.
- Publishing.
- Developer extensibility.

## 3. Editor Layout

Use a professional three-region editor.

### Left panel

Navigation and construction tools:

- Pages.
- Components.
- Layers.
- Assets.
- Reusable sections.
- Templates.
- Site structure.

### Center canvas

The actual rendered page.

Requirements:

- Accurate component rendering.
- Selection outlines.
- Hover states.
- Drop targets.
- Responsive viewport controls.
- Zoom controls.
- Preview mode.
- Selection handles.
- Canvas scrolling.

### Right panel

Context-sensitive inspector.

Display:

- Selected component name.
- Component properties.
- Layout settings.
- Typography.
- Colors.
- Spacing.
- Responsive overrides.
- Advanced configuration.

The inspector must be generated from component metadata wherever possible.

Do not build a separate hardcoded inspector for every component.

## 4. Document Model

The editor must use a structured, versioned JSON document model.

Example:

    {
      "schemaVersion": 1,
      "type": "page",
      "root": {
        "id": "root-001",
        "component": "core:container",
        "props": {
          "width": "full",
          "maxWidth": "1200px"
        },
        "children": [
          {
            "id": "hero-001",
            "component": "core:hero",
            "props": {
              "heading": "Build something exceptional",
              "description": "A platform for modern websites."
            },
            "children": []
          }
        ]
      }
    }

This example establishes the document concept, not a mandatory final schema implementation.

Every node must have:

- Stable unique ID.
- Component identifier.
- Component version.
- Validated properties.
- Child nodes where permitted.
- Optional responsive overrides.
- Optional editor metadata.

The document must be serializable and versionable.

Never store arbitrary executable JavaScript in page documents.

## 5. Component Registry

All visual components must register metadata.

Required component definition:

    {
      "id": "core:hero",
      "version": "1.0.0",
      "label": "Hero",
      "category": "sections",
      "description": "A prominent introductory section",
      "icon": "layout-template",
      "acceptsChildren": true,
      "allowedParents": ["core:page", "core:container"],
      "defaultProps": {},
      "propertySchema": {},
      "responsiveProperties": [],
      "render": HeroComponent
    }

Implement typed registration APIs.

Component namespaces:

- `core:` Platform components.
- `theme:` Theme components.
- `plugin:` Plugin components.
- `site:` Site-specific components.

Component identifiers must remain stable.

Component versions must be tracked so old documents can be migrated safely.

## 6. Property Schema

The editor must support typed property definitions.

Initial supported types:

- String.
- Number.
- Boolean.
- Enum.
- Color.
- Image.
- Video.
- URL.
- Rich text.
- Icon.
- Spacing.
- Typography.
- Alignment.
- Object.
- Array.
- Content reference.

Each property must define:

- Name.
- Label.
- Type.
- Default value.
- Validation.
- Description.
- Optional grouping.
- Optional conditional visibility.
- Responsive behavior where supported.

Use shared runtime validation schemas.

The editor must never assume a property is valid because it came from its own UI.

## 7. Drag-and-Drop

Required behaviors:

- Drag from component library to canvas.
- Insert between existing nodes.
- Reorder siblings.
- Move components between valid containers.
- Duplicate components.
- Delete components.
- Copy and paste.
- Drag reusable sections.
- Visual drop indicators.

Enforce parent-child restrictions.

Do not permit invalid document structures.

Keyboard alternatives must exist for critical drag-and-drop actions.

## 8. Selection and Layers

Selecting an element in the canvas must synchronize with the layer tree.

Selecting an element in the layer tree must highlight the corresponding canvas element.

Support:

- Nested layers.
- Expand and collapse.
- Rename where appropriate.
- Visibility toggle.
- Locking.
- Multi-selection where operations support it.

Use stable node IDs rather than DOM position or generated CSS selectors.

## 9. Responsive Editing

Initial viewport presets:

- Desktop.
- Tablet.
- Mobile.

Support:

- Viewport switching.
- Responsive property overrides.
- Responsive typography.
- Responsive spacing.
- Visibility rules.
- Layout adjustments.

Define inheritance clearly:

Desktop/base values are inherited by smaller viewports unless overridden.

The document must distinguish inherited values from explicit overrides.

Do not generate arbitrary media-query CSS for every property without validation.

## 10. Undo and Redo

Implement command-based history.

Every editor mutation must be represented as an operation.

Examples:

- Insert node.
- Remove node.
- Move node.
- Update property.
- Duplicate node.
- Change responsive override.
- Reorder children.

Requirements:

- Undo.
- Redo.
- History boundaries.
- Stable document state.
- No accidental loss of unsaved changes.

History must not be implemented by blindly storing unlimited full-document copies.

## 11. Autosave and Publishing

Support:

- Local unsaved state.
- Server autosave.
- Save status.
- Revision creation.
- Draft preview.
- Publishing.
- Restore previous revision.

Use optimistic concurrency control.

If the server document changes while the user is editing, detect the conflict and provide a recovery path.

Never silently overwrite a newer document revision.

## 12. Reusable Sections and Templates

Support reusable:

- Sections.
- Layouts.
- Page templates.
- Component compositions.

Define whether a reusable item is:

- A shared reference.
- A detached copy.
- A versioned snapshot.

Do not make this behavior ambiguous.

Users must understand whether editing a reusable item changes every page using it.

## 13. Rich Text

Provide structured rich-text editing.

Requirements:

- Formatting.
- Links.
- Lists.
- Headings.
- Inline code.
- Media embedding where supported.
- Safe serialization.
- Sanitized rendering.

Never render untrusted raw HTML without sanitization.

## 14. Preview and Rendering

The editor preview must use the same component registry and renderer as the published website.

Preview mode must:

- Resolve draft content.
- Respect current theme.
- Support viewport presets.
- Show rendering errors.
- Avoid publishing draft changes.

The preview renderer must not execute arbitrary plugin or document code.

## 15. Accessibility

Target WCAG 2.2 AA.

Provide:

- Keyboard navigation.
- Screen-reader labels.
- Focus management.
- Accessible dialogs.
- Keyboard component insertion.
- Non-drag alternatives.
- High-contrast selection indicators.

## 16. Performance

Requirements:

- Avoid full-canvas rerenders on every inspector keystroke.
- Use targeted state updates.
- Virtualize large layer trees where appropriate.
- Lazy-load component previews where practical.
- Keep editor history efficient.
- Avoid blocking the main thread with expensive document processing.

Measure performance with representative large pages.

## 17. Testing

Required tests:

- Document validation.
- Component registration.
- Property validation.
- Node insertion.
- Node movement.
- Invalid parent-child rejection.
- Undo and redo.
- Responsive inheritance.
- Autosave.
- Conflict detection.
- Preview rendering.
- Published rendering.
- Keyboard accessibility.

## 18. Acceptance Criteria

The editor is complete when a user can:

1. Create a page.
2. Insert registered React components.
3. Arrange them visually.
4. Configure component properties.
5. Adjust desktop, tablet, and mobile layouts.
6. Undo and redo changes.
7. Save drafts.
8. Preview drafts.
9. Publish pages.
10. Reopen the page without losing its structure.

The published output must render from the same validated document model used by the editor.
