import React from 'react';
import Template from './page.template';

const IndexPage = React.createClass({
    getInitialState:function () {
        // init state
        return {
            contentHeight:window.innerHeight - 85
        };
    },
    render: Template,
});

export default IndexPage;
