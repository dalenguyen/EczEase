# Code Style Guidelines

This document outlines the code style guidelines for the EczEase project.

## TypeScript/JavaScript Style Guide

### Quotes

- **Single quotes** (`'`) are used for string literals
- Double quotes (`"`) should only be used when necessary to avoid escaping (e.g., `'I\'m a string'` vs `"I'm a string"`)
- **Template literals** (backticks `` ` ``) are preserved and should be used for:
  - Multi-line strings
  - String interpolation with expressions: `` `Hello ${name}` ``
  - HTML templates or complex text formatting

### Semicolons

- **No semicolons** at the end of statements
- Relying on JavaScript's Automatic Semicolon Insertion (ASI)
- Be careful with:
  - Lines starting with `(`, `[`, or `/` - consider prefixing with a semicolon if needed
  - Immediately Invoked Function Expressions (IIFEs)

## Angular-Specific Guidelines

### Dependency Injection

- Always use the `inject()` function instead of constructor injection
- Declare dependencies as `private readonly` class properties:

```typescript
export class ExampleComponent {
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);

  // Rest of the component...
}
```

### Signals and State Management

- Use Angular's signals for reactive state management
- Declare read-only signals with `signal<T>()` and models with `model<T>()`
- Access signal values directly with parentheses: `this.mySignal()`

## Running Linting

To check for code style issues or fix them automatically:

```bash
# Check for linting issues
npx nx lint webapp

# Fix linting issues automatically
npx nx lint webapp --fix
```

## Best Practices

1. **Always check linting before committing code**
2. **Configure your editor to format on save** to avoid manual style fixes
3. **Don't disable style rules** without team discussion
