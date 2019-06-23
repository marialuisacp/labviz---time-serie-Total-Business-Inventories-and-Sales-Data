const l_margin = { 
  top: 20, 
  right: 20, 
  bottom: 70, 
  left: 40, 
  horizontal: 80
};

const width_l = 1800 - margin.left - margin.right;
const height_l = 300 - margin.top - margin.bottom;
const parseDate_l = d3.time.format("%Y-%m-%d").parse;
 
const xl = d3.time.scale().range([0, width_l]);
const yl = d3.scale.linear().range([height_l, 0]);

const xAxisl = d3.svg.axis().scale(x)
  .orient("bottom")
  .innerTickSize(-height_l)
  .outerTickSize(50)
  .tickPadding(10)
  .tickFormat(d3.time.format("%Y-%m"));
const yAxisl = d3.svg.axis().scale(y)
  .orient("left").ticks(5);
 
const valueline = d3.svg.line()
  .x((d) => x(d.date))
  .y((d) => y(d.value));
    
let svgl = d3.select("#area-line-chart")
  .append("svg")
    .attr("width", width_l + l_margin.left + l_margin.right)
    .attr("height", height_l + l_margin.top + l_margin.bottom)
  .append("g")
    .attr("transform", "translate(" + l_margin.left + "," + l_margin.top + ")");

d3.csv("total-business-inventories-to-sales-ratio.csv", (error, data) => {
  data.forEach((d) => {
    d.date = parseDate_l(d.date);
    d.value = d.value;
  });
 
  x.domain(data.map((d) => d.date));
  y.domain([0, d3.max(data, (d) => d.value)]);

  let i = 0, j = 0;
  let x_axis = svgl.append("g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0," + height_l + ")")
                   .call(xAxisl);

  x_axis.selectAll("line")
    .attr("opacity",(d) => { j++; if( j % 15 === 0) return 0.2; return 0.05; });
  x_axis.selectAll("text")
    .attr("opacity",(d) => { i++; if( i % 15 === 0) return 1; return 0; })
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)" );

  svgl.append("g")   
    .attr("class", "y axis")
    .call(yAxisl);
 
  let linePath = svgl.append("path")
    .attr("class", "line")
    .attr("id", "line-chart-line")
    .attr("stroke-linecap","round")
    .attr("d", valueline(data));

  const totalLength = linePath.node().getTotalLength();
  d3.selectAll("#line-chart-line")
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(10000)
    .ease("quad")
    .attr("stroke-dashoffset", 0);
});