TESTER = document.getElementById('tester');

function getEqn() {
    let eqn = document.getElementById('eqn').value;
    alert(eqn);
}

var eq = (n) => 2 * n;
let input = [-Math.PI, 0, Math.PI, 2 * Math.PI];
let output = input.map(eq);

var trace1 = {
    x: input,
    y: output,
    type: 'scatter',
    mode: 'markers'
};

var data = [trace1];

var layout = {
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

var config = {
    responsive: true
}

Plotly.react(TESTER, data, layout, config);
