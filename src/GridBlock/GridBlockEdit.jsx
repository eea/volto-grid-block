import React, { useState, useEffect } from 'react';
import { BlockChooser } from '@plone/volto/components';
import { withFormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import cx from 'classnames';
import BlockEditorModal from './Components/BlockEditorModal';

import {
  Tile,
  TileModal,
  RowToolbar,
  RowModal,
  GridBlockModal,
} from './Components';
import { reorder, getColumnLayout } from './utils';

import '@eeacms/volto-grid-block/less/gridLayout.less';

const GridBlockEdit = (props) => {
  const [selectedBlock, setSelectedBlock] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [blockChooser, setBlockChooser] = useState(false);
  const [openRowModal, setOpenRowModal] = useState(false);
  const [openTileModal, setOpenTileModal] = useState(false);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [openBlockEditModal, setOpenBlockEditModal] = useState(false);
  const [actuallyOpenBlockEditModal, setActuallyOpenBlockEditModal] = useState(
    false,
  );

  const className = props.data.className || '';
  const inlineStyle = props.data.inlineStyle || '';
  const initialBlock = uuid();
  const initialRow = uuid();
  const initialState = props.data?.blocksData
    ? props.data.blocksData
    : {
        blocks: {
          [initialBlock]: {
            id: initialBlock,
            rowId: initialRow,
          },
        },
        blocks_layout: {
          rows: {
            [initialRow]: {
              id: initialRow,
              items: [initialBlock],
            },
          },
          items: [initialRow],
        },
      };
  const [blocksData, setBlocksData] = useState(initialState);

  useEffect(() => {
    props.onChangeBlock(props.block, {
      ...props.data,
      blocksData,
    });
    /* eslint-disable-next-line */
  }, [blocksData]);

  useEffect(() => {
    if (openBlockEditModal && selectedBlock) {
      setActuallyOpenBlockEditModal(true);
    } else {
      setActuallyOpenBlockEditModal(false);
    }
  }, [openBlockEditModal, selectedBlock]);

  const onMutateBlock = (current, incoming) => {
    setBlocksData({
      ...blocksData,
      blocks: {
        ...blocksData.blocks,
        [current]: {
          ...blocksData.blocks[current],
          ...incoming,
        },
      },
    });
    if (blockChooser) {
      setBlockChooser(false);
    }
  };

  const onChangeBlock = (blockId, data) => {
    setBlocksData({
      ...blocksData,
      blocks: {
        ...blocksData.blocks,
        [blockId]: {
          ...blocksData.blocks[blockId],
          ...data,
        },
      },
      blocks_layout: { ...(blocksData.blocks_layout || {}) },
    });
  };

  const onAddBlock = (rowId) => {
    const id = uuid();
    setBlocksData({
      ...blocksData,
      blocks: {
        ...blocksData.blocks,
        [id]: {
          id,
          rowId,
        },
      },
      blocks_layout: {
        ...blocksData.blocks_layout,
        rows: {
          ...(blocksData.blocks_layout.rows || {}),
          [rowId]: {
            ...(blocksData.blocks_layout.rows[rowId] || {}),
            items: [...(blocksData.blocks_layout.rows[rowId].items || {}), id],
          },
        },
      },
    });
  };

  const onDeleteBlock = (block) => {
    const newBlocks = { ...blocksData.blocks };
    const newRows = { ...blocksData.blocks_layout.rows };
    const newItems = [...blocksData.blocks_layout.items];
    const blockIndex = newRows[block.rowId].items.indexOf(block.id);
    const rowIndex = newItems.indexOf(block.rowId);

    if (newRows[block.rowId].items.length <= 1) {
      delete newRows[block.rowId];
      newItems.splice(rowIndex, 1);
    } else {
      newRows[block.rowId].items.splice(blockIndex, 1);
    }
    delete newBlocks[block.id];
    setBlocksData({
      ...blocksData,
      blocks: {
        ...newBlocks,
      },
      blocks_layout: {
        rows: {
          ...newRows,
        },
        items: [...newItems],
      },
    });
  };

  const onDeleteRow = (row, rowIndex) => {
    const newBlocks = { ...blocksData.blocks };
    const newRows = { ...blocksData.blocks_layout.rows };
    const newItems = [...blocksData.blocks_layout.items];
    newRows[row].items.forEach((block) => {
      delete newBlocks[block];
    });
    delete newRows[row];
    newItems.splice(rowIndex, 1);
    setBlocksData({
      ...blocksData,
      blocks: {
        ...newBlocks,
      },
      blocks_layout: {
        rows: {
          ...newRows,
        },
        items: [...newItems],
      },
    });
  };

  const onReorderRow = (startIndex, endIndex) => {
    const newItems = reorder(
      blocksData.blocks_layout.items,
      startIndex,
      endIndex,
    );
    setBlocksData({
      ...blocksData,
      blocks_layout: {
        ...blocksData.blocks_layout,
        items: [...newItems],
      },
    });
  };

  const onSelectedRowChange = (newSelectedRow) => {
    setSelectedRow(newSelectedRow);
    if (
      newSelectedRow.id &&
      JSON.stringify(newSelectedRow) !==
        blocksData.blocks_layout.rows[newSelectedRow.id]
    ) {
      setBlocksData({
        ...blocksData,
        blocks: {
          ...blocksData.blocks,
        },
        blocks_layout: {
          ...(blocksData.blocks_layout || {}),
          rows: {
            ...(blocksData.blocks_layout.rows || {}),
            [newSelectedRow.id]: {
              ...(blocksData.blocks_layout.rows[newSelectedRow.id] || {}),
              ...newSelectedRow,
            },
          },
        },
      });
    }
  };

  const onSelectedBlockChange = (newSelectedBlock) => {
    setSelectedBlock(newSelectedBlock);
    if (
      newSelectedBlock.id &&
      JSON.stringify(newSelectedBlock) !==
        blocksData.blocks[newSelectedBlock.id]
    ) {
      setBlocksData({
        ...blocksData,
        blocks: {
          ...blocksData.blocks,
          [newSelectedBlock.id]: {
            ...newSelectedBlock,
          },
        },
      });
    }
  };

  const onChange = (data) => {
    props.onChangeBlock(props.block, {
      ...props.data,
      ...data,
    });
  };

  const onSelectItem = (url, item) => {
    const data = {};
    if (item['@type'] === 'Image') {
      data.url = item.getURL;
      data.title = item.title;
    }
    const newSelectedBlock = { ...selectedBlock, ...data };
    setSelectedBlock(newSelectedBlock);
    onChangeBlock(selectedBlock.id, {
      ...newSelectedBlock,
    });
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const newRowItems = reorder(
        blocksData.blocks_layout.rows[destination.droppableId].items,
        source.index,
        destination.index,
      );
      setBlocksData({
        ...blocksData,
        blocks_layout: {
          ...blocksData.blocks_layout,
          rows: {
            ...blocksData.blocks_layout.rows,
            [destination.droppableId]: {
              ...blocksData.blocks_layout.rows[destination.droppableId],
              items: [...newRowItems],
            },
          },
        },
      });
    } else {
      //  WIP
    }
  };

  return (
    <div className="grid-block">
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={cx('grid-layout edit', className)}
          style={{ ...(inlineStyle || {}) }}
        >
          {blocksData.blocks_layout.items?.length
            ? blocksData.blocks_layout.items.map((row, rowIndex) => (
                <div key={`row-${row}`} className="row edit">
                  <RowToolbar
                    rowsLength={blocksData.blocks_layout.items.length}
                    row={row}
                    rowIndex={rowIndex}
                    rowData={blocksData.blocks_layout.rows[row]}
                    onAddBlock={onAddBlock}
                    onDeleteRow={onDeleteRow}
                    onReorderRow={onReorderRow}
                    selectedRow={selectedRow}
                    openRowModal={openRowModal}
                    setSelectedRow={setSelectedRow}
                    setOpenRowModal={setOpenRowModal}
                  />
                  <Droppable droppableId={row}>
                    {(providedRow) => (
                      <>
                        <div
                          ref={providedRow.innerRef}
                          className={cx(
                            'row mt-0-super',
                            blocksData.blocks_layout.rows[row]
                              .grid_row_classname,
                          )}
                          style={{
                            ...(blocksData.blocks_layout.rows[row]
                              .grid_row_inline_style || {}),
                          }}
                        >
                          {blocksData.blocks_layout.rows[row]?.items?.length
                            ? blocksData.blocks_layout.rows[row].items.map(
                                (block, blockIndex) => (
                                  <Draggable
                                    key={block}
                                    draggableId={block}
                                    index={blockIndex}
                                  >
                                    {(providedBlock) => (
                                      <div
                                        className={cx(
                                          'column',
                                          getColumnLayout(
                                            blocksData.blocks[block]
                                              .grid_block_column_layout,
                                          ),
                                        )}
                                        ref={providedBlock.innerRef}
                                        {...providedBlock.draggableProps}
                                        {...providedBlock.dragHandleProps}
                                      >
                                        <Tile
                                          {...props}
                                          setSelectedRow={setSelectedRow}
                                          setSelectedBlock={setSelectedBlock}
                                          setBlockChooser={setBlockChooser}
                                          setOpenTileModal={setOpenTileModal}
                                          blockChooser={blockChooser}
                                          selectedRow={selectedRow}
                                          selectedBlock={selectedBlock}
                                          blocksData={blocksData}
                                          setBlocksData={setBlocksData}
                                          block={blocksData.blocks[block]}
                                          index={blockIndex}
                                          properties={props.properties}
                                          pathname={props.pathname}
                                          onSelectItem={onSelectItem}
                                          onMutateBlock={onMutateBlock}
                                          onChangeBlock={onChangeBlock}
                                          onAddBlock={onAddBlock}
                                          onDeleteBlock={onDeleteBlock}
                                          setOpenBlockEditModal={
                                            setOpenBlockEditModal
                                          }
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ),
                              )
                            : ''}
                        </div>
                        {providedRow.placeholder}
                      </>
                    )}
                  </Droppable>
                </div>
              ))
            : ''}
        </div>
      </DragDropContext>
      <div className="grid-layout block-control">
        <div className="row">
          <div className="column">
            <Button
              onClick={() => {
                const id = uuid();
                const rowId = uuid();
                setBlocksData({
                  ...blocksData,
                  blocks: {
                    ...blocksData.blocks,
                    [id]: {
                      id,
                      rowId,
                    },
                  },
                  blocks_layout: {
                    ...blocksData.blocks_layout,
                    rows: {
                      ...(blocksData.blocks_layout.rows || {}),
                      [rowId]: {
                        id: rowId,
                        items: [id],
                      },
                    },
                    items: [...(blocksData.blocks_layout.items || []), rowId],
                  },
                });
              }}
            >
              Add row
            </Button>
            <Button onClick={() => setOpenBlockModal(true)}>Edit block</Button>
          </div>
          {blockChooser ? (
            <div className="column">
              <BlockChooser
                onMutateBlock={onMutateBlock}
                currentBlock={selectedBlock.id}
              />
            </div>
          ) : (
            ''
          )}
          {openRowModal ? (
            <RowModal
              open={openRowModal}
              setOpen={setOpenRowModal}
              selectedRow={selectedRow}
              onSelectedRowChange={onSelectedRowChange}
            />
          ) : (
            ''
          )}
          {openTileModal ? (
            <TileModal
              open={openTileModal}
              setOpen={setOpenTileModal}
              selectedBlock={selectedBlock}
              onSelectedBlockChange={onSelectedBlockChange}
            />
          ) : (
            ''
          )}
          {openBlockModal ? (
            <GridBlockModal
              open={openBlockModal}
              setOpen={setOpenBlockModal}
              onChange={onChange}
              data={props.data}
            />
          ) : (
            ''
          )}
          {actuallyOpenBlockEditModal ? (
            <BlockEditorModal
              context={{ ...props }}
              selectedBlock={selectedBlock}
              block={blocksData.blocks[selectedBlock.id]}
              setSelectedBlock={setSelectedBlock}
              index={0}
              properties={props.properties}
              pathname={props.pathname}
              openObjectBrowser={props.openObjectBrowser}
              closeObjectBrowser={props.closeObjectBrowser}
              isObjectBrowserOpen={props.isObjectBrowserOpen}
              onSelectItem={onSelectItem}
              onMutateBlock={onMutateBlock}
              onChangeBlock={onChangeBlock}
              onClose={setOpenBlockEditModal}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};
export default withFormStateContext(GridBlockEdit);
