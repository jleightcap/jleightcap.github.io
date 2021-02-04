/**
 * parse a given string into a lambda.
 * @param {String} n
 */
function parse(n) {
    let toks = tokenize(n);
    return parse_rec(toks);
}

function parse_rec(toks) {
    if (toks.length == 0) {
        return (x) => x;
    }
    switch (toks[0].type) {
        case 'UNIOP_SIN':
            assert(toks[1].type == 'LPAREN', "expected '(' after `sin'");
            let sin = (x) => Math.sin(parse_rec(toks.slice(2))(x));
            return sin;
        case 'UNIOP_COS':
            assert(toks[1].type == 'LPAREN', "expected '(' after `cos'");
            let cos = (x) => Math.cos(parse_rec(toks.slice(2))(x));
            return cos;
        case 'LIT_INT':
            console.log("LIT_INT", toks[0].value);
            return (x) => toks[0].value;
        case 'LIT_VAR':
            console.log("LIT_VAR", toks[0].value);
            return (x) => x;
        default:
            err("unexpected token: " + toks[0]);
    }
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
        default:
            err("unexpected token: " + tok);
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
        throw "";
    } else {
        log("");
    }
}
