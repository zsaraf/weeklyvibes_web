'use strict';

import React from 'react';

class Section extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {

        var titleButtonText = (this.props.titleButtonText) ? (
            <div className='title-button-text' onClick={this.props.titleButtonHit}>
                {this.props.titleButtonText}
            </div>
        ) : null;

        var sectionTitle = (this.props.title) ? (
            <div className='section-title'>
                <div className='title'>
                    {this.props.title}
                </div>
                {titleButtonText}
            </div>
        ) : null;

        return (
            <div className='section'>
                {sectionTitle}
                <div className='section-content'>
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default Section;
