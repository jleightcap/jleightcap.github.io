# Designing a Website Like a C Program
<center><a href="../../index.html">Jack Leightcap</a></center>
date: April 3, 2020

<i><p style="color:gray">
"Ooh, this is one of those artisan, hand-crafted websites! I'll
have to post this to my Instagram. I once met an old web developer
in the south of France who would wash the bytes by hand before
uploading them to his server. Said it was a family tradition
passed down for generations." 
\- [KISS Linux Testimonial](https://k1ss.org/testimonials)
</p></i>


<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

## Background

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

## Implementation
### Structure
In treating the source of this website like the source of a C program:

>CSS is like the header files, it defines some shared parameters to be imported and expanded on elsewhere.

>Markdown is like the `.c` files, the bulk of the content.

>And finally, `cmark` acts as a compiler.

With this familiar setup, of course a `Makefile` is needed!

The directory structure:

    ├── Makefile
    │
    │   # The actual content
    ├── index.md
    ├── 404.md
    ├── Blog
    │   ├── {blog}
    │   ├──── post.md
    │   └──── content
    ├── Project
    │   ├── {project}
    │   ├──── post.md
    │   └──── content
    │
    │   # Style
    └── style.css

I've written the Makefile so that the compiled `.html` lives in the same space as the source `.md`.
I ~~can't be bothered to change that~~ decided this was a feature, so everything is ~~entirely unsecured~~ open source.
Both the source `.md` and compiled `.html`, as well as the entire Makefile can
be found at the
[GitHub Pages repo](https://github.com/jleightcap/jleightcap.github.io).

To generate the website just requires a `make` and a super fast compilation.
The relevant piece of the Makefile:

```
%.html: %.md
    cmark -t html --unsafe $^ > $@
    sed -i "1s/^/<link rel=\"stylesheet\" type=\"text\/css\" href=\"$(CSS)\" media=\"screen\" \/>\n\n/" $@
```

The `--unsafe` cmark flag allows for inline HTML in the source .md files.
The `sed` command prepends each .html file with a link to the source CSS. Think of this as a linker.
