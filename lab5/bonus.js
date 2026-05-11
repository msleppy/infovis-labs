// Bonus Activity
export function renderBonus(d3, data) {
    const svg = d3.select("#bonus");
    const width = 600;
    const height = 400;

    const margin = {top: 50, right: 50, bottom: 50, left: 70};
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let aggregated = d3.rollup(
        data,
        v => Math.round(d3.mean(v, d => +d.hwy)),
        d => +d.cyl
    );

    aggregated = Array.from(aggregated, ([cyl, value]) => ({ cyl, value }));
    aggregated.sort((a, b) => a.cyl - b.cyl);

    const x = d3.scaleBand()
        .domain(aggregated.map(d => d.cyl))
        .range([0, chartWidth])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 30])
        .range([chartHeight, 0]);

    const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 30]);

    const bars = chart.append("g")
        .selectAll("rect")
        .data(aggregated)
        .join("rect")
        .attr("x", d => x(d.cyl))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => chartHeight - y(d.value))
        .attr("fill", d => color(d.value))
        .style("opacity", 0.8);

    const tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("display", "none")
        .style("background", "#f9f9f9")
        .style("border", "1px solid #ccc")
        .style("padding", "0.5rem");

    bars.on("mouseover", (event, d) => {
        d3.select(event.currentTarget).style("stroke", "black");
        tooltip.style("display", "block")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
            .html(`<h1 class="tooltip-title">${d.cyl} Cylinders</h1>
                   <div>Average Highway MPG: ${d.value}</div>`);
    }).on("mouseleave", (event) => {
        tooltip.style("display", "none");
        d3.select(event.currentTarget).style("stroke", "none");
    });

    chart.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x).tickSize(0));

    const yAxis = chart.append("g")
        .call(d3.axisLeft(y).ticks(10).tickSize(-chartWidth))
        .call(g => g.select(".domain").remove());
    yAxis.selectAll("line").attr("stroke", "#ddd");

    chart.append("g")
        .selectAll("line")
        .data(aggregated)
        .join("line")
        .attr("x1", d => x(d.cyl) + x.bandwidth()/2)
        .attr("x2", d => x(d.cyl) + x.bandwidth()/2)
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1)
        .attr("shape-rendering", "crispEdges");

    chart.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 40)
        .attr("text-anchor", "middle")
        .text("Number of Cylinders");

    chart.append("text")
        .attr("x", -chartHeight / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Average Highway MPG");
}