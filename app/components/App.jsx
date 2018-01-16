import React, { Component } from 'react';
import World from './Global/World.jsx';

const fillWindow = {
    position: 'relative',
    width: '100%',
    height: '100%'
};

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log('Rendered App');
        return(
            <div style={fillWindow}>
                <World/>
            </div>
        );
    }
};