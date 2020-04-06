import React from 'react';
import { Map } from './map';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from '@material-ui/core/styles';

class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.dataKeys = Object.keys(props.data);
        this.state = {
            key: 0
        }
    }

    handleChange(_, newValue) {
        clearInterval(this.interval);
        this.setState({key: newValue});
    }

    valueText(val) {
        var date = new Date(this.dataKeys[this.state.key]);
        date.setDate(date.getDate() + val);
        return date.toLocaleDateString("en-NZ")
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
                <div className="slider-container">
                    <Typography gutterBottom>
                        Date
                    </Typography>
                    <Slider
                        defaultValue={0}
                        getAriaValueText={this.valueText.bind(this)}
                        valueLabelFormat={this.valueText.bind(this)}
                        value={this.state.key}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={0}
                        max={this.dataKeys.length-1}
                        onChange={this.handleChange.bind(this)}
                        valueLabelDisplay="on"
                    />
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
        } , 200000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

}


export {
    MapContainer
}