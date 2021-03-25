import React, { useContext } from "react";
import { Form, Alert, Button, Card } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { FormattedMessage } from "react-intl";
import {
  createAntdFormValidationMessages,
  createUseAntdForm,
  RetryDialog,
  Field,
  MultilineText,
  Spinner,
  useEntityEditor,
  EntityEditorProps,
  registerEntityEditorScreen
} from "@haulmont/jmix-react-ui";
import { gql } from "@apollo/client";
import { DatatypesTestEntity } from "../../jmix/entities/scr_DatatypesTestEntity";

const ENTITY_NAME = "scr_DatatypesTestEntity";
const UPSERT_INPUT_NAME = "datatypesTestEntity";
const ROUTING_PATH = "/datatypesTestEditor";

const LOAD_SCR_DATATYPESTESTENTITY = gql`
  query scr_DatatypesTestEntityById($id: String = "", $loadItem: Boolean!) {
    scr_DatatypesTestEntityById(id: $id) @include(if: $loadItem) {
      id
      _instanceName
      bigDecimalAttr
      booleanAttr
      dateAttr
      dateTimeAttr
      doubleAttr
      integerAttr
      longAttr
      stringAttr
      timeAttr
      uuidAttr
      localDateTimeAttr
      offsetDateTimeAttr
      localDateAttr
      localTimeAttr
      offsetTimeAttr
      enumAttr
      associationO2Oattr {
        id
        _instanceName
      }
      associationO2Mattr {
        id
        _instanceName
      }
      associationM2Oattr {
        id
        _instanceName
      }
      associationM2Mattr {
        id
        _instanceName
      }
      compositionO2Oattr {
        id
        _instanceName
        name
        quantity
      }
      compositionO2Mattr {
        id
        _instanceName
        name
        quantity
        datatypesTestEntity {
          id
          _instanceName
        }
      }
      intIdentityIdTestEntityAssociationO2OAttr {
        id
        _instanceName
      }
      integerIdTestEntityAssociationM2MAttr {
        id
        _instanceName
      }
      datatypesTestEntity3 {
        id
        _instanceName
      }
      name
    }

    scr_AssociationO2OTestEntityList {
      id
      _instanceName
    }

    scr_AssociationM2OTestEntityList {
      id
      _instanceName
    }

    scr_AssociationM2MTestEntityList {
      id
      _instanceName
    }

    scr_IntIdentityIdTestEntityList {
      id
      _instanceName
    }

    scr_IntegerIdTestEntityList {
      id
      _instanceName
    }

    scr_DatatypesTestEntity3List {
      id
      _instanceName
    }
  }
`;

const UPSERT_SCR_DATATYPESTESTENTITY = gql`
  mutation Upsert_scr_DatatypesTestEntity(
    $datatypesTestEntity: inp_scr_DatatypesTestEntity!
  ) {
    upsert_scr_DatatypesTestEntity(datatypesTestEntity: $datatypesTestEntity) {
      id
    }
  }
`;

const DatatypesTestEditor = observer(
  (props: EntityEditorProps<DatatypesTestEntity>) => {
    const {
      onCommit,
      entityInstance,
      submitBtnCaption = "common.submit"
    } = props;

    const [form] = useForm();

    const {
      relationOptions,
      executeLoadQuery,
      loadQueryResult: { loading: queryLoading, error: queryError },
      upsertMutationResult: { loading: upsertLoading },
      entityEditorState,
      intl,
      handleSubmit,
      handleSubmitFailed,
      handleCancelBtnClick
    } = useEntityEditor<DatatypesTestEntity>({
      loadQuery: LOAD_SCR_DATATYPESTESTENTITY,
      upsertMutation: UPSERT_SCR_DATATYPESTESTENTITY,
      entityName: ENTITY_NAME,
      upsertInputName: UPSERT_INPUT_NAME,
      routingPath: ROUTING_PATH,
      onCommit,
      entityInstance,
      useEntityEditorForm: createUseAntdForm(form)
    });

    if (queryLoading) {
      return <Spinner />;
    }

    if (queryError != null) {
      console.error(queryError);
      return <RetryDialog onRetry={executeLoadQuery} />;
    }

    return (
      <Card className="narrow-layout">
        <Form
          onFinish={handleSubmit}
          onFinishFailed={handleSubmitFailed}
          layout="vertical"
          form={form}
          validateMessages={createAntdFormValidationMessages(intl)}
        >
          <Field
            entityName={ENTITY_NAME}
            propertyName="bigDecimalAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="booleanAttr"
            formItemProps={{
              style: { marginBottom: "12px" },
              valuePropName: "checked"
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="dateAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="dateTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="doubleAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="integerAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="longAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="stringAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="timeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="uuidAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="localDateTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="offsetDateTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="localDateAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="localTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="offsetTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="enumAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="associationO2Oattr"
            associationOptions={relationOptions?.get(
              "scr_AssociationO2OTestEntity"
            )}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="associationM2Oattr"
            associationOptions={relationOptions?.get(
              "scr_AssociationM2OTestEntity"
            )}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="associationM2Mattr"
            associationOptions={relationOptions?.get(
              "scr_AssociationM2MTestEntity"
            )}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="compositionO2Oattr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="compositionO2Mattr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="intIdentityIdTestEntityAssociationO2OAttr"
            associationOptions={relationOptions?.get(
              "scr_IntIdentityIdTestEntity"
            )}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="integerIdTestEntityAssociationM2MAttr"
            associationOptions={relationOptions?.get("scr_IntegerIdTestEntity")}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="datatypesTestEntity3"
            associationOptions={relationOptions?.get(
              "scr_DatatypesTestEntity3"
            )}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={ENTITY_NAME}
            propertyName="name"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          {entityEditorState.globalErrors.length > 0 && (
            <Alert
              message={
                <MultilineText lines={toJS(entityEditorState.globalErrors)} />
              }
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
              <FormattedMessage id={submitBtnCaption} />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
);

registerEntityEditorScreen(
  ENTITY_NAME,
  "datatypesTestEditor",
  <DatatypesTestEditor />
);

export default DatatypesTestEditor;
