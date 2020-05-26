---
title: "Practical SAT-CNF: Solving Picross"
author: "Jack Leightcap"
date: May 26, 2020
---


## Translating A Puzzle
Writing expressions in *Disjunctive Normal*, or *Sum of Products* (SOP), form is simple:

$x=\{4\}$:
<center>$(a \wedge b \wedge c \wedge d)$</center>

$x=\{3\}$:
<center>
$(a \wedge b \wedge c \wedge \neg d)
\vee
(\neg a \wedge b \wedge c \wedge d)$
</center>

$x=\{1,2\}$:
<center>
$(a \wedge \neg b \wedge c \wedge d)$
</center>

$x=\{2,1\}$
<center>
$(a \wedge b \wedge \neg c \wedge d)$
</center>

$x=\{2\}$:
<center>
$(a \wedge b \wedge \neg c \wedge \neg d)
\vee
(\neg a \wedge b \wedge c \wedge \neg d)
\vee
(\neg a \wedge \neg b \wedge c \wedge c)$
</center>

$x=\{1,1\}$
<center>
$(a \wedge \neg b \wedge c \wedge \neg d)
\vee
(a \wedge \neg b \wedge \neg c \wedge d)
\vee
(\neg a \wedge b \wedge \neg c \wedge d)$
</center>

$x=\{1\}$:
<center>$(a)\vee (b)\vee (c)\vee (d)$</center>

However, SAT-CNF solvers require *Conjunctive Normal*, or *Product of Sums* (POS), form.
This translation in the worst case is $O(2^n)$:

$x=\{4\}$:
<center>$(a) \wedge (b) \wedge (c) \wedge (d)$</center>

$x=\{3\}$:
<center>
$(\neg a \vee \neg d)
\wedge
(a \wedge d)
\wedge
(b)
\wedge
(c)$
</center>

$x=\{1,2\}$:
<center>
$(a)
\wedge
(\neg b)
\wedge
(c)
\wedge
(d)$
</center>

$x=\{2,1\}$
<center>
$(a) \wedge (b) \wedge (\neg c) \wedge (d)$
</center>

$x=\{2\}$:
<center>
$(\neg a \vee b)
\wedge
(\neg a \vee \neg c)
\wedge
(a \vee c)
\wedge
(\neg b \vee \neg d)
\wedge
(b \vee d)
\wedge
(c \vee \neg d)$
</center>

$x=\{1,1\}$
<center>
$(\neg a \vee \neg b)
\wedge
(a \vee b)
\wedge
(\neg b \vee \neg c)
\wedge
(\neg c \vee \neg d)
\wedge
(c \vee d)$
</center>

$x=\{1\}$:
<center>$(a \vee b \vee c \vee d)$</center>


|   $x$     | Expression
|:---------:|:-----------:
| $\{1\}$   | $(a)\vee (b)\vee (c)\vee (d)$
|\          | $(a \vee b \vee c \vee d)$
| $\{2\}$   |
|\          | $(\neg a \vee b) \wedge (\neg a \vee \neg c) \wedge (a \vee c) \wedge (\neg b \vee \neg d) \wedge (b \vee d) \wedge (c \vee \neg d)$
| $\{1,1\}$
|\          | $(\neg a \vee \neg b) \wedge (a \vee b) \wedge (\neg b \vee \neg c) \wedge (\neg c \vee \neg d) \wedge (c \vee d)$
| $\{3\}$   |
