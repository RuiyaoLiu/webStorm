import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

function errorLoading(error) {
    throw new Error(`Dynamic page loading failed: ${error}`);
}

function loadRoute(cb) {
    return module => cb(null, module.default);
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path={'/'} components={App}>
                <Route path={'/list/guanxian'} name='guanxian' getComponent={(location, cb) => {
                    import('./components/list/ListContainer').then(loadRoute(cb, false)).catch(errorLoading)
                }} />
                <Route path={'/list/jiedian'} name='jiedian' getComponent={(location, cb) => {
                    import('./components/list/ListContainer0').then(loadRoute(cb, false)).catch(errorLoading)
                }} />
                <Route path={'/map/baidu'} name='MapBaidu' getComponent={(location, cb) => {
                    import('./components/map/BaiduContainer').then(loadRoute(cb, false)).catch(errorLoading)
                }} />
                <Route path={'/echarts/lineCount'} name='EchartsSamples' getComponent={(location, cb) => {
                    import('./components/echarts/lineCount').then(loadRoute(cb, false)).catch(errorLoading)
                }} />
                <Route path={'/echarts/lineLength'} name='EchartsSamples' getComponent={(location, cb) => {
                    import('./components/echarts/lineLength').then(loadRoute(cb, false)).catch(errorLoading)
                }} />
                <Route path={'/echarts/lineType'} name='EchartsSamples' getComponent={(location, cb) => {
                    import('./components/echarts/lineType').then(loadRoute(cb, false)).catch(errorLoading)
                }} />
                <Route path={'/setting'} name='Setting' getComponent={(location, cb) => {
                    import('./components/setting/SettingContainer').then(loadRoute(cb, false)).catch(errorLoading)
                }} />
            </Route>
        </Router>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
