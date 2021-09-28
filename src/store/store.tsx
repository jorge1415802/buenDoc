import { createStore, combineReducers } from 'redux';
import { professionalReducer } from '../reducers/professionalReducer';

const reducers = combineReducers({
    professional : professionalReducer
})

export const store = createStore(reducers)