import {useCallback} from "react";
import {action} from "mobx";
import {JmixEntityFilter} from "@haulmont/jmix-react-core";
import {EntityListState} from "../useEntityList";

export function useFilterChangeCallback<TEntity>(
  entityListState: EntityListState<TEntity>
) {
  // TODO: fix
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    action((filter?: JmixEntityFilter[]) => {
      entityListState.filter = filter;
    }),
    [entityListState.filter]
  );
}