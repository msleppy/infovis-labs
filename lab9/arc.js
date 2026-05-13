// set dimensions
const arcWidth = 1600;
const arcHeight = 700;
const margin = 80;

// svg container
const svgArc = d3.select("#arcDiagram");

// clear any existing elements inside the SVG
svgArc.selectAll("*").remove();

// load the Love Actually dataset
d3.json("love-actually.json").then(function(data) {

  // extract nodes/characters and links/relationships
  const nodes = data.nodes;
  const links = data.links;

  // create scale to spread nodes along the x-axis
  const xScale = d3.scalePoint()
    .domain(nodes.map(function(d) { return d.id; })) // map node ids
    .range([margin, arcWidth - margin]); // full width with margins

  const yBase = arcHeight - 150;-

  // create paths between nodes
  svgArc
    .selectAll(".arc")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("d", function(d) {

      // get x positions of source and target nodes
      const sourceX = xScale(d.source);
      const targetX = xScale(d.target);

      // get arc radius
      const radius = Math.abs(targetX - sourceX) / 2;

      // makes sure arc is drawn left to right
      const startX = Math.min(sourceX, targetX);
      const endX = Math.max(sourceX, targetX);

      // arc pathing
      return "M " + startX + " " + yBase +
             " A " + radius + " " + radius + " 0 0 1 " + endX + " " + yBase;
    })
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-width", 1.5)
    .style("opacity", 0.5);

  // draw nodes along the x-axis line
  svgArc
    .selectAll(".arc-node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "arc-node")
    .attr("cx", function(d) { return xScale(d.id); }) 
    .attr("cy", yBase) 
    .attr("r", 7)
    .attr("fill", function(d) {
    // color nodes based on character gender
      if (d.gender === "male") return "steelblue";
      if (d.gender === "female") return "hotpink";
      return "gray";
    });

  // labels for nodes/names
  svgArc
    .selectAll(".arc-label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "arc-label")
    .attr("x", function(d) { return xScale(d.id); })

    // fixed the vertical position to reduce name crowding
    .attr("y", function(d, i) {
      return i % 2 === 0 ? yBase + 30 : yBase + 50;
    })

    .attr("font-size", "8px")
    .attr("text-anchor", "end")

    // fix labels for readability and spacing issues
    .attr("transform", function(d, i) {
      const y = i % 2 === 0 ? yBase + 30 : yBase + 50;
      return "rotate(-45," + xScale(d.id) + "," + y + ")";
    })

    .text(function(d) { return d.name; });

});