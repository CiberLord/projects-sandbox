import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';

import { AppDispatch } from '../store';

export const useActions = (...actions: AnyAction[]) => {
    const dispatch = useDispatch() as AppDispatch;

    return useMemo(() => {
        if (Array.isArray(actions)) {
            return actions.map((action) => bindActionCreators(action, dispatch));
        }

        return bindActionCreators(actions, dispatch);
    }, [dispatch]);
};
