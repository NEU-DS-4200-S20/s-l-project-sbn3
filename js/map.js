function mapVis() {

  //Immediately Invoked Function Expression to limit access to our
  // variables and prevent

  var width = 700, height = 700;

  var selectableElements = d3.select(null);
  var ourbrush = null;
  var dispatcher;

  function map(selector, data) {
    var svg = d3.select("#vis-svg")
    .attr("width", width)
    .attr("height", height);

    var projection = d3
    .geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(width);

    var path = d3.geoPath().projection(projection);

    d3.json("us.json", function(us) {
        drawMap(us, data);
    });


    function drawMap(us, data) {

      svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "states");

      svg.append("g")
      .append("path")
      .datum(
        topojson.mesh(us, us.objects.states, function(a, b) {
          return a !== b;
        })
      )
      .attr("id", "state-borders")
      .attr("d", path);

      var points = svg.append("g")
      .selectAll(".mapPoint")
      .data(data);

      points.exit().remove();

      points = points.enter().
      append("circle")
      .attr("class", "point mapPoint")
      .attr("cx", function(d) {
        if (projection([d.long, d.lat]) != null) {
          return projection([d.long, d.lat])[0];
        } else {
          return;
        }
      })
      .attr("cy", function(d) {
        if (projection([d.long, d.lat]) != null) {
          return projection([d.long, d.lat])[1];
        } else {
          return;
        }
      });

      selectableElements = points;

      svg.call(brush);
    }

    function brush(g) {
      const brush = d3.brush() // Create a 2D interactive brush
      .on("start brush", highlight) // When the brush starts/continues do...
      .on("end", brushend);

      ourbrush = brush;

      g.call(brush);


      function highlight() {
        if (d3.event.selection === null) return;

        const [[x0, y0], [x1, y1]] = d3.event.selection;

        circles = d3.selectAll("circle");

        circles.classed("selected", d =>
        projection([d.long, d.lat]) != null &&
        x0 <= projection([d.long, d.lat])[0] &&
        projection([d.long, d.lat])[0] <= x1 &&
        y0 <= projection([d.long, d.lat])[1] &&
        projection([d.long, d.lat])[1] <= y1
      );

      // Get the name of our dispatcher's event
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

      // Let other charts know about our selection
      dispatcher.call(dispatchString, this, svg.selectAll(".selected").data());
      //console.log("map sent");
      //console.log(svg.selectAll(".selected").data());
    }

    function brushend() {
      if(d3.event.sourceEvent.type!="end"){
        d3.select(this).call(brush.move, null);
      }
    }
  }
  return map;
}

// Gets or sets the dispatcher we use for selection events
map.selectionDispatcher = function (_) {
  if (!arguments.length) return dispatcher;
  dispatcher = _;
  return map;
};

// Given selected data from another visualization
// select the relevant elements here (linking)
map.updateSelection = function (selectedData) {
  if (!arguments.length) return;

  // Select an element if its datum was selected
  selectableElements.classed("selected", d => {
    return selectedData.includes(d)
  });

};

return map;
}
