enum Tokens {
    LPAREN,
    RPAREN,
    LIT_VAR,
    LIT_NUMBER,
    UNIOP_SIN,
    UNIOP_COS,
    UNIOP_LN,
    BINOP_PLUS,
    BINOP_MINUS,
    BINOP_MUL,
    BINOP_DIV,
}


type None = null;
type Variable = string;
type Value = number;

type Token = {
    type: Tokens;
    value?: Value;
    name?: Variable;
}

type Expr = None | String | Number | Token[];


// dictionary contant token strings -> Tokens type
const Token_Map =
{
    // delineators
    "(": { type: Tokens.LPAREN },
    ")": { type: Tokens.RPAREN },
    // literals
    "pi": { type: Tokens.LIT_NUMBER, value: Math.PI },
    "e": { type: Tokens.LIT_NUMBER, value: Math.E },
    // unary operators
    "sin": { type: Tokens.UNIOP_SIN },
    "cos": { type: Tokens.UNIOP_COS },
    "ln": { type: Tokens.UNIOP_LN },
    // binary operators
    "+": { type: Tokens.BINOP_PLUS },
    "-": { type: Tokens.BINOP_MINUS },
    "*": { type: Tokens.BINOP_MUL },
    "/": { type: Tokens.BINOP_DIV },
}

// transform a string representing an  S-Expression into a lambda.
function expression(s: string) {
    let toks: Token[] = tokenize(s);
    console.log("toks: ", toks);
    let expr: Expr = parse(toks);
    console.log("expr: ", expr);
    return lambda_expr(expr);
}

// form a Lambda from an Expression.
function lambda_expr(expr: Expr): ({}: number) => number {
    console.log("lambda: ", expr);

    // variable
    enum ExprType { Var, Num, Exp };
    const exptype = (e: Expr): ExprType => {
        // polymorphism who?
        if (typeof e === "string") return ExprType.Var;
        if (typeof e === "number") return ExprType.Num;
        if (e instanceof Array) return ExprType.Exp;
    };

    // FIXME: clearly type hierarchy is clunky
    const asexpr = (t: Token | Token[]): Expr => {
        if (t instanceof Array) return t;
        else switch (t.type) {
            case Tokens.LIT_VAR: return t.name;
            case Tokens.LIT_NUMBER: return t.value;
        }
    };

    const curry =
        (op: ({}: number, {}: number) => number) =>
            (f: ({}: number) => number, g: ({}: number) => number) =>
                (x: number) =>
                    op(f(x), g(x));

    const add_curry = curry((a, b) => (a + b));
    const sub_curry = curry((a, b) => (a - b));
    const mul_curry = curry((a, b) => (a * b));
    const div_curry = curry((a, b) => (a / b));

    switch (exptype(expr)) {
        case ExprType.Var:
            return (x) => x;
        case ExprType.Num:
            return (_) => expr as number;
        case ExprType.Exp:
            const funcall = expr as Token[];
            const [op, args] = [funcall[0], funcall.slice(1)];
            console.log("op: ", op, "args: ", args);
            let argfuns: ((_: number) => number)[] = args.map((t) => lambda_expr(asexpr(t)));
            switch (op.type) {
                case Tokens.UNIOP_SIN:
                    assert(argfuns.length == 1, "lambda: `sin' expects one parameter");
                    return (x) => parseFloat(Math.sin(argfuns[0](x)).toFixed(3));
                case Tokens.UNIOP_COS:
                    assert(argfuns.length == 1, "lambda: `cos' expects one parameter");
                    return (x) => parseFloat(Math.cos(argfuns[0](x)).toFixed(3));
                case Tokens.UNIOP_LN:
                    assert(argfuns.length == 1, "lambda: `ln' expects one parameter");
                    return (x) => parseFloat(Math.log(argfuns[0](x)).toFixed(3));
                case Tokens.BINOP_PLUS:
                    return (x: number) => argfuns.reduce(add_curry, ({}) => 0)(x);
                case Tokens.BINOP_MINUS:
                    return (x: number) => argfuns.reduce(sub_curry, ({}) => 0)(x);
                case Tokens.BINOP_MUL:
                    return (x: number) => argfuns.reduce(mul_curry, ({}) => 1)(x);
                case Tokens.BINOP_DIV:
                    return (x: number) => argfuns.reduce(div_curry, ({}) => 1)(x);
            }
    }
}

function parse(toks: Token[]): Expr {
    if (toks.length == 0) return null;
    let tok = toks[0];
    let rest = toks.slice(1);

    switch (tok.type) {
        // top-level expressions
        case Tokens.LPAREN:
            let [sl, tail] = parse_sublist(rest);
            assert(tail.length == 0, "parse: unexpected extra tokens");
            return sl;
        // top-level atoms
        case Tokens.LIT_NUMBER:
            return tok.value;
        // top-level variables
        case Tokens.LIT_VAR:
            return tok.name;
        default:
            log("parse: unexpected token: " + toks[0].type);
    }
}

// parse a sublist (everything after LPAREN up to matching RPAREN),
// returning the sublist and any leftover tokens
function parse_sublist(toks: Token[]): [Token[], Token[]] {
    // FIXME: fold probably more elegant
    var balance = 1;
    var sublist = [];
    for (var ii = 0; ii < toks.length; ii++) {
        let tok = toks[ii];
        switch (toks[ii].type) {
            case Tokens.LPAREN:
                let [sl, tail] = parse_sublist(toks.slice(ii + 1));
                assert(tail.length == 0, "parse: unexpected leftover tokens");
                sublist.push(sl);
                ii += sl.length;
                balance++;
                break;
            case Tokens.RPAREN:
                balance--;
                break;
            default:
                sublist.push(tok);
                break;
        }
        if (balance == 0) return [sublist, toks.slice(ii)];
    }
    log("parse: unbalanced parens");
}

// tag string lexeme as appopriate Token
function tok_tag(lexeme: string): Token {
    // lexeme is number
    if (/\d+|\d+.\d+/.test(lexeme)) {
        return { type: Tokens.LIT_NUMBER, value: +lexeme };
    }
    // lexme is constant string Token
    else if (lexeme in Token_Map) {
        return Token_Map[lexeme];
    }
    // lexeme is a (non-constant string Token) word: must be a variable
    else if (/\w+/.test(lexeme)) {
        return { type: Tokens.LIT_VAR, name: lexeme };
    } else {
        log("tokenize: unexpected lexeme " + lexeme);
    }
}

// regex that matches tokens in a string
/* ORDER:
 * - delineators
 * - numbers (fractional or not)
 * - single character operators
 * - multi-character operators
 * - any remaining words (variables)
 */
// FIXME: unary minus
const re_tok = /\(|\)|\d+\.\d|\d+|\+|\-|\*|\/|sin|cos|ln|pi|e|\w+/g;

function tokenize(s: string): Token[] {
    s = s.trim();

    // TODO: function and variable declaration
    let [{}, def] = s.split("=");

    // TODO: function self-referential in body
    var toks: Token[] = def.match(re_tok).map(tok_tag);
    return toks;
}

// log a message to user
function log(msg: string) {
    var result = document.getElementById("parse_result");
    result.innerText = msg;
}

// assert a condition, printing an error message if false
function assert(cond: boolean, msg: string) {
    if (!cond) log(msg);
    else log("");
}
