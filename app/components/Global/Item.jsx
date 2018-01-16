import React, { Component } from 'react';

export default class Item extends Component {
    constructor(props) {
        super(props);
        this.item = null;
        this.state = {
            selected : false
        };
        this.select_item = this.select_item.bind(this);
    }
    display_item() {
        if (this.item !== null) {
            return this.item;
        }
        return;
    }
    select_item(event) {
        // if (this.item !== null) {
            this.setState({
                selected : !this.state.selected
            });
        // }
        event.stopPropagation();
    }
    render() {
        const displaySelected = {
            border: '2px solid #02f1ff',
            background: '#bbeaff'
        };
        const style = this.state.selected === true ? displaySelected : {};
        return(
            <li style={style}
                onClick={this.select_item}>
                {this.display_item()}
            </li>
        );
    }
}