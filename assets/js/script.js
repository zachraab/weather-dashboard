$(document).ready(function () {
  // VARIABLE DECLARATIONS

  //    general variables
  var searchBtn = $("#search-btn");
  var historyList = $("#history-list");
  var cardParent = $("#card-parent");
  var forecastHeader = $("forecast-header");

  //    weather variables
  var cityName = $("#city-name");
  var cityIcon = $("#city-icon");
  var date = $("#date");
  var temp = $("#temp");
  var wind = $("#wind");
  var humid = $("#humid");
  var uv = $("#uv");

  //    api
  var base = `https://api.openweathermap.org/data/2.5/`;
  const apiKey = "24d3e77575ea6a3daa1e23b95dbe112f";

  var storedCity = JSON.parse(localStorage.getItem("Search History")) || [];

  // FUNCTIONS

  //1st api to grab lat and lon
  function callApi(city) {
    return `${base}weather?q=${city}&appid=${apiKey}`;
  }

  function searchLatLon(searchInput) {
    fetch(callApi(searchInput))
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        var lat = data.coord.lat;
        var lon = data.coord.lon;

        searchCity(lat, lon);

        $(cityName).text(data.name + " - ");
        var iconCode = data.weather[0].icon;
        var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
        $(cityIcon).attr("src", iconUrl);

        //button creation
        //    search input buttons

        // console.log($(historyList.each()));

        var newListBtn = $("<button>" + searchInput + "</button>");
        newListBtn.attr({
          class: "custom-btn",
          value: searchInput,
        });
        historyList.append(newListBtn);
      });
  }

  // dynamically create buttons
  function buttonCreation() {
    //button creation for search input

    // var newListBtn = $("<button>" + searchInput + "</button>");
    // newListBtn.attr({
    //   class: "custom-btn",
    //   value: searchInput,
    // });
    // historyList.append(newListBtn);

    //    on page load, create buttoons for locally stored cities
    for (var i = 0; i < storedCity.length; i++) {
      var storedListBtn = $("<button>" + storedCity[i] + "</button>");
      storedListBtn.attr({
        class: "custom-btn",
        value: storedCity[i],
      });
      historyList.append(storedListBtn);
    }
  }
  buttonCreation();

  //2nd api with majority of information being called
  function searchCity(lat, lon) {
    var oneCallApi = `${base}onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`;

    fetch(oneCallApi)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        // show forecast header
        forecastHeader.removeClass("hidden");

        // ways to delete old cards
        //    cardParent.text("");
        //    cardParent.children("div").remove();
        cardParent.empty();

        // convert timezone difference and format date
        var dateStringCurrent = new Date(
          (data.current.dt + data.timezone_offset) * 1000
        ).toDateString();
        var dateStringArr = dateStringCurrent.split(" ");
        function dateStringNew() {
          formatDate =
            dateStringArr[0] +
            ", " +
            dateStringArr[1] +
            " " +
            dateStringArr[2] +
            "/" +
            dateStringArr[3];
          return formatDate;
        }

        //Today's weather details
        $(date).text(dateStringNew);
        $(temp).text("Temperature: " + data.current.temp + "°F");
        $(wind).text("Wind Speed: " + data.current.wind_speed + " MPH");
        $(humid).text("Humidity: " + data.current.humidity + "%");
        $(uv).text("UV Index: " + data.current.uvi);

        // Forecast code below
        var forecastArr = [];
        for (var i = 0; i < 5; i++) {
          var forecast = data.daily[i + 1];
          forecastArr.push(forecast);

          var dateStringForecast = new Date(
            (forecastArr[i].dt + data.timezone_offset) * 1000
          ).toDateString();

          //.getDay method different way to get date's
          // console.log(dateStringForecast.getDay());

          var iconCode = forecastArr[i].weather[0].icon;
          var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

          var card = $("<div>");
          cardParent.append(card);
          card.attr("class", "card");

          var cardDate = $(
            "<p>" +
              "<strong>" +
              "Date: " +
              dateStringForecast +
              "</strong>" +
              "</p>"
          );
          var cardIcon = $("<img>");
          cardIcon.attr({
            src: iconUrl,
            id: "new-icon",
          });

          var cardTemp = $(
            "<p>" + "Temperature: " + forecastArr[i].temp.day + "°F" + "</p>"
          );
          var cardWind = $(
            "<p>" + "Wind Speed: " + forecastArr[i].wind_speed + " MPH" + "</p>"
          );
          var cardHumid = $(
            "<p>" + "Humidity: " + forecastArr[i].humidity + "%" + "</p>"
          );
          var cardUvi = $("<p>" + "UV Index: " + forecastArr[i].uvi + "</p>");

          card.append(
            cardDate,
            cardIcon,
            cardTemp,
            cardWind,
            cardHumid,
            cardUvi
          );
        }
      });
  }

  // grab's value of selected buttons in search history
  function buttonSearch(e) {
    var value = $(e.target).val();

    console.log(value);

    $(".custom-btn").click(function () {
      $("#history-list button:selected").each(function () {
        $("#select-from").append(
          "<button value='" +
            $(this).val() +
            "'>" +
            $(this).text() +
            "</button>"
        );
        $(this).remove();
      });
    });

    searchLatLon(value);
  }

  // grab value of form input and pushes it to local storage and main function
  function searchValue(e) {
    e.preventDefault();
    var searchInput = $("input[id='search-input']").val().trim();

    if (!searchInput) {
      alert("Please enter a valid City");

      return;
    }
    storedCity.push(searchInput);
    localStorage.setItem("Search History", JSON.stringify(storedCity));

    // check for duplicates?
    // filter duplicates out of list
    // make it a set
    // .filter method
    // if then statement with includes

    searchLatLon(searchInput);

    // clears input field
    var clearSearchInput = $("#search-input");
    clearSearchInput.val("");
  }

  // EVENT LISTENERS
  //    when main search button clicked, go to form input function
  //    $(searchBtn).on("click", searchValue);
  $("#formID").on("submit", function (e) {
    searchValue(e);
  });

  // when button in search history clicked, go to button search function
  $("#history-list").on("click", buttonSearch);
});
