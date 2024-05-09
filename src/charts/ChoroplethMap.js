import React, { useEffect, useState, useRef } from 'react';
import us_states from "../data/us-states-default.json";
import * as d3 from 'd3';

const ChoroplethMap = ({ state, handleStateChange }) => {
  const ref = useRef(null);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 600; // Set fixed size for clarity
    const height = 350;

    const projection = d3.geoAlbersUsa().fitSize([width, height], us_states);
    const path = d3.geoPath().projection(projection);
    const colorScale = d3
      .scaleLog()
      .domain([1, d3.max(us_states.features, d => d.value)])
      .range(['#ffb3b3', '#e60000', '#990000']);

    svg.selectAll('path')
      .data(us_states.features)
      .join('path')
      .attr('id', d => d.properties.name.replace(/\s+/g, ''))
      .attr('d', path)
      .attr('fill', d => selectedState === d.properties.name ? '#8bc34a' : colorScale(d.value))
      .on('click', (event, d) => {
        const newState = selectedState === d.properties.name ? null : d.properties.name;
        setSelectedState(newState);
        handleStateChange(newState);

        // Update the fill colors directly here without an additional useEffect
        svg.selectAll('path')
           .attr('fill', d => newState === d.properties.name ? '#8bc34a' : colorScale(d.value));
      })
      .append('title')
      .text(d => d.properties.name + " " + d.value);
  }, [selectedState]); // Include selectedState in the dependency array

  return (
    <svg ref={ref} width={600} height={350} />
  );
};

export default ChoroplethMap;
