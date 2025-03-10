---
title: Advanced Features
description: Learn about advanced features in TerminalDocs
category: Usage
order: 5
---

# Advanced Features

This guide covers advanced features in TerminalDocs that help you create more engaging and interactive documentation.

## Interactive Components

TerminalDocs includes several interactive components that make your documentation more engaging.

### Expandable Sections

Expandable sections allow you to hide content that might be too detailed for all users, but still make it accessible to those who need it.

You can create expandable sections using HTML `<details>` and `<summary>` tags:

```markdown
<details>
<summary>Click to expand</summary>

This content is hidden by default and only appears when the user clicks on the header.

You can include any Markdown content here, including:

- Lists
- Code blocks
- Images
- And more!

</details>
```

When rendered, this creates a collapsible section that users can expand to see more details.

### Multi-level Navigation

You can create multi-level navigation by organizing your documentation into categories and subcategories.

{% hint style="info" %}
To create subcategories, use a slash in the category name, like `Category/Subcategory`.
{% endhint %}

## Advanced Formatting

### Code Blocks with Line Highlighting

You can highlight specific lines in code blocks to draw attention to important parts:

```javascript
function calculateTotal(items) {
  return items
    .filter(item => item.price > 0)
    .map(item => item.price * item.quantity)
    .reduce((total, price) => total + price, 0);
}
```

When rendered, lines 3-5 would be highlighted (note: line highlighting is specified with `{3-5}` after the language identifier in some markdown processors, but implementation may vary).

### Custom Containers

You can create custom containers to highlight different types of content using hint blocks:

```markdown
{% hint style="info" %}
**Definition**
A term or concept that needs explanation.
{% endhint %}

{% hint style="warning" %}
**Caution**
Something you should be careful about.
{% endhint %}

{% hint style="danger" %}
**Danger**
Something that could cause serious problems.
{% endhint %}

{% hint style="success" %}
**Tip**
A helpful suggestion to improve your workflow.
{% endhint %}
```

## Integration Features

### Embedding External Content

You can embed external content like YouTube videos, CodePen examples, or GitHub gists.

#### YouTube Videos

To embed a YouTube video, use the following syntax:

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

#### CodePen Examples

To embed a CodePen example, use the following syntax:

```html
<iframe height="400" style="width: 100%;" scrolling="no" title="Example CodePen" src="https://codepen.io/your-username/embed/your-pen-id?height=400&theme-id=dark&default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
</iframe>
```

#### GitHub Gists

To embed a GitHub Gist, use the following syntax:

```html
<script src="https://gist.github.com/username/gist-id.js"></script>
```

## SEO Optimization

TerminalDocs includes features to help optimize your documentation for search engines.

{% hint style="success" %}
Always include a descriptive `title` and `description` in the frontmatter of your documentation files. These are used for SEO purposes.
{% endhint %}

### Meta Tags

TerminalDocs automatically generates appropriate meta tags for your documentation pages based on the frontmatter:

```markdown
---
title: Advanced Features
description: Learn about advanced features in TerminalDocs
---
```

This will generate the following meta tags:

```html
<title>Advanced Features | TerminalDocs</title>
<meta name="description" content="Learn about advanced features in TerminalDocs">
```

## Conclusion

These advanced features help you create more engaging and interactive documentation. Experiment with them to find the best way to present your content to your users.

{% hint style="info" %}
For more information on how to use these features, check out the [GitBook Features](/docs/gitbook-features) page.
{% endhint %} 