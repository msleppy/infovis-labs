// set dimensions
const width = 1200;
const height = 800;

const svg = d3.select("#graph1");

// clear
svg.selectAll("*").remove();

// test/troubleshooting
svg.append("rect")
  .attr("x", 20)
  .attr("y", 20)
  .attr("width", 250)
  .attr("height", 60)
  .attr("fill", "orange");

svg.append("text")
  .attr("x", 35)
  .attr("y", 58)
  .attr("font-size", "24px")
  .attr("fill", "black")
  .text("graph.js is running");

// load the Love Actually JSON file
d3.json("love-actually.json")
  .then(function(data) {
    console.log("Love Actually data loaded:", data);

    // remove troubleshooting
    svg.selectAll("*").remove();

    // create links/lines
    const links = svg
      .selectAll(".link1")
      .data(data.links)
      .enter()
      .append("line")
      .attr("class", "link1")
      .attr("stroke", "#888")
      .attr("stroke-width", 1.5)
      .style("opacity", 0.5);

    // create nodes/circles
    const nodes = svg
      .selectAll(".node1")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("class", "node1")
      .attr("r", 10)
      .attr("fill", function(d) {
        // color nodes based on gender
        if (d.gender === "male") return "steelblue";
        if (d.gender === "female") return "hotpink";
        return "gray";
      });

    // create text labels for each node/character name
    const labels = svg
      .selectAll(".label1")
      .data(data.nodes)
      .enter()
      .append("text")
      .attr("class", "label1")
      .attr("font-size", "10px")
      .attr("fill", "black")
      .text(function(d) {
        return d.name;
      });

    // force-directed layout/physics
    const simulation = d3.forceSimulation(data.nodes)
      
      // connects nodes based on relationships
      .force("link", d3.forceLink(data.links)
        .id(function(d) { return d.id; }) 
        .distance(90)) 

      // pushes nodes apart
      .force("charge", d3.forceManyBody().strength(-160))

      // keeps graph centered in SVG
      .force("center", d3.forceCenter(width / 2, height / 2))

      // prevents nodes from overlapping
      .force("collision", d3.forceCollide().radius(20))

      // update positions every simulation tick
      .on("tick", ticked);

    // runs repeatedly to update positions of elements
    function ticked() {

      // update link positions
      links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      // update node positions
      nodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

      // update label positions 
      labels
        .attr("x", function(d) { return d.x + 12; })
        .attr("y", function(d) { return d.y + 4; });
    }
  })
  .catch(function(error) {

    // error handling
    console.error("Error loading love-actually.json:", error);

    // display error message on screen if file does not load
    svg.append("text")
      .attr("x", 35)
      .attr("y", 110)
      .attr("font-size", "22px")
      .attr("fill", "red")
      .text("Could not load love-actually.json");
  });