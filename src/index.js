import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './App';

import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import axios from 'axios'; 
import { takeEvery, put } from 'redux-saga/effects';

// this startingPlantArray should eventually be removed
const startingPlantArray = [
  { id: 1, name: 'Rose' },
  { id: 2, name: 'Tulip' },
  { id: 3, name: 'Oak' }
];

const plantList = (state = startingPlantArray, action) => {
  switch (action.type) {
    case 'ADD_PLANT':
      return [ ...state, action.payload ]
    default:
      return state;
  }
};

function* fetchPlants() {
  try {
    const plants = yield axios.get('/api/plant');
    yield put({type: 'SET_PLANTS', payload: plants.data})
  } catch (error) {
    console.log(`error in fetchplants: ${error}`);
    alert('Someting went wrong'); 
  }
};






function* rootSaga() {
  yield takeEvery('FETCH_PLANTS', fetchPlants); 
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({ 
    plantList 
  }),
  applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(rootSaga); 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);