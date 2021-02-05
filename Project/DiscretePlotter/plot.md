---
title: Discrete Signal Plotter
---

<head>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>

# Usage
The signals are expected in the form of an *S-Expression*.
The more common notation `x[n]=sin(n) + 2` would be represented as:
```lisp
x[n]=(+ (sin n) 2)
```

or a more compilcated example, `sin(2*pi*n)+(e^n)cos(n)` would be represented as:
```lisp
x[n]=(+ (sin (* 2 (* pi n))) (* (pow e n) (cos n)))
```

# Plotter
Equation:
<center>
    <input type="text" placeholder="x[n]=(sin n)" id="eqn"></input>
    <button type="button" onclick="get_conf();">Plot</button>
</center>


<div><p id="parse_result"></p></div>

Bounds:
<center>
    <input type="text" placeholder="0" id="lower_bound"></input>
    <input type="text" placeholder="10" id="upper_bound"></input>
</center>

<center><div id="tester"></div></center>

<script type="text/javascript" src="parse.min.js"></script>
<script type="text/javascript" src="plot.min.js"></script>
