'use strict';

import React from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery';
import PIXI from 'pixi.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';

class LoadingLogo extends React.Component {
    constructor( props ) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="center-wrapper">
                <div className="logo-wrapper">
                    <div className="logo" key="logo"></div>
                    <div className="quote" key="quote">"Hello friends, said the little brown fox"</div>
                </div>
            </div>
        );
    }
}

class Loading extends React.Component {

    constructor( props ) {
        super(props);

        // vars
        this._numDots = 200;
        this._numBigDotsPerSquarePixel = 0.00008;
        this._numSmallDotsPerSquarePixel = 0.00010;
        this._maxLineDistance = 90;
        this._maxLineDistanceSquared = this._maxLineDistance * this._maxLineDistance;
        this._mouseEffectPositionProportion = 0.04;
        this._mouseEffectRotationProportion = 0.00004;

        this._beginAnimationPhase2 = false;

        //bind our animate function
        this.animate = this.animate.bind(this);

        this.state = {
            showLogo: false
        };
    }

    componentWillUnmount() {
        this._stop = true;
    }

    componentDidMount() {
        this.width = $(ReactDOM.findDOMNode(this)).width();
        this.height = $(ReactDOM.findDOMNode(this)).height();

       //Setup PIXI Canvas in componentDidMount
       this.renderer = new PIXI.CanvasRenderer(this.width, this.height, {antialias: true});
       this.renderer.backgroundColor = 0x000000;
       this.refs.gameCanvas.appendChild(this.renderer.view);

       // create the root of the scene graph
       this.stage = new PIXI.Container();
       this.stage.width = this.width;
       this.stage.height = this.height;
       this.stage.position = new PIXI.Point(this.width/2.0, this.height/2.0);
       this.stage.pivot = new PIXI.Point(this.width/2.0, this.height/2.0);

       this._currentStagePosition = new PIXI.Point(this.stage.width/2.0, this.stage.height/2.0);

       /* Array of all dot containers */
       this.bigDotContainers = [];
       this.smallDotContainers = [];
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

       //start the game
       this.animate();

       setTimeout(function () {
           this.setState({
               showLogo: true
           });
       }.bind(this), 700);

       setTimeout(function() {
           this.props.loadingAnimationPhase1Finished();
       }.bind(this), 1500);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.beginAnimationPhase2) {
            setTimeout(function() {
                this.props.loadingAnimationPhase2Finished();
            }.bind(this), 1500);
        }
    }

    addDots() {
        var area = this.width * this.height;
        var numSmallDots = this._numSmallDotsPerSquarePixel * area;
        var numBigDots = this._numBigDotsPerSquarePixel * area;

        for (var i = 0; i < numBigDots; i++) {
            this.addDot(i, true);
        }

        for (var i = 0; i < numSmallDots; i++) {
            this.addDot(i, false);
        }
    }

    addDot(identifier, big) {
        var x = this.randomInt(this.width);
        var y = this.randomInt(this.height);

        var colors = [0xD58E79, 0x78E387, 0x78B3D8];
        var color = colors[this.randomInt(3)];

        var dot = new PIXI.Graphics();
        dot.beginFill(color);
        dot.drawCircle(0, 0, big ? 1.5 : 0.75);
        dot.endFill();
        dot.x = x;
        dot.y = y;
        this.stage.addChild(dot);

        var velocityX = this.randomVelocity(big);
        var velocityY = this.randomVelocity(big);

        var dotContainer = {
            identifier: identifier,
            dot: dot,
            velocityX: velocityX,
            velocityY: velocityY,
        };

        if (big) {
            var dotSector = this._getSector(dot);
            var dotSectorX = dotSector[0];
            var dotSectorY = dotSector[1];
            this.dotSectors[dotSectorX][dotSectorY].push(dotContainer);
        } else {
            this.smallDotContainers.push(dotContainer);
        }
    }

    /* Animation functions */
    animate() {
        // stop requesting animation frames when we unmount
        if (!this._stop) {
            this.frame = requestAnimationFrame(this.animate);
        }

        if (this.smallDotContainers) {
            this._animateDots();
            this._animateLines();
            this._handleMouseInteraction();
        }

        this.renderer.render(this.stage);
    }

    _handleMouseInteraction() {
        if (this.renderer.plugins.interaction.mouse.global.x < 0 || this.renderer.plugins.interaction.mouse.global.y < 0) {
            return;
        }

        var mouseXPosition = this.renderer.plugins.interaction.mouse.global.x;
        var mouseYPosition = this.renderer.plugins.interaction.mouse.global.y;

        if (this._lastMousePosition) {
            var xOffset =  (this._lastMousePosition.x - mouseXPosition) * this._mouseEffectPositionProportion;
            var yOffset =  (this._lastMousePosition.y - mouseYPosition) * this._mouseEffectPositionProportion;

            var point = new PIXI.Point(xOffset, yOffset);

            this.stage.position = new PIXI.Point(this.stage.position.x + xOffset, this.stage.position.y + yOffset);

            var rotationOffset = (this._lastMousePosition.x - mouseXPosition) * this._mouseEffectRotationProportion;
            this.stage.rotation += rotationOffset;
        }

        this._lastMousePosition = new PIXI.Point(mouseXPosition, mouseYPosition);
    }

    /* Dot animation function */
    _animateDots() {
        this._animateSmallDots();
        this._animateBigDots();
    }

    _animateSmallDots() {
        for (var smallDotContainerIdx = 0; smallDotContainerIdx < this.smallDotContainers.length; smallDotContainerIdx++) {
            var smallDotContainer = this.smallDotContainers[smallDotContainerIdx];
            this.smallDotContainers[smallDotContainerIdx] = this._animateDotContainer(smallDotContainer, false);
        }
    }

    _animateBigDots() {
        for (var dotSectorX = 0; dotSectorX < this.dotSectors.length; dotSectorX++) {
            for (var dotSectorY = 0; dotSectorY < this.dotSectors[0].length; dotSectorY++) {
                var bigDotContainers = this.dotSectors[dotSectorX][dotSectorY];
                for (var bigDotContainerIdx = 0; bigDotContainerIdx < bigDotContainers.length; bigDotContainerIdx++) {
                    var bigDotContainer = bigDotContainers[bigDotContainerIdx];
                    bigDotContainer = this._animateDotContainer(bigDotContainer, true);

                    /* Put in correct sector (if not already in it) */
                    var newDotSector = this._getSector(bigDotContainer.dot);
                    var newDotSectorX = newDotSector[0];
                    var newDotSectorY = newDotSector[1];

                    if (dotSectorX != newDotSectorX || dotSectorY != newDotSectorY) {
                        /* Remove dot from current dot sector (and reset iteration idx) */
                        (this.dotSectors[dotSectorX][dotSectorY]).splice(bigDotContainerIdx, 1);
                        bigDotContainerIdx--;

                        /* Add to correct sector */
                        if (newDotSectorX >= 0 && newDotSectorX < this.dotSectors.length &&
                            newDotSectorY >= 0 && newDotSectorY < this.dotSectors[0].length) {

                            this.dotSectors[newDotSectorX][newDotSectorY].push(bigDotContainer);
                        } else {
                            this.stage.removeChild(bigDotContainer.dot);
                        }

                    }
                }

            }
        }
    }

    _animateDotContainer(dotContainer, big) {
        var dot = dotContainer.dot;
        dot.x += dotContainer.velocityX/2.0;
        dot.y += dotContainer.velocityY/2.0;

        if (this.props.beginAnimationPhase2) {
            dotContainer.velocityX *= (Math.abs(dotContainer.velocityX) < 2) ? 1.2 : 1.03;
            dotContainer.velocityY *= (Math.abs(dotContainer.velocityY) < 2) ? 1.2 : 1.04;
            dot.scale.x += .003 * dotContainer.velocityX;
            dot.scale.y += .003 * dotContainer.velocityX;
            dot.alpha -= 0.007;
        } else {
            /* Check for dot going out of bounds (and direct in opposite direction) */
            if (dot.x < 0 || dot.x > this.width) {
                dotContainer.velocityX *= -1;
                dot.x += 2 * dotContainer.velocityX;
            }

            if (dot.y < 0 || dot.y > this.height) {
                dotContainer.velocityY *= -1;
                dot.y += 2 * dotContainer.velocityY;
            }
        }


        return dotContainer;
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
                var bigDotContainers = this.dotSectors[dotSectorX][dotSectorY];
                for (var bigDotContainerIdx = 0; bigDotContainerIdx < bigDotContainers.length; bigDotContainerIdx++) {
                    var bigDotContainer = bigDotContainers[bigDotContainerIdx];

                    /* Add line for every other dot in same sector */
                    for (var otherSectorDotsIdx = bigDotContainerIdx; otherSectorDotsIdx < bigDotContainers.length; otherSectorDotsIdx++) {
                        var otherDotContainer = bigDotContainers[otherSectorDotsIdx];
                        this._addLineBetweenDots(bigDotContainer, otherDotContainer);
                    }

                    /* Check sector to the right, below, and diaganolly (right, below) */
                    this._updateLinesForDotInSector(bigDotContainer, dotSectorX + 1, dotSectorY);
                    this._updateLinesForDotInSector(bigDotContainer, dotSectorX, dotSectorY + 1);
                    this._updateLinesForDotInSector(bigDotContainer, dotSectorX + 1, dotSectorY + 1);
                }
            }
        }
    }

    _updateLinesForDotInSector(bigDotContainer, sectorX, sectorY) {
        if (sectorX < this.dotSectors.length && sectorY < this.dotSectors[0].length) {
            var otherDotContainers = this.dotSectors[sectorX][sectorY];
            for (var otherDotContainerIdx = 0; otherDotContainerIdx < otherDotContainers.length; otherDotContainerIdx++) {
                var otherDotContainer = otherDotContainers[otherDotContainerIdx];
                if (this._distanceBetweenDotsSquared(bigDotContainer.dot, otherDotContainer.dot) < this._maxLineDistanceSquared) {
                    this._addLineBetweenDots(bigDotContainer, otherDotContainer);
                }
            }
        }
    }

    _addLineBetweenDots(bigDotContainer1, bigDotContainer2) {
        this.lineContainers.push({
            dot1: bigDotContainer1.dot,
            dot2: bigDotContainer2.dot
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
                <VelocityTransitionGroup enter={{animation: {opacity: 1}}} leave={{animation: {opacity: 0}}} runOnMount={true} duration={300}>
                    <div className="game-canvas-container" ref="gameCanvas"></div>
                </VelocityTransitionGroup>
                <VelocityComponent animation={{ opacity: (this.state.showLogo && !this.props.beginAnimationPhase2 ? 1 : 0)}} duration={1000}>
                    <LoadingLogo />
                </VelocityComponent>
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

    randomVelocity(big) {
        var velocity = (Math.random() + 0.2);
        if (this.randomBool()) {
            velocity *= -1;
        }

        if (!big) {
            velocity = velocity/4.0;
        }
        return velocity;
    }

}

export default Loading;
