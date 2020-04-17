---
title: "Charlie 'the Traveling Salesman' on the MBTA"
date: February 2, 2019
---

# Abstract
Using a brute force Traveling Salesman search of the MBTA Green Line, I found the shortest possible route which visits all 64 stops.

<div style="text-align:center">
<img src="../Images/mbtaspeedrun-1.gif" width="80%">
</div>

The ideal time was about 2.5 hours. 
In practice, my best time is 2:47.
My first attempt had a time of 3:15, which you can watch [here](https://www.youtube.com/embed/LspT5B-S-uw).

The search involved reducing the graph to a 6-node non-directed graph search.
All paths start and end at the most extreme ends, Lechmere and Riverside respectively.
Directionality was determined based on MBTA early morning time tables.

# The Final Route
```
Lechmere → Heath Street → walk to Brookline Village → Hynes → Cleveland Circle → walk to Boston College → Kenmore → Riverside
```
If you find a more efficient route or beat my record, please let me know!
