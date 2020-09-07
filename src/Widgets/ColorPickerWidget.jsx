import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { CompactPicker } from 'react-color';
import { Checkbox } from 'semantic-ui-react';

const ColorPickerWidget = (props) => {
  const [active, setActive] = useState(false);
  const [transparent, setTransparent] = useState(false);

  const handleChangeComplete = (color) => {
    if (transparent) {
      setTransparent(false);
    }
    props.onChange(props.id, color.hex);
  };

  return (
    <div className="color-picker-widget">
      <div className="display-flex flex-flow-column">
        <div className="color-picker-toolbar">
          <span>{props.title}</span>
          <Checkbox
            label={active ? 'ON' : 'OFF'}
            toggle
            onChange={(event, data) => {
              props.onChange(`${props.id}_active`, data.checked);
              setActive(data.checked);
            }}
            checked={active}
          />
        </div>{' '}
        {active ? (
          <Checkbox
            className="pt-1 pb-1"
            label="Transparent"
            toggle
            onChange={(event, data) => {
              if (props.value && data.checked) {
                props.onChange(props.id, 'transparent');
              } else if (props.value === 'transparent') {
                props.onChange(props.id, '#000000');
              }
              setTransparent(data.checked);
            }}
            checked={transparent}
          />
        ) : (
          ''
        )}
      </div>
      {active ? (
        <CompactPicker
          className="color-picker"
          color={props.value || '#000'}
          onChangeComplete={handleChangeComplete}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
    discodata_query: state.discodata_query,
  })),
)(ColorPickerWidget);
