const drawHistogram = (data) => {
    // Step 6.1 Set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`); //Responsive SVG
    
    // Create an inner chart group with margins
    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`); // Move the inner chart to account for margins

    // Generate bins using the shared bin generator.
    const bins = binGenerator(data); // Save the bins into an array

    console.log(bins); // Log the bins to the console for debugging

    // Step 6.3 Get the lower and upper bounds of bins
    const minEng = bins[0].x0; //Lower bound of the first bin
    const maxEng = bins[bins.length - 1].x1; //Upper bound of the last bin
    const binsMaxLength = d3.max(bins, d => d.length); // Get the maximum length of the bins

    // Keep bin boundaries fixed so filters only change bar heights, not energy ranges.
    binGenerator
        .domain([minEng, maxEng])
        .thresholds(bins.slice(1).map(bin => bin.x0));

    // Define scales (from shared constants)
    xScale
    .domain([minEng, maxEng]) 
    .range([0, innerWidth]);

    yScale
    .domain([0, binsMaxLength])
    .range([innerHeight, 0])
    .nice(); // Use the nice() method to round the y-axis value

    // Step 6.4 Draw the bars of the histogram
    innerChart
        .selectAll("rect")
        .data(bins)
        .join("rect")
            .attr("x", d => xScale(d.x0)) // Set the x position based on the lower bound of the bin
            .attr("y", d => yScale(d.length)) // Set the y position based on the count of items in the bin
            .attr("width", d => xScale(d.x1) - xScale(d.x0)) // Set the width based on the bin range
            .attr("height", d => innerHeight - yScale(d.length)) // Set the height based on the count of items in the bin
            .attr("fill", barColor) // Set the fill color for the bars
            .attr("stroke", bodyBackgroundColor) // Set the stroke color for the bars
            .attr("stroke-width", 2);

    // Step 6.5 Add axes
    const bottomAxis = d3.axisBottom(xScale)

    // Add the x-axis to the bottom of the inner chart
    innerChart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`) // Move the x-axis to the bottom of the inner chart
        .call(bottomAxis); // Call the bottom axis generator

    // Add the x-axis label
    svg
        .append("text")
        .text("Labeled Energy Consumption (kWh/year)") // Set the label text
        .attr("text-anchor", "end") 
        .attr("x", width - 20) // Position the label in the center of the inner chart
        .attr("y", height - 5) // Position the label below the x-axis
        .attr("class", "axis-label"); // Set the colour of the label in visualisation.css

    // Step 6.6 Add left axis
    const leftAxis = d3.axisLeft(yScale);

    // Add the y-axis to the left of the chart relative to the inner chart
    innerChart
        .append("g")
        .attr("class", "y-axis")
        .call(leftAxis); // Call the left axis generator
    
        svg 
            .append("text")
            .text("Frequency") // Set the label text
            .attr("x", 30) 
            .attr("y", 20) 
            .attr("class", "axis-label"); 
};