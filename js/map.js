function mapVis() {

  let width = 700, height = 700;

  let selectableElements = d3.select(null);
  let dispatcher;

  function map(selector, data) {

    let svg = d3.select("#vis-svg")
    .attr("width", width)
    .attr("height", height);

    let gr = svg.append("g");

    let projection = d3
    .geoAlbersUsa()
    .scale(width * 3)
    .translate([-width / 5, height * .6]);


    let path = d3.geoPath().projection(projection);


    d3.json("us.json", function(us) {
      drawMap(us, data);
    });

    function drawMap(us, data) {


      const zoom = d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 30])
      .on("zoom", zoomed);

      gr.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter()
      .append("path")
        .on("click", clicked)
        .attr("d", path)
      .attr("class", "states");

      gr.append("g")
      .append("path")
      .datum(
        topojson.mesh(us, us.objects.states, function(a, b) {
          return a !== b;
        })
      )
      .attr("id", "state-borders")
      .attr("d", path);

      let points = gr.append("g")
      .selectAll(".mapPoint")
      .data(data);

      points.exit().remove();

      points = points.enter()
      .append("circle")
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

      gr.call(brush);

      gr.call(zoom);

      function clicked(d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        d3.event.stopPropagation();
        gr.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.mouse(gr.node())
        );
      }

      function zoomed() {
        gr.attr("transform", d3.event.transform);
        gr.attr("stroke-width", 1 / d3.event.transform.k);
      }

    }

    function brush(g) {
      const brush = d3.brush() // Create a 2D interactive brush
      .on("start brush", highlight) // When the brush starts/continues do...
      .on("end", brushend); // When the brush ends do...

      ourbrush = brush;

      gr.call(brush);


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
