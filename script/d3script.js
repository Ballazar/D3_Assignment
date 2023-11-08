// creating the variables
    const tooltip = d3.select("#tooltip");
    const w = 1000
    const h = 1100
// creating an svg to contain the map
    const svg = d3.select("body")
            .append("svg")
            .attr("height", h)
            .attr("width", w);
// choosing the projection, centering on the uk and adjusting the scale to fit the map onto svg
    const projection = d3.geoMercator()
            .center([0, 55.4]) 
            .rotate([4.4, 0])  
            .scale(4000)  
            .translate([w / 2, h / 2]);

    const pathGenerator = d3.geoPath().projection(projection)
// loading the JSON data and passing it through the path to create the map
    d3.json("https://github.com/Ballazar/D3_Assignment/blob/main/json/uk.json").then(data => 
        {
            svg.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", pathGenerator)
        }
    );
// creating a tooltip function to show the data when hovered over
function showTooltip(event, data) {
        tooltip
            .style("left", (event.pageX + 20) + "px")
            .style("top", (event.pageY - 50) + "px")
            .html(`<strong>${data.Town}</strong><br>County: ${data.County}<br>Population: ${data.Population}`)
            .style("display", "block");
    }
// creating a function to hide the tooltip when not hovered over
function hideTooltip() {
        tooltip.style("display", "none");
    }
// function to plot the data given in the JSON feed of towns
function plotTowns(data) {
// Define a scaling function for the circle size based on population.
        const populationScale = d3.scaleSqrt()
            .domain([0, d3.max(data, data => data.Population)])
            .range([0, 10]);
// creating an origin point for all the circles for the animation        
        const origin = projection([-4, 54]);
// Plot the towns as circles.
            svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", origin[0]) // Start from origin
            .attr("cy", origin[1])
            .attr("r", data => populationScale(data.Population))
            .attr("fill", "red")
            .attr("opacity", 0.5)
            .on("mouseover", (event, data) => showTooltip(event, data))
            .on("mouseout", () => hideTooltip())
            .transition() // animation
            .attr("cx", data => projection([data.lng, data.lat])[0])
            .attr("cy", data => projection([data.lng, data.lat])[1]);
    }

// Load data function to load the data based on the imput in the textbox
function loadData(numberOfTowns) {
        const dataUrl = `http://34.38.72.236/Circles/Towns/${numberOfTowns}`;
            d3.json(dataUrl)
            .then(function(data) {
// Remove existing circles and plot new ones
            svg.selectAll("circle").remove()
            plotTowns(data);
    }
        )
            .catch(function(error) {
            console.error("Error loading JSON data:", error);
    }
        );
    }

// Button click event
        document.getElementById("reloadData").addEventListener("click", function() {
        const numberOfTowns = +document.getElementById("townsNumber").value;
        loadData(numberOfTowns);
}
    );
    // live update slider value
    function updateSliderValue(value) {
        document.getElementById("sliderValue").textContent = value;
      }
      // JavaScript functions to increment and decrement the slider value
    function incrementValue() {
        const slider = document.getElementById("townsNumber");
        var newValue = parseInt(slider.value) + 1;
        if (newValue <= 500) {
          slider.value = newValue;
          updateSliderValue(newValue);
        }
      }
  
      function decrementValue() {
        const slider = document.getElementById("townsNumber");
        const newValue = parseInt(slider.value) - 1;
        if (newValue >= 1) {
          slider.value = newValue;
          updateSliderValue(newValue);
        }
      }
// Initial load
loadData(50);