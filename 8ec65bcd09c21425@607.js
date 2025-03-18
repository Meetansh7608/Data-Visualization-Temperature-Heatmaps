import define1 from "./f780586a85a07fa7@363.js";

function _1(md){return(
md`# Assignment 2 - Meetansh Gupta`
)}

function _d3(require){return(
require('d3@7')
)}

function _url(){return(
"https://raw.githubusercontent.com/xiameng552180/CSCE-679-Data-Visualization-Assignment2/refs/heads/main/temperature_daily.csv"
)}

function _temp_data(d3,url){return(
d3.csv(url, d => ({
    year: +d.date.slice(0, 4),
    month: +d.date.slice(5, 7),
    day: +d.date.slice(8, 10), 
    max_temp: +d.max_temperature,
    min_temp: +d.min_temperature}))
)}

function _6(temp_data,d3,DOM,width,legend)
{  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const yearsSet = new Set(temp_data.map(d => d.year))
  const years = Array.from(yearsSet)

  const min_max_temps = {}
  const raw_temps = new Set

  temp_data.forEach(d => {
    const key = `${d.year}-${d.month}`
    if (!min_max_temps[key]) min_max_temps[key] = [d.min_temp, d.max_temp]
    else{
      min_max_temps[key][0] = Math.min(min_max_temps[key][0], d.min_temp)
      min_max_temps[key][1] = Math.max(min_max_temps[key][1], d.max_temp)
    }
    raw_temps.add(d.min_temp)
    raw_temps.add(d.max_temp)  
  })
  // return d3.extent(Array.from(raw_temps))
  // console.log(min_max_temps);
  // html`<pre>Total Rects: ${Object.entries(min_max_temps).length}</pre>`
  const pageheight = 750
  const svg = d3.select(DOM.svg(width, pageheight))
  
  const height = 600  
  const margin = { left: 40, top: 0, right: 10, bottom: 30 }
  const graph = svg.append("g").attr("transform", `translate(0, ${pageheight-height})`);

  const xScale = d3.scaleBand()
    .domain(years)
    .range([margin.left, width-margin.right])
    .padding(0.1)

  graph.append('g')
    .call(d3.axisTop(xScale))
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .attr('transform', `translate(0, ${margin.top})`)

  const yScale = d3.scaleBand()
    .range([margin.top, height - margin.bottom])
    .domain(months)
    .padding(0.1)
  
  graph.append('g')
    .call(d3.axisLeft(yScale))
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .attr('transform', `translate(${margin.left},0)`)

  const lowest = d3.extent(raw_temps)[0]
  const highest = d3.extent(raw_temps)[1]
  
  const colorScale = d3.scaleSequential([highest, lowest], d3.interpolateSpectral)

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "4px")

  function mouseover(event, d) {
    tooltip.transition().duration(200).style("visibility", "visible")
    tooltip.html(
      `${months[parseInt(d[0].split('-')[1]) - 1]}, ${d[0].split('-')[0]}<br>
      Min Temp: ${d[1][0]}°C<br>
      Max Temp: ${d[1][1]}°C`
    )
  }

  function mouseout() {tooltip.transition().duration(100).style("visibility", "hidden")}

  function mousemove(event) {
    const tooltipWidth = tooltip.node().offsetWidth
    const tooltipHeight = tooltip.node().offsetHeight
    const padding = 10
    let tooltipX = event.pageX + padding
    let tooltipY = event.pageY + padding                
    
    if (tooltipX + tooltipWidth >= width)
      tooltipX = event.pageX - tooltipWidth
    if (tooltipY + tooltipHeight >= 1.5*height)
        tooltipY = event.pageY - tooltipHeight
      
    tooltip.style("top", tooltipY + "px").style("left", tooltipX + "px")
  }
  
  function updatechart(temp_type) {
    graph.selectAll("rect").remove()
    graph.selectAll("rect")
      .data(Object.entries(min_max_temps))
      .enter()
      .append("rect")
      .attr("x", d => xScale(parseInt(d[0].split('-')[0])))
      .attr("y", d => yScale(months[parseInt(d[0].split('-')[1])-1]))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d[1][temp_type]))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout)
  }  

  updatechart(1)
  
  const title = svg.append("text")
    .attr("transform", `translate(${width/2}, 40)`)
    .style("text-anchor", "middle")
    .style("font-size", "26px")
    .style("fill", "black")
    // .style("font-family", "sans-serif")
    .text("Monthly Maximum Temperatures in Hong Kong, 1997-2017");

  let temp_type = 1
  
  const button = svg.append("foreignObject")
    .attr("x", width/8)
    .attr("y", 60)
    .attr("width", 300)  // Set button width
    .attr("height", 50)  // Set button height
    .append("xhtml:button")  // Create a button inside the foreignObject
    .attr("id", "tempButton")
    .text("Show Minimum Temperatures")
    .style("padding", "10px 20px")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("background-color", "Navy")
    .style("color", "white")
    .style("border", "none")
    .style("cursor", "pointer")
    .style("border-radius", "5px")

  button.on("click", function() {
    temp_type = 1 - temp_type
    console.log(temp_type)
    button.text(temp_type === 1 ? "Show Minimum Temperatures" : "Show Maximum Temperatures")
    button.style("background-color", temp_type === 1 ? "Navy" : "Maroon")
    title.text(temp_type === 1 ? "Monthly Maximum Temperatures in Hong Kong, 1997-2017" : 
               "Monthly Minimum Temperatures in Hong Kong, 1997-2017")
    updatechart(temp_type)
  })

  const legendNode = legend(colorScale, "Temperature, °C")
  d3.select(legendNode).attr("transform", `translate(0,0)`)
  d3.select(legendNode).select(".caption").style("font-size", "14px").style("font-weight", "normal")
  
  const keylegend = svg.append("g")
    .attr("transform", `translate(${width/2}, 60)`)
    .append(() => {
      return legendNode
    })
  
  return svg.node()
}


function _7(temp_data,d3,DOM,width,legend)
{  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const yearsSet = new Set(temp_data.map(d => d.year))
  const years = Array.from(yearsSet).slice(-10)

  const min_max_temps = {}
  const raw_temps = new Set

  temp_data.forEach(d => {
    const key = `${d.year}-${d.month}`
    if (d.year < years[0]) return
    if (!min_max_temps[key]) min_max_temps[key] = [d.min_temp, d.max_temp]
    else{
      min_max_temps[key][0] = Math.min(min_max_temps[key][0], d.min_temp)
      min_max_temps[key][1] = Math.max(min_max_temps[key][1], d.max_temp)
    }
    raw_temps.add(d.min_temp)
    raw_temps.add(d.max_temp)  
  })
  // return d3.extent(Array.from(raw_temps))
  // console.log(min_max_temps);
  // html`<pre>Total Rects: ${Object.entries(min_max_temps).length}</pre>`
  const pageheight = 745
  const svg = d3.select(DOM.svg(width, pageheight))
  
  const height = 600  
  const margin = { left: 40, top: 0, right: 10, bottom: 30 }
  const graph = svg.append("g").attr("transform", `translate(0, ${pageheight-height})`);

  const xScale = d3.scaleBand()
    .domain(years)
    .range([margin.left, width-margin.right])
    .padding(0.1)

  graph.append('g')
    .call(d3.axisTop(xScale))
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .attr('transform', `translate(0, ${margin.top})`)

  const yScale = d3.scaleBand()
    .range([margin.top, height - margin.bottom])
    .domain(months)
    .padding(0.1)
  
  graph.append('g')
    .call(d3.axisLeft(yScale))
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .attr('transform', `translate(${margin.left},0)`)

  const lowest = d3.extent(raw_temps)[0]
  const highest = d3.extent(raw_temps)[1]
  
  const colorScale = d3.scaleSequential([highest, lowest], d3.interpolateSpectral)

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "4px")

  function mouseover(event, d) {
    tooltip.transition().duration(200).style("visibility", "visible")
    tooltip.html(
      `${months[parseInt(d[0].split('-')[1]) - 1]}, ${d[0].split('-')[0]}<br>
      Min Temp: ${d[1][0]}°C<br>
      Max Temp: ${d[1][1]}°C`
    )
  }

  function mouseout() {tooltip.transition().duration(100).style("visibility", "hidden")}

  function mousemove(event) {
    const tooltipWidth = tooltip.node().offsetWidth
    const tooltipHeight = tooltip.node().offsetHeight
    const padding = 10
    let tooltipX = event.pageX + padding
    let tooltipY = event.pageY + padding                
    
    if (tooltipX + tooltipWidth >= width)
      tooltipX = event.pageX - tooltipWidth
    if (tooltipY + tooltipHeight >= 1.5*height)
        tooltipY = event.pageY - tooltipHeight
      
    tooltip.style("top", tooltipY + "px").style("left", tooltipX + "px")
  }
  
  function updatechart(temp_type) {
    graph.selectAll("rect").remove()
    graph.selectAll("rect")
      .data(Object.entries(min_max_temps))
      .enter()
      .append("rect")
      .attr("x", d => xScale(parseInt(d[0].split('-')[0])))
      .attr("y", d => yScale(months[parseInt(d[0].split('-')[1])-1]))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d[1][temp_type]))
      .each(function (d) {
        const [year, month] = d[0].split('-').map(Number)
        const x = xScale(year)
        const y = yScale(months[month-1])
        plot_lines(year, month, x, y, xScale.bandwidth(), yScale.bandwidth())
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout)
  }  

  function plot_lines(year, month, x, y, xband, yband) {
    const data = temp_data.filter(d => d.year === year && d.month === month)
    
    const xCellScale = d3.scaleLinear()
      .domain([0, 32])
      .range([x, x+xband])

    const yCellScale = d3.scaleLinear()
      .domain([lowest, highest])
      .range([y+yband, y])

    const line_min = d3.line().x(d => xCellScale(d.day)).y(d => yCellScale(d.min_temp))
    const line_max = d3.line().x(d => xCellScale(d.day)).y(d => yCellScale(d.max_temp))
    
    graph.append("path")
      .datum(data)
      .attr("d", line_min)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5);

    graph.append("path")
      .datum(data)
      .attr("d", line_max)
      .attr("fill", "none")
      .attr("stroke", "forestgreen")
      .attr("stroke-width", 1.5);
  }

  updatechart(1)
  
  const title = svg.append("text")
    .attr("transform", `translate(${width/2}, 40)`)
    .style("text-anchor", "middle")
    .style("font-size", "26px")
    .style("fill", "black")
    // .style("font-family", "sans-serif")
    .text("Monthly Maximum Temperatures in Hong Kong, 2008-2017");

  let temp_type = 1
  
  const button = svg.append("foreignObject")
    .attr("x", width/8)
    .attr("y", 60)
    .attr("width", 300)  // Set button width
    .attr("height", 50)  // Set button height
    .append("xhtml:button")  // Create a button inside the foreignObject
    .attr("id", "tempButton")
    .text("Show Minimum Temperatures")
    .style("padding", "10px 20px")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("background-color", "Navy")
    .style("color", "white")
    .style("border", "none")
    .style("cursor", "pointer")
    .style("border-radius", "5px")

  button.on("click", function() {
    temp_type = 1 - temp_type
    console.log(temp_type)
    button.text(temp_type === 1 ? "Show Minimum Temperatures" : "Show Maximum Temperatures")
    button.style("background-color", temp_type === 1 ? "Navy" : "Maroon")
    title.text(temp_type === 1 ? "Monthly Maximum Temperatures in Hong Kong, 1997-2017" : 
               "Monthly Minimum Temperatures in Hong Kong, 1997-2017")
    updatechart(temp_type)
  })

  const legendNode = legend(colorScale, "Temperature, °C")
  d3.select(legendNode).attr("transform", `translate(0,0)`)
  d3.select(legendNode).select(".caption").style("font-size", "14px").style("font-weight", "normal")
  
  const keylegend = svg.append("g")
    .attr("transform", `translate(${width/2-40}, 60)`)
    .append(() => {
      return legendNode
    })

  keylegend.append("circle").attr("cx", 360).attr("cy", 10).attr("r", 8)
    .style("fill", "forestgreen").style("stroke", "black").style("stroke-width", 0.25)
  keylegend.append("circle").attr("cx", 360).attr("cy", 40).attr("r", 8)
    .style("fill", "blue").style("stroke", "black").style("stroke-width", 0.25)
  keylegend.append("text")
    .attr("x", 370)
    .attr("y", 15)
    .style("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "black")
    .text("Daily Max Temp, °C");
  keylegend.append("text")
    .attr("x", 370)
    .attr("y", 45)
    .style("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "black")
    .text("Daily Min Temp, °C");
  
  
  return svg.node()
}


export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  main.variable(observer("url")).define("url", _url);
  main.variable(observer("temp_data")).define("temp_data", ["d3","url"], _temp_data);
  main.variable(observer()).define(["temp_data","d3","DOM","width","legend"], _6);
  main.variable(observer()).define(["temp_data","d3","DOM","width","legend"], _7);
  return main;
}
