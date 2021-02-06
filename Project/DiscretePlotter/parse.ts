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

enum ExprType {
    LITERAL,
    OPERATOR,
    VARIABLE,
}
type Expr<T> = {
    type: ExprType,
    body:
    | None
    | Variable
    | Value
    | { op: T; args: Expr<T>[]; }
};

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
    console.log(toks);
    let expr: Expr<Token> = parse(toks);
    return lambda_expr(expr);
}

// form a Lambda from an Expression.
function lambda_expr(expr: Expr<Token>) {
    // expressions
    switch (expr.type) {
        case ExprType.VARIABLE:
            return (x: number) => x;
        case ExprType.LITERAL:
            return (_: number) => expr.body;
        case ExprType.OPERATOR:
            return (x: number) => x;
    }
    /*
    if (exprs instanceof Array) {
        let expr = exprs[0];
        let rest = exprs.slice(1);
        switch (expr.type) {
            case 'UNIOP_SIN':
                assert(rest.length == 1, "sexp: `sin' expects one argument");
                let arg = (x) => lambda_expr(rest[0])(x);
                return (x) => Math.sin(arg(x));
            case 'BINOP_PLUS':
            case 'BINOP_MINUS':
            case 'BINOP_MUL':
            case 'BINOP_DIV':
                assert(rest.length == 2,
                    "sexp: binary function " + expr.type + " expects two arguments");
                let arg1 = (a1) => lambda_expr(rest[0])(a1);
                let arg2 = (a2) => lambda_expr(rest[1])(a2);
                switch (expr.type) {
                    case 'BINOP_PLUS':
                        return (x) => arg1(x) + arg2(x);
                    case 'BINOP_MINUS':
                        return (x) => arg1(x) - arg2(x);
                    case 'BINOP_MUL':
                        return (x) => arg1(x) * arg2(x);
                    case 'BINOP_DIV':
                        return (x) => arg1(x) / arg2(x);
                    default:
                        assert(false, "sexp: unhandled binop");
                }
        }
    }
    // literals
    else {
        switch (exprs.type) {
            case 'LIT_INT':
            case 'LIT_PI':
            case 'LIT_E':
                return (_: number) => Number(exprs.value);
            case 'LIT_VAR':
                return (x: number) => x;
        }
    }
    */
}

function parse(toks: Token[]): Expr<Token> {
    if (toks.length == 0) return null;
    let tok = toks[0];
    let rest = toks.slice(1);

    switch (tok.type) {
        // top-level expressions
        case Tokens.LPAREN:
            let [sl, tail] = parse_sublist(rest);
            assert(tail.length == 0, "parse: unexpected extra tokens");
            return { type: ExprType.OPERATOR, body: { op: tok, args: sl } };
        // top-level atoms
        case Tokens.LIT_NUMBER:
            return { type: ExprType.LITERAL, body: tok.value };
        case Tokens.LIT_VAR:
            return { type: ExprType.VARIABLE, body: tok.name };
        default:
            log("parse: unexpected token: " + toks[0].type);
    }
}

// parse a sublist (everything after LPAREN up to matching RPAREN),
// returning the sublist and any leftover tokens
function parse_sublist(toks: Token[]) : [Expr<Token>[],  Token[]] {
    var balance = 1;
    var sublist = [];
    // FIXME: fold is more elegant
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

    // FIXME: function and variable declaration
    let [_, def] = s.split("=");

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
    if (!cond) {
        log(msg);
    } else {
        log("");
    }
}
