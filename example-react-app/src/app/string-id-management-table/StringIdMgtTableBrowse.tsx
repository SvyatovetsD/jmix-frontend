import React, { useContext } from "react";
import { observer } from "mobx-react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
  EntityPermAccessControl,
  ScreensContext
} from "@haulmont/jmix-react-core";
import { DataTable, RetryDialog, useEntityList } from "@haulmont/jmix-react-ui";
import { StringIdTestEntity } from "../../jmix/entities/scr_StringIdTestEntity";
import { FormattedMessage } from "react-intl";
import { gql } from "@apollo/client";

const ENTITY_NAME = "scr_StringIdTestEntity";
const ROUTING_PATH = "/stringIdMgtTableManagement";

const SCR_STRINGIDTESTENTITY_LIST = gql`
  query scr_StringIdTestEntityList(
    $limit: Int
    $offset: Int
    $orderBy: inp_scr_StringIdTestEntityOrderBy
    $filter: [inp_scr_StringIdTestEntityFilterCondition]
  ) {
    scr_StringIdTestEntityCount
    scr_StringIdTestEntityList(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      id
      _instanceName
      identifier
      description
      productCode
    }
  }
`;

const DELETE_SCR_STRINGIDTESTENTITY = gql`
  mutation Delete_scr_StringIdTestEntity($id: String!) {
    delete_scr_StringIdTestEntity(id: $id)
  }
`;

const StringIdMgtTableBrowse = observer(() => {
  const screens = useContext(ScreensContext);

  const {
    loadItems,
    listQueryResult: { loading, error, data },
    handleRowSelectionChange,
    handleFilterChange,
    handleSortOrderChange,
    handlePaginationChange,
    deleteSelectedRow,
    handleCreateBtnClick,
    handleEditBtnClick,
    store
  } = useEntityList<StringIdTestEntity>({
    listQuery: SCR_STRINGIDTESTENTITY_LIST,
    deleteMutation: DELETE_SCR_STRINGIDTESTENTITY,
    screens,
    currentScreen: screens.currentScreen,
    entityName: ENTITY_NAME,
    routingPath: ROUTING_PATH
  });

  if (error != null) {
    console.error(error);
    return <RetryDialog onRetry={loadItems} />;
  }

  const buttons = [
    <EntityPermAccessControl
      entityName={ENTITY_NAME}
      operation="create"
      key="create"
    >
      <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateBtnClick}
      >
        <span>
          <FormattedMessage id="common.create" />
        </span>
      </Button>
    </EntityPermAccessControl>,
    <EntityPermAccessControl
      entityName={ENTITY_NAME}
      operation="update"
      key="update"
    >
      <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        disabled={store.selectedRowKey == null}
        type="default"
        onClick={handleEditBtnClick.bind(null, store.selectedRowKey)}
      >
        <FormattedMessage id="common.edit" />
      </Button>
    </EntityPermAccessControl>,
    <EntityPermAccessControl
      entityName={ENTITY_NAME}
      operation="delete"
      key="delete"
    >
      <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        disabled={store.selectedRowKey == null}
        onClick={deleteSelectedRow.bind(null, data?.scr_StringIdTestEntityList)}
        key="remove"
        type="default"
      >
        <FormattedMessage id="common.remove" />
      </Button>
    </EntityPermAccessControl>
  ];

  return (
    <DataTable
      data={data}
      current={store.pagination?.current}
      pageSize={store.pagination?.pageSize}
      entityName={ENTITY_NAME}
      loading={loading}
      error={error}
      columnDefinitions={["description", "productCode"]}
      onRowSelectionChange={handleRowSelectionChange}
      onFilterChange={handleFilterChange}
      onSortOrderChange={handleSortOrderChange}
      onPaginationChange={handlePaginationChange}
      hideSelectionColumn={true}
      buttons={buttons}
    />
  );
});

export default StringIdMgtTableBrowse;
