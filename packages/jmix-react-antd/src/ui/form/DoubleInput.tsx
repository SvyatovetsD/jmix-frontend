import {InputNumber} from "antd";
import * as React from "react";
import styles from './InputNumber.module.less';
import {forwardRef, Ref} from 'react';
import {InputNumberProps} from 'antd/es/input-number';

export const DoubleInput = forwardRef((props: InputNumberProps, ref: Ref<typeof InputNumber>) => {
  return (
    <InputNumber className={styles.inputNumberField}
                 // @ts-ignore ref is missing in typings, but it does actually work
                 ref={ref}
                 {...props}
    />
  );
});
