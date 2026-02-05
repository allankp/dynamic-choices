# Contributing to Dynamic Workflow Choices

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/allankp/dynamic-workflow-choices.git
   cd dynamic-workflow-choices
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development Workflow

### Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `src/` directory

3. Run the development checks:
   ```bash
   # Format code
   npm run format

   # Lint
   npm run lint

   # Type check
   npm run typecheck

   # Run tests
   npm test

   # Build
   npm run build
   ```

4. Or run all checks at once:
   ```bash
   npm run all
   ```

### Code Style

- We use Prettier for code formatting
- ESLint for linting
- TypeScript strict mode is enabled

### Testing

- Write tests for new functionality
- Tests are located in `src/tests/`
- We use Vitest as the test framework
- Aim for good coverage of edge cases

### Building

The compiled JavaScript is committed to the `dist/` directory. This is required because GitHub Actions runs the compiled code directly.

Always run `npm run build` before committing and include the `dist/` changes in your commit.

## Pull Request Process

1. Ensure all checks pass (`npm run all`)
2. Update the README.md if you've added new features or inputs
3. Commit your changes with a descriptive message
4. Push to your fork
5. Open a pull request against the `main` branch

### PR Title Convention

We use conventional commits for PR titles:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring

### Review Process

- PRs require at least one approval before merging
- CI checks must pass
- The maintainer may request changes or ask questions

## Reporting Issues

When reporting issues, please include:

1. A clear description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Relevant workflow files (sanitized of secrets)
5. Error messages if applicable

## Questions?

Feel free to open an issue for questions or discussions about potential features.
