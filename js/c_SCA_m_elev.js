import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


// Función async para cargar los datos
async function loadData(watershed_selected) {
    const csvData = await d3.csv(watershed_selected);
    const data = csvData.map(d => ({
      group: d.group,
      variable: d.variable,
      value: +d.value
    }));
    return data;
  }

// Función para dibujar el gráfico 
export async function c_SCA_m_elev(watershed) {
    // set the dimensions and margins of the graph

    const margin = { top: 80, right: 80, bottom: 60, left: 100 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    const svg = d3.select("#p13")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Text to create .csv file
    const text_ini = "csv//month//SCA_m_elev_BNA_";
    const text_end =  ".csv";

    // .csv file
    const watershed_selected = text_ini.concat(watershed).concat(text_end);

    // Read the data
    const data = await loadData(watershed_selected);

    // Labels
    const myGroups = Array.from(new Set(data.map(d => d.group)));
    const myVars = Array.from(new Set(data.map(d => d.variable)));

    // Build X scales and axis:
    const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 15)
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(3));
     

    // Build Y scales and axis:
    const y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myVars)
        .padding(0.05);

        const yAxis = d3.axisLeft(y)
        .tickValues(y.domain().filter(function(d,i){ return !(i%5)}));
      
      const gX = svg.append("g").call(yAxis);
  



//    svg.append("g")
//        .style("font-size", 7)
//        .call(d3.axisLeft(y).tickSize(3))
//        .select(".domain").remove();

    // Build color scale
    const myColor = d3.scaleLinear()
        .domain([1,50])
        .range(["#ffffd9", "#081d58"]);
    
    const colorScaleThreshold = d3
        .scaleThreshold()
        .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
        .range(["#FFFFE6", "#FFFFB4", "#FFEBBE", "#FFD37F", "#FFAA00", "#E69800", "#70A800", "#00A884", "#0084A8", "#004C99"])
      
    // create a tooltip
    const tooltip = d3.select("#Place1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px") 
        
        
    // Three 
    const mouseover = function(event, d) {
        tooltip.style("opacity", 1);
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
    };
    const mousemove = function(event, d) {
        tooltip
            .html(`The exact value of<br>this cell is: ${d.value}`)
            .style("left", `${d3.pointer(event)[0]+70}px`)
            .style("top", `${d3.pointer(event)[1]}px`);
    };
    const mouseleave = function(event, d) {
        tooltip.style("opacity", 0);
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8);
    };

    // Add the squares
    svg.selectAll()
        .data(data, d => `${d.group}:${d.variable}`)
        .enter()
        .append("rect")
            .attr("x", d => x(d.group))
            .attr("y", d => y(d.variable))
            //.attr("rx", 4)
            //.attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill",  function (d) {return colorScaleThreshold(d.value); })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    // Add title to graph SCA promedio por mes (2000-2022) por elevacion
        // Etiqueta title
        svg.append("text")
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .attr("font-size", "20px")
        .attr("x", 30)
        .attr("y", -25)
        .text("Cobertura de nieve por elevación");

                // Etiqueta SUb titulo
        svg.append("text")
        .attr("text-anchor", "center")
        .attr("font-family", "Arial")
        .attr("font-size", "16px")
        .style("fill", "grey")
        .attr("x", width / 2  - 40)
        .attr("y", -10)
        .text("Cuenca: "+ watershed);

        // Etiqueta del eje X
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("x", width / 2 + 15)
        .attr("y", height + 40)
        .text("Meses");

        // Etiqueta del eje Y
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "Arial")
        .attr("font-size", "13")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -80)
        .text("Elevación (msnm)");


  // Legend
  
  let legX = 340
  let legY = 30

  svg.append("text")
  .attr("x", legX)
  .attr("y", legY-15)
  .text("PN (%)")
  .style("font-size", "12px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#004C99")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+15)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#0084A8")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+30)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#00A884")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+45)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#70A800")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+60)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#E69800")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+75)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#FFAA00")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+90)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#FFD37F")
  
  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+105)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#FFEBBE")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+120)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#FFFFB4")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+135)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "#FFFFE6")

  svg.append("rect")
  .attr("x", legX)
  .attr("y", legY+135+45)
  .attr('height', 15)
  .attr('width', 15)
  .style("fill", "black")




  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7)
  .text("90 - 100")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15)
  .text("80 - 90")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15)
  .text("70 - 80")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15)
  .text("60 - 70")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15)
  .text("50 - 60")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15)
  .text("40 - 50")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15)
  .text("30 - 40")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15+15)
  .text("20 - 30")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15+15+15)
  .text("10 - 20")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15+15+15+15)
  .text("0 - 10")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX)
  .attr("y", legY+7+15+15+15+15+15+15+15+15+15+30)
  .text("Nubes (%)")
  .style("font-size", "12px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")

  svg.append("text")
  .attr("x", legX+20)
  .attr("y", legY+7+15+15+15+15+15+15+15+15+15+30+15)
  .text(">30")
  .style("font-size", "10px")
  .attr("font-family", "Arial")
  .attr("alignment-baseline", "middle")




























}

