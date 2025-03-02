---
title: GitBook-like Features
description: Demonstration of GitBook-like features in TerminalDocs
category: Usage
order: 4
---

# GitBook-like Features

This page demonstrates the GitBook-like features that have been added to TerminalDocs.

## Hint Blocks

Hint blocks are used to highlight important information. There are four types of hint blocks: info, warning, danger, and success.

{% hint style="info" %}
This is an information hint block. Use it to provide additional information.
{% endhint %}

{% hint style="warning" %}
This is a warning hint block. Use it to warn users about potential issues.
{% endhint %}

{% hint style="danger" %}
This is a danger hint block. Use it to alert users about critical issues.
{% endhint %}

{% hint style="success" %}
This is a success hint block. Use it to indicate successful operations or best practices.
{% endhint %}

## Tabs

Tabs allow you to organize content into different sections that users can switch between.

{% tabs %}
{% tab title="JavaScript" %}
```javascript
function hello() {
  console.log("Hello, world!");
}
```
{% endtab %}

{% tab title="Python" %}
```python
def hello():
    print("Hello, world!")
```
{% endtab %}

{% tab title="Rust" %}
```rust
fn hello() {
    println!("Hello, world!");
}
```
{% endtab %}
{% endtabs %}

## Code Blocks

Code blocks with syntax highlighting are supported for various programming languages.

```javascript
// This is a JavaScript code block
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
```

## Tables

Tables are useful for organizing data.

| Name | Type | Description |
|------|------|-------------|
| id | string | Unique identifier |
| name | string | User's name |
| email | string | User's email address |
| age | number | User's age |

## Lists

Both ordered and unordered lists are supported.

### Unordered List

- Item 1
- Item 2
  - Subitem 1
  - Subitem 2
- Item 3

### Ordered List

1. First step
2. Second step
   1. Substep 1
   2. Substep 2
3. Third step

## Blockquotes

Blockquotes are used to highlight quotes or important statements.

> This is a blockquote. It can be used to highlight important information or quotes from other sources.

## Links

Links can be used to reference other pages or external resources.

- [Internal link to Getting Started](/docs/getting-started)
- [External link to GitHub](https://github.com)

## Images

Images can be included in your documentation.

![Alt text for the image](https://via.placeholder.com/800x400)

## Conclusion

These GitBook-like features enhance the readability and usability of your documentation. Use them to create more engaging and informative documentation for your users. 