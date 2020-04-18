// Immediately Invoked Function Expression to limit access to our
// variables and prevent race conditions
((() => {

  // loading data from SBN's csv file
  d3.csv("data/SBN3DataMap.csv", (data) => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    // creates an interactive table
    let tableData = table()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ("div.vis-holder", data);

    // creates an interactive map
    let map = mapVis()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ("#map", data);

    // linking between table and map
    map.selectionDispatcher().on(dispatchString, function(selectedData) {
      tableData.updateSelection(selectedData);
    });

    // linking between table and map
    tableData.selectionDispatcher().on(dispatchString, function(selectedData) {
      map.updateSelection(selectedData);
    });

  });

})());
