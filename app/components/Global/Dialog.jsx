import React, { Component } from 'react';
import style from './Menu.scss';

function AnimatedText(props) {
    return(
        <p>{props.text}</p>
    );
}

function ContinueButton(props) {
    return(
        <div data-effect={props.effect} className={style.nextButton}></div>
    );
}

export default class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            line : 0,
        };
        this.handleClick = this.handleClick.bind(this);
        this.close = this.close.bind(this);
        this.next = this.next.bind(this);
    }
    handleClick(e) {
        if (e.target.dataset.effect === 'next') {
            this.next();
        }
        if (e.target.dataset.effect === 'close') {
            this.close();
        }
        e.preventDefault();
        e.stopPropagation();
    }
    close() {
        this.setState({
            isClosing : true,
        });
        this.props.onClose();
    }
    next() {
        this.setState({
            line : this.state.line + 1,
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.isClosing === true) {
            this.state.isClosing = false;
            this.state.line = 0;
        }
    }
    render() {
        console.log('Rendering dialog');
        let classes = `${style.window} ${style.dialog} `;
        if (this.props.isOpen) classes += style.open;

        let lines = this.props.text.split('|');
        let line = lines[this.state.line];
        let effect = (this.state.line + 1 == lines.length) ? 'close' : 'next';   

        /* Keep last line while closing. */
        if (this.state.isClosing) {
            line = lines[lines.length - 1];
        }

        return (
            <div className={classes} onClick={this.handleClick}>
                <ContinueButton effect={effect} />
                <AnimatedText text={line} />
            </div>
        );
    }
}