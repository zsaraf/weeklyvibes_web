'use strict';

import React from 'react';

class Section extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {

        var sectionTitle = (this.props.title) ? (
            <div className='section-title'>
                {this.props.title}
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
