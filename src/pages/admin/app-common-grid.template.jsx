import React from 'react';
import BodeGrid from '../../components/uis/tables/bode-grid/bode-grid';
const render = function() {
    return (
        <div>
            <BodeGrid gridOptions={this.state.gridOptions} ref="grid"></BodeGrid>
        </div>
    );
};

export default render;
