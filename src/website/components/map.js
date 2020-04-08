import React from 'react';
import { scaleLinear } from "d3-scale";

import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";


function Map({ data, min, max, metric }) {
    const geoUrl =
            "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
    
    var colorScale = scaleLinear()
        .domain([min, max])
        .range(["#eee", "#AA0011"]);

    return (
        <div>
            <ComposableMap>
                <ZoomableGroup zoom={1}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map(geo => {
                                var mapCountry = data.find(dataPoint => 
                                    dataPoint.Country == geo.properties.NAME || 
                                    dataPoint.Country == geo.properties.NAME_LONG || 
                                    dataPoint.Country == geo.properties.ISO_A3 || 
                                    dataPoint.Country == geo.properties.ISO_A2
                                );

                                var dataValue = mapCountry && metric.calc(mapCountry);
                                
                                return <Geography 
                                    key={geo.rsmKey} 
                                    geography={geo} 
                                    fill={mapCountry ? colorScale(dataValue) : "#eee"}
                                    stroke="#ddd"
                                    strokeWidth="0.5"

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