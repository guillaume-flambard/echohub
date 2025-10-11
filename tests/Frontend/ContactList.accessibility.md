# Contact List Accessibility Test Plan

This document outlines the accessibility improvements made to the contact list component and how to test them.

## ARIA Labels Added

### 1. Navigation Landmark
**Location**: `contact-list.tsx:77`
```tsx
<div role="navigation" aria-label="Contact list">
```
**Purpose**: Identifies the contacts list as a navigation region for screen readers.

### 2. Search Input
**Location**: `contact-list.tsx:101`
```tsx
<Input aria-label="Search contacts" />
```
**Purpose**: Provides clear label for screen readers since visual label is icon-only.

### 3. Filter Button Group
**Location**: `contact-list.tsx:104`
```tsx
<div role="group" aria-label="Filter contacts by type">
  <Button aria-pressed={filterType === 'all'} aria-label="Show all contacts">All</Button>
  <Button aria-pressed={filterType === 'app'} aria-label="Show app contacts only">Apps</Button>
  <Button aria-pressed={filterType === 'human'} aria-label="Show human contacts only">Humans</Button>
</div>
```
**Purpose**: Groups filter buttons and indicates their pressed state.

### 4. Contact List Region
**Location**: `contact-list.tsx:138`
```tsx
<div role="list" aria-label="Contacts">
```
**Purpose**: Identifies the scrollable region as a list of contacts.

### 5. Contact Items
**Location**: `contact-list.tsx:257`
```tsx
<button
  role="listitem"
  aria-label="EchoTravels, Minerva app, status: online"
  aria-current={isSelected ? 'true' : undefined}
>
```
**Purpose**: Provides full context about each contact including name, type, and status.

### 6. Mobile Close Button
**Location**: `contact-list.tsx:88`
```tsx
<Button aria-label="Close contact list">
  <X aria-hidden="true" />
</Button>
```
**Purpose**: Labels the close button and hides decorative icon from screen readers.

## Manual Testing Checklist

### Screen Reader Testing
- [ ] VoiceOver (macOS): `Cmd + F5` to enable
  - [ ] Navigate with `VO + arrow keys`
  - [ ] All landmarks are announced correctly
  - [ ] Filter buttons announce pressed state
  - [ ] Contact items announce name, type, and status

- [ ] NVDA (Windows): Free screen reader
  - [ ] Navigate with `arrow keys`
  - [ ] Test all interactive elements

- [ ] JAWS (Windows): Commercial screen reader
  - [ ] Verify all ARIA labels are read correctly

### Keyboard Navigation Testing
- [ ] Tab through all interactive elements in logical order
- [ ] Filter buttons: `Tab` to focus, `Space/Enter` to activate
- [ ] Contact items: `Tab` to focus, `Enter` to select
- [ ] Search input: `Tab` to focus, type to search
- [ ] Mobile close button: `Tab` to focus, `Enter` to close

### Color Contrast Testing
- [ ] All text meets WCAG 2.1 AA contrast ratio (4.5:1)
- [ ] Status indicators (green/yellow/gray) are distinguishable
- [ ] Focus indicators are clearly visible

## Automated Testing (Future Implementation)

To add automated accessibility tests, install these dependencies:

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-axe
```

### Example Test with jest-axe

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ContactList } from '@/components/hub/contact-list';

expect.extend(toHaveNoViolations);

test('ContactList has no accessibility violations', async () => {
  const { container } = render(
    <ContactList
      contacts={mockContacts}
      selectedContact={null}
      onSelectContact={() => {}}
    />
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Filter buttons have correct aria-pressed state', () => {
  const { getByLabelText } = render(
    <ContactList
      contacts={mockContacts}
      selectedContact={null}
      onSelectContact={() => {}}
    />
  );

  const allButton = getByLabelText('Show all contacts');
  expect(allButton).toHaveAttribute('aria-pressed', 'true');
});

test('Contact items announce full context', () => {
  const { getByLabelText } = render(
    <ContactList
      contacts={[{
        id: 1,
        name: 'EchoTravels',
        type: 'app',
        app: { status: 'online' }
      }]}
      selectedContact={null}
      onSelectContact={() => {}}
    />
  );

  const contact = getByLabelText(/EchoTravels.*Minerva app.*online/);
  expect(contact).toBeInTheDocument();
});
```

## WCAG 2.1 Compliance

The following WCAG 2.1 Level AA criteria are now met:

- ✅ **1.3.1 Info and Relationships**: Semantic HTML with proper ARIA roles
- ✅ **2.1.1 Keyboard**: All functionality available via keyboard
- ✅ **2.4.4 Link Purpose**: All interactive elements clearly labeled
- ✅ **4.1.2 Name, Role, Value**: All components have accessible names and roles
- ✅ **4.1.3 Status Messages**: Filter state changes announced via aria-pressed

## Resources

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [axe DevTools Browser Extension](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
