// import d3
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log("D3 loaded:", d3);


// activity 2

const svg = d3.select("#d3svg");
const circles = svg.selectAll("circle");

circles.style("fill", (d, i) => d3.schemeCategory10[i]);

circles.attr("r", (d, i) => 10 + i * 5);

circles
  .attr("cx", (d, i) => 50 + i * 100)
  .attr("cy", 100);


// activity 3

// load cars
d3.csv("cars.csv")
  .then((data) => {
    console.log("Cars CSV Data:", data);
  })
  .catch((error) => {
    console.error("Error loading CSV:", error);
  });

d3.json("https://raw.githubusercontent.com/npow/airline-codes/master/airlines.json")
  .then((data) => {
    console.log("Airlines Data:", data);
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });
