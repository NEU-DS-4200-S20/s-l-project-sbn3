/* global D3 */

function table() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  var ourBrush = null,
  selectableElements = d3.select(null),
  dispatcher;

  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data) {
    var table = d3.select(selector)
    .append("table")
    .style("border", "2px black solid")
    .classed("my-table", true);

    // https://gist.github.com/jfreels/6814721
    function tabulate(data,columns) {
      var thead = table.append('thead')
      var tbody = table.append('tbody')

      thead.append('tr')
      .selectAll('th')
      .data(columns)
      .enter()
      .append('th')
      .text(function (d) { return d })

      var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr')

      var cells = rows.selectAll('td')
      .data(function(row) {
        return columns.map(function (column) {
          return { column: column, value: row[column] }
        })
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value })

      return table;
    }

    table = tabulate(data, ["Name", "Product", "Address", "City", "State", "Zip", "Phone", "Website"]);

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
      //console.log(selectedData);
      //console.log(selectedData.includes(d));
      return selectedData.includes(d)
    });
  };

  return chart;
}
