import React from 'react';
import { Map } from './map';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.dataKeys = Object.keys(props.data);
        this.state = {
            key: 0,
            selectedProperty: this.props.properties[0],
        }
    }

    handleDateChange(_, newValue) {
        clearInterval(this.interval);
        this.setState({key: newValue});
    }

    handlePropertyChange(_, newValue) {
        this.setState({selectedProperty: newValue});
    }

    dateText(val) {
        var date = new Date(this.dataKeys[this.state.key]);
        date.setDate(date.getDate() + val);
        return date.toLocaleDateString("en-NZ")
    }

    valueText(val) {
        return `+${val}`;
    }

    render() {
        var data = this.props.data[this.dataKeys[this.state.key]];
        var minMax = this.props.minMaxes[this.state.selectedProperty];

        return (
            <div className="map-container">
                <Map 
                    data={this.props.data[this.dataKeys[this.state.key]]} 
                    min={minMax.min} 
                    max={minMax.max} 
                    property={this.state.selectedProperty}
                />
                <div className="slider-container">
                    <Typography gutterBottom>
                        Date {this.dateText(this.state.key)}
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
                        onChange={this.handleDateChange.bind(this)}
                        valueLabelDisplay="on"
                    />
                </div>
                <div className="metric-selector">
                    <FormControl component="fieldset">
                    <FormLabel component="legend">Metric</FormLabel>
                    <RadioGroup aria-label="selectedProperty" name="selectedProperty" value={this.state.selectedProperty} onChange={this.handlePropertyChange.bind(this)}>
                        {this.props.properties.map(p => <FormControlLabel value={p} control={<Radio />} label={p} />)}
                    </RadioGroup>
                    </FormControl>
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
        } , 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

}


export {
    MapContainer
}