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
        xaxis: {
            autorange: true,
            rangemode: "tozero"
        }
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
    Plotly.newPlot(TESTER, trace, layout, config);
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
    var list = [];
    for (var ii = lower; ii <= upper; ii += step) {
        list.push(ii);
    }
    return list;
}

/**
 * Read an equation from eqn element.
 */
function getEqn() {
    const eqn = expression(document.getElementById('eqn').value);
    const input = bound_input(0, 12, 0.5);
    plot(input, eqn);
}

plot_init();
