# Charlie 'the Traveling Salesman' on the MBTA
<center><a href="../../index.html">Jack Leightcap</a></center>
date: February 2, 2019

## Abstract
Using a brute force Traveling Salesman, I found the shortest possible route which visits all 64 stops of the MBTA Green Line.

<center><img src="mbtaspeedrun-1.gif" width="80%"></center>

The ideal time was about 2:30.
In practice, my best time is 2:47.
My first attempt had a time of 3:15, which you can watch [here](https://www.youtube.com/embed/LspT5B-S-uw).

## Implementation
Instead of searching all 64 nodes, the search instead reduced the graph to a 6-node non-directed graph search.
The consequence of a reduction like this is that the edges of the graph then
contain stations themselves — this means that the traditional Travelling
Salesman problem of visiting every node is modified to visit every node *and*
visit every edge.

To reduce search time, all paths start and end at the most extreme ends, Lechmere and Riverside respectively.
Directionality was determined based on MBTA early morning time tables.

## The Final Route
```
Lechmere → Heath Street → walk to Brookline Village → Hynes → Cleveland Circle → walk to Boston College → Kenmore → Riverside
```
If you find a more efficient route or beat my record, please let me know!
