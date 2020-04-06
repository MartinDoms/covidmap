import React from 'react';
import { scaleLinear } from "d3-scale";

import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";


function Map({ data, min, max, property }) {
    const geoUrl =
            "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
    
    var colorScale = scaleLinear()
        .domain([min, max])
        .range(["#D9D9D9", "#AA0011"]);

    return (
        <div>
            <ComposableMap>
                <ZoomableGroup zoom={1}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map(geo => {
                                var geoData = data.find(p => p.Country == geo.properties.NAME || p.Country == geo.properties.NAME_LONG || p.Country == geo.properties.ISO_A3 || p.Country == geo.properties.ISO_A2);

                                if (geoData && !geoData[property]) geoData = null;
                                
                                return <Geography 
                                    key={geo.rsmKey} 
                                    geography={geo} 
                                    fill={geoData ? colorScale(geoData[property]) : "#EEE"}
                                />
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </div>
    )
}

export {
    Map
}