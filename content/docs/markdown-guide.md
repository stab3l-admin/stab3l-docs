---
title: Markdown Guide
description: Learn how to use Markdown in TerminalDocs
category: Guides
order: 1
---

# Markdown Guide

TerminalDocs uses Markdown for writing documentation. This guide will help you understand how to use Markdown to format your documentation, including the new GitBook-like features.

{% hint style="info" %}
TerminalDocs now supports GitBook-like syntax for creating rich content blocks. This guide covers both standard Markdown and these extended features.
{% endhint %}

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

#### Unordered Lists

```markdown
- Item 1
- Item 2
  - Subitem 1
  - Subitem 2
- Item 3
```

Which renders as:

- Item 1
- Item 2
  - Subitem 1
  - Subitem 2
- Item 3

#### Ordered Lists

```markdown
1. Item 1
2. Item 2
   1. Subitem 1
   2. Subitem 2
3. Item 3
```

Which renders as:

1. Item 1
2. Item 2
   1. Subitem 1
   2. Subitem 2
3. Item 3

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

## GitBook-like Features

TerminalDocs now supports several GitBook-like features to enhance your documentation.

### Hint Blocks

Hint blocks are used to highlight important information. There are four types of hint blocks available:

{% hint style="info" %}
**Info blocks (blue)** are used for general information and definitions.
{% endhint %}

{% hint style="warning" %}
**Warning blocks (yellow)** are used to warn users about potential issues.
{% endhint %}

{% hint style="danger" %}
**Danger blocks (red)** are used to alert users about critical issues.
{% endhint %}

{% hint style="success" %}
**Success blocks (green)** are used for tips and best practices.
{% endhint %}

To create a hint block, use this syntax:

```markdown
{% hint style="TYPE" %}
Your content here
{% endhint %}
```

Replace `TYPE` with: `info`, `warning`, `danger`, or `success`

### Tabs

You can create tabs to organize content:

{% tabs %}
{% tab title="Syntax" %}
```markdown
{% tabs %}
{% tab title="Tab 1" %}
Content for tab 1
{% endtab %}

{% tab title="Tab 2" %}
Content for tab 2
{% endtab %}
{% endtabs %}
```
{% endtab %}

{% tab title="Result" %}
This is actually a nested example of tabs! You're viewing the "Result" tab inside the "Tabs" section.
{% endtab %}
{% endtabs %}

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

Which renders as:

```javascript
function hello() {
  console.log("Hello, world!");
}
```

### Tables

You can create tables:

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

Which renders as:

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

### Blockquotes

You can create blockquotes:

```markdown
> This is a blockquote.
> It can span multiple lines.
```

Which renders as:

> This is a blockquote.
> It can span multiple lines.

## GitHub Flavored Markdown

TerminalDocs supports GitHub Flavored Markdown (GFM), which includes additional features:

### Task Lists

You can create task lists:

```markdown
- [x] Task 1 (completed)
- [ ] Task 2 (not completed)
```

Which renders as:

- [x] Task 1 (completed)
- [ ] Task 2 (not completed)

### Strikethrough

You can strikethrough text:

```markdown
~~Strikethrough text~~
```

Which renders as:

~~Strikethrough text~~

{% hint style="success" %}
Now you know how to use both standard Markdown and GitBook-like features in TerminalDocs! For more examples, check out the [GitBook Features](/docs/gitbook-features) page. 
{% endhint %}