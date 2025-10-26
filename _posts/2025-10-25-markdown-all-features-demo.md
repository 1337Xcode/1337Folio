---
layout: post
title: "Markdown All Features Demo"
date: 2025-10-25 10:00:00 +0000
tags: [Markdown, Demo, Reference]
excerpt: "A template showcasing all supported Markdown syntax."
emoji: "📚"
---

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

---

**Bold text**  
*Italic text*  
***Bold and italic***  
~~Strikethrough~~  
<u>Underline (HTML)</u>

---

> This is a blockquote.  
> > Nested blockquote.

---

- Unordered list item 1
- Unordered list item 2
  - Nested item
    - Deeper nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item
   2. Another nested item

- [x] Task list complete
- [ ] Task list incomplete

---

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Cell 2   | Cell 3   |
| Row 2    | Cell 5   | Cell 6   |

---

Inline code: `console.log('Hello, Markdown!')`

```python
# Fenced code block with language
def hello(name):
    print(f"Hello, {name}!")
```

```sh
# Fenced code block (was indented)
echo "Indented code"
```

---

[Link to Google](https://www.google.com)  
[Relative Link](/about/)  
![Sample Image](https://via.placeholder.com/150)  
<img src="https://via.placeholder.com/100x50" alt="HTML Image" width="100" height="50">

---

Horizontal rule below:

---

Superscript: 2<sup>10</sup>  
Subscript: H<sub>2</sub>O

---

Footnote example[^1].

[^1]: This is a footnote.

---

Math inline: $E=mc^2$  
Math block:

<div>
$$
\int_{a}^{b} x^2 dx
$$
</div>

---

<details>
  <summary>Expandable Section (HTML)</summary>
  This content is hidden until expanded.
</details>

---

Emoji: 😄

---

Table of Contents (if supported):

* TOC will be generated automatically if your theme supports it.

---

HTML video embed:

<video controls width="200">
  <source src="{{ '/assets/videos/sample-video.mp4' | relative_url }}" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

YouTube embed (HTML):

<iframe width="360" height="215" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video" frameborder="0" allowfullscreen></iframe>
