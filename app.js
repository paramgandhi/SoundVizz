// save current state: selected visualization variable
var year = "2010";
var year_data = []

var genre = "basshall"
var genre_data = []

init();

// Radar Chart for Years
var context = document.getElementById("radarChart").getContext("2d");
var radarChart = new Chart(context, {
  // The type of chart we want to create
  type: "radar",
  // The data for our dataset
  data: {
    labels: ["danceability", "energy", "liveness", "tempo", "loudness", "acousticness", "speechiness"],
    datasets: [{
      label: year,
      pointHitRadius: 20,
      backgroundColor: "rgba(55, 71, 79, 0.3)",
      borderColor: "rgba(0, 137, 123, 64)",
      lineTension: 0.2,
      pointHoverRadius: 5,
      data: [0.57, 0.68, 0.2, 0.97, 0.98, 0.24, 0.07],
    }],
  },
  // Configuration options go here
  options: {
    scale: {
      angleLines: {
        display: false,
      },
      ticks: {
        suggestedMin: 0,
        suggestedMax: 1,
      },
    },
    tooltips: {
      enabled: true,
      callbacks: {
        title: function (tooltipItem, data) {
          return data["labels"][tooltipItem[0]["index"]];
        },
        label: function (tooltipItem, data) {
          return Math.round(data["datasets"][0]["data"][tooltipItem["index"]]);
        },
      },
    },
  },
});

// Radar Chart for Genres
var genreCtx = document.getElementById("radarGenre").getContext("2d");
var radarGenre = new Chart(genreCtx, {
  // The type of chart we want to create
  type: "radar",
  // The data for our dataset
  data: {
    labels: ["danceability", "energy", "liveness", "tempo", "loudness", "acousticness", "speechiness"],
    datasets: [{
      label: genre,
      pointHitRadius: 20,
      backgroundColor: "rgba(255, 77, 64,0.3)",
      borderColor: "rgb(255, 77, 64)",
      lineTension: 0.2,
      pointHoverRadius: 5,
      data: [0.82, 0.63, 0.08, 0.37, 0.66, 0.21, 0.63] //songAttributes[0], 
    }],
  },
  // Configuration options go here
  options: {
    scale: {
      angleLines: {
        display: false,
      },
      ticks: {
        suggestedMin: 0,
        suggestedMax: 1,
      },
    },
    tooltips: {
      enabled: true,
      callbacks: {
        title: function (tooltipItem, data) {
          return data["labels"][tooltipItem[0]["index"]];
        },
        label: function (tooltipItem, data) {
          return data["datasets"][0]["data"][tooltipItem["index"]];
        },
      },
    },
  },
});

// Radar Chart for Artists
function handleSlider(data) {
  year = data;
  document.getElementById("yearVal").innerHTML = data;
  console.log("handle" + data)
  loadYearData();
  redrawYear();
}

function handleMouseOver(d, i) {
  d3.select(this)
    .attr("fill", "red");
  genre = d.genre;
  loadGenreData();
  redrawGenre();
}

function init() {
  loadYearData();
  loadGenreData();
  drawBarChart();
}

function redrawYear() {
  // update data
  console.log(year_data)
  radarChart.data.datasets[0].label = year;
  radarChart.data.datasets[0].data = [year_data.danceability, year_data.energy, year_data.liveness, year_data.tempo, year_data.loudness, year_data.acousticness, year_data.speechiness]
  radarChart.update();
}

function redrawGenre() {
  radarGenre.data.datasets[0].label = genre;
  radarGenre.data.datasets[0].data = [genre_data.danceability, genre_data.energy, genre_data.liveness, genre_data.tempo, genre_data.loudness, genre_data.acousticness, genre_data.speechiness]
  radarGenre.update();
}

function loadYearData() {
  d3.csv("data/data_by_year.csv", (data) => {
    for (let i = 0; i < data.length; i++) {
      if (parseInt(data[i].year) == parseInt(year)) {
        console.log(data[i])
        year_data = data[i]
      }
    }
  });
}

function loadGenreData() {
  d3.csv("data/data_by_genre.csv", (data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].genre == genre) {
        console.log(data[i])
        genre_data = data[i]
      }
    }
  });
}

function drawBarChart() {
  var margin = {
      top: 20,
      right: 30,
      bottom: 40,
      left: 120
    },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  d3.csv("data/data_by_genre.csv", function (data) {
    // Add X axis
    var x = d3.scaleLinear().domain([0, 1]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    var y = d3
      .scaleBand()
      .range([0, height])
      .domain(
        data.map(function (d) {
          return d.genre;
        })
      )
      .padding(0.3);
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("font-weight", 700);
    //Bars
    svg
      .selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", function (d) {
        return y(d.genre);
      })
      .attr("width", function (d) {
        return x(d.popularity);
      })
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2")
      .on("mouseover", handleMouseOver)
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#69b3a2");
      });
  });
}

