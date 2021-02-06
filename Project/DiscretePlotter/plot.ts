const BG = '#222222';
const FG = '#ffffff';

/**
 * @param {Array} input
 * @param {Array -> Array} eqn
 */
function plot(input, eqn) {
    const layout = {
        showlegend: false,
        paper_bgcolor: BG,
        plot_bgcolor: BG,
        font: { color: FG },
    };

    const config = {
        responsive: true
    }

    const output = input.map(eqn);
    var trace = [{ x: input, y: output, type: 'scatter', mode: 'markers' }];

    // FIXME: .react() less overhead
    let TESTER = document.getElementById('tester');

    Plotly.react(TESTER, trace, layout, config);
}

/**
 * A default plot.
 */
function plot_init() {
    const input = bound_input(0, 12, 1);
    const eqn = (n) => Math.sin(n);
    plot(input, eqn);
}

/**
 * Generate an input array for given bounds and step size.
 * @param {Number} lower
 * @param {Number} upper
 * @param {Number} step
 */
function bound_input(lower, upper, step) {
    // FIXME: use Array(...).fill().map(...)
    // FIXME: floats break
    if (lower == "") {
        lower = 0;
    }
    if (upper == "") {
        upper = 10;
    }
    if (step == "") {
        step = 1;
    }
    var list = [];
    for (var ii = lower; ii <= upper; ii += step) {
        list.push(ii);
    }
    return list;
}

/**
 * Read an equation from user.
 */
function get_conf() {
    const in_eqn = (<HTMLInputElement>document.getElementById('eqn')).value;
    const in_lb =
        (<HTMLInputElement>document.getElementById('lower_bound')).value;
    const in_ub =
        (<HTMLInputElement>document.getElementById('upper_bound')).value;
    const eqn = expression(in_eqn);
    let lb = parseFloat(in_lb);
    let ub = parseFloat(in_ub);
    assert(lb < ub, "plot: lower bound must be less than upper bound");
    const input = bound_input(lb, ub, 1);
    plot(input, eqn);
}

plot_init();
