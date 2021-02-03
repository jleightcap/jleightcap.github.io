TESTER = document.getElementById('tester');

/**
 * @param {Array} input
 * @param {Array -> Array} eqn
 */
function plot(input, eqn) {
    const layout = {
        showlegend: false,
        paper_bgcolor: '#222222',
        plot_bgcolor: '#222222',
        font: {
            color: '#ffffff'
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

    Plotly.react(TESTER, trace, layout, config);
}

let input = [-Math.PI, 0, Math.PI, 2 * Math.PI];
var eq = (n) => 1 * n;
plot(input, eq);

function getEqn() {
    let eqn = document.getElementById('eqn').value;
}
