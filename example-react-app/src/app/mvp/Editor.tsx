import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Form, Button, Card, Input } from "antd";
import { observer } from "mobx-react";
import { FormattedMessage } from "react-intl";
import { registerEntityEditor } from "@haulmont/jmix-react-ui";

const ENTITY_NAME = "Car";
const ROUTING_PATH = "/mvpScreenEditor";

const SCR__CAR_BY_ID = gql`
  query scr_CarById($id: String, $loadItem: Boolean!) {
    scr_CarById(id: $id) @include(if: $loadItem) {
      id
      _instanceName
      manufacturer
      model
      regNumber
      purchaseDate
      manufactureDate
      wheelOnRight
      carType
      ecoRank
      maxPassengers
      price
      mileage
      garage {
        id
        _instanceName
      }
      technicalCertificate {
        id
        _instanceName
      }

      version
      createdBy
      createdDate
      lastModifiedBy
      lastModifiedDate
    }

    scr_GarageList {
      id
      _instanceName
    }

    scr_TechnicalCertificateList {
      id
      _instanceName
    }
  }
`;

const SCR__CAR_EDIT = gql`
  mutation Upsert_scr_Car($car: inp_scr_Car!) {
    upsert_scr_Car(car: $car) {
      id
    }
  }
`;

const MvpScreenEditor = observer(() => {
  const multiScreen = useMultiScreen();
  const id = multiScreen?.params?.entityId;

  // TODO: id variable name
  const { loading: queryLoading, error: queryError, data } = useQuery(
    SCR__CAR_BY_ID,
    {
      variables: {
        id
      }
    }
  );

  if (queryLoading) {
    return <>'Loading...'</>;
  }

  if (queryError) {
    return <>'Error :('</>;
  }

  const item = data?.["scr_CarById"];

  if (item == null) {
    return <p>No data</p>;
  }

  return (
    <Card className="narrow-layout">
      <Form
        onFinish={() => alert("onFinish")}
        onFinishFailed={() => alert("onFinishFailed")}
        layout="vertical"
      >
        {Object.keys(item).map(attrName => (
          <Form.Item>
            <Input addonBefore={attrName} />
          </Form.Item>
        ))}

        <Form.Item style={{ textAlign: "center" }}>
          <Button htmlType="button" onClick={() => alert("onCancel")}>
            <FormattedMessage id="common.cancel" />
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={false} // TODO
            style={{ marginLeft: "8px" }}
          >
            <FormattedMessage id={"common.submit"} />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});

registerEntityEditor({
  component: MvpScreenEditor,
  caption: "screen.MvpScreenEditor",
  screenId: "MvpScreenEditor",
  entityName: ENTITY_NAME,
  menuOptions: {
    pathPattern: `${ROUTING_PATH}/:entityId?`,
    menuLink: ROUTING_PATH
  }
});

export default MvpScreenEditor;
