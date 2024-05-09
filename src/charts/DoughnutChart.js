import React, { useEffect, useRef } from "react";
import { select, arc, pie, scaleOrdinal, schemeSet3 } from "d3";
import { Margin } from "../utils/config"; // Assuming you have such imports

const DoughnutChart = ({ data, dimension, state, industry }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0 || !dimension) {
      console.log("Invalid data or dimension provided");
      return;
    }

    // Filter data by state and industry if not empty
    let filteredData = data;
    if (state) {
      // console.log(state, industry);
      filteredData = data.filter(d => d.state === state);
    }

    if (industry) {
      filteredData = filteredData.filter(d => d.Industry === industry);
    }

    // console.log(filteredData);

    // Sort and pick top 5 companies by layoffs, group the rest as "Others"
    const topCompanies = filteredData.sort((a, b) => b.Laid_Off - a.Laid_Off).slice(0, 5);
    const otherCompaniesLayoffs = filteredData.slice(5).reduce((acc, curr) => acc + curr.Laid_Off, 0);
    const displayData = topCompanies.map(d => ({ name: d.company, value: d.Laid_Off }));
    if (otherCompaniesLayoffs > 0) {
      displayData.push({ name: "Others", value: otherCompaniesLayoffs });
    }

    // Remove any existing SVG elements
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    const boxSize = 500;
    const innerRadius = boxSize / 4;
    const outerRadius = boxSize / 2;

    // Color scale
    const colors = scaleOrdinal(schemeSet3);

    // Create new svg
    const chart = svg
      .append("svg")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${boxSize} ${boxSize}`)
      .append("g")
      .attr("transform", `translate(${boxSize / 2}, ${boxSize / 2})`);

    const arcGenerator = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pieGenerator = pie().value(d => d.value);

    const arcs = chart
      .selectAll()
      .data(pieGenerator(displayData))
      .enter();

    arcs
      .append("path")
      .attr("d", arcGenerator)
      .style("fill", (d, i) => colors(i));

    // Add label inside doughnut chart
    arcs
      .append("text")
      .attr("text-anchor", "middle")
      .text(d => `${d.data.name} (${d.data.value})`)
      .style("fill", "#000000")
      .style("font-size", `${Math.min(boxSize / 20, 20)}px`) // Adjusted font size for visibility
      .attr("transform", d => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y})`;
      });
  }, [data, dimension, state, industry]); // Ensure dependency array is correct

  return (
    <div className="DoughnutChart">
      <svg ref={svgRef} width={500} height={400}></svg>
    </div>
  );
};

export default DoughnutChart;
