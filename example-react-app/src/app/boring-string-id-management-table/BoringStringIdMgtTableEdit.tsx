import React, { useContext } from "react";
import { Form, Alert, Button, Card } from "antd";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { FormattedMessage } from "react-intl";
import { useMetadata, ScreensContext } from "@haulmont/jmix-react-core";
import {
  createAntdFormValidationMessages,
  RetryDialog,
  Field,
  MultilineText,
  Spinner,
  useEntityEditor,
  MultiScreenContext
} from "@haulmont/jmix-react-ui";
import { gql } from "@apollo/client";
import "../../app/App.css";

const ENTITY_NAME = "scr_BoringStringIdTestEntity";
const INPUT_NAME = "boringStringIdTestEntity";
const ROUTING_PATH = "/boringStringIdManagementTable";

const LOAD_SCR_BORINGSTRINGIDTESTENTITY = gql`
  query scr_BoringStringIdTestEntityById($id: String!, $loadItem: Boolean!) {
    scr_BoringStringIdTestEntityById(id: $id) @include(if: $loadItem) {
      id
      _instanceName
      description
    }
  }
`;

const UPSERT_SCR_BORINGSTRINGIDTESTENTITY = gql`
  mutation Upsert_scr_BoringStringIdTestEntity(
    $boringStringIdTestEntity: inp_scr_BoringStringIdTestEntity!
  ) {
    upsert_scr_BoringStringIdTestEntity(
      boringStringIdTestEntity: $boringStringIdTestEntity
    ) {
      id
    }
  }
`;

const BoringStringIdMgtTableEdit = observer(() => {
  const multiScreen = useContext(MultiScreenContext);
  const screens = useContext(ScreensContext);
  const metadata = useMetadata();

  const {
    load,
    loadQueryResult: { loading: queryLoading, error: queryError },
    upsertMutationResult: { loading: upsertLoading },
    store,
    form,
    intl,
    handleFinish,
    handleFinishFailed,
    handleCancelBtnClick
  } = useEntityEditor({
    loadQuery: LOAD_SCR_BORINGSTRINGIDTESTENTITY,
    upsertMutation: UPSERT_SCR_BORINGSTRINGIDTESTENTITY,
    entityId: multiScreen?.params?.entityId,
    queryName: "scr_BoringStringIdTestEntityById",
    entityName: ENTITY_NAME,
    inputName: INPUT_NAME,
    routingPath: ROUTING_PATH,
    screens,
    multiScreen
  });

  if (queryLoading || metadata == null) {
    return <Spinner />;
  }

  if (queryError != null) {
    console.error(queryError);
    return <RetryDialog onRetry={load} />;
  }

  return (
    <Card className="narrow-layout">
      <Form
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        layout="vertical"
        form={form}
        validateMessages={createAntdFormValidationMessages(intl)}
      >
        <Field
          entityName={ENTITY_NAME}
          propertyName="description"
          formItemProps={{
            style: { marginBottom: "12px" }
          }}
        />

        {store.globalErrors.length > 0 && (
          <Alert
            message={<MultilineText lines={toJS(store.globalErrors)} />}
            type="error"
            style={{ marginBottom: "24px" }}
          />
        )}

        <Form.Item style={{ textAlign: "center" }}>
          <Button htmlType="button" onClick={handleCancelBtnClick}>
            <FormattedMessage id="common.cancel" />
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={upsertLoading}
            style={{ marginLeft: "8px" }}
          >
            <FormattedMessage id="common.submit" />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});

export default BoringStringIdMgtTableEdit;
