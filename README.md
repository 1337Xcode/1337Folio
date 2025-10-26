# 1337Folio

1337Folio is a forkable Jekyll portfolio template that helps you publish projects and posts quickly. It is easy to edit for beginners.

This README shows the files you will edit, how to run the site locally, and how to contribute.

## Quick start (Windows PowerShell)

1. Clone and install

```powershell
git clone <your-repo-url>
cd Portfolio-Template
bundle install
```

1. Serve locally

```powershell
bundle exec jekyll serve --livereload
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

1. Build for production

```powershell
bundle exec jekyll build
```

## Files you will edit

`_config.yml`

- Site title, owner name, owner email, social links. This is the canonical source of site data.

`_layouts/default.html`

- Page layout and quick defaults. Small client side defaults are exposed there as `window.SITE_OWNER` and `window.SITE_EMAIL` for quick edits without rebuilding.

`index.html`

- Homepage content and visible text.

`_data/projects.yml`

- Add your projects here. Each project is a YAML object with fields like `name`, `description`, `technologies`, `github`, and `demo`.

`tags/index.html`

- Tag browsing page. It shows posts and projects grouped by tag.

`contact/index.html`

- Contact page text. The form is handled by `assets/js/pages/contact.js` which needs a Formspree endpoint to send messages.

Assets and scripts

- `assets/css/` : Styles
- `assets/js/main.js` : Site scripts. Avoid large changes here unless you know what you are doing.
- `assets/js/pages/contact.js` : Contact form behavior. Set the Formspree endpoint here.

## Projects data example

Add entries to `_data/projects.yml` like this:

```yaml
- name: "Project Name"
  description: "Short description"
  technologies: ["JavaScript", "React"]
  github: "https://github.com/you/repo"
  demo: "https://you.github.io/repo"
```

## Contact form placeholder

The contact form uses Formspree. Edit `assets/js/pages/contact.js` and set `formspreeEndpoint` to your Formspree id. If the endpoint is not configured the site will show a clear message on the contact page so visitors know the form is not active.

## Build and deploy

Local preview

```powershell
bundle exec jekyll serve --livereload
```

Build for production

```powershell
bundle exec jekyll build
```

Deployment options

- GitHub Pages
- Any static site host (Netlify, Vercel, etc.)

## Contributing and support

See `CONTRIBUTING.md` for how to file issues and submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

## Credits
Created by 1337XCode. If you reuse this template keep the credit line in the footer.
