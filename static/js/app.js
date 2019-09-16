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

// Create a bar graph.
function bar_graph(subject) {
    console.log(subject);
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

        Plotly.newPlot(bubble, data, layout);
    });
};

function optionChanged(option) {
    generate_metadata(option);
    bubble_plot(option);
};

init();