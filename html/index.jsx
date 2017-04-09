import React from 'react';
import ReactDOM from 'react-dom';

import {AppContainer} from 'react-hot-loader';

import ExperimentPicker from './ExperimentPicker.jsx';

const hotRender = (Component, target) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        typeof target === `string` ? document.getElementById(target) : target
    )
};

const render = target => {
    hotRender(ExperimentPicker, target);

    if (module.hot) {
        module.hot.accept('./ExperimentPicker.jsx', () => { hotRender(ExperimentPicker, target) })
    }
};

export {render};