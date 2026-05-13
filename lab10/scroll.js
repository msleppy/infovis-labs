// scroll 

// set SVG
const svg = d3.select("#graphic")
  .attr("width", 800)
  .attr("height", 300);

// grid layout 
const rows = 3;        
const columns = 10;      
const spacing = 72;     
const rectSize = 36;    
const startX = 20;       
const startY = 40;       

// colors for each state (eye color), (black = default state)
const blackColor = "#3f464d";  
const grayColor = "#c8c8c8";   
const brownColor = "#d0b07c";  
const blueColor = "#5a86b8";   
const greenColor = "#9fbc3d";  

// create array of 30 boxes (each represents a student)
let data = d3.range(30).map(() => 5);


// create boxes, bind data to them
let rects = svg.selectAll("rect")
  .data(data)
  .join("rect") 

  // x position (column)
  .attr("x", (d, i) => startX + (i % columns) * spacing)

  // y position (row)
  .attr("y", (d, i) => startY + Math.floor(i / columns) * spacing)

  // size of each box
  .attr("width", rectSize)
  .attr("height", rectSize)

  // rounded corners
  .attr("rx", 8)
  .attr("ry", 8)

  // initial color (black)
  .attr("fill", blackColor);

// wrapper to create the waypoint
function scroll(n, offset, func1, func2) {
  return new Waypoint({
    element: document.getElementById(n),

    handler: function(direction) {

      // scrolling down -> forward
      // scrolling up -> backward

      direction === "down" ? func1() : func2();
    },

    // Trigger when user reaches 75% of the div
    offset: offset
  });
}



// state 1: 30 black boxes
// set color, animation 
function grid() {
  rects
    .transition() 
    .delay((d, i) => 10 * i) 
    .duration(400) 
    .attr("fill", blackColor); 
}

// state 2: 17 brown boxes
function grid2() {
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(400)
    .attr("fill", (d, i) => i > 12 ? brownColor : grayColor);
}

// state 3: 12 blue boxes
function grid3() {
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(400)
    .attr("fill", (d, i) => (i > 0 && i <= 12) ? blueColor : grayColor);
}

// state 4: 1 green box
function grid4() {
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(400)
    .attr("fill", (d, i) => i === 0 ? greenColor : grayColor);
}

// start with all black boxes
grid();

// scrolls

// scroll: black -> brown
new scroll("div2", "75%", grid2, grid);   

// scroll: brown -> blue
new scroll("div3", "75%", grid3, grid2);  

// scroll: blue -> green
new scroll("div4", "75%", grid4, grid3);  