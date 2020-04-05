//Immediately Invoked Function Expression to limit access to our
// variables and prevent
var width = 960;
var height = 500;

var svg = d3
  .select("#vis-svg")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height / 2])
  .scale(width);

var path = d3.geoPath().projection(projection);

d3.json("us.json", function(us) {
  d3.csv("data/SBN3DataMap.csv", function(data) {
    drawMap(us, data);
     });
});

function drawMap(us, data) {

  var mapGroup = svg.append("g").attr("class", "mapGroup");

  mapGroup
    .append("g")
    // .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "states");

    mapGroup
    .append("path")
    .datum(
      topojson.mesh(us, us.objects.states, function(a, b) {
        return a !== b;
      })
    )
    .attr("id", "state-borders")
    .attr("d", path);

    var circles = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "adds")
    .attr("cx", function(d) {
      return projection([d.long, d.lat])[0];
    })
    .attr("cy", function(d) {
      return projection([d.long, d.lat])[1];
    })
    .attr("r", 3);

    svg.append("g");
}















// var svgStates = d3.select("svg #states"),
//     svgBoundary = d3.select("svg #boundary"),
//     states = {},
//     startYear = 1790,
//     currentYear = startYear;
//
// var width = window.innerWidth, // (1)
//   height = window.innerHeight;
// var projection = d3.geoAlbersUsa()
//   .translate([width / 2, height / 2]);  // (2)
//
// var path = d3.geoPath()
//     .projection(projection);  // (3)
//
// d3.json("data/usa.json", function(error, boundary) {
//  svgBoundary.selectAll("path")
//      .data(boundary.features)
//      .enter()
//    .append("path")
//      .attr("d", path)
// });
//
// d3.json("data/states.json", function(error, topologies) {  // (4)
//
//   var state = topojson.feature(topologies[0], topologies[0].objects.stdin);  // (5)
//
//   svgStates.selectAll("path")
//       .data(state.features)
//       .enter()
//     .append("path")
//       .attr("d", path)
//     .style("fill", function(d, i) {
//       console.log("d is ", d)
//       var name = d.properties.STATENAM.replace(" Territory", "");
//       return colors[name];
//     })
//     .append("svg:title")
//   .text(function(d) { return d.properties.STATENAM; });
//   });
//
//




















































//
