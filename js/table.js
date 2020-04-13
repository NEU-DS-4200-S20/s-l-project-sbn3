/* global D3 */

function table() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data) {
    let table = d3.select("div.vis-holder")
    //.append("foreignObject")
    // .attr("width", 500)
    // .attr("height", 100)
      .append("table")
        .classed("my-table", true);

    // Here, we grab the labels of the first item in the dataset
    //  and store them as the headers of the table.
    let tableHeaders = Object.keys(data[0]);

    // You should append these headers to the <table> element as <th> objects inside
    // a <th>
    // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table

    // YOUR CODE HERE
    table.append("thead");

    for (header of tableHeaders) {
      table.select("thead").append("th").text(header);
    }

    let tr = table.selectAll("tr")
      .data(data)
      .enter().append("tr");

    let td = tr.selectAll("td")
      .data(function(d, i) { return Object.values(d); })
      .enter().append("td")
      .text(function(d) { return d; });

    table.classed("text-unselectable", true);

    isMouseDown = false;
    isOver = false;

    d3.selectAll("tr")
    .on("mouseover", (d, i, elements) => {
      isOver = true;
      d3.select(elements[i]).classed("mouseover", true);
      if (isMouseDown) {
        d3.select(elements[i]).classed("selected", true);
      }
      update();
    })
    .on("mouseout", (d, i, elements) => {
      isOver = false;
      d3.select(elements[i]).classed("mouseover", false);
      update();
    })
    .on("mousedown", (d, i, elements) => {
      d3.selectAll("tr").classed("selected", false);
      d3.select(elements[i]).classed("selected", true);
      isMouseDown = true;
      update();
    })
    .on("mouseup", (d, i, elements) => {
      isMouseDown = false;
      update();
    });

    d3.selectAll("html")
    .on("mousedown", () => {
      if (isOver === false) {
        d3.selectAll("tr").classed("selected", false);
      } else {
        isMouseDown = true;
      }
      update();
    })
    .on("mouseup", () => {
      isMouseDown = false;
      update();
    })

    function update() {
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
      dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
    }

    return chart;
  }

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    d3.selectAll('tr').classed("selected", d => {
      return selectedData.includes(d)
    });
  };

  return chart;
}
