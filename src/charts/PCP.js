import React, { useEffect, useRef } from "react";
import Parcoords from "parcoord-es";
import "parcoord-es/dist/parcoords.css";
import * as d3 from 'd3';

const processData = (data) => data.map(d => ({
    Industry: d.Industry,
    Laid_Off: d.Laid_Off,
    Stage: d.Stage,
    Year: d.Year,
    state: d.state
}));

const initializeChart = (node, data, colors) => {
    if (node) {
        d3.select(node).selectAll("*").remove();
        const chart = Parcoords()("#chart-id")
            .data(data)
            .hideAxis(["color"])
            .color((d, i) => colors[d.Year % 5])
            .render()
            .brushMode("1D-axes")
            .interactive()
            .reorderable();
    }
};

const PCP = ({ data }) => {
    const chartRef = useRef(null);
    const colors = ['#90baed', '#ffd3b4', '#9be3a3', '#f8a3a4', '#dac9e9'];

    useEffect(() => {
        const processedData = processData(data);
        initializeChart(chartRef.current, processedData, colors);
    }, [data]);

    return (
        <div
            ref={chartRef}
            id="chart-id"
            style={{ width: '1000px', height: '400px' }}
            className="parcoords"
        />
    );
};

export default PCP;
