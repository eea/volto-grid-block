import React, { useState } from 'react';
import loadable from '@loadable/component';
import { Checkbox, Grid } from 'semantic-ui-react';
import cx from 'classnames';

import '@eeacms/volto-grid-block/less/color-picker.less';

const ReactColor = loadable.lib(() => import('react-color'));

const ColorPickerWidget = (props) => {
  const data = props.value || {};

  const handleChangeComplete = (color) => {
    props.onChange(props.id, { ...data, color: color.hex });
  };

  return (
    <div
      id={`default-${props.id}`}
      className={cx('inline field color-picker', data.active ? 'active' : '')}
    >
      <Grid>
        <Grid.Row stretched>
          <Grid.Column width={8}>
            <div className="wrapper">
              <p style={{ fontWeight: '500' }}>{props.title}</p>
            </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <div className="wrapper">
              <Checkbox
                label={data.active ? 'ON' : 'OFF'}
                toggle
                onChange={(event, newData) => {
                  props.onChange(props.id, {
                    ...data,
                    active: newData.checked,
                  });
                }}
                checked={data.active}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
        {data.active ? (
          <>
            <Grid.Column width="12">
              <Checkbox
                className="pt-1 pb-1"
                label="Transparent"
                toggle
                onChange={(event, newData) => {
                  props.onChange(props.id, {
                    ...data,
                    transparent: newData.checked,
                    color: newData.checked ? 'transparent' : '#000000',
                  });
                }}
                checked={data.transparent}
              />
            </Grid.Column>
            {data.color !== 'transparent' ? (
              <Grid.Column width="12">
                <ReactColor>
                  {({ CompactPicker }) => {
                    return (
                      <CompactPicker
                        className="color-picker"
                        color={data.color || '#000'}
                        onChangeComplete={handleChangeComplete}
                      ></CompactPicker>
                    );
                  }}
                </ReactColor>
              </Grid.Column>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
      </Grid>
    </div>
  );
};

export default ColorPickerWidget;
