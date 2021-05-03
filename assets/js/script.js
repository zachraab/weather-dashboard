$(document).ready(function () {
  // VARIABLE DECLARATIONS

  var searchBtn = $("#search-btn");
  var historyList = $("#history-list");
  var cardParent = $("#card-parent");
  var forecastHeader = $("forecast-header");

  var cityName = $("#city-name");
  var cityIcon = $("#city-icon");
  var date = $("#date");
  var temp = $("#temp");
  var wind = $("#wind");
  var humid = $("#humid");
  var uv = $("#uv");

  var base = `https://api.openweathermap.org/data/2.5/`;
  const apiKey = "24d3e77575ea6a3daa1e23b95dbe112f";

  var storedCity = JSON.parse(localStorage.getItem("Search History")) || [];

  // FUNCTIONS

  // grab lat lon
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

        // var newListBtn = $("<button>" + searchInput + "</button>");
        // newListBtn.attr({
        //   class: "custom-btn",
        //   value: searchInput,
        // });
        // var newListItem = $("<li>");
        // historyList.append(newListItem);
        // newListItem.append(newListBtn);
      });
  }

  function buttonCreation(searchInput) {
    console.log("button creation function");

    // var newListItem = $("<li>");
    //button creation
    if (searchInput) {
      console.log("searched city if statement");
      var newListBtn = $("<button>" + searchInput + "</button>");
      newListBtn.attr({
        class: "custom-btn",
        value: searchInput,
      });
      historyList.append(newListBtn);
      // newListItem.append(newListBtn);
    }

    for (var i = 0; i < storedCity.length; i++) {
      console.log("search history loop");
      var storedListBtn = $("<button>" + storedCity[i] + "</button>");
      storedListBtn.attr({
        class: "custom-btn",
        value: storedCity[i],
      });
      historyList.append(storedListBtn);
      // newListItem.append(storedListBtn);
    }
  }
  buttonCreation();

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

        //deletes old cards
        //  cardParent.text("");
        cardParent.children("div").remove();

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

        $(date).text(dateStringNew);
        $(temp).text("Temperature: " + data.current.temp + "°F");
        $(wind).text("Wind Speed: " + data.current.wind_speed + " MPH");
        $(humid).text("Humidity: " + data.current.humidity + "%");
        $(uv).text("UV Index: " + data.current.uvi);

        var forecastArr = [];
        for (var i = 0; i < 5; i++) {
          var forecast = data.daily[i + 1];
          forecastArr.push(forecast);

          var dateStringForecast = new Date(
            (forecastArr[i].dt + data.timezone_offset) * 1000
          ).toDateString();

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

  function buttonSearch(e) {
    var value = $(e.target).val();

    console.log(value);

    searchLatLon(value);
  }

  function searchValue(e) {
    e.preventDefault();
    var searchInput = $("input[id='search-input']").val().trim();
    if (!searchInput) {
      alert("Please enter a valid City");

      return;
    }
    storedCity.push(searchInput);
    localStorage.setItem("Search History", JSON.stringify(storedCity));

    // on enter key (13), submit search form
    // $("#search-input").on("keyup", function (event) {
    //   console.log(event.keycode());
    //   event.preventDefault();
    //   if (event.keycode === 13) {
    //     $(searchBtn).click();
    //   }
    // });
    searchLatLon(searchInput);
  }
  function renderHistory() {
    // if cityBtn already exists in list, dont render again
    // creates button elements with values of labels
    // when clicked, buttons take you to corresponding city
  }

  // calls search history function
  renderHistory();

  // EVENT LISTENERS

  $(searchBtn).on("click", searchValue);
  $("#history-list").on("click", buttonSearch);
});
