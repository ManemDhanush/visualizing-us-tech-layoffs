import React, { useEffect, useState, useRef, useCallback } from "react";
import * as d3 from "d3";
import { COLOR_SCALE } from "../utils/config"; // Ensure this path is correct

const ParallelCoordinatePlotAllColumns = ({ data }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState([]);

  useEffect(() => {
    // Calculate dimensions excluding 'Name' and any in mdsDeleteColumns
    const allDimensions = Object.keys(data[0]);
    const initialDimensions = allDimensions.filter(
      (d) => d !== "Name" && d != "Money_Raised_in_$_mil" && d != "#" && d != "Company" && d != "Country" && d != "Continent" && d != "Date_layoffs" && d != "lat" && d != "lng"
    );
    setDimensions(initialDimensions);
  }, [data]);

  const drawChart = useCallback(() => {
    if (dimensions.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 700;
    const height = 500;
    const padding = 20;

    const isNumeric = (dimension) =>
      data.every((d) => typeof d[dimension] === "number");

    const x = d3
      .scalePoint()
      .range([padding, width - padding])
      .padding(1)
      .domain(dimensions);

    const y = {};
    for (const dimension of dimensions) {
      y[dimension] = isNumeric(dimension)
        ? d3.scaleLinear().range([height - padding, padding])
        : d3
            .scalePoint()
            .range([height - padding, padding])
            .padding(0.5);

      y[dimension].domain(
        isNumeric(dimension)
          ? d3.extent(data, (d) => d[dimension])
          : [...new Set(data.map((d) => d[dimension]))]
      );
    }

    svg.selectAll("*").remove();

    const axisGroups = svg
      .selectAll(".axis-group")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "axis-group")
      .attr("transform", (dimension) => `translate(${x(dimension)},0)`);

    axisGroups.each(function (dimension) {
      d3.select(this)
        .call(d3.axisLeft(y[dimension]))
        .append("text")
        .text(dimension)
        .style("text-anchor", "middle")
        .style("cursor", "ew-resize")
        .attr("transform", `translate(0,${height - padding + 20})`)
        .attr("fill", "currentColor");
    });

    axisGroups.call(
      d3
        .drag()
        .on("start", function () {
          d3.select(this).raise().classed("active", true);
        })
        .on("drag", function (event) {
          d3.select(this).attr("transform", `translate(${event.x},0)`);
        })
        .on("end", function (event, dimension) {
          const newX = Math.max(padding, Math.min(width - padding, event.x));
          const newPosition = Math.round(
            ((newX - padding) / (width - 2 * padding)) * dimensions.length
          );
          const newDimensions = [...dimensions];
          newDimensions.splice(newDimensions.indexOf(dimension), 1);
          newDimensions.splice(newPosition, 0, dimension);
          setDimensions(newDimensions); // Update the dimensions state
        })
    );

    const colorScale = d3.scaleOrdinal(COLOR_SCALE);

    const line = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y[d[0]](d[1]))
      .defined((d) => !isNaN(y[d[0]](d[1])));

    svg
      .append("g")
      .attr("class", "lines")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", (d) => line(dimensions.map((p) => [p, d[p]])))
      .style("fill", "none")
      .style("stroke", (d) => colorScale(0))
      .style("opacity", 0.5);
  }, [data, dimensions]); // Now `dimensions` is a dependency

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div className="PCP All attributes plot">
      <div style={{ paddingLeft: "200px" }}>
        <h3>PCP All attributes</h3>
      </div>
      <svg ref={svgRef} width="700" height="500"></svg>
    </div>
  );

};

export default ParallelCoordinatePlotAllColumns;
