const margin = { 
  top: 20, 
  right: 20, 
  bottom: 70, 
  left: 40, 
  horizontal: 80
};

const width = 1800 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;
const	parseDate = d3.time.format("%Y-%m-%d").parse;

const x = d3.scale.ordinal().rangeRoundBands([0, width - margin.horizontal], .3);
const y = d3.scale.linear().range([height, 0]);

const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y-%m"));
const yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

let svg = d3.select("#area-visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("total-business-inventories-to-sales-ratio.csv", function(error, data) {

  data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
  });
	
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  let i = 0;
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .attr("opacity",(d) => { i++; if( i % 15 === 0) return 1; return 0; })
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill",(d) => { if (d.value > 1.4) return "#0EAC51"; return "#3EDC81"; })
      .attr("x",(d) => { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", (d, i) => {
        return height;
      })
      .attr("height", 0)
      .transition()
      .duration(50)
      .delay((d, i) => {
        return i * 50;
      })
      .attr("y",(d) => { return y(d.value); })
      .attr("height",(d) => { return height - y(d.value); });
  
  let lineHeight = 1;
  let yline = y(1.4) - (height + margin.bottom + margin.top) + lineHeight;
  let svgLine = d3.select("#area-line")
        .append("svg")
        .attr("width", width - margin.horizontal)
        .attr("height", lineHeight)
        .style("background", "#C5D3E2")
        .style("opacity", 1)
        .attr("id", "line")
        .attr("transform", "translate(0,"+ yline +")");
});