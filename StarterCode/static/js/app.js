// Get the samples endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let data;

// Fetch the JSON data and create a bar chart with a dropdown menu
d3.json(url).then(function(response) {
  // Extract relevant data from the JSON

  data = response;

  const sampleValues = data.samples[0].sample_values.slice(0, 10);
  const otuIds = data.samples[0].otu_ids.slice(0, 10);
  const otuLabels = data.samples[0].otu_labels.slice(0, 10);

  // Get the names of the datasets
  const datasetNames = data.names;

  // Initialize the page with a default plot and dropdown menu
  function init() {

    //Reverse the data arrays to match the exercise - user preference. 

    let reversedSampleValues = sampleValues.slice(0, 10).reverse();
    let reversedOtuIds = otuIds.map(id => `OTU ${id}`).slice(0, 10).reverse();
    let reversedOtuLabels = otuLabels.slice(0, 10).reverse();
  
    // Create a bar chart
    let trace1 = {
      x: reversedSampleValues,
      y: reversedOtuIds,
      text: reversedOtuLabels,
      type: 'bar',
      orientation: 'h',
      hoverinfo: 'text'
    };


    let data = [trace1];

    let layout = {
      title: 'Top 10 OTUs',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' },
      hovermode: 'closest',
    };

    Plotly.newPlot('bar', data, layout);

    // Populate the dropdown menu with dataset names
    let dropdownMenu = d3.select("#selDataset");
    datasetNames.forEach(name => {
      dropdownMenu.append("option").property("value", name).text(name);
    });
  }

  function displayMetadata(sampleId) {
    // Find the index of the sample ID in the names array
    const index = data.names.indexOf(sampleId);
    if (index !== -1) {
      // Select the table with id "sample-metadata"
      const metadataTable = d3.select("#sample-metadata");
      metadataTable.html(""); // Clear existing content
  
      // Get the metadata for the selected sample ID
      const metadata = data.metadata[index];
  
      // Add table rows with metadata values
      Object.entries(metadata).forEach(([key, value]) => {
        // Create a new row for each key-value pair
        const newRow = metadataTable.append("tr");
        newRow.append("th").text(key); // Add table header
        newRow.append("td").text(value); // Add table data
      });
    } else {
      console.error(`Sample ID ${sampleId} not found.`);
    }
  }
  
  // Call the function with a sample ID (replace with the desired ID)

  displayMetadata("940"); // Initial display

  // Call the displayMetadata function when the dropdown changes
  d3.select("#selDataset").on("change", function() {
    const selectedSampleId = d3.select(this).property("value");
    displayMetadata(selectedSampleId);
  });

  // Call updatePlotly() when a change takes place to the DOM
  d3.selectAll("#selDataset").on("change", updatePlotly);


// Function to update the plot based on the selected dataset
function updatePlotly() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let datasetName = dropdownMenu.property("value");

    // Fetch data for the selected dataset
    d3.json(url).then(function(data) {
        // Find the index of the selected dataset name in the names array
        let datasetIndex = data.names.indexOf(datasetName);

        // Use the index to access the corresponding data
        let selectedData = data.samples[datasetIndex];

        // Reverse the data arrays
        let reversedSampleValues = selectedData.sample_values.slice(0, 10).reverse();
        let reversedOtuIds = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let reversedOtuLabels = selectedData.otu_labels.slice(0, 10).reverse();

        // Update the bar chart using Plotly.restyle
        Plotly.restyle('bar', 'x', [reversedSampleValues]);
        Plotly.restyle('bar', 'y', [reversedOtuIds]);
        Plotly.restyle('bar', 'text', [reversedOtuLabels]);

        // Update the bubble chart using Plotly.restyle
        Plotly.restyle('bubble', 'x', [selectedData.otu_ids]);
        Plotly.restyle('bubble', 'y', [selectedData.sample_values]);
        Plotly.restyle('bubble', 'marker.size', [selectedData.sample_values]);
        Plotly.restyle('bubble', 'marker.color', [selectedData.otu_ids]);
        Plotly.restyle('bubble', 'text', [selectedData.otu_labels]);

          // Update the metadata
          displayMetadata(datasetName);
    });
}

  // Initialize the plot and dropdown menu
  init();


//Bubble Chart
// Create a bubble chart that displays each sample.

// Use otu_ids for the x values.

// Use sample_values for the y values.

// Use sample_values for the marker size.

// Use otu_ids for the marker colors.

// Use otu_labels for the text values.

var otuIdsBubble = data.samples[0].otu_ids;
var sampleValuesBubble = data.samples[0].sample_values;
var otuLabelsBubble = data.samples[0].otu_labels;

var trace2 = {
    x: otuIdsBubble,    // x-axis values
    y: sampleValuesBubble, // y-axis values
    mode: 'markers',     // set mode to 'markers' for a scatter plot
    marker: {
      size: sampleValuesBubble,  // size of bubbles
      color: otuIdsBubble,  // color of bubbles
    },
    text: otuLabelsBubble,  // text labels for each point
  };
  
  // Data array containing the trace
  var dataBubble = [trace2];
  
  // Layout configuration
  var layoutBubble = {
    title: 'Bubble Chart Module 14',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' },
    height: 400,
    width: 1000,


  };
  
  // Create the plot
  Plotly.newPlot('bubble', dataBubble, layoutBubble);


});