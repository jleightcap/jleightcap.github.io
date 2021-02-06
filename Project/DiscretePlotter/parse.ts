enum Tokens {
  LPAREN,
  RPAREN,
  LIT_VAR,
  LIT_INT,
  LIT_PI,
  LIT_E,
  UNIOP_SIN,
  UNIOP_COS,
  UNIOP_LN,
  BINOP_PLUS,
  BINOP_MINUS,
  BINOP_MUL,
  BINOP_DIV,
}

interface Token {
  type: Tokens;
  value?: number;
  name?: string;
}

// dictionary contant token strings -> Tokens type
const Token_Map =
    {
      // delineators
      "(" : {type : Tokens.LPAREN},
      ")" : {type : Tokens.RPAREN},
      // literals
      "pi" : {type : Tokens.LIT_PI, value : Math.PI},
      "e" : {type : Tokens.LIT_E, value : Math.E},
      // unary operators
      "sin" : {type : Tokens.UNIOP_SIN},
      "cos" : {type : Tokens.UNIOP_COS},
      "ln" : {type : Tokens.UNIOP_LN},
      // binary operators
      "+" : {type : Tokens.BINOP_PLUS},
      "-" : {type : Tokens.BINOP_MINUS},
      "*" : {type : Tokens.BINOP_MUL},
      "/" : {type : Tokens.BINOP_DIV},
    }

/**
 * parse a given string into a lambda.
 * @param {String} n
 */
function expression(s: string) {
  let toks: Array<Token> = tokenize(s);
  console.log(toks);
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
      return (_: number) => Number(exprs.value);
    case 'LIT_VAR':
      return (x: number) => x;
    }
  }
}

function parse(toks: Array<Token>) {
  if (toks.length == 0)
    return [];
  let tok = toks[0];
  let rest = toks.slice(1);

  switch (tok.type) {
    case Tokens.LPAREN:
      let [sl, tail] = parse_sublist(rest);
      assert(tail.length == 0, "parse: unexpected extra tokens");
      return sl;
      // atoms
    case Tokens.LIT_INT | Tokens.LIT_VAR | Tokens.LIT_PI | Tokens.LIT_E:
      return tok;
    default:
      log("parse: unexpected token: " + toks[0].type);
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
  return [ sublist, [] ];
}

function tok_tag(lexeme: string) : Token {
  // lexeme is number
  console.log(lexeme);
  if (/\d+|\d+.\d+/.test(lexeme)) {
    return {type: Tokens.LIT_INT, value: +lexeme };
  }
  // lexme is constant string Token
  else if (lexeme in Token_Map) {
    return Token_Map[lexeme];
  }
  // lexeme is a (non-constant string Token) word: must be a variable
  else if (/\w+/.test(lexeme)) {
    return {type: Tokens.LIT_VAR, name: lexeme };
  }
  else {
    assert(false, "tokenize: unexpected token " + lexeme);
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

function tokenize(s: string) : Token[] {
  s = s.trim();

  // FIXME: function and variable declaration
  let [_, def] = s.split("=");

  // TODO: function self-referential in body
  var toks: Array<Token> = def.match(re_tok).map(tok_tag);
  return toks;
}

function log(msg: string) {
  var result = document.getElementById("parse_result");
  result.innerText = msg;
}

/**
 * Assert cond, otherwise error msg.
 * @param {Bool} cond
 * @param {String} msg
 */
function assert(cond: boolean, msg: string) {
  if (!cond) {
    log(msg);
  } else {
    log("");
  }
}
