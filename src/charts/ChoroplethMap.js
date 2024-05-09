import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChoroplethMap = ( {props, handleStateChange} ) => {
  const ref = useRef(null);

  useEffect(() => {
    const usStates = props.choroplethMap;
    // console.log(usStates);
    const svg = d3.select(ref.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const projection = d3.geoAlbersUsa().fitSize([width, height], usStates);

    const colorScale = d3
      .scaleLog()
      .domain([1, d3.max(usStates.features, d => d.value)])
      .range(['#ff9999','#ff0000','#800000']);

    const path = d3.geoPath().projection(projection);

    const handleClick = (event, d) => {
      // console.log(event);

      const statePath = svg.select(`#${d.properties.name.replace(/\s+/g, '')}`);
      const fillColor = statePath.attr('fill');
      const newFillColor = fillColor === '#8bc34a' ? colorScale(d.value) : '#8bc34a';
      statePath.attr('fill', newFillColor);
      handleStateChange(d.properties.name);

      // if (newFillColor === '#8bc34a') {
      //   handleStateChange(d.properties.name); // call handleStateChange method here
      // } else {
      //   handleStateChange("US");
      // }
    };

    svg
      .selectAll('path')
      .data(usStates.features)
      .join('path')
      .attr('id', d => d.properties.name.replace(/\s+/g, ''))
      .attr('d', path)
      .attr('fill', d => colorScale(d.value))
      .on('click', handleClick)
      .append('title')
      .text(d => d.properties.name + " " + d.value);
  }, [props.start, props.end]);

  return (
    <svg ref={ref} width={700} height={350}>
    </svg>
  );
};

export default ChoroplethMap;
