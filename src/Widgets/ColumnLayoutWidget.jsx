import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { omit, without } from 'lodash';
import move from 'lodash-move';
import { Grid, Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { DragDropList } from '@eeacms/volto-blocks-form/components';
import { emptyBlocksForm } from '@eeacms/volto-blocks-form/helpers';
import { getColumns } from '@eeacms/volto-grid-block/helpers';
import { even_columns } from '@eeacms/volto-grid-block/grid';
import cx from 'classnames';

import { ColumnLayoutSchema } from './schema';

import tuneSVG from '@plone/volto/icons/tune.svg';
import triangleSVG from '@plone/volto/icons/triangle.svg';
import dragSVG from '@plone/volto/icons/drag.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import plusSVG from '@plone/volto/icons/circle-plus.svg';

import '@eeacms/volto-grid-block/less/column-layout.less';

export function moveColumn(formData, source, destination) {
  return {
    ...formData,
    blocks_layout: {
      items: move(formData.blocks_layout?.items, source, destination),
    },
  };
}

const empty = () => {
  return [uuid(), emptyBlocksForm()];
};

const blocksWithColumnLayout = (blocks, blocks_layout) => {
  const { items = [] } = blocks_layout;
  const newBlocks = { ...blocks };
  items.forEach((columnId, index) => {
    newBlocks[columnId].column_layout = {
      mobile: 12,
      tablet: even_columns[items.length - 1][index],
      computer: even_columns[items.length - 1][index],
      largeScreen: even_columns[items.length - 1][index],
      widescreen: even_columns[items.length - 1][index],
    };
  });
  return newBlocks;
};

const ColumnLayoutWidget = (props) => {
  const [activeColumn, setActiveColumn] = useState(null);
  const { value = {}, id, onChange, maxSize = 12 } = props;
  const columnsList = getColumns(value);

  const showAdd = value.blocks_layout?.items?.length < maxSize;

  return (
    <div id={`default-${props.id}`} className="inline field column-layout">
      <Grid>
        <Grid.Row stretched>
          <Grid.Column width={12}>
            <div className="wrapper">
              <div className="columns-header">
                <p style={{ fontWeight: '500' }}>{props.title}</p>
                {showAdd ? (
                  <Button
                    icon
                    basic
                    title="Add column"
                    onClick={() => {
                      const [newId, newData] = empty(columnsList);
                      const newBlocks = {
                        ...value.blocks,
                        [newId]: newData,
                      };
                      const newBlocksLayout = {
                        ...value.blocks_layout,
                        items: [...value.blocks_layout?.items, newId],
                      };
                      onChange(id, {
                        ...value,
                        blocks: blocksWithColumnLayout(
                          newBlocks,
                          newBlocksLayout,
                        ),
                        blocks_layout: newBlocksLayout,
                      });
                    }}
                  >
                    <Icon name={plusSVG} size="22px" />
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={12} className="columns-area">
            <DragDropList
              childList={columnsList}
              onMoveItem={(result) => {
                const { source, destination } = result;
                if (!destination) {
                  return;
                }
                const newFormData = moveColumn(
                  value,
                  source.index,
                  destination.index,
                );
                onChange(id, newFormData);
                return true;
              }}
            >
              {(dragProps) => {
                const { childId, index, draginfo } = dragProps;
                return (
                  <div ref={draginfo.innerRef} {...draginfo.draggableProps}>
                    <div className="column-wrapper">
                      <div
                        style={{
                          visibility: 'visible',
                          display: 'inline-flex',
                        }}
                        {...draginfo.dragHandleProps}
                        className="drag handle"
                      >
                        <Icon name={dragSVG} size="22px" />
                      </div>
                      <div className="column-area">
                        <div className="label">Column {index + 1}</div>
                        <div>
                          <Button
                            icon
                            basic
                            title="Edit column"
                            onClick={() => {
                              onChange('Activate column', childId);
                            }}
                          >
                            <Icon name={tuneSVG} size="22px" />
                          </Button>
                          <Button
                            icon
                            basic
                            title="Edit column layout"
                            onClick={() => {
                              setActiveColumn(
                                activeColumn === childId ? null : childId,
                              );
                            }}
                          >
                            <Icon name={triangleSVG} size="22px" />
                          </Button>
                          {value.blocks_layout?.items?.length > 1 ? (
                            <Button
                              icon
                              basic
                              title="Remove column"
                              onClick={() => {
                                const newBlocks = omit({ ...value.blocks }, [
                                  childId,
                                ]);
                                const newBlocksLayout = {
                                  ...value.blocks_layout,
                                  items: without(
                                    [...value.blocks_layout?.items],
                                    childId,
                                  ),
                                };
                                const newFormData = {
                                  ...value,
                                  blocks: blocksWithColumnLayout(
                                    newBlocks,
                                    newBlocksLayout,
                                  ),
                                  blocks_layout: newBlocksLayout,
                                };
                                onChange(id, newFormData);
                              }}
                            >
                              <Icon name={trashSVG} size="22px" />
                            </Button>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={cx(
                        'column-layout-form',
                        activeColumn === childId ? 'show' : '',
                      )}
                    >
                      <InlineForm
                        schema={ColumnLayoutSchema()}
                        title="Column layout"
                        onChangeField={(id, width) => {
                          const newBlocks = { ...value.blocks };
                          newBlocks[childId].column_layout[id] = width;
                          const newFormData = {
                            ...value,
                            blocks: newBlocks,
                          };
                          onChange(id, newFormData);
                        }}
                        formData={value.blocks[childId]?.column_layout}
                      />
                    </div>
                  </div>
                );
              }}
            </DragDropList>
            <Button
              style={{ marginBottom: '1em' }}
              title="This action will remove all the data from the columns!"
              onClick={() => {
                if (
                  /* eslint-disable-next-line */
                  window.confirm(
                    'Are you sure you want to select a template?\nThis action will remove all the data from the columns!',
                  )
                ) {
                  onChange(id, undefined);
                }
              }}
            >
              Apply columns template
            </Button>
            <p className="info">
              Adding/deleting columns will <b>reset</b> the columns layout.{' '}
              <br />
              Using a columns template will <b>reset</b> all the data from the
              columns.
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default ColumnLayoutWidget;
