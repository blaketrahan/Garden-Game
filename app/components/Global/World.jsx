import React, { Component } from 'react';
import * as THREE from 'three';
import Menu from './Menu.jsx';
import Dialog from './Dialog.jsx';

import style from './World.scss';

/*
    Characters, plants, trees, etc.
*/
class Thing {
    constructor(px = 0, py = 0, pz = 0, rx = 0, ry = 0, rz = 0) {
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;

        this.name = "Bouby!";
        this.dialogue = null;

        this.update = this.update.bind(this);
        this.display = this.display.bind(this);
        this.collide = this.collide.bind(this);

        this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.userData = {
            entity : this
        };
    }
    update() {
        this.rx += 0.02;
    }
    display(alpha) {
        let arx = (this.rx * alpha) + (this.rx * (1 - alpha));
        this.mesh.rotation.x = arx;
    }
    collide(isClicking) {
        if (isClicking) {
            return {
                isPointing : true,
                action : 'create_dialog',
                target : null,
                value : `Hi, my name is ${this.name}`
            };
        } else {
            return {
                isPointing : true,
                action : null,
                target : null,
                value : null
            };
        }
    }
}

/*
    The ThreeJS window
*/
export default class World extends Component {
    constructor(props) {
        super(props);

        this.state = {
            innerWidth : 400,
            innerHeight : 400,
            isPointing : false,
            dialog : "Some text",
            isTalking : false,
        };

        this.mouse = {
            x : 0,
            y : 0,
            active : false,
        };
        
        this.update = this.update.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.raycast = this.raycast.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = this.onClick.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        let w = this.state.innerWidth,
            h = this.state.innerHeight;

        /* Camera */
        this.camera = new THREE.PerspectiveCamera(70, w/h, 0.01, 10);
        this.camera.position.z = 1;
        this.cameraPrev = this.camera.position;

        /* Scene */
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xe3edef);

        /* Container of Things */
        this.things = [];
        this.things.push(new Thing());
        this.scene.add(this.things[this.things.length-1].mesh);

        /* ThreeJS Renderer */
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(w,h);
        this.domElement.appendChild(this.renderer.domElement);

        /* Raycasting */
        this.raycaster = new THREE.Raycaster();

        /* Fixed timestep clock */
        this.elapsedTime = window.performance.now();
        this.accumulator = 0;

        /* Begin rendering */
        requestAnimationFrame(this.update);
    }

    raycast() {
        let x =  (this.mouse.x/window.innerWidth)  * 2 - 1;
        let y = -(this.mouse.y/window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(new THREE.Vector2(x,y), this.camera);

        let intersects = this.raycaster.intersectObjects(this.scene.children );
        
        let result = {
            isPointing : false,
            action : null,
            target : null,
            value : null
        };

        /* Only react to the closest element. */
        for (let i = 0; i < intersects.length; i++)
        {
            result = intersects[i].object.userData.entity.collide(this.mouse.active);
            break;
        }
        this.mouse.active = false;

        return result;
    }

    closeDialog() {
        this.setState({
            isTalking : false
        });
    }

    update() {
        /*
            Render 3d window separately of React

            This is a fixed time step (logic and rendering decoupled)
            as per famous Gaffer On Games article
            https://gafferongames.com/post/fix_your_timestep/
        */
        requestAnimationFrame(this.update);
    
        const now = window.performance.now();
        let delta = now - this.elapsedTime;
        this.elapsedTime = now;
    
        if (delta > 1000) {
          delta = 1000;
        }
        this.accumulator += delta;
    
        /* Game logic */
        const timestep = 16.6667;
        if (this.accumulator >= timestep)
        {
            this.cameraPrev = this.camera.x;

            /* update objects */
            for (let i = 0; i < this.things.length; i++)
            {
                this.things[i].update();
            }

            /* mouse hover and click collision */
            let result = this.raycast();

            /* send events to global event dispatcher */
            switch (result.action) {
                case 'create_dialog':
                    this.setState({ 
                        dialog : result.value, 
                        isTalking : true 
                    });
                break;
            }

            /* set pointer state */
            this.state.isPointing !== result.isPointing 
                && this.setState({ isPointing : result.isPointing });

          this.accumulator -= timestep;
        }
        const alpha = this.accumulator / timestep;

        /* Render */
        for (let i = 0; i < this.things.length; i++)
        {
            this.things[i].display(alpha);
        }

        this.renderer.render(this.scene, this.camera);
    }

    onMouseMove(event) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
    }

    onClick(event) {
        this.mouse.active = true;
        event.preventDefault();
        event.stopPropagation();
    }

    render() {
        console.log('Rendered World');
        /*
            Return the element ThreeJS will render to.
        */
        const styles = {
            width : this.state.innerWidth + 'px',
            height : this.state.innerHeight + 'px',
        };

        const classNames = [
            style.renderWindow,
            this.state.isPointing ? style.handPoint : style.handOpen
        ].join(' ');

        return(
            <div>
                <div
                    className={classNames}
                    ref={(ref) => {this.domElement = ref; }}
                    style={styles}
                    onClick={this.onClick}
                    onMouseMove={this.onMouseMove}
                ></div>
                <Menu />
                <Dialog 
                    text={this.state.dialog} 
                    isOpen={this.state.isTalking}
                    onClose={this.closeDialog}
                />
            </div>
        );
    }
};