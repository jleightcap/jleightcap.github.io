---
title: PicrossSAT
date: June 5, 2020
author: <a href="../../index.html">Jack Leightcap</a>
---

## Abstract
Picross puzzles (also known as Nonograms) are a logic puzzle in the vein of Sudoku.
A puzzle consists of a set of restrictions on each row and column of a grid:

<center>
<img src="picross-wiki.png" width="60%">

[By Gus Polly at English Wikipedia - Own work, CC0](https://commons.wikimedia.org/w/index.php?curid=68386589)
</center>

For a restriction like `[2 8]`, the slice with that restriction must contain 2 continuous cells, a separation gap of at least 1 cell, and 8 continuous cells; with any amount of padding on either end.
These restrictions are the only information needed to uniquely encode this image!
I think this is crazy, isn't this such a small amount of information needed to reconstruct this image?
Maybe this could this be used for data compression!
Well, probably not: as solving Picross puzzles has been proven NP-complete (Ueda, Nagao).

The solution being an array of Booleans, and solving being an NP-complete problem: I immediately thought about applying a SAT solver.
A SAT solver is tailored to solve the *Boolean Satisfiability Problem* (*SAT* for short) as efficiently as possible: given a Boolean formula $F$ like:

<center>
$$
F = (a \vee \neg b \vee c) \wedge (\neg a \vee b \vee c)
$$
</center>

can you set the input variables to be either true or false, such that the $F$ is true?
This may seem like a somewhat random problem, but this is the first known NP-complete problem (Cook, Levin), and there are many SAT solvers that are designed to find a set of input variables satisfying a given Boolean formula as effeciently as possible.

Here, I'll describe an algorithm to convert a Picross puzzle into an equivalent SAT problem.
Using `MiniSat`, an off-the-shelf SAT solver with C++ integration, this allows for the solution for arbitrary puzzles with reasonable efficiency.

## Example
Using an extremely simple puzzle as an example:

<a href="picross-ex.tex"><center><img src="picross-ex.png" width="20%"></center></a>

If you understand the rules of Picross, this is solvable almost at sight: however, this is a good example of the process used to encode a puzzle to an equivalent SAT problem.

Given the restriction `[1]` in a space of 2, there exists two possible permutations of cells: calling the state of these two cells $x$ and $y$, the state of this slice $S$ can be expressed as
$S = (x \wedge \neg y) \vee (\neg x \wedge y)$;
if the restriction were `[2]` in the space of 2, $S$ would just be
$S = x \wedge y$.

These are the only two restrictions for the given example.
For the whole board to be satisfied, all of the conditions of each slice must be satisfied:

<center>
$$E =
\underbrace{[a \wedge b]}_{\text{row 1}}
\wedge
\underbrace{[(c \wedge \neg d) \vee (\neg c \wedge d)]}_{\text{row 2}}
\wedge
\underbrace{[a \wedge c]}_{\text{column 1}}
\wedge
\underbrace{[(b \wedge \neg d) \vee (\neg b \wedge d)]}_{\text{column 2}}$$
</center>

This expression sufficiently encodes the example as a Boolean formula.
However, for reasons that will be explained later, SAT solvers expect an expression in the form of `AND` of `OR`s.
This means slices like $(c \wedge \neg d) \vee (\neg c \wedge d)$ need to be rewritten,
$(c \wedge \neg d) \vee (\neg c \wedge d) = (c \vee d) \wedge (\neg c \vee \neg d)$;
And in total, a Boolean formula in the form a SAT solver would expect for $B$:

<center>
$$E =
a \wedge b \wedge
(c \vee d) \wedge
(\neg c \vee \neg d) \wedge
a \wedge c \wedge
(b \vee d) \wedge
(\neg b \vee \neg d)$$
</center>

Testing using the `minisat` library in C++:

```cpp
#include <minisat/core/Solver.h>
#include <iostream>

int main() {
    using Minisat::mkLit;
    using Minisat::lbool;

    Minisat::Solver solver;

    auto A = solver.newVar();
    auto B = solver.newVar();
    auto C = solver.newVar();
    auto D = solver.newVar();

    solver.addClause(  mkLit(A)            );
    solver.addClause(  mkLit(B)            );
    solver.addClause(  mkLit(C),  mkLit(D) );
    solver.addClause( ~mkLit(C), ~mkLit(D) );
    solver.addClause(  mkLit(A)            );
    solver.addClause(  mkLit(C)            );
    solver.addClause(  mkLit(B),  mkLit(D) );
    solver.addClause( ~mkLit(B), ~mkLit(D) );

    auto sat = solver.solve();
    if (sat) {
        std::clog << "===SAT===\n";
        std::clog << "A=" << (solver.modelValue(A) == l_True) << std::endl;
        std::clog << "B=" << (solver.modelValue(B) == l_True) << std::endl;
        std::clog << "C=" << (solver.modelValue(C) == l_True) << std::endl;
        std::clog << "D=" << (solver.modelValue(D) == l_True) << std::endl;
        return 0;
    }
    else {
        std::clog << "===UNSAT===\n";
        return -1;
    }
}
```
Gives the expected solution,
```
===SAT===
A=1
B=1
C=1
D=0
```
Great! This example is extremely simple, but shows all the steps that will be generalized.

## Translation Algorithm
The translation algorithm of a Picross puzzle to an equivalent SAT problem has three distinct steps:

1. For a given slice, generate all permutations of white space vector for a given restriction vector.
2. Convert permutations of white space vector into DNF expression.
3. Convert set of slice DNF expressions into board CNF expression.

### Generating Slice Permutations
#### Defining White Space Set $W$
A given slice $S$ consists of a size $n = |S|$ and a restriction set $R$.
The goal of this step is to generate the set of valid permutations $P$.

For the given example, the permutations of the slices were small:

- $n=2$, $R=\{1\}$: $P = \{\{1, 0\}, \{0, 1\}\}$.
- $n=2$, $R=\{2\}$: $P = \{\{1, 1\}\}$.

However, for a more complex example, $P$ grows exponentially:

- $n=6$, $R=\{1,2\}$: $P = \{\{1,0,1,1,0,0\}, \{1,0,0,1,1,0\}, \{1,0,0,0,1,1\}, ... \}$

To describe a valid slice $S_v \in P$, encode the lengths of white space and occupied cells.
For example, one permutation for $n=6$, $R=\{1,2\}$ is $S_v = \{1,0,1,1,0,0\}$; which can be encoded as $|S_v| = \{1,1,2,2\}$ (one 1, one 0, two 1s, two 0s).
Generally, $|S_v|$ consists of:

<center>
$$ |S_v| = \{W_0, R_0, W_1, R_1, ..., R_{|R|}, W_{|R| + 1}\}$$
</center>
Where $R_i$ is the $i$th element of $R$, and $W_i$ is the $i$th element of the white space set $W$.
$W$ is described by the restrictions:

- $|W| = |R| + 1$ : there is one more white space cell than number of groups of cells (think of fenceposts).
- $\sum W = n - \sum R$: the length of whole slice minus the total amount of occupied cells is the total amount of white space cells.
- $W_0 \ge 0$, $W_{|W|} \ge 0$: there can be an arbitrary amount of padding on either end, including none.
- $W_{1 .. |W|-1} > 0$: there must be a separation of at least 1 between each group of cells.

With this description, $S_v$ can be reconstructed from $W$ and the constant $R$, so generating $P$ is equivalent to generating
all valid permutations of $W$.
Some simple examples of this encoding, where $n=6$ and $R=\{2,1\}$:

- $S_v = \{1,1,0,0,0,1\}$: $W = \{0,3,0\}$
- $S_v = \{0,1,1,0,0,1\}$: $W = \{1,2,0\}$
- $S_v = \{0,1,1,0,1,0\}$: $W = \{1,1,1\}$

With this example, using the restrictions of $W$, you can even see what permutation was missed just by looking at $W$: $W = \{0,2,1\}$.

#### Generating Permutations of $W$
For simplicity in generating permutations, defining $W^\prime$:

- $|W^\prime| = |R| + 1$
- $\sum W^\prime = n - \sum R$
- $W_{0..|W|} \ge 0$

$W^\prime$ is just $W$ without the restriction that middle elements aren't zero.
The relaxation from $W$ to $W^\prime$ means that all permutations of an element of $W^\prime$ are still in $W^\prime$, which is not true of $W$.
This allows for the simplification of just generating sets of strictly increasing values, then just generating all permutations of that set.

This problem can be restated with three parameters $n$, $h$, and $w$:

> Generate all combinations of sets of size at most $w$, where the sum of all elements is $n$, and all
> elements are between $0$ and $h$.


Some examples:

- `sumPermute(2,1,2)` returns $\{\{1,1\}\}$
- `sumPermute(2,2,2)` returns $\{\{2\}, \{1,1\}\}$
- `sumPermute(4,3,3)` returns $\{\{1,3\}, \{2,2\}, \{1,1,2\}\}$

This screams recursion to me!
For the largest element, loop from the largest to smallest possible value as `i`, then prepend the result of `sumPermute(n - i, i, w - 1)`.
This recursive relation shows the need to pass the $h$ parameter such that elements are generated in strictly decreasing order.

To finish the recurrence relation, the minimum and maximum possible values and a base case are
needed.
The maximum value is simply $h$, and the minimum is $\text{ceil}(n/w)$ where the total number of cells is distributed equally across the entire width.
The base case is $n - i = 0$, where the remaining cells are all accounted for in the last cell.
In total,

```cpp
vector<vector<int>>
sumPermute(int n, int h, int w) {
    vector permute;
    vector<vector> result;

    for(ii = ceil(n/w) → h) {
        permute.push(ii);

        // reached base case
        if(n - ii == 0) {
            result.push(permute);
            return result;
        }

        permute.prepend(sumPermute(n - ii, ii, w - 1));
        result.push(permute);
    }
    return result;
}
```
This is best visualized as a recursion tree; using the example `sumPermute(4,3,3)`:

<a href="picross-tree.tex"><center><img src="picross-tree.png" width="90%"></center></a>

To generate $W$, filter elements of $W^\prime$ where any of the middle elements are zero.

This completes the first step of the translation algorithm: converting a given slice into a set of permutations of the white space vector.

### Converting Slice Permutations to DNF Expression
At this point, for a given slice $S$, we have generated all valid permutations of $W$.
To recover $P$ the set of all valid slice permutations from each $W$, we do the encoding in
'reverse',

- push back $W_0$ zeros
- push back $R_0$ ones
- ...
- push back $R_{|R|}$ ones
- push back $W_{|W|}$ zeros

When repeated for each valid permutation of $W$, the resulting set is $P$.

To convert $P$ to a set of Boolean expressions, an encoding of the board is needed.
`MiniSat`'s literals are a wrapper around `int`s, so uniquely encoding each board cell as an integer using row-major ordering:

<center>$B_{x,y} = x + \text{dimX} \times y$</center>

To convert each element of $P$ to a corresponding Boolean expression, iterate over each permutation encoding $\neg B_{i,j}$ if a zero is read and $B_{i,j}$ if a one is read.
For one instance of a permutation, all of these literals are `AND`ed, and all permutations are `OR`ed for a resulting expression of every possibility for the given slice.

This final expression is in *Disjunctive Normal Form* (`OR` of `AND`s, or Sum of Products):

<center>$$\bigvee_{i=0}^m \left( \bigwedge_{j=0}^n B_{i,j} \right)$$</center>

This completes the second step of the translation algorithm: converting a given slive into a DNF expression.

### Converting Expressions to CNF

At this point, we have a set of DNF expressions that satisfy each slice of the board.
To satisfy the entire board, all of these expresssions must be satisfied: `AND`ing over all slices $S$ gives a total expression for the board $E$:

<center>$$E = \bigwedge_{S} \left( \underbrace{\bigvee_{i=0}^m \left( \bigwedge_{j=0}^n B^S_{i,j} \right)}_{\text{DNF}} \right) $$</center>

However, SAT solvers reasonably expect a standard form for input expressions.
*Conjunctive Normal Form* is the form SAT solvers use to represent a Boolean formula (see [this](https://cstheory.stackexchange.com/questions/1410/why-is-cnf-used-for-sat-and-not-dnf) thread for explanations as to why),

<center>$$\bigwedge_{i=0}^n \left( \bigvee_{j=0}^m x_{ij} \right)$$</center>

So the final step of the translation algorithm is the conversion of $E$ into CNF.
Well, we're already pretty close with the outermost `AND`; in fact, just translating the inner DNF expression to CNF is sufficient,

<center>$$\bigwedge \left( \underbrace{\bigvee \left( \bigwedge x \right)}_{\text{DNF}} \right)
\hspace{1em} \rightarrow \hspace{1em}
\bigwedge \left( \underbrace{\bigwedge \left( \bigvee x \right)}_{\text{CNF}} \right)
\hspace{1em} = \hspace{1em}
\underbrace{\bigwedge \left( \bigvee x \right) }_{\text{CNF}}
$$</center>

Converting DNF expressions to CNF expressions is another great exponential translation!
I believe this algorithm is, formally speaking, $O(\text{bad})$.
Using $a$ as a shorthand for a sequence of `AND`ed literals, writing an expanded form of $E$:

<center>$E = (a_{11} \vee a_{12} \vee ... \vee a_{1n} ) \wedge (a_{21} \vee a_{22} \vee ... \vee a_{2n}) \wedge ... \wedge (a_{m1} \vee a_{m2} \vee ... \vee a_{mn})$</center>

Converting to a CNF expression is once again making every permutation of sets.
Using $E = (x_{11} \wedge x_{12} \wedge x_{13}) \vee (x_{21} \wedge x_{22} \wedge x_{23})$ as an example: <center>
$$E = \begin{matrix}
(x_{11} \vee x_{21}) & \wedge & (x_{11} \vee x_{22}) & \wedge & (x_{11} \vee x_{23}) & \wedge \\
(x_{12} \vee x_{21}) & \wedge & (x_{12} \vee x_{22}) & \wedge & (x_{12} \vee x_{23}) & \wedge \\
(x_{13} \vee x_{21}) & \wedge & (x_{13} \vee x_{22}) & \wedge & (x_{13} \vee x_{23})
\end{matrix}$$
</center>

This is clearly very exponential, and the general form is quite large: using $|a| = l$,

<center>
$$E = \begin{matrix}
(a_{111} \vee a_{211} \vee ... \vee a_{m11}) & \wedge & ... & \wedge & (a_{11l} \vee a_{211} \vee ... \vee a_{m11}) & \wedge \\
(a_{111} \vee a_{212} \vee ... \vee a_{m11}) & \wedge & ... & \wedge & (a_{11l} \vee a_{212} \vee ... \vee a_{m11}) & \wedge \\
\vdots & & \ddots & & \vdots \\
(a_{111} \vee a_{21l} \vee ... \vee a_{m11}) & \wedge & ... & \wedge & (a_{11l} \vee a_{21l} \vee ... \vee a_{m11}) & \wedge \\
\vdots & & \ddots & & \vdots \\
(a_{111} \vee a_{21l} \vee ... \vee a_{m1l}) & \wedge & ... & \wedge & (a_{11l} \vee a_{21l} \vee ... \vee a_{m1l}) & \wedge \\
\vdots & & \ddots & & \vdots \\
(a_{1n1} \vee a_{2nl} \vee ... \vee a_{mnl}) & \wedge & ... & \wedge & (a_{1nl} \vee a_{2nl} \vee ... \vee a_{mnl})
\end{matrix}$$
</center>

The number of expressions grows as $O(l^m)$... in other words, very bad!
There are other general techniques for transforming DNF expressions to CNF expressions (see [CNF Wikipedia page](https://en.wikipedia.org/wiki/Conjunctive_normal_form#Conversion_into_CNF) for examples), however having a non-exponential growth requires a translation that is equisatisfiable but not equivalent.
This could be useful if the question were instead *is there a solution* rather than *what is the solution*.
With this final conversion, the translation algorithm is complete!
Any Picross puzzle can be converted to an equivalent, SAT solver ready, CNF expression using this
algorithm.

## Implementation, Considerations

The complete code for `PicrossSAT` can be found [here](https://github.com/jleightcap/PicrossSAT).

In general, I didn't concern myself with the asymptotic complexity (in time or space) of each conversion.
I assumed that the majority of the runtime would be consumed by the actual SAT solver, and not the conversion translation algorithm.
This seems to be true for any puzzle larger than $4 \times 4$, at least from very basic testing.

This was my first program in 'modern' C++ after much more exposure to C, so please pardon the violations of best practices that I'm sure are there.
