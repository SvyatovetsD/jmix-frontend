import {ListQueryVars, HasId} from "@haulmont/jmix-react-core";
import {useCallback} from "react";
import { IntlShape } from "react-intl";
import {useEntityList, EntityListHookOptions, EntityListHookResult} from "../../crud/list/useEntityList";
import { useMasterDetailStore } from "./MasterDetailContext";
import {modals} from "../modals";

function showConfirmDialog(
  onConfirm: () => void,
  intl: IntlShape,
  messageId: string,
) {
  modals.open({
    content: intl.formatMessage({id: messageId}),
    okText: intl.formatMessage({id: "common.ok"}),
    cancelText: intl.formatMessage({id: "common.cancel"}),
    onOk: onConfirm,
  });
}

export interface MasterDetailListHookOptions<TEntity, TData, TQueryVars, TMutationVars>
extends EntityListHookOptions<TEntity, TData, TQueryVars, TMutationVars> {}

export interface MasterDetailListHookResult<TEntity, TData, TQueryVars, TMutationVars>
extends EntityListHookResult<TEntity, TData, TQueryVars, TMutationVars> {}

export function useMasterDetailList<
  TEntity = unknown,
  TData extends Record<string, any> = Record<string, any>,
  TQueryVars extends ListQueryVars = ListQueryVars,
  TMutationVars extends HasId = HasId
>(
  options: MasterDetailListHookOptions<TEntity, TData, TQueryVars, TMutationVars>
): MasterDetailListHookResult<TEntity, TData, TQueryVars, TMutationVars> {
  const entityListData = useEntityList(options);

  const {intl} = entityListData;

  const masterDetailStore = useMasterDetailStore();

  type EntityListHookResultType = EntityListHookResult<TEntity, TData, TQueryVars, TMutationVars>;

  const handleCreateBtnClick: EntityListHookResultType['handleCreateBtnClick'] = useCallback(
    () => {
      if (masterDetailStore.selectedEntityId !== undefined) {
        showConfirmDialog(
          () => {
            masterDetailStore.setIsOpenEditor(true);
            masterDetailStore.setSelectedEntityId(undefined);
          },
          intl,
          "masterDetail.create.ifEntitySelected"
        );
      } else {
        masterDetailStore.setIsOpenEditor(true);
        masterDetailStore.setSelectedEntityId(undefined);
      }
    },
    [intl, masterDetailStore]
  );

  const handleSelectionChange: EntityListHookResultType['handleSelectionChange'] = useCallback(
    (selectedEntityIds) => {
      // tslint:disable-next-line:no-console
      console.log('handleSelectionChange')

      // Где-то тут надо проверять, сохранено ли в редакторе или нет
      // Если сохранено, то менять экран
      // Если не сохранено, то отменять выполнение
      if(selectedEntityIds.length === 0) {
        // tslint:disable-next-line:no-console
        console.log('if(selectedEntityIds.length === 0) {')
        masterDetailStore.setIsOpenEditor(false);
        masterDetailStore.setSelectedEntityId(undefined);
      }

      if (masterDetailStore.saved) {
        // tslint:disable-next-line:no-console
        console.log('if saved')
        masterDetailStore.setIsOpenEditor(true);
        masterDetailStore.setSelectedEntityId(selectedEntityIds[0]);
      } else {
        const leave = confirm('do you want to leave without saving your changes?');
        // tslint:disable-next-line:no-console
        console.log('if !masterDetailStore.saved && leave');

        if (leave) {
          masterDetailStore.setSaved(true);
          masterDetailStore.setIsOpenEditor(true);
          masterDetailStore.setSelectedEntityId(selectedEntityIds[0]);
        } else {
          return;
        }
      }

      // Если не сохранено, то вот это не надо выполнять плиз ок
      entityListData.handleSelectionChange(selectedEntityIds);
    },
    [intl, masterDetailStore]
  );
  
  return {
    ...entityListData,
    handleCreateBtnClick,
    handleSelectionChange,
  };
}
