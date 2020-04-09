/*function table() {
  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data) {
    let table = d3
      .select(selector)
      .append("table")
      .classed("my-table", true);

    // Here, we grab the labels of the first item in the dataset
    //  and store them as the headers of the table.
    let tableHeaders = Object.keys(data[0]);

    table
      .append("thead")
      .append("tr")
      .selectAll("th")
      .data(tableHeaders)
      .enter()
      .append("th")
      .text(function(d) {
        return d;
      });


    table.on("mouseleave", function(d) {
      chart.updateSelection([]);

      //Dispatcher will ensure other charts are also unhighlighted
      dispatcher.call(
        dispatchString,
        this,
        table.selectAll(".selected").data()
      );
    });

    let rows = table
      .append("tbody")
      .selectAll("tr")
      .data(data)
      .enter()
      .append("tr")
      .on("mousedown", function(d) {
        d3.select(this).style("background-color", "pink");
      })
      .on("mouseover", function(d) {
        d3.select(this).classed("selected", true);
        // Get the name of our dispatcher's event

        // Let other charts know
        dispatcher.call(
          dispatchString,
          this,
          table.selectAll(".selected").data()
        );
      });

    rows
      .selectAll("td")
      .data(function(row) {
        return tableHeaders.map(function(column) {
          return { column: column, value: row[column] };
        });
      })
      .enter()
      .append("td")
      .text(function(d) {
        return d.value;
      });

    // Get the name of our dispatcher's event
    let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

    return chart;
  }

    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function(_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
    };
  
    // Given selected data from another visualization
    // select the relevant elements here (linking)
    chart.updateSelection = function(selectedData) {
      if (!arguments.length) return;
  
      // Select an element if its datum was selected
      d3.selectAll("tr").classed("selected", d => {
        return selectedData.includes(d);
      });
    };
  
    return chart;
} */