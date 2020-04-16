//mapVis(300, 300);

// Immediately Invoked Function Expression to limit access to our
// variables and prevent race conditions
((() => {

  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  d3.csv("data/SBN3DataMap.csv", (data) => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    // Create a table given the following:
    // a dispatcher (d3-dispatch) for selection events;
    // a div id selector to put our table in; and the data to use.
    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#vis-svg", data);

    // Create a line chart given x and y attributes, labels, offsets;
    // a dispatcher (d3-dispatch) for selection events;
    // a div id selector to put our svg in; and the data to use.
    let map = mapVis()
    .selectionDispatcher(d3.dispatch(dispatchString))
      ("#map", data);




    // When the line chart selection is updated via brushing,
    // tell the scatterplot to update it's selection (linking)
    map.selectionDispatcher().on(dispatchString, function(selectedData) {
      tableData.updateSelection(selectedData);
      // ADD CODE TO HAVE TABLE UPDATE ITS SELECTION AS WELL
    });

    // When the line chart selection is updated via brushing,
    // tell the scatterplot to update it's selection (linking)
    tableData.selectionDispatcher().on(dispatchString, function(selectedData) {
      map.updateSelection(selectedData);
      // ADD CODE TO HAVE TABLE UPDATE ITS SELECTION AS WELL
    });

  });

})());
