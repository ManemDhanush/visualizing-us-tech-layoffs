import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, handleRangeChange }) => {
  const svgRef = useRef();
  const [selectedRange, setSelectedRange] = useState(null); // State to store the selected range

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("Invalid data provided");
      return;
    }

    const margin = { top: 10, right: 30, bottom: 60, left: 60 };
    const width = 700;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous SVG content

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = d3.timeParse("%Y-%m-%d");
    const formatDate = d3.timeFormat("%Y-%m");
    const transformedData = data.map(d => {
      const parsedDate = parseDate(d.Date_layoffs);
      return {
        ...d,
        Date_layoffs: parsedDate ? formatDate(parsedDate) : "Invalid date"
      };
    }).filter(d => d.Date_layoffs !== "Invalid date");

    const dataByMonth = Array.from(d3.group(transformedData, d => d.Date_layoffs),
      ([month, values]) => ({
        month: d3.timeParse("%Y-%m")(month),
        Laid_Off: d3.sum(values, v => v.Laid_Off)
      })
    ).sort((a, b) => a.month - b.month);

    const x = d3.scaleTime()
      .domain(d3.extent(dataByMonth, d => d.month))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataByMonth, d => d.Laid_Off)])
      .range([height, 0])
      .nice();

    g.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m")))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    g.append("g")
      .call(d3.axisLeft(y));

    g.append("path")
      .datum(dataByMonth)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => x(d.month))
        .y(d => y(d.Laid_Off))
      );

    g.append("text")
      .attr("x", 100)
      .attr("y", 0)
      .attr("fill", "currentColor")
      .style("font-size", "11px")
      .style("text-anchor", "end")
      .text("Number of Layoffs ↑");

    g.append("text")
      .attr("x", height + height + 50)
      .attr("y", height + 30)
      .attr("fill", "currentColor")
      .style("font-size", "11px")
      .style("text-anchor", "end")
      .text("Date ->");

    // Setup the brush
    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on("end", function (event) {
        const selection = event.selection;
        if (selection) {
          handleRangeChange(selection.map(x.invert));
          const [x0, x1] = selection.map(x.invert);
          setSelectedRange([x0, x1]); // Store the date range in state
          console.log(x0, x1); // Or handle the range however needed
        }
      });

    g.append("g")
      .attr("class", "brush")
      .call(brush);

  }, [data]);

  return (
    <div className="LineChart">
      <svg ref={svgRef} width={1000} height={400}></svg>
    </div>
  );
};

export default LineChart;
