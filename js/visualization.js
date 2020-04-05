//Immediately Invoked Function Expression to limit access to our
// variables and prevent
var width = 960;
var height = 500;

var svg = d3
.select("#vis-svg")
.append("svg")
.attr("width", width)
.attr("height", height)
.call(d3.zoom().on("zoom", function () {
  svg.attr("transform", d3.event.transform)
}));

var projection = d3
.geoAlbersUsa()
.translate([width / 2, height / 2])
.scale(width);

var path = d3.geoPath().projection(projection);

var zoom = d3.zoom()
.scaleExtent([1, 80])
.on("zoom", zoomed);

var button = d3.select("#toggleBrush");
var brushEnabled = false;

function toggleBrush() {
  if (brushEnabled) {
    button.attr("value", "Enable Brushing");
  } else {
    button.attr("value", "Disable Brushing");
  }
  brushEnabled = !brushEnabled;
}

d3.json("us.json", function(us) {
  d3.csv("data/SBN3DataMap.csv", function(data) {
    drawMap(us, data);
  });
});

var mapGroup = svg.append("g").attr("class", "mapGroup");
svg.call(zoom);

var brush = d3
.brush()
.on("start brush", highlight)
.on("end", brushend);

function drawMap(us, data) {

  mapGroup
  //.append("g")
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

  var circles = mapGroup
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
  });


}

function highlight() {
  if (d3.event.selection === null) return;

  let [[x0, y0], [x1, y1]] = d3.event.selection;

  circles = d3.selectAll("circle");

  circles.classed(
    "selected",
    d =>
    x0 <= projection([d.long, d.lat])[0] &&
    projection([d.long, d.lat])[0] <= x1 &&
    y0 <= projection([d.long, d.lat])[1] &&
    projection([d.long, d.lat])[1] <= y1
  );
}

function brushend() {
  console.log("end");
}

function zoomed() {
  if (!brushEnabled){
    mapGroup.selectAll("path").style("stroke-width", 1.5 / d3.event.transform.k + "px");
    mapGroup.selectAll("circle").style("r", 4 / d3.event.transform.k);
    mapGroup.attr("transform", d3.event.transform); // updated for d3 v4
  }
}
