import React, { useReducer } from 'react';
import reducer from './reducers';
import StoreContext from './StoreContext';
// import console from 'utils/console';

const { globalReducer, globalState } = reducer();

interface ActionType {
    type: string;
    data: any;
}

const useCombine = (combinedReducers: any): [any, (action: ActionType) => void] => {
    const state = Object.keys(combinedReducers).reduce((acc, key) => ({ ...acc, [key]: combinedReducers[key][0] }), {});

    const dispatch = (action: ActionType) => {
        const mutations: any = Object.keys(combinedReducers).reduce(
            (acc, key) => ({ ...acc, [key]: combinedReducers[key][1] }),
            {}
        );

        // 分配 action 与重写 action type

        const actionType = action.type.split('_');
        const reducerType = actionType[0] || '';
        action.type = actionType[1] || '';

        // console.log(action, action.type, actionType);

        mutations[reducerType](action);
    };

    return [state, dispatch];
};

const Provider = (props: any) => {
    const [state, dispatch] = useCombine({
        global: useReducer(globalReducer, globalState),
    });

    return <StoreContext.Provider value={{ state, dispatch }}>{props.children}</StoreContext.Provider>;
};

export default Provider;
