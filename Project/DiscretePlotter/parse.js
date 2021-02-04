/**
 * parse a given string into a lambda.
 * @param {String} n
 */
function expression(n) {
    let toks = tokenize(n);
    let expr = parse(toks);
    return sexp_of_expr(expr);
}

function sexp_of_expr(exprs) {
    // expressions
    if (exprs instanceof Array) {
        let expr = exprs[0];
        let rest = exprs.slice(1);
        switch (expr.type) {
            case 'UNIOP_SIN':
                assert(rest.length == 1, "sexp: `sin' expects one argument");
                let arg = (x) => sexp_of_expr(rest[0])(x);
                return (x) => Math.sin(arg(x));
            case 'BINOP_PLUS':
            case 'BINOP_MINUS':
            case 'BINOP_MUL':
            case 'BINOP_DIV':
                assert(rest.length == 2,
                    "sexp: binary function " + expr.type + " expects two arguments");
                let arg1 = (a1) => sexp_of_expr(rest[0])(a1);
                let arg2 = (a2) => sexp_of_expr(rest[1])(a2);
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
                return (x) => Number(exprs.value);
            case 'LIT_VAR':
                return (x) => x;
        }
    }
}

function parse(toks) {
    if (toks.length == 0) return [];
    let tok = toks[0]
    let rest = toks.slice(1);

    switch (tok.type) {
        case 'LPAREN':
            let [sl, tail] = parse_sublist(rest);
            assert(tail.length == 0, "parse: unexpected extra tokens");
            return sl;
            // atoms
        case 'LIT_INT':
        case 'LIT_VAR':
        case 'LIT_PI':
        case 'LIT_E':
            return tok;
        case 'RPAREN':
        default:
            log("unexpected token: " + toks[0].type);
    }
}

function parse_sublist(toks) {
    var balance = 1;
    var sublist = [];
    for (var ii = 0; ii < toks.length; ii++) {
        let tok = toks[ii];
        switch (toks[ii].type) {
            case 'LPAREN':
                let [sl, tail] = parse_sublist(toks.slice(ii + 1));
                sublist.push(sl);
                ii += sl.length;
                balance++;
                break;
            case 'RPAREN':
                balance--;
                break;
            default:
                sublist.push(tok);
                break;
        }
    }
    assert(balance == 0, "parse: unbalanced parens");
    return [sublist, []];
}

function tok_tag(tok) {
    switch (tok) {
        case "(":
            return {
                type: 'LPAREN', value: null
            };
        case ")":
            return {
                type: 'RPAREN', value: null
            };
        case "n":
            return {
                type: 'LIT_VAR', value: "n"
            };
        case (tok.match(/\d+/) || {}).input:
            return {
                type: 'LIT_INT', value: tok
            };
        case "pi":
            return {
                type: 'LIT_PI', value: Math.PI
            };
        case "e":
            return {
                type: 'LIT_E', value: Math.E
            };
        case "+":
            return {
                type: 'BINOP_PLUS', value: null
            };
            /* FIXME: unary minus */
        case "-":
            return {
                type: 'BINOP_MINUS', value: null
            };
        case "*":
            return {
                type: 'BINOP_MUL', value: null
            };
        case "/":
            return {
                type: 'BINOP_DIV', value: null
            };
        case "sin":
            return {
                type: 'UNIOP_SIN', value: null
            };
        case "cos":
            return {
                type: 'UNIOP_COS', value: null
            };
        case "ln":
            return {
                type: 'UNIOP_LN', value: null
            };
        default:
            assert(false, "unexpected token: " + tok.type);
    }
}

function tokenize(n) {
    n = n.trim();
    // function declaration regex
    const re_fun = /^\w+\[n\]/g;
    // tokens regex FIXME: unary minus
    const re_tok = /\(|\)|n|\d+|\+|\-|\*|\/|sin|cos|ln|pi|e|\w+/g;
    let fun_def = n.split("=");
    assert(fun_def.length == 2, "tokenize: expected `fun[n]=...'");

    let [fun, def] = fun_def;
    assert(re_fun.test(fun), "tokenize: malformed function name");
    // TODO: function self-referential in body
    var toks = def.match(re_tok).map(tok_tag);
    return toks;
}

function log(msg) {
    var result = document.getElementById("parse_result");
    result.innerText = msg;
}

/**
 * Assert cond, otherwise error msg.
 * @param {Bool} cond
 * @param {String} msg
 */
function assert(cond, msg) {
    if (!cond) {
        log(msg);
    } else {
        log("");
    }
}
