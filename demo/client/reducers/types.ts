import { IModalStore } from './modals/types';
import { IConfigStore } from './config/types';

export interface IRootStore {
    modal: IModalStore;
    config: IConfigStore;
}
