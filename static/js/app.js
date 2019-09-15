var directory = 'static/data/samples.json';
d3.json(directory).then((entries) => {
    console.log(entries);
    console.log(entries.samples);
    
    var dropdown = [];
    entries.samples.forEach(([key, value]) => console.log(entries.samples.id));

});