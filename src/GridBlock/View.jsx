import React from 'react';
import { RenderBlocks } from '@eeacms/volto-grid-block/components';
import {
  getColumns,
  getClasses,
  getStyle,
} from '@eeacms/volto-grid-block/helpers';
import { numberToWord } from '@eeacms/volto-grid-block/grid';
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
      >
        <Grid.Row
          className={cx(
            'grid-row',
            getClasses(
              data.row_class_name,
              data.row_ui_container || false,
              false,
            ),
          )}
          style={getStyle({
            style: data.row_css?.style,
            margin: data.row_margin,
            padding: data.row_padding,
            backgroundColor: data.row_background_color?.active
              ? data.row_background_color.color
              : null,
            textColor: null,
            textAlign: null,
            justifyContent: data.row_justify_content,
          })}
          verticalAlign={data.row_vertical_align}
        >
          {columnList.map(([columnId, column], index) => (
            <Grid.Column
              className={cx(
                'grid-column',
                `${numberToWord[column.column_layout.small]} wide small`,
                getClasses(
                  column.column_class_name,
                  column.column_ui_container || false,
                  false,
                ),
              )}
              textAlign={column.column_text_align}
              style={getStyle({
                style: column.column_css?.style,
                margin: column.column_margin,
                padding: column.column_padding,
                backgroundColor: null,
                textColor: column.column_text_color?.active
                  ? column.column_text_color.color
                  : null,
              })}
              key={columnId}
              mobile={column.column_layout.mobile}
              tablet={column.column_layout.tablet}
              computer={column.column_layout.computer}
              largeScreen={column.column_layout.largeScreen}
              widescreen={column.column_layout.widescreen}
            >
              <div
                className={cx('grid-column-wrapper')}
                style={getStyle({
                  style: {},
                  margin: null,
                  padding: null,
                  backgroundColor: column.column_background_color?.active
                    ? column.column_background_color.color
                    : null,
                  textColor: null,
                })}
              >
                <RenderBlocks {...props} metadata={metadata} content={column} />
              </div>
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default View;
