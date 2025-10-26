# Contributing to 1337Folio

Thanks for helping improve 1337Folio. This short guide shows how to report issues and submit changes.

If you are new to open source, start with a small documentation fix or a single project entry in `_data/projects.yml`.

## Report an issue

- Bug: include steps to reproduce, the expected result, the actual result, and any console output or error text.
- Enhancement: describe the change, why it helps, and one or two example use cases.
- Docs: point to the file and section, and suggest a short replacement or addition.

Use the Issues tab. Add a clear title and paste any relevant screenshots or logs.

## Quick local test

Run these commands in PowerShell to build the site locally:

```powershell
bundle install
bundle exec jekyll build
bundle exec jekyll serve --livereload
```

Open [http://localhost:4000](http://localhost:4000) to check pages.

## Make a change and open a pull request

1. Fork the repo and create a branch:

```bash
git clone <your-fork-url>
git checkout -b my-fix-or-feature
```

1. Keep changes small and focused. Commit with clear messages.

1. Run the local build and test the area you changed.

1. Push and open a PR against `main`. In the PR description include:

    - What you changed
    - Why it is needed
    - How to test the change locally

## PR checklist

- [ ] Branch is based on `main` and up to date
- [ ] Changes are focused and well described in the commit messages
- [ ] Local build runs and the change is tested manually
- [ ] Update `README.md` or other docs if the change affects how someone uses the template
- [ ] Keep accessibility in mind for UI changes

## Code guidelines

- HTML and Liquid: Keep markup simple. Preserve aria attributes and semantic tags.
- CSS: Prefer small, scoped changes. Reuse existing classes and variables.
- JavaScript: Make changes that are isolated. Avoid global side effects. Check for runtime errors in the browser console.

If you add JavaScript, guard DOM access with checks like `document.querySelector` to avoid errors on pages where elements are not present.

## Community and etiquette

- Be respectful and constructive.
- Explain your reasoning when suggesting larger changes.
- Help maintainers by including screenshots, steps to test, and small reproducible examples.

## Security issues

Do not open a public issue for security vulnerabilities. Contact the repository owner using the email in `_config.yml` or via the repo profile.

Thank you for contributing to 1337Folio. Small fixes make this template easier to use for everyone.
