// geomap 
(function() {

    // clear both SVGs
    d3.select("#geomap1").selectAll("*").remove();
    d3.select("#geomap2").selectAll("*").remove();

    // activity 1
    d3.json("./topo.json").then(function(data) {

        // convert topo
        const topo = topojson.feature(data, data.objects.states);

        // create a projection
        var projection1 = d3.geoAlbersUsa()
            .scale(700)
            .translate([487.5, 305]);

        // pathing
        var path1 = d3.geoPath().projection(projection1);

        const svg1 = d3.select("#geomap1")
            .append("g")
            .attr("transform", "translate(50,50)");

        // draw basic states
        svg1.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            .attr("d", path1)
            .attr("fill", "whitesmoke")
            .attr("stroke", "black")
            .attr("stroke-width", "1px");
    });

    // activity 2
    // load all datasets at once
    Promise.all([
        d3.json("./topo.json"),
        d3.csv("./cities.csv"),
        d3.csv("./states.csv")
    ]).then(function(data) {

        // assign each dataset to a variable
        const topology = data[0];
        const cities = data[1];
        const states = data[2];

        // convert topo
        const topo = topojson.feature(topology, topology.objects.states);

        // state dictionary
        const stateDictionary = new Map();
        states.forEach(function(state) {
            stateDictionary.set(state.State.trim(), +state.Population);
        });

        // color scale
        var blues = d3.scaleSequential()
            .domain(d3.extent(states, function(d) { return +d.Population; }))
            .interpolator(d3.interpolateBlues);

        // projection
        var projection2 = d3.geoAlbersUsa()
            .scale(700)
            .translate([487.5, 305]);

        // pathing
        var path2 = d3.geoPath().projection(projection2);

        const svg2 = d3.select("#geomap2")
            .append("g")
            .attr("transform", "translate(50,50)");

        // draw states and assign them colors based on population
        svg2.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            .attr("d", path2)
            .attr("fill", function(d) {
                const population = stateDictionary.get(d.properties.name);
                return population ? blues(population) : "lightgray";
            })
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        // circles for state capitals
        svg2.append("g")
            .selectAll("circle")
            .data(cities)
            .join("circle")
            .attr("cx", function(d) {
                const coords = projection2([+d.longitude, +d.latitude]);
                return coords ? coords[0] : null;
            })
            .attr("cy", function(d) {
                const coords = projection2([+d.longitude, +d.latitude]);
                return coords ? coords[1] : null;
            })
            .attr("r", 6)
            .attr("fill", "indianred")
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

    });

})();