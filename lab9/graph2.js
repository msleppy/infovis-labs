// set dimensions
const width2 = 1200;
const height2 = 800;

// select svg
const svg2 = d3.select("#graph2");

// clear
svg2.selectAll("*").remove();


// load Scream JSON data
d3.json("scream.json").then(function(data) {

  // create lines
  const links2 = svg2
    .selectAll(".link2")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "link2")
    .attr("stroke", "#999")
    .attr("stroke-width", 1.2)
    .style("opacity", 0.35);

  // create circles
  const nodes2 = svg2
    .selectAll(".node2")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("class", "node2")
    .attr("r", 11)
    .attr("fill", function(d) {
      // color nodes based on character role/group
      if (d.group === "killer") return "#d62728";
      if (d.group === "main") return "#1f77b4";
      if (d.group === "friend") return "#ff7f0e";
      if (d.group === "law") return "#2ca02c";
      if (d.group === "media") return "#9467bd";
      if (d.group === "victim") return "#8c564b";
      if (d.group === "family") return "#17becf";
      if (d.group === "suspect") return "#e377c2";
      if (d.group === "school") return "#7f7f7f";
      return "#69b3a2";
    });

  // add labels for each node/character names
  const labels2 = svg2
    .selectAll(".label2")
    .data(data.nodes)
    .enter()
    .append("text")
    .attr("class", "label2")
    .attr("font-size", "11px")
    .attr("fill", "black")

    // add  outline to improve readability 
    .attr("stroke", "white")
    .attr("stroke-width", 0.6)
    .attr("paint-order", "stroke")

    .text(function(d) {
      return d.name;
    });

  // create force-directed layout for the network
  const simulation2 = d3.forceSimulation(data.nodes)

    // connects nodes based on relationships
    .force("link", d3.forceLink(data.links)
      .id(function(d) { return d.id; }) 
      .distance(120)) 

    // pushes nodes apart
    .force("charge", d3.forceManyBody().strength(-260))

    // keeps graph centered
    .force("center", d3.forceCenter(width2 / 2, height2 / 2))

    // prevents nodes from overlapping
    .force("collision", d3.forceCollide().radius(32))

    // update positions on each tick
    .on("tick", ticked2);

  // runs to update positions of nodes, links, and labels
  function ticked2() {

    // update link positions
    links2
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    // update node positions
    nodes2
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

    // label positioning
    labels2
      .attr("x", function(d) { return d.x + 16; })
      .attr("y", function(d) { return d.y - 14; });
  }
});