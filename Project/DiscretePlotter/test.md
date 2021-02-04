---
title: Discrete Signal Plotter
---

<head>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>

<center><div id="tester"></div></center>

Equation:
<center>
    <input type="text" placeholder="sin[n]" id="eqn"></input>
    <button type="button" onclick="getEqn();">Plot</button>
</center>


<div><par id="parse_result"></par></div>

## Usage
The signals are expected in the form of an *S-Expression*.
The more common notation `x[n]=sin(n) + 2` would be represented as:
```lisp
x[n]=(+ (sin n) 2)
```

or a more compilcated example, `ln(sin(2*pi*n))+n^2` would be represented as:
```lisp
x[n]=(+ (ln (sin (* 2 pi n))) (pow n 2))
```

## Design
The math expression parser was written from scratch by someone dipping a toe in JavaScript, so expect bugs and bad error reporting.

<script type="text/javascript" src="parse.js"></script>
<script type="text/javascript" src="test.js"></script>
