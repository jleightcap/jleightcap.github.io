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

## Design
The math expression parser was written from scratch, so expect bugs and bad error reporting.

<script type="text/javascript" src="parse.js"></script>
<script type="text/javascript" src="test.js"></script>
