TESTER = document.getElementById('tester');

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
        font: {
            color: FG
        },
    };

    const config = {
        responsive: true
    }

    const output = input.map(eqn);
    var trace = [{
        x: input,
        y: output,
        type: 'scatter',
        mode: 'markers'
    }];

    // FIXME: .react() less overhead
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
    if (lower == "") { lower = 0; }
    if (upper == "") { upper = 10; }
    if (step == "") { step = 1; }
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
    const eqn = expression(document.getElementById('eqn').value);
    let lb = parseFloat(document.getElementById('lower_bound').value);
    let ub = parseFloat(document.getElementById('upper_bound').value);
    let om = parseFloat(document.getElementById('sample_freq').value);
    assert(lb < ub, "plot: lower bound must be less than upper bound");
    assert(om > 0.001, "plot: very low sampling rate");
    const input = bound_input(lb, ub, om);
    plot(input, eqn);
}

plot_init();
