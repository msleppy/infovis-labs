// Activities 1 and 2: Scatterplot Visualization
console.log("Scatterplot JS Loaded");

export function renderScatterplot(d3, data) {
    const svg = d3.select("#scatterplot");
    const width = 600;
    const height = 400;

    const margin = { top: 40, right: 40, bottom: 50, left: 60 };
    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.hwy)])
        .range([0, chartWidth]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.cty)])
        .range([chartHeight, 0]);

    const points = chart.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(+d.hwy))
        .attr("cy", d => y(+d.cty))
        .attr("r", 8)
        .attr("fill", "steelblue");

    const tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("display", "none")
        .style("background", "#f9f9f9")
        .style("border", "1px solid #ccc")
        .style("padding", "0.5rem");

    points
        .on("mouseover", (event, d) => {
            d3.select(event.currentTarget)
                .style("stroke", "black");

            tooltip.style("display", "block")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")
                .html(`
                    <h1 class="tooltip-title">${d.manufacturer}</h1>
                    <div>Highway (HWY) MPG: ${d.hwy}</div>
                    <div>City (CTY) MPG: ${d.cty}</div>
                `);
        })
        .on("mouseleave", (event) => {
            tooltip.style("display", "none");
            d3.select(event.currentTarget).style("stroke", "none");
        });

    chart.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x).ticks(10).tickSize(-chartHeight))
        .call(g => g.select(".domain").remove());

    chart.append("g")
        .call(d3.axisLeft(y).ticks(10).tickSize(-chartWidth))
        .call(g => g.select(".domain").remove());

    chart.append("text")
        .attr("class", "axis-title")
        .attr("x", chartWidth - 40)
        .attr("y", chartHeight + 35)
        .text("HWY");

    chart.append("text")
        .attr("class", "axis-title")
        .attr("x", -40)
        .attr("y", -15)
        .attr("transform", "rotate(-90)")
        .text("CTY");
}
