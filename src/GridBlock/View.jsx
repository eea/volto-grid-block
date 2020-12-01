import React from 'react';
import { RenderBlocks } from '@eeacms/volto-grid-block/components';
import {
  getColumns,
  getClasses,
  getStyle,
} from '@eeacms/volto-grid-block/helpers';
import cx from 'classnames';
import { Grid } from 'semantic-ui-react';

import '@eeacms/volto-grid-block/less/grid-block.less';

const View = (props) => {
  const { data } = props;
  const columnsData = data.data;
  const metadata = props.metadata || props.properties;
  const { grid_size } = data;
  const columnList = getColumns(columnsData);
  return (
    <div className="grid-block-container">
      <Grid
        columns={grid_size}
        className={cx('grid-block', getClasses(data.grid_class_name))}
        style={getStyle({
          style: data.grid_css?.style,
          margin: data.grid_margin,
          padding: data.grid_padding,
          backgroundColor: data.grid_background_color?.active
            ? data.grid_background_color.color
            : null,
          textColor: data.grid_text_color?.active
            ? data.grid_text_color.color
            : null,
        })}
        stackable
      >
        <Grid.Row
          className={cx(
            'grid-row',
            getClasses(data.row_class_name, data.row_ui_container),
          )}
          style={getStyle({
            style: data.row_css?.style,
            margin: data.row_margin,
            padding: data.row_padding,
            backgroundColor: data.row_background_color?.active
              ? data.row_background_color.color
              : null,
            textColor: null,
          })}
        >
          {columnList.map(([columnId, column], index) => (
            <Grid.Column
              className={cx(
                'grid-column',
                getClasses(
                  column.column_class_name,
                  column.column_ui_container,
                ),
              )}
              style={getStyle({
                style: column.column_css?.style,
                margin: column.column_margin,
                padding: column.column_padding,
                backgroundColor: column.column_background_color?.active
                  ? column.column_background_color.color
                  : null,
                textColor: column.column_text_color?.active
                  ? column.column_text_color.color
                  : null,
              })}
              key={columnId}
              {...column.column_layout}
            >
              <RenderBlocks {...props} metadata={metadata} content={column} />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default View;
