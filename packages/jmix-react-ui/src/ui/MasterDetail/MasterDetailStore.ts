import {action, makeObservable, observable} from 'mobx';

export class MasterDetailStore {
    selectedEntityId: string | undefined = undefined;
    isOpenEditor: boolean = false;
    saved: boolean = true;

    constructor() {
        makeObservable(this, {
            selectedEntityId: observable,
            isOpenEditor: observable,
            saved: observable,
            setSelectedEntityId: action,
            setIsOpenEditor: action,
            setSaved: action,
        });
    }

    setSelectedEntityId(selectedEntityId: string | undefined) {
        this.selectedEntityId = selectedEntityId;
    }

    setIsOpenEditor(isOpenEditor: boolean) {
        this.isOpenEditor = isOpenEditor;
    }

    setSaved(saved: boolean) {
      this.saved = saved;
    }
}
