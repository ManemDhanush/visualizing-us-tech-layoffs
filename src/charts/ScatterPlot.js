// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// const ScatterPlot = (props) => {
//   const svgRef = useRef();

//   useEffect(() => {
//     let { data, dimensionX, dimensionY, xIsCategorical, yIsCategorical, isHorizontal } = props;

//     // Swap dimensions and categorical flags if isHorizontal is true
//     if (isHorizontal) {
//       let temp = dimensionX;
//       dimensionX = dimensionY;
//       dimensionY = temp;

//       temp = xIsCategorical;
//       xIsCategorical = yIsCategorical;
//       yIsCategorical = temp;
//     }

//     if (!data || data.length === 0 || !dimensionX || !dimensionY) {
//       console.log("Invalid data or dimensions provided");
//       return;
//     }

//     // Clear any existing SVG content
//     d3.select(svgRef.current).selectAll("*").remove();

//     const width = 600;
//     const height = 370;
//     const margins = { top: 10, right: 10, bottom: 10, left: 10 };

//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .style("overflow", "visible")
//       .style("margin-top", "10px");

//     // Append title to the scatter plot
//     svg.append("text")
//       .attr("x", width / 2)
//       .attr("y", margins.top / 2)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "20px")
//       .text("Scatter Plot between " + dimensionX + " and " + dimensionY);

//     let xScale, yScale;

//     // Define scales based on dimension types
//     if (xIsCategorical) {
//       xScale = d3
//         .scaleBand()
//         .domain(data.map((d) => d[dimensionX]))
//         .range([margins.left, width - margins.right])
//         .padding(0.1);
//     } else {
//       xScale = d3
//         .scaleLinear()
//         .domain(d3.extent(data, (d) => d[dimensionX]))
//         .nice()
//         .range([margins.left, width - margins.right - 10]); // Adjusted the range for a space before the end
//     }

//     if (yIsCategorical) {
//       yScale = d3
//         .scaleBand()
//         .domain(data.map((d) => d[dimensionY]))
//         .range([height - margins.bottom, margins.top])
//         .padding(0.1);
//     } else {
//       yScale = d3
//         .scaleLinear()
//         .domain(d3.extent(data, (d) => d[dimensionY]))
//         .nice()
//         .range([height - margins.bottom, margins.top + 10]); // Adjusted the range for a space before the start
//     }

//     // Append grid lines
//     const xGrid = d3
//       .axisBottom(xScale)
//       .tickSize(-(height - margins.top - margins.bottom))
//       .tickFormat("")
//       .ticks(10);
//     svg
//       .append("g")
//       .attr("class", "grid")
//       .attr("transform", `translate(0, ${height - margins.bottom})`)
//       .call(xGrid)
//       .selectAll(".tick")
//       .style("stroke-opacity", 0.2)
//       .style("stroke", "#ddd");

//     const yGrid = d3
//       .axisLeft(yScale)
//       .tickSize(-width + margins.left + margins.right)
//       .tickFormat("")
//       .ticks(10);
//     svg
//       .append("g")
//       .attr("class", "grid")
//       .attr("transform", `translate(${margins.left}, 0)`)
//       .call(yGrid)
//       .selectAll(".tick")
//       .style("stroke-opacity", 0.2)
//       .style("stroke", "#ddd");

//     // Append dots for each data point
//     svg
//       .selectAll(".dot")
//       .data(data)
//       .enter()
//       .append("circle")
//       .classed("dot", true)
//       .attr("cx", (d) =>
//         xIsCategorical
//           ? xScale(d[dimensionX]) + xScale.bandwidth() / 2 + Math.random() * 10 - 5
//           : xScale(d[dimensionX]) + Math.random() * 10 - 5
//       )
//       .attr("cy", (d) =>
//         yIsCategorical
//           ? yScale(d[dimensionY]) + yScale.bandwidth() / 2 + Math.random() * 10 - 5
//           : yScale(d[dimensionY]) + Math.random() * 10 - 5
//       )
//       .attr("r", 2)
//       .style("fill", "#1DB954") // Green fill color
//       .style("stroke", "#000"); // Black border color

//     // Append x-axis
//     const xAxis = d3.axisBottom(xScale);
//     svg
//       .append("g")
//       .classed("x-axis", true)
//       .attr("transform", `translate(0, ${height - margins.bottom})`)
//       .call(xAxis)
//       .selectAll("text")
//       .attr("transform", "translate(-10,0) rotate(-45)")
//       .style("text-anchor", "end");

//     // Append y-axis
//     const yAxis = d3.axisLeft(yScale);
//     svg
//       .append("g")
//       .classed("y-axis", true)
//       .attr("transform", `translate(${margins.left}, 0)`)
//       .call(yAxis);

//     // Append X dimension label
//     svg
//       .append("text")
//       .attr("x", width / 2)
//       .attr("y", height - margins.bottom / 4)
//       .style("text-anchor", "middle")
//       .text(dimensionX);

//     // Append Y dimension label
//     svg
//       .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("x", -height / 2)
//       .attr("y", margins.left / 2)
//       .style("text-anchor", "middle")
//       .text(dimensionY);
//   }, [props]);

//   return <svg ref={svgRef}></svg>;
// };

// export default ScatterPlot;


import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ScatterPlot = (props) => {
  const svgRef = useRef();

  useEffect(() => {
    let { data, dimensionX, dimensionY, xIsCategorical, yIsCategorical, isHorizontal } = props;

    // Swap dimensions and categorical flags if isHorizontal is true
    if (isHorizontal) {
      let temp = dimensionX;
      dimensionX = dimensionY;
      dimensionY = temp;

      temp = xIsCategorical;
      xIsCategorical = yIsCategorical;
      yIsCategorical = temp;
    }

    if (!data || data.length === 0 || !dimensionX || !dimensionY) {
      console.log("Invalid data or dimensions provided");
      return;
    }

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margins = { top: 40, right: 30, bottom: 60, left: 60 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      // .style("background", "#f4f4f4")
      // .style("border", "1px solid #ccc")
      .style("border-radius", "8px");

    // Append title to the scatter plot
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margins.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text(`Scatter Plot: ${dimensionX} vs ${dimensionY}`);

    let xScale, yScale;

    // Define scales based on dimension types
    if (xIsCategorical) {
      xScale = d3
        .scaleBand()
        .domain(data.map((d) => d[dimensionX]))
        .range([margins.left, width - margins.right])
        .padding(0.1);
    } else {
      xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d[dimensionX]))
        .nice()
        .range([margins.left, width - margins.right]);
    }

    if (yIsCategorical) {
      yScale = d3
        .scaleBand()
        .domain(data.map((d) => d[dimensionY]))
        .range([height - margins.bottom, margins.top])
        .padding(0.1);
    } else {
      yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d[dimensionY]))
        .nice()
        .range([height - margins.bottom, margins.top]);
    }

    // Append grid lines
    const xGrid = d3
      .axisBottom(xScale)
      .tickSize(-(height - margins.top - margins.bottom))
      .tickFormat("")
      .ticks(10);
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${height - margins.bottom})`)
      .call(xGrid)
      .selectAll(".tick")
      .style("stroke-opacity", 0.3)
      .style("stroke", "#999");

    const yGrid = d3
      .axisLeft(yScale)
      .tickSize(-width + margins.left + margins.right)
      .tickFormat("")
      .ticks(10);
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margins.left}, 0)`)
      .call(yGrid)
      .selectAll(".tick")
      .style("stroke-opacity", 0.3)
      .style("stroke", "#999");

    // Append dots for each data point with tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("visibility", "hidden");

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .classed("dot", true)
      .attr("cx", (d) =>
        xIsCategorical
          ? xScale(d[dimensionX]) + xScale.bandwidth() / 2
          : xScale(d[dimensionX])
      )
      .attr("cy", (d) =>
        yIsCategorical
          ? yScale(d[dimensionY]) + yScale.bandwidth() / 2
          : yScale(d[dimensionY])
      )
      .attr("r", 5)
      .style("fill", "#ff6347")
      .style("stroke", "#000")
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        tooltip
          .html(`${dimensionX}: ${d[dimensionX]}<br>${dimensionY}: ${d[dimensionY]}`)
          .style("visibility", "visible");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Append x-axis
    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height - margins.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    // Append y-axis
    const yAxis = d3.axisLeft(yScale);
    svg
      .append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(${margins.left}, 0)`)
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px");

    // Append X dimension label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margins.bottom / 4)
      .style("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(dimensionX);

    // Append Y dimension label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margins.left / 3)
      .style("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(dimensionY);
  }, [props]);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlot;
