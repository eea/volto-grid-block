import React, { useState, useEffect, useRef } from 'react';
import { Icon, EditBlock } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { SidebarPortal } from '@plone/volto/components';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { makeSchema, getBlockFullControlSchema } from './schema';
import cx from 'classnames';
import move from 'lodash-move';
import { isEmpty, map } from 'lodash';
import { v4 as uuid } from 'uuid';
import dragSVG from '@plone/volto/icons/drag.svg';
import neutralSVG from '@plone/volto/icons/neutral.svg';
import delightedSVG from '@plone/volto/icons/delighted.svg';
import { settings } from '~/config';

import '../less/gridLayout.less';

const GridBlockEdit = (props) => {
  const [selectedBlockFullControl, setSelectedBlockFullControl] = useState(
    null,
  );
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [placeholderProps, setPlaceholderProps] = useState(null);
  const [schema, setSchema] = useState(null);
  const [blockSchema, setBlockSchema] = useState(null);
  const gridContainer = useRef(null);
  const initialBlock = uuid();
  const initialBlocksData = {
    blocks: {
      [initialBlock]: {
        '@type': 'slate',
        plaintext: '',
      },
    },
    blocks_layout: {
      items: [initialBlock],
    },
  };
  const blocksData = props.data.blocksData || initialBlocksData;
  const {
    blocks = { ...initialBlocksData.blocks },
    blocks_layout = { ...initialBlocksData.blocks_layout },
  } = blocksData;
  // Unselect block if click is outside of grid layout
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, false);
    setSchema(makeSchema({ ...props, schemaTitle: 'Grid blocks' }));
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, false);
    };
    /* eslint-disable-next-line */
  }, [])
  useEffect(() => {
    if (!selectedBlockFullControl) {
      setBlockSchema(null);
    } else {
      setBlockSchema(getBlockFullControlSchema(props));
    }
    /* eslint-disable-next-line */
  }, [selectedBlockFullControl])
  // Handle click outside
  function handleClickOutside(event) {
    const sidebars = document.querySelectorAll('.sidebar-container');
    const slateToolbars = document.querySelectorAll('.slate-toolbar');
    let inSidebar = false;
    let inSlateToolbar = false;
    for (let sidebar of sidebars) {
      if (sidebar.contains(event.target) && !inSidebar) {
        inSidebar = true;
        break;
      }
    }
    for (let toolbar of slateToolbars) {
      if (toolbar.contains(event.target) && !inSidebar) {
        inSlateToolbar = true;
        break;
      }
    }
    if (
      gridContainer &&
      !gridContainer.current.contains(event.target) &&
      !inSidebar &&
      !inSlateToolbar
    ) {
      setSelectedBlock(null);
      setSelectedBlockFullControl(null);
    }
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    setPlaceholderProps({});
    return props.onChangeBlock(props.block, {
      ...props.data,
      blocksData: {
        ...blocksData,
        blocks_layout: {
          ...blocksData.blocks_layout,
          items: move(
            blocksData.blocks_layout.items,
            source.index,
            destination.index,
          ),
        },
      },
    });
  };

  // Handle click down
  const handleDragStart = (event) => {
    const queryAttr = 'data-rbd-draggable-id';
    const domQuery = `[${queryAttr}='${event.draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    if (!draggedDOM) {
      return;
    }

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = event.source.index;
    var clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, sourceIndex)
        .reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr);
          const marginBottom = parseFloat(style.marginBottom);
          return total + curr.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft,
      ),
    });
  };

  const onDragUpdate = (update) => {
    if (!update.destination) {
      return;
    }
    const draggableId = update.draggableId;
    const destinationIndex = update.destination.index;

    const queryAttr = 'data-rbd-draggable-id';
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    if (!draggedDOM) {
      return;
    }
    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = update.source.index;
    const childrenArray = [...draggedDOM.parentNode.children];
    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.slice(0, destinationIndex),
      movedItem,
      ...childrenArray.slice(destinationIndex + 1),
    ];

    var clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(
        window.getComputedStyle(draggedDOM.parentNode).paddingLeft,
      ),
    });
  };

  const handleKeyDown = (
    e,
    index,
    block,
    node,
    {
      disableEnter = false,
      disableArrowUp = false,
      disableArrowDown = false,
    } = {},
  ) => {
    if (e.key === 'ArrowUp' && !disableArrowUp) {
      onFocusPreviousBlock(block);
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' && !disableArrowDown) {
      onFocusNextBlock(block);
      e.preventDefault();
    }
    if (e.key === 'Enter' && !disableEnter) {
      onAddBlock({ '@type': settings.defaultBlockType }, block);
      e.preventDefault();
    }
  };

  const handleOnSelectBlock = (id) => {
    if (!props.selected) {
      setTimeout(() => {
        setSelectedBlock(id);
      }, 100);
    } else {
      setSelectedBlock(id);
    }
  };

  const handleFullControl = (id) => {
    if (selectedBlockFullControl === id) {
      setSelectedBlockFullControl(null);
    } else {
      setSelectedBlockFullControl(id);
    }
  };

  const onAddBlock = (incoming, block = null) => {
    const blockId = uuid();
    const newBlocks = {
      ...(blocksData?.blocks || {}),
      [blockId]: {
        ...incoming,
      },
    };
    const newBlocksLayout = {
      ...(blocksData?.blocks_layout || {}),
    };
    if (block) {
      const position = newBlocksLayout.items.indexOf(block);
      newBlocksLayout.items.splice(position + 1, 0, blockId);
    } else {
      newBlocksLayout.items = [
        ...(blocksData?.blocks_layout?.items || []),
        blockId,
      ];
    }
    props.onChangeBlock(props.block, {
      ...props.data,
      blocksData: {
        ...blocksData,
        blocks: {
          ...newBlocks,
        },
        blocks_layout: {
          ...newBlocksLayout,
        },
      },
    });
  };

  const onChangeBlock = (current, incoming) => {
    props.onChangeBlock(props.block, {
      ...props.data,
      blocksData: {
        ...blocksData,
        blocks: {
          ...blocksData.blocks,
          [current]: {
            ...incoming,
          },
        },
      },
    });
  };

  const onMutateBlock = (current, incoming) => {
    onChangeBlock(current, incoming);
  };

  const onChangeField = (current, incoming) => {
    console.log('onChangeField', current, incoming);
  };

  const onDeleteBlock = (current) => {
    if (blocksData.blocks_layout.items.length === 1) {
      props.onDeleteBlock(props.block);
    } else {
      const newBlocks = {
        ...blocksData.blocks,
      };
      const newBlocksLayoutItems = [...blocksData.blocks_layout.items];
      const position = newBlocksLayoutItems.indexOf(current);
      delete newBlocks[current];
      if (position > -1) {
        newBlocksLayoutItems.splice(position, 1);
      }
      props.onChangeBlock(props.block, {
        ...props.data,
        blocksData: {
          ...blocksData,
          blocks: {
            ...newBlocks,
          },
          blocks_layout: {
            ...blocksData.blocks_layout,
            items: [...newBlocksLayoutItems],
          },
        },
      });
    }
  };

  const onMoveBlock = (current, incoming) => {
    console.log('onMoveBlock', current, incoming);
  };

  const onFocusPreviousBlock = (block) => {
    if (selectedBlock) {
      const position = blocks_layout.items.indexOf(block);
      setSelectedBlock(
        blocks_layout.items[position - 1] ||
          blocks_layout.items[blocks_layout.items.length - 1],
      );
    }
  };

  const onFocusNextBlock = (block) => {
    if (selectedBlock) {
      const position = blocks_layout.items.indexOf(block);
      setSelectedBlock(
        blocks_layout.items[position + 1] || blocks_layout.items[0],
      );
    }
  };

  return (
    <div
      role="presentation"
      className={cx('ui container _grid-layout edit')}
      ref={gridContainer}
    >
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={handleDragStart}
        onDragUpdate={onDragUpdate}
      >
        <Droppable droppableId="edit-form">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ position: 'relative' }}
              className={cx('row edit')}
            >
              {map(
                blocks_layout.items,
                (block, index) =>
                  blocks?.[block]?.['@type'] && (
                    <Draggable draggableId={block} index={index} key={block}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cx(
                            'column edit',
                            `block-editor-${blocks[block]['@type']}`,
                            `column-${blocks[block].grid_column_default || 12}`,
                          )}
                        >
                          <div style={{ position: 'relative' }}>
                            <div
                              style={{
                                visibility:
                                  selectedBlock === block
                                    ? 'visible'
                                    : 'hidden',
                                display: 'inline-block',
                              }}
                              {...provided.dragHandleProps}
                              className="drag handle wrapper"
                            >
                              <Icon name={dragSVG} size="18px" />
                            </div>
                            <div
                              style={{
                                visibility:
                                  selectedBlock === block
                                    ? 'visible'
                                    : 'hidden',
                                display: 'inline-block',
                              }}
                              className="drag handle star wrapper"
                            >
                              <Icon
                                name={
                                  selectedBlockFullControl === block
                                    ? delightedSVG
                                    : neutralSVG
                                }
                                size="18px"
                                onClick={() => {
                                  handleFullControl(block);
                                }}
                              />
                            </div>

                            <EditBlock
                              id={block}
                              index={index}
                              type={blocks[block]['@type']}
                              key={block}
                              handleKeyDown={handleKeyDown}
                              onAddBlock={onAddBlock}
                              onChangeBlock={onChangeBlock}
                              onMutateBlock={onMutateBlock}
                              onChangeField={onChangeField}
                              onDeleteBlock={onDeleteBlock}
                              onSelectBlock={handleOnSelectBlock}
                              onMoveBlock={onMoveBlock}
                              onFocusPreviousBlock={onFocusPreviousBlock}
                              onFocusNextBlock={onFocusNextBlock}
                              properties={props.data.properties}
                              data={blocks[block]}
                              pathname={props.pathname}
                              block={block}
                              selected={
                                selectedBlock === block &&
                                selectedBlockFullControl !== block
                              }
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ),
              )}
              {provided.placeholder}
              {!isEmpty(placeholderProps) && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${placeholderProps.clientY}px`,
                    height: `${placeholderProps.clientHeight + 18}px`,
                    background: '#eee',
                    width: `${placeholderProps.clientWidth}px`,
                    borderRadius: '3px',
                  }}
                />
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {schema && !selectedBlockFullControl ? (
        <SidebarPortal selected={props.selected}>
          <InlineForm
            schema={schema}
            title={schema.title}
            onChangeField={(field, data) => {
              props.onChangeBlock(props.block, {
                ...(props.data || {}),
                [field]: data,
              });
            }}
            formData={props.data}
            block={props.block}
          />
        </SidebarPortal>
      ) : blockSchema && selectedBlockFullControl ? (
        <SidebarPortal selected={props.selected}>
          <InlineForm
            schema={blockSchema}
            title={blockSchema.title}
            onChangeField={(field, newData) => {
              const mustBe = blockSchema.properties[field].mustBe;
              let newDataParsed = newData;
              if (mustBe === 'json') {
                try {
                  newDataParsed = JSON.parse(newData);
                } catch {}
              }
              onChangeBlock(selectedBlockFullControl, {
                ...blocksData.blocks[selectedBlockFullControl],
                [field]: newDataParsed,
              });
            }}
            formData={blocksData.blocks[selectedBlockFullControl]}
            block={selectedBlockFullControl}
          />
        </SidebarPortal>
      ) : (
        ''
      )}
    </div>
  );
};
export default GridBlockEdit;
