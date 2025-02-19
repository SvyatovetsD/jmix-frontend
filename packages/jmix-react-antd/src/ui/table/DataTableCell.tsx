import {Checkbox} from 'antd';
import React, {ReactNode} from 'react';
import {SerializedEntityProps} from '@haulmont/jmix-rest';
import { MainStoreInjected, MainStore, getEnumCaption, useMetadata, MetaPropertyInfo, PropertyType } from '@haulmont/jmix-react-core';
import { toDisplayValue } from '@haulmont/jmix-react-web';

type DataTableCellProps<EntityType> = MainStoreInjected & {
  text: any,
  propertyInfo: MetaPropertyInfo,
  mainStore: MainStore,
  record?: EntityType
}

export const DataTableCell = <EntityType extends unknown>(props: DataTableCellProps<EntityType>): ReactNode => {

  const {type, attributeType, cardinality, name} = props.propertyInfo;

  if ((type as PropertyType) === 'Boolean') {
    return (
      <Checkbox
        checked={props.text as boolean}
        disabled={true}
      />
    );
  }

  if (attributeType === 'ENUM') {
    return (
      <EnumCell text={props.text} propertyInfo={props.propertyInfo} mainStore={props.mainStore!}/>
    );
  }

  if (attributeType === 'ASSOCIATION' && cardinality === 'MANY_TO_MANY') {
    const associatedEntities = props.record?.[name as keyof EntityType] as unknown as SerializedEntityProps[];
    const displayValue = associatedEntities?.map(entity => entity._instanceName).join(', ');
    return (
      <div>{displayValue}</div>
    );
  }

  return (
    <div>{toDisplayValue(props.text, props.propertyInfo)}</div>
  );
};

const EnumCell = <EntityType extends unknown>(props: DataTableCellProps<EntityType>) => {
  const metadata = useMetadata();
  const caption = getEnumCaption(props.text, props.propertyInfo, metadata.enums);
  return <div>{caption ? caption : ''}</div>;
};
