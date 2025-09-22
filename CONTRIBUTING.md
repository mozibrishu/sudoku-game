# Contributing to Sudoku Master

Thank you for your interest in contributing to Sudoku Master! This document provides guidelines and information for contributors.

## Getting Started

Before you begin contributing, please make sure you have read and understood our [Code of Conduct](CODE_OF_CONDUCT.md) and [Development Guide](DEVELOPMENT.md).

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)
- Git
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/sudoku-master.git
   ```
3. Navigate to the project directory:
   ```bash
   cd sudoku-master
   ```
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Start the development server:
   ```bash
   pnpm run dev
   ```

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check the existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots or videos if applicable
- Your environment details (browser, OS, device)
- Console errors or logs if available

### Suggesting Features

Feature suggestions are welcome! Please provide:

- A clear and descriptive title
- Detailed description of the proposed feature
- Use cases and benefits
- Mockups or examples if applicable
- Consider the scope and complexity of the feature

### Code Contributions

#### Before You Start

- Check existing issues and pull requests to avoid duplicates
- For large changes, create an issue first to discuss the approach
- Make sure your changes align with the project's goals and architecture

#### Development Workflow

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards:
   - Write clean, readable code with proper comments
   - Follow the existing code style and conventions
   - Add tests for new functionality
   - Update documentation as needed

3. Test your changes thoroughly:
   ```bash
   pnpm run test
   pnpm run lint
   ```

4. Commit your changes with a clear message:
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. Push to your fork and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

#### Commit Message Guidelines

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests
- `chore:` for maintenance tasks

Examples:
- `feat: add multiplayer support`
- `fix: resolve scoring calculation bug`
- `docs: update installation instructions`

### Code Style Guidelines

#### JavaScript/React

- Use functional components with hooks
- Follow ESLint and Prettier configurations
- Use descriptive variable and function names
- Keep functions small and focused
- Add JSDoc comments for complex functions
- Use TypeScript types where applicable

#### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic class names for custom CSS
- Maintain consistent spacing and typography
- Ensure accessibility compliance

#### File Organization

- Keep components in the `src/components` directory
- Place custom hooks in `src/hooks`
- Put utility functions in `src/lib`
- Use descriptive file names
- Group related files together

### Testing Guidelines

#### Unit Tests

- Test individual functions and components
- Use Jest and React Testing Library
- Aim for high code coverage on critical paths
- Mock external dependencies appropriately

#### Integration Tests

- Test component interactions
- Verify game state transitions
- Test user workflows end-to-end
- Validate anti-cheat system behavior

#### Manual Testing

- Test on multiple browsers and devices
- Verify responsive design
- Check accessibility features
- Test keyboard navigation
- Validate performance on lower-end devices

### Documentation

When contributing code, please also update relevant documentation:

- Update README.md for new features or setup changes
- Add or update JSDoc comments for new functions
- Update DEVELOPMENT.md for architectural changes
- Add entries to CHANGELOG.md for notable changes

### Performance Considerations

- Optimize React components with proper memoization
- Ensure P5.js animations run smoothly
- Minimize bundle size and loading times
- Test performance on various devices
- Use browser dev tools to identify bottlenecks

### Accessibility

- Ensure keyboard navigation works properly
- Add appropriate ARIA labels and roles
- Test with screen readers
- Maintain proper color contrast ratios
- Support reduced motion preferences

### Security

- Validate all user inputs
- Follow secure coding practices
- Be mindful of XSS and injection vulnerabilities
- Test anti-cheat system thoroughly
- Report security issues privately

## Pull Request Process

1. **Create a Pull Request**: Use the provided template and fill out all sections
2. **Code Review**: Address feedback from maintainers and other contributors
3. **Testing**: Ensure all tests pass and add new tests if needed
4. **Documentation**: Update relevant documentation
5. **Approval**: Get approval from at least one maintainer
6. **Merge**: Maintainers will merge your PR when ready

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code has been performed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation have been made
- [ ] Changes generate no new warnings or errors
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Communication

- Be respectful and constructive in all interactions
- Use clear and concise language
- Provide helpful feedback and suggestions
- Ask questions when you need clarification
- Share knowledge and help others learn

### Recognition

Contributors will be recognized in the following ways:

- Listed in the project's contributors section
- Mentioned in release notes for significant contributions
- Invited to join the core team for exceptional contributions

## Getting Help

If you need help or have questions:

- Check the [Development Guide](DEVELOPMENT.md) for technical details
- Search existing issues and discussions
- Create a new issue with the "question" label
- Join our community discussions
- Reach out to maintainers directly for sensitive issues

## License

By contributing to Sudoku Master, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

Thank you for contributing to Sudoku Master! Your efforts help make this project better for everyone.

