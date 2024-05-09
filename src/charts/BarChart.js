import React, { useEffect, useRef } from "react";
import { Margin } from "../utils/config";
import * as d3 from "d3";

const BarChart = ({ data, dimension, state, handleIndustryChange }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0 || !dimension) {
      console.log("Invalid data or dimension provided");
      return;
    }

    // Filter data by state if state is not empty
    let filteredData = data;
    if (state) {
      filteredData = data.filter(d => d.state === state);
    }

    // console.log(filteredData);
    
    // console.log(data);
    // Remove any existing SVG elements
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 600;
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
      (v) => v.length,
      (d) => d[dimension]
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
      .classed("display", true)
      .attr("transform", `translate(${margins.left}, ${margins.top})`);

    const xAxis = d3.axisBottom(xScale).tickFormat((dv) => dv);
    const yAxis = d3.axisLeft(yScale);

    chart
      .append("g")
      .classed("gridline y-grid", true)
      .call(d3.axisLeft(yScale).tickSize(-(width - margins.left - margins.right)).tickFormat(""))
      .selectAll("line")
      .attr("stroke", "#ddd");

    chart
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height - margins.top - margins.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "translate(-10,0) rotate(-45)")
      .style("text-anchor", "end");

    chart
      .append("g")
      .classed("y-axis", true)
      .attr("transform", "translate(0,0)")
      .call(yAxis);

    chart
      .selectAll(".bar")
      .data(frequencies.entries())
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", (d) => xScale(d[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => height - margins.top - margins.bottom - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .style("stroke", "#191414")
      .style("fill", "#FF5349")
      .on("click", (event, d) => {
        // console.log(d);
        handleIndustryChange(d[0]);
      });

    chart
      .selectAll(".bar-label")
      .data(frequencies.entries())
      .enter()
      .append("text")
      .classed("bar-label", true)
      .attr("x", (d) => xScale(d[0]) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d[1]) - 5)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text((d) => d[1]);

    chart
      .select(".x-axis")
      .append("text")
      .attr("x", width - margins.left - margins.right)
      .attr("y", 40)
      .style("font-size", "15px")
      .style("text-anchor", "end")
      .text(dimension + " →");

    chart
      .select(".y-axis")
      .append("text")
      .attr("x", 0)
      .attr("y", -20)
      .style("font-size", "15px")
      .style("text-anchor", "middle")
      .text("↑ Frequency");
  }, [data, dimension, state]);

  return (
    <div className="BarChart">
      <svg ref={svgRef} width={500} height={400}></svg>
    </div>
  );
};

export default BarChart;
