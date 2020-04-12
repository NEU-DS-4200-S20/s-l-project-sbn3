function mapVis(w, h) {

  //Immediately Invoked Function Expression to limit access to our
  // variables and prevent
  var width = w;
  var height = h;

  var svg = d3
  .select("#vis-svg")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
  // .call(d3.zoom().on("zoom", function () {
  //   svg.attr("transform", d3.event.transform)
  // }));

  var projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height / 2])
  .scale(width);

  var path = d3.geoPath().projection(projection);

  // var zoom = d3.zoom()
  // .scaleExtent([1, 80])
  // .on("zoom", zoomed);
  // translate(-1296.4392968337975,-601.2308973885007) scale(4.972598675615854)

  var button = d3.select("#toggleBrush");
  var brushEnabled = false;

  function toggleBrush() {
    if (brushEnabled) {
      button.attr("value", "Disable Zooming");
      // svg.append("g").call(brush); << appears after clicking button twice
    } else {
      button.attr("value", "Zoom over Map");
    }
    brushEnabled = !brushEnabled;
  }

  d3.json("us.json", function(us) {
    d3.csv("data/SBN3DataMap.csv", function(data) {
      drawMap(us, data);

      /*let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);

      tableData.selectionDispatcher().on(dispatchString, function(selectedData){
        // TODO: fill in with map data, brushing */
    });
  });

  var mapGroup = svg.append("g").attr("class", "mapGroup");

  //svg.call(zoom);

  // var tableGroup = svg.append("g").attr("class", "tableGroup");

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

    svg.append("g").call(brush);
  }

  function highlight() {
    if (d3.event.selection === null) return;

    let [[x0, y0], [x1, y1]] = d3.event.selection;

    circles = d3.selectAll("circle");


      circles.classed(
        "selected",
        d =>
          projection([d.long, d.lat]) != null &&
          x0 <= projection([d.long, d.lat])[0] &&
          projection([d.long, d.lat])[0] <= x1 &&
          y0 <= projection([d.long, d.lat])[1] &&
          projection([d.long, d.lat])[1] <= y1
      );

    console.log(circles.classed());

  }

  function brushend() {
    console.log("end");
  }

  //mapGroup.attr("transform", "translate(-1296.4392968337975,-601.2308973885007) scale(4.972598675615854)");

  // function zoomed() {
  //   if (!brushEnabled){
  //     mapGroup.selectAll("path").style("stroke-width", 1.5 / d3.event.transform.k + "px");
  //     mapGroup.selectAll("circle").style("r", 4 / d3.event.transform.k);
  //     mapGroup.attr("transform", d3.event.transform); // updated for d3 v4
  //   }
  // }



}
