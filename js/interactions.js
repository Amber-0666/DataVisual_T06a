// Build the screen-technology buttons and connect them to histogram filtering.
const populateFilters = (data) => {
    // Step 7.3 Set up buttons and event listeners
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? 'active' : ''}`)
        .text(d => d.label) // Set the button text to the filter label
        .on("click", (e, d) => {
            console.log("Clicked filter: ", e);
            console.log("Clicked filter data: ", d);

            if (!d.isActive) {
                // make sure button clicked is not already active
                filters_screen.forEach(filter => {
                    filter.isActive = d.id === filter.id ? true : false; // Set the clicked filter to active and others to inactive
                });

                // update the filter buttons based on which one was clicked
                d3.selectAll("#filters_screen .filter")
                    .classed("active", filter => filter.id === d.id ? true : false); // Set the clicked filter button to active and others to inactive

                updateHistogram(data);
            }
        });

    d3.select("#filters_screen_size")
        .selectAll(".filter")
        .data(filters_screen_size)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? 'active' : ''}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            if (!d.isActive) {
                filters_screen_size.forEach(filter => {
                    filter.isActive = filter.id === d.id;
                });

                d3.selectAll("#filters_screen_size .filter")
                    .classed("active", filter => filter.id === d.id);

                updateHistogram(data);
            }
        });
};

const updateHistogram = (data) => {
    // Step 7.4 Update the histogram
    const screenTech = filters_screen.find(filter => filter.isActive).id;
    const screenSize = filters_screen_size.find(filter => filter.isActive).id;
    const updatedData = data.filter(tv =>
        (screenTech === "all" || tv.screenTech === screenTech) &&
        (screenSize === "all" || tv.screenSize === screenSize)
    );

    const updatedBins = binGenerator(updatedData); // Generate the bins for the updated data
    const maxCount = d3.max(updatedBins, bin => bin.length) || 0;
    yScale.domain([0, maxCount || 1]).nice();

    d3.selectAll("#histogram rect")
        .data(updatedBins)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length)) // Update the y position based on the count of items in the bin
        .attr("height", d => innerHeight - yScale(d.length)); // Update the height based on the count of items in the bin

    d3.select("#histogram .y-axis")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale));
};

// T06-2 Step 3: Creating a tooltip and adding function call to load-data.js
const createTooltip = () => {
    // Step 3.2 Append (a hidden) tooltip to innerChart
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0); // Initially hidden

    // Step 3.3 Append tooltip background rectangle
    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", barColor) // Light background color
        .attr("fill-opacity", 0.75); // Black border

    // Step 3.4 Apped tooltip text
    tooltip
        .append("text")
        .text("NA")
        .attr("x", tooltipWidth / 2) // Center the text horizontally
        .attr("y", tooltipHeight / 2 + 2) // Center the text vertically
        .attr("text-anchor", "middle") // Center the text horizontally
        .attr("alignment-baseline", "middle") // Center the text vertically
        .attr("fill", "white") // White text color
        .style("font-weight", 900); 

};

// T06-2 Step 3.5 Add functions to react to mouse events
const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    // Step 3.6 Select all circles in scatter plot
    // Step 3.7 Attach event listeners to mouseenter and mouseleave events
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            console.log("Mouse entered circle: ", d);

            d3.select(".tooltip text")
                .text(d.screenSize);

            // Get the hovered circle's position
            const cx = e.target.getAttribute("cx");
            const cy = e.target.getAttribute("cy");

            // Centre the tooltip above the circle
            d3.select(".tooltip")
                .attr(
                    "transform",
                    `translate(${cx - 0.5 * tooltipWidth},
                               ${cy - 1.5 * tooltipHeight})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .style("opacity", 0)
                .attr("transform", "translate(0, 500)");
        });
};