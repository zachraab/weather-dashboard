$(document).ready(function () {
  // VARIABLE DECLARATIONS

  var searchBtn = $("#search-btn");
  var searchInput = $("search-input");
  console.log(searchInput);
  var historyList = $("#history-list");

  var cityName = $("#city-name");
  var date = $("#date");
  var temp = $("#temp");
  var wind = $("#wind");
  var humid = $("#humid");
  var uv = $("#uv");

  var weatherForecast = {
    objName: "Denver ",
    objDate: "3/21/2021 ",
    objTemp: "68°F",
    objWind: "10 MPH",
    objHumid: "50%",
    objUv: "idk",
  };

  // FUNCTIONS

  function renderHistory() {
    // updates search history
    var newListItem = $("<li>");
    $(newListItem).text();
    newListItem.appendTo(historyList);
    // creates button elements with values of labels
    // when clicked, buttons take you to corresponding city
  }

  function renderCity(event) {
    console.log(weatherForecast.objTemp);
    event = searchInput;
    if (event === "denver") {
      $(cityName).text(weatherForecast.objName);
      $(date).text(weatherForecast.objDate);
      $(temp).text(weatherForecast.objTemp);
      $(wind).text(weatherForecast.objWind);
      $(humid).text(weatherForecast.objHumid);
      $(uv).text(weatherForecast.objUv);
    }
    // calls search history function
    renderHistory();
  }

  function renderForecast() {
    //  updates information on cards
    // updates icons depending on weather
  }

  // EVENT LISTENERS

  $(searchBtn).on("click", renderCity);
});
