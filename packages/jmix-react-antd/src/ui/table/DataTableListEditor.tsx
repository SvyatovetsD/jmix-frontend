import * as React from "react";
import { action, observable, computed, makeObservable } from "mobx";
import { PlusOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { Input, Select, Tag, Tooltip, InputNumber } from "antd";
import {observer} from "mobx-react";
import {Dayjs} from 'dayjs';
import {CaptionValuePair} from "./DataTableCustomFilter";
import {ReactNode, Ref} from 'react';
import {FormattedMessage} from 'react-intl';
import {IntegerInput} from '../form/IntegerInput';
import {DoubleInput} from '../form/DoubleInput';
import {LongInput} from '../form/LongInput';
import {BigDecimalInput} from '../form/BigDecimalInput';
import {CharInput} from "../form/CharInput";
import {
  PropertyType,
  assertNever,
  applyDataTransferFormat,
  applyDisplayFormat,
  MetaPropertyInfo,
} from '@haulmont/jmix-react-core';
import {InputNumberProps} from 'antd/es/input-number';
import {LabeledValue} from 'antd/es/select';
import styles from './DataTableFilter.module.less';
import {DatePicker} from "../DatePicker";
import {TimePicker} from "../TimePicker";
import classNames from "classnames";

interface DataTableListEditorProps {
  onChange: (items: string[] | number []) => void,
  id: string,
  propertyInfo: MetaPropertyInfo,
  nestedEntityOptions: CaptionValuePair[]
}

export enum DataTableListEditorType {
  TEXT = 'text',
  CHAR = 'char',
  INTEGER = 'integer',
  DOUBLE = 'double',
  LONG = 'long',
  BIG_DECIMAL = 'bigDecimal',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  SELECT = 'select',
}

class DataTableListEditorComponent extends React.Component<DataTableListEditorProps> {
  inputVisible = false;
  inputModel: CaptionValuePair = {
    caption: '',
    value: undefined,
  };
  items: CaptionValuePair[] = [];
  availableOptions: CaptionValuePair[] = [];

  constructor(props: DataTableListEditorProps) {
    super(props);

    makeObservable(this, {
      inputVisible: observable,
      inputModel: observable,
      items: observable,
      availableOptions: observable,
      type: computed,
      handleClose: action,
      onTextInputChange: action,
      onInputBlurOrEnter: action,
      onDatePickerChange: action,
      onDateTimePickerChange: action,
      onTimePickerChange: action,
      onTimePickerOpenChange: action,
      onSelect: action,
      handleInputChange: action,
      handleInputNumberChange: action,
      handleInputConfirm: action,
      showInput: action,
      input: computed,
      selectFieldOptions: computed
    });
  }

  get type(): DataTableListEditorType {
    if (this.props.propertyInfo.attributeType === 'ASSOCIATION' || this.props.propertyInfo.attributeType === 'COMPOSITION') {
      return DataTableListEditorType.SELECT;
    } else {
      switch(this.props.propertyInfo.type as PropertyType) {
        case 'String':
        case 'UUID':
          return DataTableListEditorType.TEXT;
        case 'Character':
          return DataTableListEditorType.CHAR;
        case 'Integer':
          return DataTableListEditorType.INTEGER;
        case 'Double':
          return DataTableListEditorType.DOUBLE;
        case 'Long':
          return DataTableListEditorType.LONG;
        case 'BigDecimal':
          return DataTableListEditorType.BIG_DECIMAL;
        case 'Date':
        case 'LocalDate':
          return DataTableListEditorType.DATE;
        case 'Time':
        case 'LocalTime':
        case 'OffsetTime':
          return DataTableListEditorType.TIME;
        case 'DateTime':
        case 'LocalDateTime':
        case 'OffsetDateTime':
          return DataTableListEditorType.DATETIME;
        default:
          throw new Error(`Unexpected property type ${this.props.propertyInfo.type}`);
      }
    }
  }

  componentDidMount(): void {
    this.availableOptions = [ ...this.props.nestedEntityOptions ];
  }

  handleClose = (item: CaptionValuePair): void => {
    this.items = this.items.filter(savedItem => savedItem !== item);
    if (this.type === DataTableListEditorType.SELECT) {
      this.availableOptions = [ ...this.availableOptions, item ];
    }
    this.props.onChange(this.items.map((savedItem) => savedItem.value) as string[] | number[]);
  };

  onTextInputChange = (event: any): void => {
    this.handleInputChange(event.target.value);
  };

  onInputBlurOrEnter = (event: any): void => {
    event.preventDefault();
    this.handleInputConfirm();
  };

  onDatePickerChange = (date: Dayjs | null): void => {
    if (date != null) {
      const normalizedDate = date.millisecond(0);
      this.handleInputChange(applyDataTransferFormat(normalizedDate, this.props.propertyInfo.type as PropertyType));
      this.handleInputConfirm();
    }
  };

  onDateTimePickerChange = (date: Dayjs | null): void => {
    if (date != null) {
      const {propertyInfo} = this.props;
      const propertyType = propertyInfo.type as PropertyType;
      const normalizedDate = date.millisecond(0);
      this.handleInputChange(
        applyDataTransferFormat(normalizedDate, propertyType),
        applyDisplayFormat(normalizedDate, propertyType)
      );
      this.handleInputConfirm();
    }
  };

  onTimePickerChange = (time: Dayjs | null, _timeString: string): void => {
    if (time != null) {
      const normalizedTime = time.millisecond(0);
      const timeParam = applyDataTransferFormat(normalizedTime, this.props.propertyInfo.type as PropertyType);
      this.handleInputChange(timeParam);
    }
  };

  onTimePickerOpenChange = (open: boolean): void => {
    if (!open && this.inputModel) {
      this.handleInputConfirm();
    }
  };

  onSelect = (value: string | number | LabeledValue): void => {
    const caption: string = this.props.nestedEntityOptions
      .find((option) => option.value === value)!
      .caption;
    this.handleInputChange(value as string, caption);
    this.availableOptions = this.availableOptions.filter((option) => {
      return option.value !== value;
    });
    this.handleInputConfirm();
  };

  handleInputChange = (value: string, caption: string = value): void => {
    this.inputModel.value = value;
    this.inputModel.caption = caption;
  };

  handleInputNumberChange = (value: string | number | null | undefined): void => {
    if (value != null) {
      this.inputModel.value = value;
      this.inputModel.caption = String(value);
    }
  };

  handleInputConfirm = (): void => {
    if (this.inputModel
        && this.inputModel.value != null
        && this.items.findIndex((item => item.value === this.inputModel.value)) === -1) {
      this.items = [...this.items, { ...this.inputModel }];
      this.inputModel.value = undefined;
      this.inputModel.caption = '';
      this.inputVisible = false;
      this.props.onChange(this.items.map((item) => item.value) as string[] | number[]);
    }
  };

  showInput = (): void => {
    this.inputVisible = true;
  };

  render() {
    return (
      <div className={styles.filterList}>
        {
          this.items.map((item: CaptionValuePair) => {
            return item.value != null
              ? <ListItemTag item={item} onClose={this.handleClose} key={item.value}/>
              : null;
          })
        }
        {this.inputVisible && (
          <Form.Item className={classNames(
            styles.filterListInput,
            styles.filterControl
          )}>
            {this.input}
          </Form.Item>
        )}
        {!this.inputVisible && (
          <Tag onClick={this.showInput}
             color='blue'
             className={styles.filterListNew}
          >
            <PlusOutlined />
            &nbsp;
            <FormattedMessage id='jmix.dataTable.listEditor.addItem'/>
          </Tag>
        )}
      </div>
    );
  }

  trapFocus = (input: any): void => {
    if (input) {
      input.focus();
    }
  };

  get input(): ReactNode {
    switch (this.type) {
      case DataTableListEditorType.TEXT:
        return (
          <div>
            <Input
              ref={this.trapFocus}
              type='text'
              size='small'
              v-model={this.inputModel.value}
              onChange={this.onTextInputChange}
              onBlur={this.onInputBlurOrEnter}
              onPressEnter={this.onInputBlurOrEnter}
            />
          </div>
        );
      case DataTableListEditorType.CHAR:
        return (
          <div>
            <CharInput
              ref={this.trapFocus}
              type='text'
              size='small'
              v-model={this.inputModel.value}
              onChange={this.onTextInputChange}
              onBlur={this.onInputBlurOrEnter}
              onPressEnter={this.onInputBlurOrEnter}
            />
            </div>
          );
      case DataTableListEditorType.INTEGER:
        return (
          <div>
            <IntegerInput {...this.getInputNumberProps()} />
          </div>
        );
      case DataTableListEditorType.DOUBLE:
        return (
          <div>
            <DoubleInput {...this.getInputNumberProps()} />
          </div>
        );
      case DataTableListEditorType.LONG:
        return (
          <div>
            <LongInput {...this.getInputNumberProps()} />
          </div>
        );
      case DataTableListEditorType.BIG_DECIMAL:
        return (
          <div>
            <BigDecimalInput {...this.getInputNumberProps()} />
          </div>
        );
      case DataTableListEditorType.DATE:
        return (
          <div>
            <DatePicker onChange={this.onDatePickerChange}/>
          </div>
        );
      case DataTableListEditorType.TIME:
        return (
          <div>
            <TimePicker
                  onChange={this.onTimePickerChange}
                  onOpenChange={this.onTimePickerOpenChange}
            />
          </div>
        );
      case DataTableListEditorType.DATETIME:
        return (
          <div>
            <DatePicker showTime={true}
                        onChange={this.onDateTimePickerChange}
            />
          </div>
        );
      case DataTableListEditorType.SELECT:
        return (
          <div>
            <Select dropdownMatchSelectWidth={false}
                    dropdownClassName={`cuba-value-dropdown-${this.props.id}`}
                    className={styles.filterSelect}
                    onSelect={this.onSelect}>
              {this.selectFieldOptions}
            </Select>
          </div>
        );
      default:
        return assertNever('ListEditorType', this.type);
    }
  }

  getInputNumberProps(): InputNumberProps & {ref: Ref<typeof InputNumber>} {
    return {
      ref: this.trapFocus,
      type: 'text',
      size: 'small',
      value: this.inputModel.value as number | undefined,
      onChange: this.handleInputNumberChange,
      onBlur: this.onInputBlurOrEnter,
      onPressEnter: this.onInputBlurOrEnter,
    };
  }

  get selectFieldOptions(): ReactNode {
    return this.availableOptions
      .filter(option => option.value != null)
      .map((option) => {
      return (
        <Select.Option title={option.caption}
                       value={option.value!}
                       key={option.value}
                       className={`cuba-filter-value-${option.value}`}
        >
          {option.caption}
        </Select.Option>
      );
    })
  }
}

interface ListItemTagProps {
  item: CaptionValuePair;
  onClose: (item: CaptionValuePair) => void;
}

function ListItemTag(props: ListItemTagProps) {
  const { item, onClose } = props;
  const isLong = item.caption.length > 20;
  const tag = (
    <Tag closable={true}
         onClose={() => onClose(item)}>
      {isLong ? `${item.caption.substr(0, 20)}...` : item.caption}
    </Tag>
  );

  return isLong ? (
    <Tooltip title={item.caption}>
      {tag}
    </Tooltip>
  ) : (
    tag
  );
}

export const DataTableListEditor = observer(DataTableListEditorComponent);
