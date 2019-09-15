var directory = '../../sample.json'
d3.json(directory).then((entry) => {
    var sorted = entry.sort((a, b) => b.sample_values - a.sample_values);
    var sliced = sorted.slice(0, 10);
    var reversed = sliced.reverse();

    var trace1 = {
        x: reversed.map((object) => object.otu_ids),
        y: reversed.map((object) => object.sample_values),
        // name: ,
        type: 'bar',
        orientation: 'h'
    };

    var data = [trace1];



    Plotly.newPlot('bar', data);
});