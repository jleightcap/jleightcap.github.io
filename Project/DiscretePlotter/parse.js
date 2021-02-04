/**
 * parse a given string into a lambda.
 * @param {String} n
 */
function expression(n) {
    let toks = tokenize(n);
    let expr = parse(toks);
    console.log(expr);
    return sexp_of_expr(expr);
}

function sexp_of_expr(exprs) {
    if (exprs.length == 0) return (x) => x;
    let expr = exprs[0]
    let rest = exprs.slice(1);


    if (rest.length == 0) {
        switch (expr.type) {
            case 'LIT_INT':
                return (x) => Number(expr.value);
            case 'LIT_VAR':
                return (x) => x;
            case 'UNIOP_SIN':
                return (args) => (x => Math.sin(args[0](x)));
            case 'UNIOP_COS':
                return (args) => (x => Math.cos(args[0](x)));
            case 'BINOP_PLUS':
                return (args) => (x => args[0](x) + args[1](x));
            case 'BINOP_MINUS':
                return (args) => (x => args[0](x) - args[1](x));
            case 'BINOP_MUL':
                return (args) => (x => args[0](x) * args[1](x));
            case 'BINOP_DIV':
                return (args) => (x => args[0](x) / args[1](x));
        }
    } else {
        let args = rest.map((arg) => sexp_of_expr([arg]));
        let op = sexp_of_expr([expr]);
        return (x) => op(args)(x);
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
        case 'LIT_INT':
        case 'LIT_VAR':
            return [tok];
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
            return { type: 'LPAREN', value: null };
        case ")":
            return { type: 'RPAREN', value: null };
        case "n":
            return { type: 'LIT_VAR', value: "n" };
        case (tok.match(/\d+/) || {}).input:
            return { type: 'LIT_INT', value: tok };
        case "+":
            return { type: 'BINOP_PLUS', value: null };
            /* FIXME: unary minus */
        case "-":
            return { type: 'BINOP_MINUS', value: null };
        case "*":
            return { type: 'BINOP_MUL', value: null };
        case "/":
            return { type: 'BINOP_DIV', value: null };
        case "sin":
            return { type: 'UNIOP_SIN', value: null };
        case "cos":
            return { type: 'UNIOP_COS', value: null };
        default:
            assert(false, "unexpected token: " + tok.type);
    }
}

function tokenize(n) {
    n = n.trim();
    // function declaration regex
    const re_fun = /^\w+\[n\]/g;
    // tokens regex FIXME: unary minus
    const re_tok = /\(|\)|n|\d+|\+|\-|\*|\/|sin|cos|\w+/g;
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
