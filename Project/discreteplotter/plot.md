---
title: Discrete Signal Plotter
date: February 6, 2021
author: <a href="../../index.html">Jack Leightcap</a>
---

<head>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>


# Plotter
Equation:
<center>
    <input type="text" placeholder="x[n]=(+ (sin n) (/ pi 2))" id="eqn"></input>
    <button type="button" onclick="get_conf();">Plot</button>
</center>


<div><p id="parse_result"></p></div>

Bounds:
<center>
    <input type="text" placeholder="0" id="lower_bound"></input>
    <input type="text" placeholder="10" id="upper_bound"></input>
</center>

<center><div id="tester"></div></center>

# Usage
The discrete signal functions are expected in the form of an *S-Expression*.
The more common notation

```
x[n]=sin(n) + pi/2
```
is instead be represented as:

```lisp
x[n]=(+ (sin n) (/ pi 2))
```

Where an S-Expression uses explicit parentheses with *prefix* notation -- has the function on the left -- like `(+ 2 2)`; versus *infix* notation like `2 + 2`.

Because the signals are discrete, the signal is only defined over the integers.
Likewise, the bounds are integers defining the domain the signal is plotted over.

# Design
The only imported code (through CDN) is `Plotly` for rendering the output functions.

The general steps:

1. Tokenize the user input into an Array of Tokens.
2. Parse the linear Array of Tokens into a recursive structure representing an S-Expression
3. Turn that S-Expression structure into a function (lambda) of one variable
4. Plot that function!

My implementation in TypeScript can be found [here](https://github.com/jleightcap/jleightcap.github.io/tree/master/Project/discreteplotter), including some fun lambdas and Currying.

<script type="text/javascript" src="parse.min.js"></script>
<script type="text/javascript" src="plot.min.js"></script>
