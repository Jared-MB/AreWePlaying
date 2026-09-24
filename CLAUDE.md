## Dependencies

- For every dependency installation for node, ALWAYS use `pnpm`.

### pnpm

- Always install exact version for npm packages, installation commands SHOULD use `@latest` and `-E`, if a dependency fails on install due pnpm `minimumReleaseAge` use the previous version. E.g. `pnpm add react@latest -E`.

## Git

- Don't switch branches until I tell you.

## Code styling

- Code can have max 4 indent deep, if a piece of code exceded this, must be extracted into a separated function.

### Typescript

- Files MUST be named with `kebab-case`. E.g. `my-function.ts`.
- Exports MUST be named, NEVER defaults:
  - ALWAYS `export function myFunction(){}`.
  - NEVER `export default function myFunction(){}`.
- Exported constants must be on `CONSTANT_CASE`. E.g. `export const MY_CONSTANT_VALUE = 18`

### React/Preact

- Files MUST be named with `kebab-case`. E.g. `my-file.tsx`.

### Astro

- Files MUST be named with `PascalCase`. E.g. `MyComponent.astro`.