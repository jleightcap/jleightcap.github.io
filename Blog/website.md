---
title: "Why this website looks like the year 2005"
author: "Jack Leightcap"
date: "April 3, 2020"
---

# Background

I spent a decent amount of time tinkering with [Hugo](https://gohugo.io/) previously.
It's a really simple way to just import a theme, write some simple pages in markdown, and you're set.

Over time, I've come to appreciate the look of bare HTML with minimal CSS more and more.
Javascript is very nice but I personally don't feel compelled to use it for my website.
So this is how I made this website with `pandoc` as a backbone.

# Using `pandoc` as a static website generator
## Rationale
I'm treating the source of this website like the source of a C program.

>CSS is like the header files, it defines some shared parameters to be imported and expanded on elsewhere.

>Markdown is like the `.c` files, the bulk of the content.

>And finally, `pandoc` acts as a compiler.

With this familiar setup, of course a `Makefile` is needed!

## Implementation
The directory structure:

    ├── Blog
    │   └── {blog posts}.md
    ├── Project
    │   └── {projects}.md
    ├── Images
    │   └── {Images}
    ├── Makefile
    ├── index.md
    └── pandoc.css

I've written the Makefile so that the compiled %.html lives in the same space as the source %.md.
I ~~can't be bothered to change that~~ decided this was a feature, so everything is ~~entirely unsecured~~ open source.

Poke around and see how I implemented things.
