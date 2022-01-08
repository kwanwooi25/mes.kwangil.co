import produce, { Draft } from 'immer';
import create, { GetState, SetState, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { devtools } from 'zustand/middleware';

export const immer =
  <
    T extends object,
    CustomSetState extends SetState<T>,
    CustomGetState extends GetState<T>,
    CustomStoreApi extends StoreApi<T>,
  >(
    config: StateCreator<
      T,
      (partial: ((draft: Draft<T>) => void) | T, replace?: boolean) => void,
      CustomGetState,
      CustomStoreApi
    >,
  ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState =
          typeof partial === 'function'
            ? produce(partial as (state: Draft<T>) => T)
            : (partial as T);
        return set(nextState, replace);
      },
      get,
      api,
    );

const createStore = <T extends object>(
  stateCreator: StateCreator<
    T,
    (partial: ((draft: Draft<T>) => void) | T, replace?: boolean) => void,
    GetState<T>,
    StoreApi<T>
  >,
): UseBoundStore<T, StoreApi<T>> => create<T>(devtools(immer(stateCreator)));

export default createStore;
