import React, { useCallback, useContext } from "react";
import { observer } from "mobx-react";
import {
  MayHaveId,
  MayHaveInstanceName,
  ScreensContext,
  toIdString,
  useMetadata
} from "@haulmont/jmix-react-core";
import {Button} from "antd";
import './CompositionFields.less';
import {FormattedMessage, IntlShape, useIntl} from "react-intl";
import {PlusOutlined} from "@ant-design/icons";
import {openEntityListScreen} from "../../util/screen";
import {antFormToGraphQL} from "../../formatters/antFormToGraphQL";

export interface CompositionO2MFieldProps {
  value?: MayHaveId[];
  onChange?: (value?: this['value']) => void;
  entityName: string;
  reverseAttrName: string;
}

export const CompositionO2MField = observer((props: CompositionO2MFieldProps) => {
  const {value, entityName, onChange, reverseAttrName} = props;

  const metadata = useMetadata();
  const screens = useContext(ScreensContext);

  const entityList = value?.map(item => antFormToGraphQL(item, entityName, metadata)) ?? [];

  const handleClick = useCallback(() => {
    openEntityListScreen({
      entityName,
      entityList,
      screens,
      onEntityListChange: onChange, // TODO decouple from ant
      reverseAttrName,
    });
  }, [entityName, value, screens, onChange]);

  return (
    <Button type='link'
            onClick={handleClick}
            className='jmix-composition-field-upsert-btn'
    >
      <BtnTitle value={value} />
    </Button>
  );
});

interface BtnTitleProps {
  value?: MayHaveId[];
}

const BtnTitle = ({value}: BtnTitleProps) => {
  const intl = useIntl();

  if (value == null || value.length === 0) {
    return (
      <span>
        <PlusOutlined />
        <FormattedMessage id='cubaReact.nestedEntityField.addEntities' />
      </span>
    );
  }

  return (
    <>
      {constructTitle(value, intl)}
    </>
  );
};

function constructTitle(entityList: MayHaveId[], intl: IntlShape): string {
  let title = '';

  if (entityList.length > 0) {
    title += getDisplayedName(entityList[0], intl);
  }
  if (entityList.length > 1) {
    title += ', ';
    title += getDisplayedName(entityList[1], intl);
  }
  if (entityList.length > 2) {
    title += intl.formatMessage(
      {id: 'cubaReact.nestedEntityField.andXMore'},
      {quantity: entityList.length - 2}
    );
  }

  return title;
}

function getDisplayedName(entity: MayHaveId & MayHaveInstanceName, intl: IntlShape): string {
  if (entity._instanceName != null) {
    return entity._instanceName;
  }

  if (entity.id != null) {
    return toIdString(entity.id);
  }

  return intl.formatMessage({id: 'common.unsavedEntity'});
}
