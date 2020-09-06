import React from 'react';
import { TextareaWidget } from '@plone/volto/components';
import { isObject } from 'lodash';

const JsonTextWidget = (props) => {
  const getValue = (value) => {
    let parsedValue = value;
    if (isObject(value)) {
      try {
        parsedValue = JSON.stringify(value);
      } catch {}
    }
    return parsedValue;
  };
  return (
    <div className="json-text-widget">
      <TextareaWidget
        id={props.id}
        title={props.title}
        onChange={(field, data) => {
          props.onChange(props.id, data);
        }}
        value={getValue(props.value)}
      />
    </div>
  );
};

export default JsonTextWidget;
