import React, { Component } from 'react';
import style from './Menu.scss';

function AnimatedText(props) {
    return(
        <p>{props.text}</p>
    );
}

function ContinueButton(props) {
    return(
        <div data-close={true} style={ {width: '20px', height: '20px', background: 'red'} }>X</div>
    );
}

export default class Dialog extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.close = this.close.bind(this);
        // this.state = {
        //     isOpen : false,
        // };
    }
    handleClick(e) {
        console.log(e.target.getAttribute('data-close'));
        if (e.target.getAttribute('data-close') === 'true') {
            this.close();
        }
        e.preventDefault();
        e.stopPropagation();
    }
    close() {
        this.props.onClose();
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }
    render() {

        let classes = `${style.window} ${style.dialog} `;
        if (this.props.isOpen) classes += style.open;

        return (
            <div className={classes} onClick={this.handleClick}>
                <ContinueButton />
                <AnimatedText text={this.props.text} />
            </div>
        );
    }
}