var movie = []
var WinsNoms = []
var imdbRating = []
var Budget = []

var width = 800;
var height = 600;
var padding = 100;
var color = ["red", "blue"];

//Create SVG element
var svg1 = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var svg2 = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var svg3 = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var svg4 = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var svg5 = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv("./movies.csv", function(data) {
    data.forEach(function(d) {
        d.WinsNoms = +d.WinsNoms;
        d.imdbRating = +d.imdbRating;
        d.Budget = +d.Budget;
        d.IsGoodRating = +d.IsGoodRating;
        d.Runtime = +d.Runtime;
        d.Id = +d.Id;
        d.Year = +d.Year;
        d.imdbVotes = +d.imdbVotes;
        d.Gross = +d.Gross;
    });


    // Create Scales
    var xScale = d3.scale.linear()
        .range([padding, width - padding])
        .domain(d3.extent(data, function(d) {
            return d.imdbRating;
        })).nice();

    var yScale1 = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
            return d.WinsNoms;
        })).nice()
        .range([height - padding, padding]);

    var yScale2 = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
            return d.Budget;
        })).nice()
        .range([height - padding, padding]);

    var yScale3 = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
            return d.imdbVotes;
        })).nice()
        .range([height - padding, padding]);

    var yScale4 = d3.scale.sqrt()
        .domain(d3.extent(data, function(d) {
            return d.WinsNoms;
        })).nice()
        .range([height - padding, padding]);

    var yScale5 = d3.scale.log().clamp(true)
        .domain([0.1, d3.max(data, function(d) {
            return d.WinsNoms;
        })])
        .range([height - padding, padding]);

    var sizescale =  d3.scale.linear()
        .domain(d3.extent(data, function(d) {
            return d.WinsNoms;
        })).nice()
        .range([1,28]);


    // Add the x-axis.
    svg1.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(d3.svg.axis().scale(xScale).orient("bottom").ticks(10));

    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(d3.svg.axis().scale(xScale).orient("bottom").ticks(10));

    svg3.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(d3.svg.axis().scale(xScale).orient("bottom").ticks(10));

    svg4.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(d3.svg.axis().scale(xScale).orient("bottom").ticks(10));

    svg5.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(d3.svg.axis().scale(xScale).orient("bottom").ticks(10));


    // Add the y-axis.
    svg1.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.svg.axis().scale(yScale1).orient("left").ticks(10));

    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.svg.axis().scale(yScale2).orient("left").ticks(10).tickFormat(d3.format(".1e")));

    svg3.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.svg.axis().scale(yScale3).orient("left").ticks(10).tickFormat(d3.format(".1e")));

    svg4.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.svg.axis().scale(yScale4).orient("left").ticks(10));

    svg5.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.svg.axis().scale(yScale5).orient("left"));


    // Red circles for bad rating 
    svg1.selectAll("circle")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 0;
        }))
        .enter()
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) {
            return xScale(d.imdbRating);
        })
        .attr("cy", function(d) {
            return yScale1(d.WinsNoms);
        });

    svg2.selectAll("circle")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 0;
        }))
        .enter()
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) {
            return xScale(d.imdbRating);
        })
        .attr("cy", function(d) {
            return yScale2(d.Budget);
        });

    svg3.selectAll("circle")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 0;
        }))
        .enter()
        .append("circle")
        .attr("r", function(d){ return sizescale(d.WinsNoms);})
        .attr("cx", function(d) {
            return xScale(d.imdbRating);
        })
        .attr("cy", function(d) {
            return yScale3(d.imdbVotes);
        });

    svg4.selectAll("circle")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 0;
        }))
        .enter()
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) {
            return xScale(d.imdbRating);
        })
        .attr("cy", function(d) {
            return yScale4(d.WinsNoms);
        });

    svg5.selectAll("circle")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 0;
        }))
        .enter()
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) {
            return xScale(d.imdbRating);
        })
        .attr("cy", function(d) {
            return yScale5(d.WinsNoms);
        });

    // Blue cross for good rating
    svg1.selectAll(".cross")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 1;
        }))
        .enter()
        .append("path")
        .attr("class", "cross")
        .attr("d", d3.svg.symbol().type("cross").size(15))
        .attr("transform", function(d) {
            return "translate(" + xScale(d.imdbRating) + "," + yScale1(d.WinsNoms) + ")";
        });

    svg2.selectAll(".cross")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 1;
        }))
        .enter()
        .append("path")
        .attr("class", "cross")
        .attr("d", d3.svg.symbol().type("cross").size(15))
        .attr("transform", function(d) {
            return "translate(" + xScale(d.imdbRating) + "," + yScale2(d.Budget) + ")";
        });

    svg3.selectAll(".cross")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 1;
        }))
        .enter()
        .append("path")
        .attr("class", "cross")
        .attr("d", d3.svg.symbol().type("cross").size(function(d){ return (5*sizescale(d.WinsNoms));}))
        .attr("transform", function(d) {
            return "translate(" + xScale(d.imdbRating) + "," + yScale3(d.imdbVotes) + ")";
        });

    svg4.selectAll(".cross")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 1;
        }))
        .enter()
        .append("path")
        .attr("class", "cross")
        .attr("d", d3.svg.symbol().type("cross").size(15))
        .attr("transform", function(d) {
            return "translate(" + xScale(d.imdbRating) + "," + yScale4(d.WinsNoms) + ")";
        });

    svg5.selectAll(".cross")
        .data(data.filter(function(d) {
            return d.IsGoodRating == 1;
        }))
        .enter()
        .append("path")
        .attr("class", "cross")
        //.attr("class", function(d){return d.WinsNoms + " ; " +  yScale5(d.WinsNoms); })
        .attr("d", d3.svg.symbol().type("cross").size(15))
        .attr("transform", function(d) {
            return "translate(" + xScale(d.imdbRating) + "," + yScale5(d.WinsNoms) + ")";
        });

    // Adding legends
    var legend1 = svg1.selectAll(".legend")
        .data(color)
        .enter().append("g")
        .attr("class", "legend")

    var legend2 = svg2.selectAll(".legend")
        .data(color)
        .enter().append("g")
        .attr("class", "legend")

    var legend3 = svg3.selectAll(".legend")
        .data(color)
        .enter().append("g")
        .attr("class", "legend")

    var legend4 = svg4.selectAll(".legend")
        .data(color)
        .enter().append("g")
        .attr("class", "legend")

    var legend5 = svg5.selectAll(".legend")
        .data(color)
        .enter().append("g")
        .attr("class", "legend")

    // Legend for red circles
    legend1.filter(function(d) {
            return d == "red";
        })
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", width - 18)
        .attr("cy", 100);

    legend2.filter(function(d) {
            return d == "red";
        })
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", width - 18)
        .attr("cy", 100);

    legend3.filter(function(d) {
            return d == "red";
        })
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", width - 18)
        .attr("cy", 100);

    legend4.filter(function(d) {
            return d == "red";
        })
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", width - 18)
        .attr("cy", 100);

    legend5.filter(function(d) {
            return d == "red";
        })
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", width - 18)
        .attr("cy", 100);

    // Legend for blue crosses
    legend1.filter(function(d) {
            return d == "blue";
        })
        .append("path")
        .attr("class", "cross")
        .attr("d", d3.svg.symbol().type("cross").size(15))
        .attr("transform", function() {
            return "translate(" + (width - 18) + "," + 115 + ")";
        });

    legend2.filter(function(d) {
            return d == "blue";
        })
        .append("path")
        .attr("class", "cross")
        .attr("d", d3.svg.symbol().type("cross").size(15))
        .attr("transform", function() {
            return "translate(" + (width - 18) + "," + 115 + ")";
        });

    legend3.filter(function(d) {
            return d == "blue";
        })
        .append("path")
        .attr("class", "cross")
        .attr("d", d3.svg.symbol().type("cross").size(15))
        .attr("transform", function() {
            return "translate(" + (width - 18) + "," + 115 + ")";
        });

    legend4.filter(function(d) {
            return d == "blue";
        })
        .append("path")
        .attr("class", "cross")
        .attr("d", d3.svg.symbol().type("cross").size(15))
        .attr("transform", function() {
            return "translate(" + (width - 18) + "," + 115 + ")";
        });

    legend5.filter(function(d) {
            return d == "blue";
        })
        .append("path")
        .attr("class", "cross")
        .attr("d", d3.svg.symbol().type("cross").size(15))
        .attr("transform", function() {
            return "translate(" + (width - 18) + "," + 115 + ")";
        });

    // Add legend text
    legend1.append("text")
        .attr("x", width - 28)
        .attr("y", function(d) {
            if (d == "red") return 97;
            else if (d == "blue") return 113;
        })
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            if (d == "red") return "Bad Rating";
            else if (d == "blue") return "Good Rating";
        })

    legend2.append("text")
        .attr("x", width - 28)
        .attr("y", function(d) {
            if (d == "red") return 97;
            else if (d == "blue") return 113;
        })
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            if (d == "red") return "Bad Rating";
            else if (d == "blue") return "Good Rating";
        })

    legend3.append("text")
        .attr("x", width - 28)
        .attr("y", function(d) {
            if (d == "red") return 97;
            else if (d == "blue") return 113;
        })
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            if (d == "red") return "Bad Rating";
            else if (d == "blue") return "Good Rating";
        })

    legend4.append("text")
        .attr("x", width - 28)
        .attr("y", function(d) {
            if (d == "red") return 97;
            else if (d == "blue") return 113;
        })
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            if (d == "red") return "Bad Rating";
            else if (d == "blue") return "Good Rating";
        })

    legend5.append("text")
        .attr("x", width - 28)
        .attr("y", function(d) {
            if (d == "red") return 97;
            else if (d == "blue") return 113;
        })
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            if (d == "red") return "Bad Rating";
            else if (d == "blue") return "Good Rating";
        })

    // Add axis labels
    svg1.append("text")
        .attr("x", width - 200)
        .attr("y", height - padding/1.5)
        .text("IMDb Rating");
    svg2.append("text")
        .attr("x", width - 200)
        .attr("y", height - padding/1.5)
        .text("IMDb Rating");
    svg3.append("text")
        .attr("x", width - 200)
        .attr("y", height - padding/1.5)
        .text("IMDb Rating");
    svg4.append("text")
        .attr("x", width - 200)
        .attr("y", height - padding/1.5)
        .text("IMDb Rating");
    svg5.append("text")
        .attr("x", width - 200)
        .attr("y", height - padding/1.5)
        .text("IMDb Rating");

    svg1.append("text")
        .attr("transform", "translate(" + padding/2 + "," + padding*2 + ")rotate(-90)")
        .text("Wins+Noms");
    svg2.append("text")
        .attr("transform", "translate(" + padding/2 + "," + padding*2 + ")rotate(-90)")
        .text("Budget");
    svg3.append("text")
        .attr("transform", "translate(" + padding/2 + "," + padding*2 + ")rotate(-90)")
        .text("IMDb Votes");
    svg4.append("text")
        .attr("transform", "translate(" + padding/2 + "," + padding*2 + ")rotate(-90)")
        .text("Wins+Noms");
    svg5.append("text")
        .attr("transform", "translate(" + padding/2 + "," + padding*2 + ")rotate(-90)")
        .text("Wins+Noms");

    // Add plot heading
    svg1.append("text")
        .attr("x", 200)
        .attr("y", padding)
        .style("font-weight", "bold")
        .text("Wins+Nominations vs. IMDb Rating");
    svg2.append("text")
        .attr("x", 200)
        .attr("y", padding)
        .style("font-weight", "bold")
        .text("Budget vs. IMDb Rating");
    svg3.append("text")
        .attr("x", 200)
        .attr("y", padding)
        .style("font-weight", "bold")
        .text("Votes vs. IMDb Rating sized by Wins+Nominations");
    svg4.append("text")
        .attr("x", 200)
        .attr("y", padding)
        .style("font-weight", "bold")
        .text("Wins+Nominations (square-root-scaled) vs. IMDb Rating");
    svg5.append("text")
        .attr("x", 200)
        .attr("y", padding)
        .style("font-weight", "bold")
        .text("Wins+Nominations (log-scaled) vs. IMDb Rating");

});