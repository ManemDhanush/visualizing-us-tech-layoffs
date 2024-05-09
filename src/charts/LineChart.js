import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("Invalid data provided");
      return;
    }

    const margin = { top: 10, right: 30, bottom: 60, left: 60 };
    const width = 700;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Adjust date parsing and formatting
    const parseDate = d3.timeParse("%Y-%m-%d");
    const formatDate = d3.timeFormat("%Y-%m");
    const transformedData = data.map(d => {
      const parsedDate = parseDate(d.Date_layoffs);
      return {
        ...d,
        Date_layoffs: parsedDate ? formatDate(parsedDate) : "Invalid date"
      };
    }).filter(d => d.Date_layoffs !== "Invalid date");

    console.log(transformedData);

    const dataByMonth = Array.from(d3.group(transformedData, d => d.Date_layoffs),
      ([month, values]) => ({
        month: d3.timeParse("%Y-%m")(month),
        Laid_Off: d3.sum(values, v => v.Laid_Off)
      })
    ).sort((a, b) => a.month - b.month);

    const x = d3.scaleTime()
      .domain(d3.extent(dataByMonth, d => d.month))
      .range([0, width]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m"))
      .tickSizeOuter(0);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataByMonth, d => d.Laid_Off)])
      .range([height, 0])
      .nice();

    const yAxis = d3.axisLeft(y).ticks(10);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .call(yAxis);

    svg.append("path")
      .datum(dataByMonth)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => x(d.month))
        .y(d => y(d.Laid_Off))
      );

  }, [data]);

  return (
    <div className="LineChart">
      <svg ref={svgRef} width={1000} height={400}></svg>
    </div>
  );
};

export default LineChart;
