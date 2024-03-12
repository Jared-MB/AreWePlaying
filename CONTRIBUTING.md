# Contributing Guidelines

Thank you for considering contributing to our open-source project! We appreciate your interest and support. By participating in this project, you agree to abide by the following guidelines.

## How to Contribute

1. **Fork the Repository**: Start by forking our repository to your GitHub account.

2. **Clone the Repository**: Clone the forked repository to your local machine using the following command:
   ```
   git clone https://github.com/your-username/repository-name.git
   ```

3. **Create a Branch**: Create a new branch for your contribution:
   ```
   git checkout -b feature/your-feature
   ```

4. **Make Changes**: Implement your changes or add new features to the codebase.

    - Try to keep your changes focused, change only necessary files. If you have multiple changes, consider creating separate pull requests for each one.

5. **Test Your Changes**: Ensure that your changes are properly tested and do not introduce any regressions.
    - Run the tests to make sure your changes do not break any existing functionality. You can run the tests using the command `test:e2e`.
    - If you are adding a new feature, consider adding new tests to cover it. To add new tests, you can create a new file in the `__tests__` directory or add new test cases to an existing file.
        - `__test__/e2e` for end-to-end tests using [Playwright](https://playwright.dev/).
        - `__test__/unit-test` for unit tests using [Vitest](https://vitest.dev/)

6. **Commit Changes**: Commit your changes with a descriptive commit message:
   ```
   git commit -m 'Add a brief description of your changes'
   ```

7. **Push Changes**: Push your changes to your forked repository:
   ```
   git push origin feature/your-feature
   ```

8. **Submit a Pull Request (PR)**: Open a pull request from your forked repository to our main repository. Be sure to provide a clear description of your changes in the PR.

## Code Style Guidelines

- Follow the coding style and conventions used in the project.
    - We use [Biome.js](https://biomejs.dev/) to lint and format our code. You can run the script `biome:lint` to check for any linting errors and `biome:format` to format (overwrite) your code.
- Ensure proper documentation for new features or changes.
- Write clear and concise code that is easy to understand.

## Requirements to merge your PR

- Your PR must pass all the tests.
- Your PR must be reviewed and approved by at least one maintainer.
- Your PR must be up-to-date with the latest changes from the main branch.
- Your code needs to follow the code style guidelines.
- Your PR must pass the CI/CD checks.

## Reporting Issues

If you encounter any issues or have suggestions for improvement, please open an issue on the GitHub repository. Provide detailed information about the problem you encountered, including steps to reproduce it if possible.

## Code of Conduct

We expect all contributors to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful to others and create a positive and inclusive environment for everyone.

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE.md).

Thank you for your interest in contributing to our project! We appreciate your support and look forward to your contributions. If you have any questions, feel free to reach out to us.