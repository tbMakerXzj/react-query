import { initialGlobalState, globalReducer } from './globalReducer';

export default () => {
    return {
        globalState: initialGlobalState,
        globalReducer,
    };
};
