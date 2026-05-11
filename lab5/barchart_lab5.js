// Activity 3: Bar Chart
console.log("Barchart JS Loaded");

export function renderBarchart(d3, data) {
    const svg = d3.select("#barchart");
    const width = 600;
    const height = 400;

    const margin = { top: 50, right: 50, bottom: 100, left: 70 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let aggregated = d3.rollup(
        data,
        v => Math.round(d3.mean(v, d => +d.cty)),
        d => d.manufacturer
    );
    aggregated = Array.from(aggregated, ([name, value]) => ({ name, value }));

    const distinctValues = [...new Set(aggregated.map(d => d.name))];

    const x = d3.scaleBand()
        .domain(distinctValues)
        .range([0, chartWidth])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(aggregated, d => d.value)])
        .range([chartHeight, 0]);

    const ordinal = d3.scaleOrdinal()
        .domain(distinctValues)
        .range(d3.schemeSet3);

    const bars = chart.append("g")
        .selectAll("rect")
        .data(aggregated)
        .join("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => chartHeight - y(d.value))
        .attr("fill", d => ordinal(d.name))
        .style("opacity", 0.75);

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
            .html(`<h1 class="tooltip-title">${d.name}</h1>
                   <div>Average City (CTY) MPG: ${d.value}</div>`);
    }).on("mouseleave", (event) => {
        tooltip.style("display", "none");
        d3.select(event.currentTarget).style("stroke", "none");
    });

    const yAxis = chart.append("g")
        .call(d3.axisLeft(y).ticks(10).tickSize(-chartWidth))
        .call(g => g.select(".domain").remove());

    yAxis.selectAll("line").attr("stroke", "#ddd");

    chart.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

    chart.append("g")
        .selectAll("line")
        .data(distinctValues)
        .join("line")
        .attr("x1", d => x(d) + x.bandwidth()/2)
        .attr("x2", d => x(d) + x.bandwidth()/2)
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1)
        .attr("shape-rendering", "crispEdges");

    chart.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 60)
        .attr("text-anchor", "middle")
        .text("Manufacturer");

    chart.append("text")
        .attr("x", -chartHeight / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Average City MPG");
}