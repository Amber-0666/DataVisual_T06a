const drawScatterplot = (data) => {
    // T06-2 Step 2.2
    /// Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`); // Responsive SVG

    /// Create an inner chart group with margins
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`); // Move the inner chart to account for margins

    // T06-2 Step 2.3
    /// Set up x and y scales using data extents
    const xExtent = d3.extent(data, d => d.star);
    const yExtent = d3.extent(data, d => d.screenSize);

    xScaleS
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5]) // Add padding to the domain
        .range([0, innerWidth]);

    yScaleS
        .domain([yExtent[0] - 1, yExtent[1] + 1]) // Add padding to the domain
        .range([innerHeight, 0])    
        .nice();

    /// Map star ratings and screen sizes to positions within the chart area.

    // T06-2 Step 2.4
    /// (Corrected code) Set up colours for screen technologies
    const uniqueTechs = [...new Set(data.map(d => d.screenTech))];

    colorScale
        .domain(uniqueTechs)
        .range(d3.schemeCategory10);
    
    // T06-2 Step 2.5 Draw the circles
    innerChartS
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star)) // Set the x position based on star rating
        .attr("cy", d => yScaleS(d.screenSize)) // Set the y position based on screen size
        .attr("r", 4) // Set a fixed radius for the circles
        .attr("fill", d => colorScale(d.screenTech)) // Set the fill color based on screen technology
        .attr("opacity", 0.5);

    // T06-2 Step 2.6 Add bottom and left axis
    /// Add axes
    const bottomAxis = d3.axisBottom(xScaleS);
    innerChartS
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`) // Move the x-axis to the bottom of the inner chart
        .call(bottomAxis); // Call the bottom axis generator

    svg
        .append("text")
        .text("Star Rating")
        .attr("text-anchor", "end") 
        .attr("x", width - 20) // Center the label horizontally
        .attr("y", height - 5) // Position the label below the x-axis
        .attr("class", "axis-label"); // Add a class for styling

    const leftAxis = d3.axisLeft(yScaleS);
    innerChartS
        .append("g")
        .call(leftAxis); // Call the left axis generator

    svg
        .append("text")
        .text("Screen Size (inches)")
        .attr("x", 30) // Position the label to the left of the y-axis
        .attr("y", 20) // Position the label above the y-axis
        .attr("class", "axis-label"); // Add a class for styling
        
    // T06-2 Step 2.7 Add legend
    /// Add a legend on the right-hand side

    // Show each screen technology with its matching point colour.

};