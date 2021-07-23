import {useMasterDetailStore} from "./MasterDetailContext";

export function useChangeConfirm() {
  const masterDetailStore = useMasterDetailStore();

  return {
    modify: () => masterDetailStore.setSaved(false),
    save: () => masterDetailStore.setSaved(true)
  }
}