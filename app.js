// save current state: selected visualization variable
var year = "2010";
var year_data = []
init();

var context = document.getElementById("radarChart").getContext("2d");
var radarChart = new Chart(context, {
  // The type of chart we want to create
  type: "radar",
  // The data for our dataset
  data: {
    labels: ["danceability", "energy", "liveness", "tempo"],
    datasets: [
      {
        label: year,
        pointHitRadius: 20,
        backgroundColor: "rgba(255, 77, 64,0.3)",
        borderColor: "rgb(255, 77, 64)",
        lineTension: 0.2,
        pointHoverRadius: 5,
        data: [0.90,0.11,0.22,0.53] //songAttributes[0], 
      }
    ],
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

function updateSlider(val){
  year = val;
  document.getElementById("yearVal").innerHTML = val;
  loadData();
  redraw();
}

function init() {
  loadData();
}

function redraw() {
  // update data
  console.log(year_data)
  radarChart.data.datasets[0].label = year;
  radarChart.data.datasets[0].data = [year_data.danceability, year_data.energy, year_data.liveness, year_data.tempo]
  radarChart.update();
}

function loadData() {
  d3.csv("data/data_by_year.csv", (data) => {
    console.log(data.length);
    for(let i=0; i < data.length; i++){
      if(parseInt(data[i].year) == parseInt(year)){
        console.log(data[i])
        year_data = data[i]
      }
    }
  });
}