import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

d3.csv("movie_metadata.csv").then((data) => {

    // filter to remove invalid data 
    const filteredData = data.filter(d => {

        if (!d.genres || d.genres.trim() === "") return false;
        if (!d.content_rating || d.content_rating.trim() === "") return false;

        return true;
    });

    console.log("Rows after filtering:", filteredData.length);

    // typecast data and only keep needed variables
    const mappedData = filteredData.map(d => ({
        title: d.movie_title,
        genre: d.genres,
        rating: d.content_rating
    }));

    console.log("Mapped data sample:", mappedData.slice(0, 5));

    // explore raw groupings
    const genreGroups = d3.group(mappedData, d => d.genre);

    console.log("Movies grouped by genre (raw arrays):");

    for (const [genre, movies] of genreGroups) {
        console.log(genre, movies.slice(0,3)); 
        break; 
    }

    // Split multiple genres and count movies by genre
    const allGenres = mappedData.flatMap(d =>
        d.genre.split("|")
    );

    // count movies by genre
    const genreCounts = d3.rollup(
        allGenres,
        v => v.length,
        d => d
    );

    // convert the returned map into an array
    const genreArray = Array.from(genreCounts, ([genre, count]) => ({
        genre,
        count
    }));

    console.table(genreArray);

    // create the pie chart
    const width = 600;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#vis")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    
    svg.selectAll("path")
        .data(pie(genreArray))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.genre))
        .attr("stroke", "white")
        .style("stroke-width", "1px");

});
