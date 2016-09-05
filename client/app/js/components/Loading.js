'use strict';

import React from 'react';
import $ from 'jquery';

class Loading extends React.Component{

    render() {
        return (
            <div className='loading-wrapper'>
                <div className='loading'>GATHERING VIBE TRIBES...</div>
            </div>
        );
    }

    componentDidMount() {

    }

}

export default Loading;
