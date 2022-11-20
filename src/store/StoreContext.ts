import { createContext } from 'react';
import reducer from './reducers';

const { globalState } = reducer();

export default createContext({
    state: {
        global: globalState,
    },
    dispatch: (action: { type: string; data: any }) => {
    },
});
