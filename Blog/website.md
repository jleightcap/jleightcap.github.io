---
title: "Designing a Website Like a C Program"
author: "Jack Leightcap"
date: "April 3, 2020"
---

<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

# Background

I'm not a huge fan of developing websites.
This website was an exercise in treating web development like the development of
C programs and their related tools, which I'm much more familiar with.

Modifying this website only requires editing plaintext Markdown files, a Makefile, and
git.

I spent a decent amount of time tinkering with [Hugo](https://gohugo.io/) previously.
It's a really simple way to just import a theme, write some simple pages in markdown, and you're set.
While I think this is a really good solution for people like me that just want
something that looks nice with minimal work, I felt like I didn't have full
control or understanding of various elements.
If I'm going to have to dig into the CSS and JavaScript anyway, I'd rather write a
worse replacement myself but at least understand it fully.

# Implementation
## Structure
In treating the source of this website like the source of a C program:

>CSS is like the header files, it defines some shared parameters to be imported and expanded on elsewhere.

>Markdown is like the `.c` files, the bulk of the content.

>And finally, `pandoc` acts as a compiler.

With this familiar setup, of course a `Makefile` is needed!

The directory structure:

    ├── Makefile
    │
    │   # The actual content
    ├── index.md
    ├── Blog
    │   └── {blog posts}.md
    ├── Project
    │   └── {project posts}.md
    ├── Images
    │   └── {Images}
    │
    │   # Style
    ├── latex.css
    └── fonts
        └── {fonts}

I've written the Makefile so that the compiled `.html` lives in the same space as the source `.md`.
I ~~can't be bothered to change that~~ decided this was a feature, so everything is ~~entirely unsecured~~ open source.
Both the source `.md` and compiled `.html`, as well as the entire Makefile can
be found at the
[GitHub Pages repo](https://github.com/jleightcap/jleightcap.github.io).

To generate the website just requires a `make` and a super fast compilation.
The relevant piece of the Makefile:

    %.html: %.md
        pandoc -s -c $(CSS) -o $@ $^

    Blog/%.html: Blog/%.md
        pandoc -s -c $(BLOGCSS) -o $@ $^

    Project/%.html: Project/%.md
        pandoc -s -c $(PROJCSS) -o $@ $^

# Style, Elements
## CSS
I'm using the fantastic [LaTeX.CSS](https://github.com/vincentdoerig/latex-css)
here, and think it looks fantstic.
Instead of copying the source here as I've done, a simple `<link>` works as
well, and may be more elegant for including fonts.
I simply prefer to host the source in the same space as the content.

A minor addition is support for the iconic
"<span class="latex">L<sup>a</sup>T<sub>e</sub>X</span>",
which can be found [here](http://nitens.org/taraborelli/texlogo).
Just make sure to update the font to Latin Modern.

## <span class="latex">L<sup>a</sup>T<sub>e</sub>X</span>
I mentioned earlier that I didn't want to use any JavaScript on my website.
I'll make an exception for including [MathJax]([200~https://www.mathjax.org/)
because of its comparative simplicity in rendering
<span class="latex">L<sup>a</sup>T<sub>e</sub>X</span>
natively.

<center>$$H(X) = -\sum_{i=1}^n p(x_i) \log_b p(x_i)$$</center>

Or inline $\det(\lambda \textbf{I} - \textbf{A}) = 0$, like that.


For this structure, because there is no common `header` or `footer`, each `.md`
file sources the MathJax script only if needed.

The alternative I've considered is using the `standalone`
<span class="latex">L<sup>a</sup>T<sub>e</sub>X</span>
documentclass to make a single image for each equation.
This is entirely possible, just diminishes the speed and modularity of writing
a single self-contained Markdown file.
