---
title: Discrete Signal Plotter
---

<head>
    <script src="plotly-latest.min.js"></script>
</head>

# Usage
The signals are expected in the form of an *S-Expression*.
The more common notation `x[n]=sin(n) + 2` would be represented as:
```lisp
x[n]=(+ (sin n) 2)
```

or a more compilcated example, `ln(sin(2*pi*n))+n^2` would be represented as:
```lisp
x[n]=(+ (ln (sin (* 2 pi n))) (pow n 2))
```

# Design
The math expression parser was written from scratch by someone dipping a toe in JavaScript, so expect bugs and bad error reporting.

# Plotter
Equation:
<center>
    <input type="text" placeholder="x[n]=sin(n)" id="eqn"></input>
    <button type="button" onclick="get_conf();">Plot</button>
</center>


<div><p id="parse_result"></p></div>

Bounds:
<center>
    <input type="text" placeholder="0" id="lower_bound"></input>
    <input type="text" placeholder="10" id="upper_bound"></input>
</center>

Sampling Frequency:
<center>
    <input type="text" placeholder="1" id="sample_freq"></input>
</center>

<center><div id="tester"></div></center>

<script type="text/javascript" src="parse.js"></script>
<script type="text/javascript" src="test.js"></script>
