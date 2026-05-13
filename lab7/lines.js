// activity 1
var margin = { top: 50, right: 50, bottom: 60, left: 70 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// load csv
d3.csv("covid_cases_by_date.csv").then(function(data) {

    data.forEach(function(d) {
        d.date = new Date(d.collection_date);
        d.count = +d.count;
        d.test_result = d.test_result.trim().toLowerCase();
    });

    // clean data
    data = data.filter(function(d) {
        return d.date instanceof Date &&
               !isNaN(d.date.getTime()) &&
               !isNaN(d.count) &&
               (d.test_result === "positive" || d.test_result === "negative");
    });

    // make sure graph ends at 2022
    var endDate = new Date("2022-01-01");

    data = data.filter(function(d) {
        return d.date <= endDate;
    });

    // aggregate by day
    var rolled = d3.rollup(
        data,
        function(v) {
            return d3.sum(v, function(d) { return d.count; });
        },
        function(d) { return d.test_result; },
        function(d) { return d3.timeDay(d.date); }
    );

    // lines
    var covidLines = Array.from(rolled, function(entry) {
        var key = entry[0];
        var values = Array.from(entry[1], function(v) {
            return { date: v[0], count: v[1] };
        });

        values.sort(function(a, b) {
            return a.date - b.date;
        });

        return [key, values];
    });

    var allCovidPoints = covidLines.flatMap(function(group) {
        return group[1];
    });

    // x axis range
    var x = d3.scaleTime()
        .domain([
            d3.min(allCovidPoints, function(d) { return d.date; }),
            endDate
        ])
        .range([0, width]);

    // y axis range
    var y = d3.scaleLinear()
        .domain([0, d3.max(allCovidPoints, function(d) { return d.count; })])
        .range([height, 0]);

    var color = d3.scaleOrdinal()
        .domain(["negative", "positive"])
        .range(["crimson", "steelblue"]);

    var line = d3.line()
        .defined(function(d) {
            return d.date && !isNaN(d.count);
        })
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.count); });

    var svg1 = d3.select("#linegraph")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // draw the lines
    svg1.selectAll(".covid-line")
        .data(covidLines)
        .enter()
        .append("path")
        .attr("class", "covid-line")
        .attr("fill", "none")
        .attr("stroke", function(d) { return color(d[0]); })
        .attr("stroke-width", 1.5)
        .attr("d", function(d) { return line(d[1]); });

    // create the axes
    svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg1.append("g")
        .call(d3.axisLeft(y));

    // add the title
    svg1.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("COVID-19 Test Results in Philadelphia");

    // add labels for X axis
    svg1.append("text")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("text-anchor", "middle")
        .text("Date");

    // add label for Y axis
    svg1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Count");

    // legend for lines
    var legend = svg1.append("g")
        .attr("transform", "translate(" + (width - 120) + ",10)");

    ["negative", "positive"].forEach(function(key, i) {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", color(key));

        legend.append("text")
            .attr("x", 18)
            .attr("y", i * 20 + 10)
            .text(key);
    });

// catch error for troubleshooting
}).catch(function(error) {
    console.error("COVID LOAD ERROR:", error);
});