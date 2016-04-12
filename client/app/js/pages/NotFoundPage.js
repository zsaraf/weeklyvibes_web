'use strict';

import React         from 'react';
import DocumentTitle from 'react-document-title';

const propTypes = {
    currentUser: React.PropTypes.object
};

class NotFoundPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DocumentTitle title="404: Not Found">
                <div id="not-found-page">

                    <div className='massive-text'>
                        <a href='./'>404 - GO HOME</a>
                    </div>

                </div>
            </DocumentTitle>
        );
    }

}

NotFoundPage.propTypes = propTypes;

export default NotFoundPage;
