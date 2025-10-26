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

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to file issues and submit pull requests.

## Blog

This template includes a blog. Add posts in `_posts/` using the Jekyll format `YYYY-MM-DD-title.md`. Each post should include front matter with `title` and `date`. You can add `tags` to categorize posts. The example post `_posts/2025-10-25-markdown-all-features-demo.md` shows many supported features and front matter usage.

Posts are listed under `/blog/`. Tag links point to the Tags page where posts and projects with the same tag are grouped.

## Pics / Gallery page

The gallery page is located at `pics/index.html`. Store image files under `assets/images/pics/` and reference them from the gallery page or from posts. Keep large images optimized for web delivery. If you add many images, consider adding smaller thumbnails and linking to full-size images.

Edit `pics/index.html` to change how images are presented or to add captions and layout changes.

## Profile animation and tab behavior

The profile icon on the homepage includes a small animation script (`assets/js/anims/pfp.js`) that changes the avatar expression and can show short, friendly tips. Messages are generic by default. You can edit `assets/js/anims/pfp.js` to change or remove those messages.

The site also includes a small tab title script (`assets/js/anims/tab.js`) that updates the browser tab title when the page is not visible. This is optional and can be removed if you prefer the browser to keep the original title at all times.

## License

This project is licensed under the [MIT License](LICENSE).

## Credits

Created by 1337XCode. If you reuse this template keep the credit line in the footer.