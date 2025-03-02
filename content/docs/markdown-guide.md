---
title: Markdown Guide
description: Learn how to use Markdown in TerminalDocs
category: Guides
order: 1
---

# Markdown Guide

TerminalDocs uses Markdown for writing documentation. This guide will help you understand how to use Markdown to format your documentation.

## Basic Syntax

### Headings

You can create headings using the `#` symbol:

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Emphasis

You can emphasize text using asterisks or underscores:

```markdown
*Italic text* or _Italic text_
**Bold text** or __Bold text__
***Bold and italic text*** or ___Bold and italic text___
```

### Lists

You can create ordered and unordered lists:

```markdown
Unordered list:
- Item 1
- Item 2
  - Subitem 1
  - Subitem 2

Ordered list:
1. Item 1
2. Item 2
   1. Subitem 1
   2. Subitem 2
```

### Links

You can create links to other pages or external websites:

```markdown
[Link text](URL)
[Link to another page](/docs/another-page)
```

### Images

You can add images to your documentation:

```markdown
![Alt text](URL)
```

## Advanced Syntax

### Code Blocks

You can create code blocks with syntax highlighting:

````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

### Tables

You can create tables:

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### Blockquotes

You can create blockquotes:

```markdown
> This is a blockquote.
> It can span multiple lines.
```

### Horizontal Rules

You can create horizontal rules:

```markdown
---
```

## GitHub Flavored Markdown

TerminalDocs supports GitHub Flavored Markdown (GFM), which includes additional features:

### Task Lists

You can create task lists:

```markdown
- [x] Task 1 (completed)
- [ ] Task 2 (not completed)
```

### Strikethrough

You can strikethrough text:

```markdown
~~Strikethrough text~~
```

### Emoji

You can use emoji shortcodes:

```markdown
:smile: :heart: :rocket:
```

## Conclusion

This guide covers the basics of Markdown syntax. For more information, check out the [Markdown Guide](https://www.markdownguide.org/) website. 