import React from 'react';
import { Map } from './map';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';

import { PlayArrow, Pause, Loop } from '@material-ui/icons';

class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.dataKeys = Object.keys(props.data);
        this.playbackSpeeds = [1000, 500, 200, 100, 50];
        this.state = {
            key: 0,
            selectedProperty: this.props.properties[0],
            playbackSpeed: 2,
            paused: true,
            loop: true
        }
    }

    tick() {
        this.setState((state) => { 
            var key = (state.key + 1) % this.dataKeys.length;
            if (key == 0 && !state.loop) {
                clearInterval(this.interval);
                return { paused: true };
            }
            return {key};
        });
    }

    handleDateChange(_, newValue) {
        this.handlePause();
        this.setState({key: newValue});
    }

    handlePropertyChange(_, newValue) {
        this.setState({selectedProperty: newValue});
    }

    handlePlaybackSpeedChange(event, val) {
        if (val !== this.state.playbackSpeed) {
            clearInterval(this.interval);
            this.setState({ 
                playbackSpeed: val
            });

            this.handlePlay();
        }
    }

    handlePlay() {
        this.setState({paused: false});

        if (!this.state.loop && this.state.key == this.dataKeys.length-1) {
            this.setState({key: 0}); // reset at the end of a loop when looping is disabled
        }

        clearInterval(this.interval);
        this.interval = setInterval(this.tick.bind(this), this.playbackSpeeds[this.state.playbackSpeed]);
    }

    handlePause() {
        clearInterval(this.interval);
        this.setState({paused: true});
    }

    handleRepeat() {
        this.setState((state) => ({loop: !state.loop}));
    }

    dateText(val) {
        var date = new Date(this.dataKeys[this.state.key]);
        return date.toLocaleDateString("en-GB")
    }

    valueText(val) {
        return `+${val}`;
    }

    speedValueText(val) {
        return `×${val}`;
    }

    render() {
        var minMax = this.props.minMaxes[this.state.selectedProperty];

        return (
            <div className="map-container">
                <Map 
                    data={this.props.data[this.dataKeys[this.state.key]]} 
                    min={minMax.min} 
                    max={minMax.max} 
                    property={this.state.selectedProperty}
                />
                <Typography gutterBottom>
                    Date {this.dateText(this.state.key)}
                </Typography>
                <div className="configuration">

                    <div className="playback-controls">
                        <div className="slider-container">
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
                        {this.state.paused && 
                            <div className="playback-button">
                                <IconButton onClick={this.handlePlay.bind(this)} className="playback-button">
                                    <PlayArrow />
                                </IconButton>
                            </div>
                        }
                        {!this.state.paused &&
                            <IconButton onClick={this.handlePause.bind(this)} className="playback-button">
                                <Pause />
                            </IconButton>
                        }
                        <IconButton onClick={this.handleRepeat.bind(this)} className="playback-button">
                            <Loop color={this.state.loop ? 'inherit' : 'disabled'} />
                        </IconButton>
                    </div>
                    <div className="speed-control">
                        <Typography gutterBottom>
                            Playback speed
                        </Typography>
                        <Slider 
                            defaultValue={2}
                            getAriaValueText={this.speedValueText.bind(this)}
                            valueLabelFormat={this.speedValueText.bind(this)}
                            value={this.state.playbackSpeed}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={1}
                            max={5}
                            onChange={this.handlePlaybackSpeedChange.bind(this)}
                            valueLabelDisplay="on"
                        />
                    </div>
                    
                    <div className="metric-selector">
                        <FormControl component="fieldset">
                        <FormLabel component="legend">Metric</FormLabel>
                        <RadioGroup aria-label="selectedProperty" name="selectedProperty" value={this.state.selectedProperty} onChange={this.handlePropertyChange.bind(this)}>
                            {this.props.properties.map(p => <FormControlLabel value={p} control={<Radio />} label={p} key={p} />)}
                        </RadioGroup>
                        </FormControl>
                    </div>

                </div>

                <style jsx>{`
                    .playback-controls {
                        display:flex;
                    }

                    .playback-button {
                        bottom: 0.4em;
                    }

                    .slider-container {
                        flex-grow: 1;
                    }
                `}</style>

            </div>
        );
    }

    componentDidMount() {
        this.handlePlay();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

}


export {
    MapContainer
}