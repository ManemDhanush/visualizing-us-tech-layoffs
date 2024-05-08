import React, { useEffect, useRef } from "react";
import { select, arc, pie, scaleOrdinal, rollup } from "d3";
import { ChartHeight, ChartWidth, Margin } from "../utils/config";

const DoughnutChart = (props) => {
  const svgRef = useRef();

  useEffect(() => {
    const { data, dimension } = props;

    if (!data || data.length === 0 || !dimension) {
      console.log("Invalid data or dimension provided");
      return;
    }

    // Remove any existing SVG elements
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    const colors = scaleOrdinal(["#d9e3f0", "#8bc34a"]); // green and white
    const boxSize = 1000; // Increased graph box size, in pixels
    const innerRadius = boxSize / 4; // inner radius of pie, adjusted for a thicker doughnut
    const outerRadius = boxSize / 2; // outer radius of pie, maximized within the box

    // Create new svg
    const chart = svg
      .append("svg")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("height", "100%") // Use percentage for responsive design
      .attr("width", "100%") // Use percentage for responsive design
      .attr("viewBox", `0 0 ${boxSize} ${boxSize}`)
      .append("g")
      .attr("transform", `translate(${boxSize / 2}, ${boxSize / 2})`);

    // Group data by the specified dimension
    const groupedData = rollup(
      data,
      (v) => v.length,
      (d) => d[dimension]
    );

    const arcGenerator = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pieGenerator = pie().value((d) => d[1]);

    const arcs = chart
      .selectAll()
      .data(pieGenerator(Array.from(groupedData.entries())))
      .enter();

    arcs
      .append("path")
      .attr("d", arcGenerator)
      .style("fill", (d, i) => colors(i));

    // Add label inside doughnut chart
    arcs
      .append("text")
      .attr("text-anchor", "middle")
      .text((d) => `${d.data[1]}`)
      .style("fill", "#000000")
      .style("font-size", `${Math.min(boxSize / 10, 30)}px`)
      .attr("transform", (d) => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y})`;
      });
  }, [props]);

  return (
    <div className="DoughnutChart">
      <svg ref={svgRef} width={500} height={400}></svg>
    </div>
  );
};

export default DoughnutChart;
