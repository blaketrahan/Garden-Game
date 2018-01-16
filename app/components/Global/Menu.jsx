import React, { Component } from 'react';
import Item from './Item.jsx';
import style from './Menu.scss';

export default function Menu(props) {
    console.log('Rendered Menu');

    return(
        <div>
            <div className={style.window}>
                <h1>inventory</h1>
                <ul className={style.slots}>
                    <Item/>
                    <Item/>
                    <Item/>
                </ul>
            </div>
        </div>
    );
};