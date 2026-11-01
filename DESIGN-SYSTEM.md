# DESIGN-SYSTEM.md

# Product Design System & User Experience Standards

**Status:** Mandatory design specification  
**Applies to:** `apps/admin`, `packages/ui`, `packages/editor`, `apps/docs`

## 1. Design Objective

Build a premium, professional software interface suitable for a serious commercial developer platform.

The interface must feel intentional, precise, consistent, and exceptionally usable.

It must not resemble:

- A generic AI-generated dashboard.
- A starter SaaS template.
- An unmodified component library demo.
- A collection of unrelated cards.
- A visually overloaded developer console.

Use established enterprise software quality as the benchmark.

Reference quality standards:

- Linear: interaction consistency and visual discipline.
- Vercel: developer-focused information architecture.
- Stripe: clarity and documentation quality.
- Figma: professional editing workflows.
- Raycast: command-driven interaction.

These are quality references, not interfaces to copy.

## 2. Design Principles

1. Function before decoration.
2. Information hierarchy must be obvious.
3. Every screen must have a clear primary purpose.
4. Use consistent spacing and alignment.
5. Avoid unnecessary borders and containers.
6. Use color intentionally.
7. Prioritize readable typography.
8. Provide immediate interaction feedback.
9. Preserve user context during navigation.
10. Make complex workflows understandable.

## 3. Visual Direction

Default direction:

- Premium dark administrative interface.
- Neutral charcoal and graphite surfaces.
- Restrained accent color.
- High-contrast text.
- Subtle borders.
- Consistent iconography.
- Carefully controlled shadows.
- Minimal decorative gradients.

The system must also support a complete light theme.

Dark and light modes must share the same design tokens.

Do not hardcode colors in individual components.

## 4. Design Tokens

Define centralized tokens for:

### Colors

- Background.
- Surface.
- Elevated surface.
- Primary text.
- Secondary text.
- Muted text.
- Borders.
- Primary accent.
- Success.
- Warning.
- Error.
- Information.
- Focus indicators.

### Typography

- Font family.
- Display scale.
- Heading scale.
- Body scale.
- Caption scale.
- Line heights.
- Font weights.
- Letter spacing.

### Spacing

Use a consistent spacing scale based on a 4px foundation.

### Radius

Define consistent:

- Small.
- Medium.
- Large.
- Extra large.
- Pill.

### Elevation

Define:

- Flat.
- Raised.
- Overlay.
- Modal.

### Motion

Define:

- Fast interaction.
- Standard transition.
- Deliberate transition.
- Reduced-motion behavior.

## 5. Application Navigation

The administrative application must have a consistent navigation system.

Primary areas:

- Overview.
- Sites.
- Content.
- Pages.
- Media.
- Themes.
- Plugins.
- Users.
- Settings.

Navigation must support:

- Clear active states.
- Collapsible navigation.
- Keyboard navigation.
- Responsive layouts.
- Breadcrumbs where useful.
- Persistent site context.

Do not force every feature into the primary navigation. Use contextual navigation for secondary workflows.

## 6. Component Standards

Build shared, reusable components.

Required foundations:

- Button.
- Icon button.
- Input.
- Textarea.
- Select.
- Checkbox.
- Radio.
- Switch.
- Tooltip.
- Popover.
- Dropdown.
- Dialog.
- Drawer.
- Tabs.
- Table.
- Data grid.
- Badge.
- Alert.
- Toast.
- Command palette.
- Breadcrumb.
- Pagination.
- Empty state.
- Loading state.
- Error state.

Each component must define:

- Variants.
- Sizes.
- States.
- Keyboard behavior.
- Accessibility requirements.
- Responsive behavior.

Do not create duplicate versions of the same primitive across applications.

## 7. Interaction Standards

Every interactive element must provide:

- Default state.
- Hover state.
- Focus state.
- Active state.
- Disabled state.
- Loading state where applicable.
- Error state where applicable.

Avoid interactions that provide no feedback.

Destructive actions must require appropriate confirmation.

Save operations must communicate whether data is saved, saving, or unsaved.

## 8. Typography and Information Density

Use a consistent typographic hierarchy.

Avoid:

- Oversized headings on administrative screens.
- Excessive text decoration.
- Too many font weights.
- Tiny low-contrast labels.
- Long unbroken content blocks.

Use information density appropriate to the task.

Developer-facing screens may be dense, but must remain readable.

## 9. Layout Standards

Use consistent:

- Application shell.
- Content widths.
- Sidebars.
- Panel spacing.
- Page headers.
- Toolbars.
- Forms.
- Tables.
- Dialog dimensions.

Avoid placing every section inside a card.

Use open layouts when grouping is already clear through alignment, spacing, or typography.

## 10. Visual Editor Design

The editor requires a specialized interface rather than the standard administrative layout.

Required structure:

- Left component and layer panel.
- Central canvas.
- Right property inspector.
- Contextual top toolbar.

The canvas must receive the most visual attention.

The inspector must be compact, structured, and context-sensitive.

The component library must support search and categories.

Selection states must be clear without overwhelming the actual page design.

Avoid excessive floating panels and unnecessary overlays.

## 11. Forms

Forms must:

- Group related fields.
- Use clear labels.
- Explain validation errors.
- Preserve entered values after recoverable errors.
- Support keyboard navigation.
- Show required fields.
- Avoid unnecessary confirmation steps.

Use inline validation where useful.

Do not validate every keystroke if doing so interrupts the workflow.

## 12. Tables and Data Views

Tables must support appropriate combinations of:

- Sorting.
- Filtering.
- Search.
- Pagination.
- Selection.
- Bulk actions.
- Column configuration.
- Empty states.

Do not use a table when a different representation makes the data easier to understand.

## 13. Motion and Animation

Motion must communicate:

- State changes.
- Navigation.
- Hierarchy.
- Progress.
- Context.

Do not animate everything.

Avoid animation that delays task completion.

Respect `prefers-reduced-motion`.

## 14. Responsive Behavior

The administrative interface must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

The visual editor should prioritize desktop and tablet experiences, while providing a usable mobile management experience.

Public websites must be responsive independently of the administrative interface.

## 15. Accessibility

Target WCAG 2.2 AA.

Requirements:

- Semantic HTML.
- Keyboard accessibility.
- Visible focus.
- Accessible names.
- Sufficient contrast.
- Screen-reader compatibility.
- Proper form labeling.
- Accessible dialogs.
- Reduced motion.
- Non-color-only status indicators.

## 16. Empty, Loading, and Error States

Every major screen must define:

- Initial loading.
- Empty data.
- No search results.
- Permission denied.
- Network failure.
- Validation failure.
- Server failure.
- Successful completion.

Do not use endless spinners.

Provide useful recovery actions when possible.

## 17. Design Quality Gate

Before a screen is considered complete, verify:

- Layout consistency.
- Typography hierarchy.
- Spacing consistency.
- Responsive behavior.
- Keyboard operation.
- Loading and empty states.
- Error handling.
- Accessibility.
- Visual alignment.
- Functional interactions.

A screen that merely renders is not complete.

## 18. Implementation Rules

- Use centralized tokens.
- Use shared UI primitives.
- Use Lucide icons consistently.
- Avoid emoji as interface icons.
- Avoid arbitrary one-off styling.
- Avoid unnecessary gradients.
- Avoid excessive glassmorphism.
- Avoid decorative dashboard charts without meaningful data.
- Do not hardcode fake metrics.
- Do not use placeholder buttons.
- Do not create interactions that appear functional but do nothing.

Use real product data or clearly identified development fixtures.

## 19. Acceptance Criteria

The design system is complete when:

- Dark and light themes work.
- Shared primitives are implemented.
- Components have documented variants.
- Design tokens are centralized.
- Administrative navigation is consistent.
- Editor layout follows its specialized design.
- Critical workflows are keyboard accessible.
- Responsive behavior is verified.
- Accessibility requirements are tested.
- Major screens pass the design quality gate.
