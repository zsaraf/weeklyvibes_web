'use strict';

import React from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery';
import PIXI from 'pixi.js';

class Loading extends React.Component {

    constructor( props ) {
        super(props);

        // vars
        this._numDots = 200;
        this._maxLineDistance = 90;
        this._maxLineDistanceSquared = this._maxLineDistance * this._maxLineDistance;

        //bind our animate function
        this.animate = this.animate.bind(this);
    }

    componentDidMount() {
        this.width = $(React.findDOMNode(this)).width();
        this.height = $(React.findDOMNode(this)).height();

       //Setup PIXI Canvas in componentDidMount
       this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {antialias: true});
       this.renderer.backgroundColor = 0x212121;
       this.refs.gameCanvas.appendChild(this.renderer.view);

       // create the root of the scene graph
       this.stage = new PIXI.Container();
       this.stage.width = this.width;
       this.stage.height = this.height;

       //start the game
       this.animate();

       /* Array of all dot containers */
       this.dotContainers = [];
       var numHorizontalSectors = Math.floor(this.width/this._maxLineDistance) + 1;
       var numVerticalSectors = Math.floor(this.height/this._maxLineDistance) + 1;

       this.dotSectors = new Array(numHorizontalSectors);
       for (var i = 0; i < numHorizontalSectors; i++) {
           this.dotSectors[i] = new Array(numVerticalSectors);
           for (var j = 0; j < numVerticalSectors; j++) {
               this.dotSectors[i][j] = new Array();
           }
       }

       this.addDots();

       this.lineContainers = {};
    }

    addDots() {
        for (var i = 0; i < 200; i++) {
            this.addDot(i);
        }
    }

    addDot(identifier) {
        var x = this.randomInt(this.width);
        var y = this.randomInt(this.height);

        var colors = [0xD58E79, 0x78E387, 0x78B3D8];
        var color = colors[this.randomInt(3)];

        var dot = new PIXI.Graphics();
        dot.beginFill(color);
        dot.drawCircle(0, 0, 1.5);
        dot.endFill();
        dot.x = x;
        dot.y = y;
        this.stage.addChild(dot);

        var velocityX = this.randomVelocity();
        var velocityY = this.randomVelocity();

        var dotContainer = {
            identifier: identifier,
            dot: dot,
            velocityX: velocityX,
            velocityY: velocityY
        };

        this.dotContainers.push(dotContainer);

        var dotSector = this._getSector(dot);
        var dotSectorX = dotSector[0];
        var dotSectorY = dotSector[1];
        this.dotSectors[dotSectorX][dotSectorY].push(dotContainer);
    }

    /* Animation functions */
    animate() {
        // render the stage container
        this.frame = requestAnimationFrame(this.animate);

        if (this.dotContainers) {
            this._animateDots();
            this._animateLines();
        }

        this.renderer.render(this.stage);
    }

    /* Dot animation function */
    _animateDots() {
        for (var dotSectorX = 0; dotSectorX < this.dotSectors.length; dotSectorX++) {
            for (var dotSectorY = 0; dotSectorY < this.dotSectors[0].length; dotSectorY++) {
                var dotContainers = this.dotSectors[dotSectorX][dotSectorY];
                for (var dotContainerIdx = 0; dotContainerIdx < dotContainers.length; dotContainerIdx++) {
                    var dotContainer = dotContainers[dotContainerIdx];
                    var dot = dotContainer.dot;
                    dot.x += dotContainer.velocityX/2.0;
                    dot.y += dotContainer.velocityY/2.0;

                    /* Check for dot going out of bounds (and direct in opposite direction) */
                    if (dot.x < 0 || dot.x > this.width) {
                        dotContainer.velocityX *= -1;
                        dot.x += 2 * dotContainer.velocityX;
                        dotContainers[dotContainerIdx] = dotContainer;
                    }

                    if (dot.y < 0 || dot.y > this.height) {
                        dotContainer.velocityY *= -1;
                        dot.y += 2 * dotContainer.velocityY;
                        dotContainers[dotContainerIdx] = dotContainer;
                    }

                    /* Put in correct sector (if not already in it) */
                    var newDotSector = this._getSector(dot);
                    var newDotSectorX = newDotSector[0];
                    var newDotSectorY = newDotSector[1];

                    if (dotSectorX != newDotSectorX || dotSectorY != newDotSectorY) {
                        /* Remove dot from current dot sector (and reset iteration idx) */
                        (this.dotSectors[dotSectorX][dotSectorY]).splice(dotContainerIdx, 1);
                        dotContainerIdx--;

                        /* Add to correct sector */
                        this.dotSectors[newDotSectorX][newDotSectorY].push(dotContainer);
                    }
                }

            }
        }
    }

    /* Line animation functions */
    _animateLines() {
        // this._updateLineContainers();
        this._updateLineContainers2();
        this._drawLines();
    }

    _updateLineContainers2() {
        this.lineContainers = [];
        for (var dotSectorX = 0; dotSectorX < this.dotSectors.length; dotSectorX++) {
            for (var dotSectorY = 0; dotSectorY < this.dotSectors[0].length; dotSectorY++) {
                var dotContainers = this.dotSectors[dotSectorX][dotSectorY];
                for (var dotContainerIdx = 0; dotContainerIdx < dotContainers.length; dotContainerIdx++) {
                    var dotContainer = dotContainers[dotContainerIdx];

                    /* Add line for every other dot in same sector */
                    for (var otherSectorDotsIdx = dotContainerIdx; otherSectorDotsIdx < dotContainers.length; otherSectorDotsIdx++) {
                        var otherDotContainer = dotContainers[otherSectorDotsIdx];
                        this._addLineBetweenDots(dotContainer, otherDotContainer);
                    }

                    /* Check sector to the right, below, and diaganolly (right, below) */
                    this._updateLinesForDotInSector(dotContainer, dotSectorX + 1, dotSectorY);
                    this._updateLinesForDotInSector(dotContainer, dotSectorX, dotSectorY + 1);
                    this._updateLinesForDotInSector(dotContainer, dotSectorX + 1, dotSectorY + 1);
                }
            }
        }
    }

    _updateLinesForDotInSector(dotContainer, sectorX, sectorY) {
        if (sectorX < this.dotSectors.length && sectorY < this.dotSectors[0].length) {
            var otherDotContainers = this.dotSectors[sectorX][sectorY];
            for (var otherDotContainerIdx = 0; otherDotContainerIdx < otherDotContainers.length; otherDotContainerIdx++) {
                var otherDotContainer = otherDotContainers[otherDotContainerIdx];
                if (this._distanceBetweenDotsSquared(dotContainer.dot, otherDotContainer.dot) < this._maxLineDistanceSquared) {
                    this._addLineBetweenDots(dotContainer, otherDotContainer);
                }
            }
        }
    }

    _addLineBetweenDots(dotContainer1, dotContainer2) {
        this.lineContainers.push({
            dot1: dotContainer1.dot,
            dot2: dotContainer2.dot
        });
    }

    _drawLines() {
        if (this.lines) {
            for (var i = 0; i < this.lines.length; i++) {
                this.stage.removeChild(this.lines[i]);
            }
        }

        this.lines = [];
        for (var i = 0; i < this.lineContainers.length; i++) {
            var lineContainer = this.lineContainers[i];
            var dot1 = lineContainer.dot1;
            var dot2 = lineContainer.dot2;

            var line = new PIXI.Graphics();
            line.alpha = 1 - (this._distanceBetweenDotsSquared(dot1, dot2)/this._maxLineDistanceSquared);
            line.lineStyle(0.5, 0x545454, 1);
            line.moveTo(dot1.x, dot1.y);
            line.lineTo(dot2.x, dot2.y);
            this.stage.addChild(line);
            this.lines.push(line);
        }
    }

    _distanceBetweenDotsSquared(dot1, dot2) {
        var xDiff = dot2.x - dot1.x;
        var yDiff = dot2.y - dot1.y;
        return xDiff * xDiff + yDiff * yDiff;
    }

    _getSector(dot) {
        return [Math.floor(dot.x/this._maxLineDistance), Math.floor(dot.y/this._maxLineDistance)];
    }

    render() {
        return (
            <div className='loading-wrapper'>
                <div className="game-canvas-container" ref="gameCanvas" style={{width: '100%', height: '100%'}}></div>
                <div className='loading'>GATHERING VIBE TRIBES...</div>
            </div>
        );
    }

    /* Random number functions */
    randomInt(max) {
        return Math.floor((Math.random() * max))
    }

    randomBool() {
        return this.randomInt(2) == 0;
    }

    randomVelocity() {
        var velocity = (Math.random() + 0.2);
        if (this.randomBool()) {
            velocity *= -1;
        }
        return velocity;
    }

}

export default Loading;
