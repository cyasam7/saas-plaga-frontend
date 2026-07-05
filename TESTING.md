# Testing Guide

This project is configured with Vitest and React Testing Library for unit and integration testing.

## Setup

The testing environment is already configured with:

- **Vitest**: Fast unit test framework
- **React Testing Library**: React component testing utilities
- **jsdom**: DOM environment for testing
- **@testing-library/jest-dom**: Custom matchers for DOM testing

## Running Tests

### Run all tests

```bash
npm run test
```

### Run tests in watch mode

```bash
npm run test
```

### Run tests once

```bash
npm run test:run
```

### Run tests with UI

```bash
npm run test:ui
```

### Run tests with coverage

```bash
npm run test:coverage
```

## Writing Tests

### Component Testing

Use the custom render function from `src/testUtils.tsx` for components that need providers:

```tsx
import { render, screen, fireEvent } from '../testUtils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

### Service Testing

For testing services, mock the dependencies:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { MyService } from './MyService';

// Mock axios or other dependencies
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('MyService', () => {
  it('should fetch data', async () => {
    // Test implementation
  });
});
```

### Utility Function Testing

For pure functions, no special setup is needed:

```tsx
import { describe, it, expect } from 'vitest';
import { myUtilityFunction } from './utils';

describe('myUtilityFunction', () => {
  it('should return expected result', () => {
    expect(myUtilityFunction('input')).toBe('expected output');
  });
});
```

## Test Structure

- Tests should be placed in `__tests__` folders next to the components they test
- Use descriptive test names that explain what is being tested
- Group related tests using `describe` blocks
- Use `beforeEach` and `afterEach` for setup and cleanup

## Mocking

### API Calls

Mock axios or other HTTP clients:

```tsx
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));
```

### Components

Mock child components when testing parent components:

```tsx
vi.mock('./ChildComponent', () => ({
  default: ({ children }: any) => <div data-testid="child">{children}</div>
}));
```

### Hooks

Mock custom hooks:

```tsx
vi.mock('./useCustomHook', () => ({
  useCustomHook: () => ({ data: mockData, loading: false })
}));
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the user sees and does
2. **Use data-testid sparingly**: Prefer accessible queries like `getByRole`, `getByLabelText`
3. **Mock external dependencies**: Keep tests isolated and fast
4. **Write descriptive test names**: Make it clear what each test is checking
5. **Keep tests simple**: One assertion per test when possible
6. **Use proper cleanup**: Let Testing Library handle most cleanup automatically

## Coverage

The project is configured to generate coverage reports. Run `npm run test:coverage` to see coverage statistics and generate an HTML report in the `coverage/` directory.

## Debugging Tests

- Use `screen.debug()` to see the current DOM state
- Use `screen.logTestingPlaygroundURL()` to get Testing Playground URL
- Use `--reporter=verbose` for more detailed output
- Use `--ui` flag to run tests in the browser with Vitest UI
