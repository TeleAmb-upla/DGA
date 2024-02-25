import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function tm_sp_area() {

  const margin = { top: 50, right: 30, bottom: 30, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#Place2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = [
    {Macrozona: "Norte",   Intermitente:  21655, Estacional:  2888, Permanente:   25},
    {Macrozona: "Centro",  Intermitente:   7670, Estacional: 11220, Permanente:   372},
    {Macrozona: "Sur",     Intermitente:  21822, Estacional:  4023, Permanente:   262},
    {Macrozona: "Austral", Intermitente: 119255, Estacional: 43143, Permanente: 20077}
  ];
  
   // const data = await d3.csv("csv/total/tc_SP_SCA.csv");

  var series = d3.stack()
    .keys(["Intermitente","Intermitente","Permanente"])
    .offset(d3.stackOffsetDiverging)
    (data);
  
  
  var myColor = d3.scaleOrdinal().domain(series)
    .range(["yellow","orange","blue"])
    
  var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.Macrozona; }))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);
  
  var y = d3.scaleLinear()
    .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
    .rangeRound([height - margin.bottom, margin.top]);
  
  var z = d3.scaleOrdinal(d3.schemeCategory10);
  
svg.append("g")
  .selectAll("g")
  .data(series)
  .enter().append("g")
  .attr("fill", function(d){return myColor(d)}) // function(d){return myColor(d)} 
  .selectAll("rect")
  .data(function(d) { return d; })
  .enter().append("rect")
  .attr("width", x.bandwidth)
  .attr("x", function(d) { return x(d.data.Macrozona); })
  .attr("y", function(d) { return y(d[1]); })
  .attr("height", function(d) { return y(d[0]) - y(d[1]); })
  
  svg.append("g")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x));
  
  svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y));
  
  // Add title to graph
  svg.append("text")
          .attr("x", 20)
          .attr("y", 25)
          .attr("text-anchor", "center")
          .style("font-size", "18px")
          .attr("font-family","Arial")
          .text("Superficie por persistencia nieve por macrozonas");
  
 
  // Legend

  let legX = 75
  let legY = 80

  svg.append("text")
  .attr("x", legX)
  .attr("y", legY-15)
  .text("Permanencia nieves (%)")
  .style("font-size", "12px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("rect")
      .attr("x", legX)
      .attr("y", legY)
      .attr('height', 15)
      .attr('width', 15)
      .style("fill", "blue")

  svg.append("rect")
      .attr("x", legX)
      .attr("y", legY+25)
      .attr('height', 15)
      .attr('width', 15)
      .style("fill", "orange")

  svg.append("rect")
      .attr("x", legX)
      .attr("y", legY+50)
      .attr('height', 15)
      .attr('width', 15)
      .style("fill", "yellow")

  svg.append("text")
      .attr("x", legX+25)
      .attr("y", legY+10)
      .text("Permanente (>90)")
      .style("font-size", "12px")
      .attr("font-family", "Arial")
      .attr("alignment-baseline", "middle")

  svg.append("text")
      .attr("x", legX+25)
      .attr("y", legY+35)
      .text("Estacional (60 - 90)")
      .style("font-size", "12px")
      .attr("font-family", "Arial")
      .attr("alignment-baseline", "middle")

  svg.append("text")
      .attr("x", legX+25)
      .attr("y", legY+60)
      .text("Intermitente (5 - 60)")
      .style("font-size", "12px")
      .attr("font-family", "Arial")
      .attr("alignment-baseline", "middle");
      
  // Etiqueta del eje X
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("font-family", "Arial")
      .attr("font-size", "13")
      .attr("x", 250)
      .attr("y", 380)
      .text("Macrozonas");

  // Etiqueta del eje Y
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("font-family", "Arial")
      .attr("font-size", "13")
      .attr("transform", "rotate(-90)")
      .attr("y", 8)
      .attr("x", -150)
      .text("Area (km2)");

  function stackMin(serie) {
    return d3.min(serie, function(d) { return d[0]; });
  }
  
  function stackMax(serie) {
    return d3.max(serie, function(d) { return d[1]; });
  }
}
