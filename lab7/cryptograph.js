// activity 2: bitcoin info
// create margins
var margin = { top: 50, right: 50, bottom: 60, left: 70 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// load the json file
d3.json("coins.json").then(function(json) {

    var data = json.bitcoin;

    // parse 
    var parseBitcoinDate = d3.timeParse("%d/%m/%Y");

    data.forEach(function(d) {
        d.date = parseBitcoinDate(d.date);
        d.price_usd = +d.price_usd;
    });

    // clean the data
    data = data.filter(function(d) {
        return d.date instanceof Date &&
               !isNaN(d.date.getTime()) &&
               !isNaN(d.price_usd);
    });

    data.sort(function(a, b) {
        return a.date - b.date;
    });

    // x axis range
    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([0, width]);

    // y axis range
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.price_usd; })])
        .range([height, 0]);

    var line = d3.line()
        .defined(function(d) {
            return d.date && !isNaN(d.price_usd);
        })
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.price_usd); });

    var svg2 = d3.select("#cryptograph")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create the line
    svg2.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // create both axes
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg2.append("g")
        .call(d3.axisLeft(y));

    // add the title
    svg2.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Bitcoin Price (USD)");

    // add title for X axis
    svg2.append("text")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("text-anchor", "middle")
        .text("Date");

    // add title for Y axis
    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Price (USD)");

// catch error for troubleshooting
}).catch(function(error) {
    console.error("BTC LOAD ERROR:", error);
});