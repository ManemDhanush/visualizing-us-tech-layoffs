import React, { useEffect, useRef } from "react";
import Parcoords from "parcoord-es";
import "parcoord-es/dist/parcoords.css";
import * as d3 from 'd3';

const PCP = ({ props }) => {
    console.log(props);
    const chartRef = useRef(null);
    const colors = ["#4c78a8","#f58518","#54a24b","#e45756"];
    useEffect(() => {
        d3.select(chartRef.current).selectAll("*").remove();
        const loadData = async () => {
            if (chartRef !== null) {
                const pcp_data = props.parallelData.map((d) => {
                    return {
                        // ...d,
                        // After_layoffs: d["After_layoffs"],
                        // Before_Layoffs: d["Before_Layoffs"],
                        Industry: d["Industry"],
                        Laid_Off: d["Laid_Off"],
                        Stage : d["Stage"],
                        Year : d["Year"],
                        // Money_Raised_in_$_mil : d["Money_Raised_in_$_mil"].substring(1, d["Money_Raised_in_$_mil"].length - 1)
                        state : d["state"]
                    };
                })
                // select top 100 points for demo
                // const top100Data = pcp_data.slice(0,100);
                
                const chart = Parcoords()("#chart-id")
                    .data(pcp_data)
                    .hideAxis(["color"])
                    .color(function (d, i) {
                        return colors[i%4];
                    })
                    .render()
                    .brushMode("1D-axes")
                    .interactive()
                    .reorderable();
            }
        };
        loadData();
    }, [props]);

    return (
        <div
            ref={chartRef}
            id={"chart-id"}
            style={{ width: 700, height: 400 }}
            className={"parcoords"}
        >
        </div>
    );
};

export default PCP;