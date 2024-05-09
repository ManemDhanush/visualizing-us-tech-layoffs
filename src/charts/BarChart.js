import React, { useEffect, useRef, useState } from "react";
import { Margin } from "../utils/config";
import * as d3 from "d3";

const BarChart = ({ data, dimension, state, handleIndustryChange }) => {
  const svgRef = useRef();
  const [activeDimension, setActiveDimension] = useState(null);  // State to track the active dimension

  useEffect(() => {
    if (!data || data.length === 0 || !dimension) {
      console.log("Invalid data or dimension provided");
      return;
    }

    let filteredData = data;
    if (state) {
      filteredData = data.filter(d => d.state === state);
    }

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 700;
    const height = 370;
    const margins = Margin;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("margin-top", "10px");

    const frequencies = d3.rollup(
      filteredData,
      v => v.length,
      d => d[dimension]
    );

    const xScale = d3.scaleBand()
      .domain(frequencies.keys())
      .range([0, width - margins.left - margins.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(frequencies.values())])
      .nice()
      .range([height - margins.top - margins.bottom, 0]);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`);

    // Define axes
    const xAxis = d3.axisBottom(xScale).tickFormat(dv => dv);
    const yAxis = d3.axisLeft(yScale);

    chart.append("g")
      .attr("transform", `translate(0, ${height - margins.top - margins.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "translate(-10,0) rotate(-45)")
      .style("text-anchor", "end");

    chart.append("g")
      .call(yAxis);

    // Draw bars with dynamic fill based on active dimension
    chart.selectAll(".bar")
      .data(frequencies.entries())
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", d => xScale(d[0]))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => height - margins.top - margins.bottom - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .style("fill", d => activeDimension === d[0] ? "#8bc34a" : "#FF7A70")  // Conditional fill color
      .on("click", (event, d) => {
        if (activeDimension === d[0]) {
          setActiveDimension(null);  // Unselect if currently selected
          handleIndustryChange("");  // Call handler with empty string
        } else {
          setActiveDimension(d[0]);  // Set new active dimension
          handleIndustryChange(d[0]);  // Update industry
        }
      });

    chart.append("text")
      .attr("x", width / 2 + 250)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .text("Industry ->");

    chart.append("text")
      .attr("x", 30)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .text("Companies ↑");

    // Optionally add labels
    // Further code for labels or other elements as needed...
  }, [data, dimension, state, activeDimension]);  // Include activeDimension in dependency array

  return (
    <div className="BarChart">
      <svg ref={svgRef} width={700} height={400}></svg>
    </div>
  );
};

export default BarChart;
