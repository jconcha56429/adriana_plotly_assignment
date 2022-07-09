function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sample_data=data.samples;
    var metadata = data.metadata
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var FilteredArray = sample_data.filter(sampleObj => sampleObj.id == sample);
    var MetaArray = metadata.filter(sampleObj => sampleObj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var samples_result = FilteredArray[0]; 
    var wfreq_result=MetaArray[0]
    //  ask later var sort_result= samples_result.sample_values.map(bacteria => bacteria).sort((a,b) => b-a);
    //var topten_result= sort_result.slice(0,10);
    
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    var otu_ids = samples_result.otu_ids;
    var otu_labels= samples_result.otu_labels;
    var sample_values = samples_result.sample_values;
  // wfreq only filterd and in descending order 
    
    var wfreq = wfreq_result.wfreq;
    
   
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    
    var sorted = otu_ids.map(id => id ).sort((a,b) => a.sample_values-b.sample_values ).reverse()
    var yticks = sorted.map(tick => "UTO "+tick)


    
      
    

    // 8. Create the trace for the bar chart. 
    var barData = [ {
      type: 'bar',
      x: sample_values.slice(0,10),
      y: yticks.slice(0,10),
      orientation: 'h'
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacteria Cultures Found ",
      //xaxis: {title: "City" },
      //yaxis: {title: "Population Growth, 2016-2017"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [ {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker:{
          color: otu_ids,
          size: sample_values,
          sizeref: 2

      }

    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU" },
      yaxis: {title: "Total Count "} 
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // layout of Gauge 
    var gaugeData = [ {
      type: "indicator",
      mode: "gauge+number",
      value: wfreq,
      title: { text: "Belly Button Washing", font: { size: 24 } },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "cyan" },
          { range: [2, 4], color: "royalblue" },
          { range: [4, 6], color: "blue" },
          { range: [6, 8], color: "skyblue" },
          { range: [8, 10], color: "darkblue" },
        ],
       
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout =  {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    }
     
    ;

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);



  });
}

