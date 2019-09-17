// Load the directory for JSON.
var directory = 'static/data/samples.json';

// Select the dropdown menu.
var dropdown = d3.select('#selDataset');

function init() {
    d3.json(directory).then((entry) => {
        // Check the structure of this object.
        console.log(entry);

        // Map ID numbers of each subject into an array.
        var ids = entry.samples.map(sample => sample.id);
        console.log(ids);

        // Fetch IDs into the dropdown menu for data retrieval and plotting.    
        ids.forEach((id) => {
            var idNo = dropdown.append('option');
            idNo.text(id);
        });

        generate_metadata(ids[0]);
        gauge_chart(ids[0]);
        bar_graph(ids[0]);
        bubble_plot(ids[0]);
    });
};

// Generate "Demographics Info" table.
function generate_metadata(subject) {
    d3.json(directory).then((entry) => {
        
        // Filter the data with the selected ID number.
        var idInput = dropdown.property('value');
        var filtered_metadata = entry.metadata.filter((row) => row.id === parseInt(idInput));
        console.log(filtered_metadata);

        // Fetch the filtered information into the table.
        var demo_info = d3.select('#sample-metadata');
        demo_info.html('');
        Object.entries(filtered_metadata[0]).forEach(([key, value]) => {
            var info_p = demo_info.append('p');
            info_p.text(`${key}: ${value}`);
        });
    });
};

// Create a gauge chart.
function gauge_chart(subject) {
    d3.json(directory).then((entry) => {

        // Filter the data with the selected ID number.
        var idInput = dropdown.property('value');
        var filtered_metadata = entry.metadata.filter((row) => row.id === parseInt(idInput));
        console.log(filtered_metadata);

        // Set up variables.
        var trace1 = {
            domain: {
                x: [0, 1],
                y: [0, 1]
            },
            value: filtered_metadata[0].wfreq,
            title: 'Wash Frequency',
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: {range: [null, 9]},
                steps: [
                    {range: [0, 1], color: 'lightyellow'},
                    {range: [1, 2], color: 'lemonchiffon'},
                    {range: [2, 3], color: 'palegoldenrod'},
                    {range: [3, 4], color: 'khaki'},
                    {range: [4, 5], color: 'yellowgreen'},
                    {range: [5, 6], color: 'darkseagreen'},
                    {range: [6, 7], color: 'mediumseagreen'},
                    {range: [7, 8], color: 'forestgreen'},
                    {range: [8, 9], color: 'darkgreen'},
                ]
            }
        };
    
        var data = [trace1];

        var layout = {width: 500, height: 500, margin: {t: 0, b: 0}};

        Plotly.newPlot('gauge', data, layout);
    });  
};

// Create a bar graph.
function bar_graph(subject) {
    d3.json(directory).then((entry) => {

        // Filter the data with the selected ID number.
        var idInput = dropdown.property('value');
        var filtered_sample = entry.samples.filter((row) => row.id === idInput);
        console.log(filtered_sample[0]);

        // Slice the data.
        var sliced_values = filtered_sample[0].sample_values.slice(0, 10).reverse();
        var sliced_labels = filtered_sample[0].otu_labels.slice(0, 10).reverse();
        var sliced_ids = filtered_sample[0].otu_ids.slice(0, 10).reverse();
        console.log(sliced_ids);

        // Convert OTU IDs into string.
        var ids_toString = [];

        for (var i = 0; i < sliced_ids.length; i ++) {
            ids_toString.push(`OTU ${sliced_ids[i].toString()}`);
        };
        console.log(ids_toString);

        // Set up variables.
        var trace1 = {
            x: sliced_values,
            y: ids_toString,
            text: sliced_labels,
            type: 'bar',
            orientation: 'h'
        };

        var data = [trace1];

        Plotly.newPlot('bar', data);
    }); 
};


// Create a bubble chart.
function bubble_plot(subject) {
    d3.json(directory).then((entry) => {

        // Filter the data with the selected ID number.
        var idInput = dropdown.property('value');
        var filtered_sample = entry.samples.filter((row) => row.id === idInput);
        console.log(filtered_sample[0]);

        // Set up variables.
        var trace1 = {
            x: filtered_sample[0].otu_ids,
            y: filtered_sample[0].sample_values,
            text: filtered_sample[0].otu_labels,
            mode: 'markers',
            marker: {
                size: filtered_sample[0].sample_values,
                color: filtered_sample[0].otu_ids
            }
        };

        var data = [trace1];

        var layout = {
            title: `OTU Population by OTU ID of Subject ${subject}`,
            xaxis: {
                title: 'OTU ID'
            },
            yaxis: {
                title: 'Number of Samples'
            }
        };

        Plotly.newPlot('bubble', data, layout);
    });
};

function optionChanged(option) {
    generate_metadata(option);
    bar_graph(option);
    bubble_plot(option);
    gauge_chart(option)
};

init();