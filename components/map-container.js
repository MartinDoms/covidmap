import React from 'react';
import { Map } from './map';

class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.dataKeys = Object.keys(props.data);
        this.state = {
            key: 0
        }
    }

    render() {
        var data = this.props.data[this.dataKeys[this.state.key]];
        var minMax = this.props.minMaxes[this.props.property];

        return (
            <div className="map-container">
                <Map 
                    data={this.props.data[this.dataKeys[this.state.key]]} 
                    min={minMax.min} 
                    max={minMax.max} 
                    property={this.props.property}
                />
                <div className="date">
                    {this.dataKeys[this.state.key]}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            var currentKey
            this.setState((state, props) => ({ 
                key: (state.key + 1) % this.dataKeys.length 
            }));
        } , 200);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

}

export {
    MapContainer
}