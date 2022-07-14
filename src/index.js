import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ParkingLot from './ParkingLot';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import parkingStore from './reducers';

const store = createStore(parkingStore);

ReactDOM.render(<Provider store={store}>
					<ParkingLot />
				</Provider>, document.getElementById('root'));
registerServiceWorker();
