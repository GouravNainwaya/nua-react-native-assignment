# Global Windsurf Rules for React Native & Flutter Development

1. **Never Break Existing Flow or Business Logic**
   - The highest priority is to preserve the existing application behavior.
   - Never modify or refactor working code unless it is explicitly required for the task.
   - Do not break existing flows, business logic, navigation, APIs, or user experience.
   - Avoid unnecessary "best practice", "industry standard", or "smart" refactors if they are not requested.
   - Respect the founder's or project's existing architecture and implementation decisions, even if they differ from common industry practices.
   - Keep changes as isolated and minimal as possible so existing functionality remains untouched.

2. **No Syntax Errors**
   - Always ensure code compiles without syntax mistakes.
   - Validate imports, hooks, widget tree, and closing brackets.

3. **Respect Existing Codebase**
   - Before adding new functionality, review how similar features are already implemented.
   - Match the existing project structure, naming conventions, and styling.
   - Reuse existing utilities, components, and helper functions wherever possible.

4. **Code Consistency**
   - In React Native: follow existing patterns for hooks, navigation, state management, and styles.
   - In Flutter: follow existing widget structures, theme usage, and state management approach.

5. **Keep It Simple First**
   - Default to the simplest solution that integrates well with the current code.
   - Avoid overengineering or introducing unnecessary complexity without strong justification.

6. **Error Handling**
   - Always add basic null-safety checks (Flutter) and error boundaries/guards (React Native).
   - Never leave silent failures—log or handle errors gracefully.

7. **Testing & Verification**
   - In Flutter: ensure `flutter analyze` and `flutter test` pass when applicable.
   - In React Native: ensure `npm/yarn run lint` passes and no ESLint/TypeScript errors remain.

8. **Dependencies**
   - Do not add new libraries without checking if the functionality already exists in the project.
   - If a new dependency is truly required, document why it’s necessary.

9. **UI/UX Integrity**
   - Preserve existing design consistency (padding, colors, typography).
   - Check responsiveness across common device sizes before finalizing.

10. **Incremental Changes**
   - Make small, safe changes instead of large rewrites.
   - Clearly mark TODOs or FIXMEs instead of leaving incomplete logic.

11. **Review Before Commit**
   - Double-check code readability and maintainability.
   - Prefer clarity over cleverness.