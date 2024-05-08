import React, { useEffect, useRef } from "react";
import { ChartHeight, ChartWidth, Margin } from "../utils/config";
import * as d3 from "d3";

const BarChart = (props) => {
  const svgRef = useRef();

  useEffect(() => {
    const { data, dimension } = props;

    if (!data || data.length === 0 || !dimension) {
      console.log("Invalid data or dimension provided");
      return;
    }

    // Remove any existing SVG elements
    d3.select(svgRef.current).selectAll("*").remove();

    // Define the dimensions and margins
    const width = 500;
    const height = 300;
    const margins = Margin;

    // Create the SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("margin-top", "70px");

    // Append title to the chart
    // svg
    //   .append("text")
    //   .attr("x", width / 2)
    //   .attr("y", margins.top / 2)
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "20px")
    //   .text("Bar Chart for " + dimension);

    // Define scales based on the data and dimension type
    const frequencies = d3.rollup(
      data,
      (v) => v.length,
      (d) => d[dimension]
    );

    // Create the X and Y scales
    const xScale = d3
      .scaleBand()
      .domain(frequencies.keys())
      .range([0, width - margins.left - margins.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(frequencies.values())])
      .nice()
      .range([height - margins.top - margins.bottom, 0]);

    // Create the chart group
    const chart = svg
      .append("g")
      .classed("display", true)
      .attr("transform", `translate(${margins.left}, ${margins.top})`);

    // Add the X and Y axes
    const xAxis = d3.axisBottom(xScale).tickFormat((dv, i) => dv);
    const yAxis = d3.axisLeft().scale(yScale);

    // Add grid lines for the y-axis
    chart
      .append("g")
      .classed("gridline y-grid", true)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-(width - margins.left - margins.right))
          .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#ddd");

    // Transform the X and Y axes
    chart
      .append("g")
      .classed("x-axis", true)
      .attr(
        "transform",
        `translate(0, ${height - margins.top - margins.bottom})`
      )
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "translate(-10,0) rotate(-45)")
      .style("text-anchor", "end");

    chart
      .append("g")
      .classed("y-axis", true)
      .attr("transform", "translate(0,0)")
      .call(yAxis);

    // Add the bars, actual data being visualized
    chart
      .selectAll(".bar")
      .data(frequencies.entries())
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", (d) => xScale(d[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr(
        "height",
        (d) => height - margins.top - margins.bottom - yScale(d[1])
      )
      .attr("width", xScale.bandwidth())
      .style("stroke", "#191414")
      .style("fill", "#FF5349");

    // Add frequency labels on top of bars
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

    // Add labels for the X and Y axes
    chart
      .select(".x-axis")
      .append("text")
      .attr("x", width - margins.left - margins.right)
      .attr("y", 40)
      .attr("fill", "currentColor")
      .style("font-size", "15px")
      .style("text-anchor", "end")
      .text(dimension + " →");

    chart
      .select(".y-axis")
      .append("text")
      .attr("x", 0)
      .attr("y", -20)
      .attr("fill", "currentColor")
      .style("font-size", "15px")
      .style("text-anchor", "middle")
      .text("↑ Frequency");
  }, [props]);

  return (
    <div className="BarChart">
      <svg ref={svgRef} width={500} height={400}></svg>
    </div>
  );
};

export default BarChart;
