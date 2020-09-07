import React from 'react';
import { Icon } from '@plone/volto/components';
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
import EditBlock from '../components/manage/Blocks/Block/Edit';
import {
  getColumnClasses,
  getGridStyle,
  getRowClasses,
  getRowStyle,
} from '../helpers';
import '../less/gridLayout.less';

class GridBlockEdit extends React.Component {
  constructor(props) {
    super(props);

    this.updatePropsBlocksData = this.updatePropsBlocksData.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onDragUpdate = this.onDragUpdate.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.onSelectBlock = this.onSelectBlock.bind(this);
    this.onFullControl = this.onFullControl.bind(this);
    this.onAddBlock = this.onAddBlock.bind(this);
    this.onChangeBlock = this.onChangeBlock.bind(this);
    this.onMutateBlock = this.onMutateBlock.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.onDeleteBlock = this.onDeleteBlock.bind(this);
    this.onMoveBlock = this.onMoveBlock.bind(this);
    this.onFocusPreviousBlock = this.onFocusPreviousBlock.bind(this);
    this.onFocusNextBlock = this.onFocusNextBlock.bind(this);

    const initialState = this.getInitialState(props);
    this.gridContainer = React.createRef();
    this.state = initialState;
    this.updatePropsBlocksData();
  }

  getInitialState() {
    const idTrailingBlock = uuid();
    const blocksData = isEmpty(this.props.data.blocksData?.blocks)
      ? {
          blocks: {
            [idTrailingBlock]: {
              '@type': settings.defaultBlockType,
            },
          },
          blocks_layout: {
            items: [idTrailingBlock],
          },
        }
      : { ...this.props.data.blocksData };
    return {
      blocksData: { ...blocksData },
      selectedBlock: null,
      selectedBlockFullControl: null,
      placeholderProps: null,
      schema: makeSchema({ ...this.props, schemaTitle: 'Grid blocks' }),
      blockSchema: getBlockFullControlSchema(this.props),
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  UNSAFE_componentWillMount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  componentDidUpdate(prevProps) {}

  updatePropsBlocksData() {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      blocksData: {
        ...this.state.blocksData,
      },
    });
  }

  handleClickOutside(event) {
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
      this.gridContainer &&
      this.gridContainer.current &&
      !this.gridContainer.current.contains(event.target) &&
      !inSidebar &&
      !inSlateToolbar
    ) {
      this.setState({ selectedBlock: null, selectedBlockFullControl: null });
    }
  }

  onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    return this.setState(
      {
        placeholderProps: {},
        blocksData: {
          ...this.state.blocksData,
          blocks_layout: {
            ...this.state.blocksData.blocks_layout,
            items: move(
              this.state.blocksData.blocks_layout.items,
              source.index,
              destination.index,
            ),
          },
        },
      },
      () => {
        this.updatePropsBlocksData();
      },
    );
  }

  handleDragStart(event) {
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

    this.setState({
      placeholderProps: {
        clientHeight,
        clientWidth,
        clientY,
        clientX: parseFloat(
          window.getComputedStyle(draggedDOM.parentNode).paddingLeft,
        ),
      },
    });
  }

  onDragUpdate(update) {
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
    this.setState({
      placeholderProps: {
        clientHeight,
        clientWidth,
        clientY,
        clientX: parseFloat(
          window.getComputedStyle(draggedDOM.parentNode).paddingLeft,
        ),
      },
    });
  }

  handleKeyDown(
    e,
    index,
    block,
    node,
    {
      disableEnter = false,
      disableArrowUp = false,
      disableArrowDown = false,
    } = {},
  ) {
    if (e.key === 'ArrowUp' && !disableArrowUp) {
      this.onFocusPreviousBlock(block);
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' && !disableArrowDown) {
      this.onFocusNextBlock(block);
      e.preventDefault();
    }
    if (e.key === 'Enter' && !disableEnter) {
      this.onAddBlock(
        { '@type': settings.defaultBlockType },
        this.state.blocksData.blocks_layout.items.indexOf(block),
      );
      e.preventDefault();
    }
  }

  onSelectBlock = (id) => {
    if (!this.props.selected) {
      setTimeout(() => {
        this.setState({
          selectedBlock: id,
        });
      }, 100);
    } else {
      this.setState({
        selectedBlock: id,
      });
    }
  };

  onFullControl = (id) => {
    if (this.state.selectedBlockFullControl === id) {
      this.setState({
        selectedBlockFullControl: null,
      });
    } else {
      this.setState({
        selectedBlockFullControl: id,
      });
    }
  };

  onAddBlock(incoming, position = -1) {
    return new Promise((resolve) => {
      const blocksData = { ...(this.state.blocksData || {}) };
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
      if (position > -1) {
        newBlocksLayout.items.splice(position + 1, 0, blockId);
      } else {
        newBlocksLayout.items = [
          ...(blocksData?.blocks_layout?.items || []),
          blockId,
        ];
      }
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
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
      this.setState(
        {
          blocksData: {
            ...blocksData,
            blocks: {
              ...newBlocks,
            },
            blocks_layout: {
              ...newBlocksLayout,
            },
          },
        },
        () => {
          // this.updatePropsBlocksData();
          resolve(blockId);
        },
      );
    });
  }

  onChangeBlock(current, incoming) {
    return new Promise((resolve) => {
      const blocksData = { ...(this.state.blocksData || {}) };
      const newBlocksLayoutItems = [...blocksData.blocks_layout.items];
      this.props
        .onChangeBlock(this.props.block, {
          ...this.props.data,
          blocksData: {
            ...blocksData,
            blocks: {
              ...blocksData.blocks,
              [current]: {
                ...incoming,
              },
            },
            blocks_layout: {
              ...blocksData.blocks_layout,
              items: [...newBlocksLayoutItems],
            },
          },
        })
        .then(() => {
          console.log('HERE', current);
        });
      this.setState(
        {
          blocksData: {
            ...blocksData,
            blocks: {
              ...blocksData.blocks,
              [current]: {
                ...incoming,
              },
            },
            blocks_layout: {
              ...blocksData.blocks_layout,
              items: [...newBlocksLayoutItems],
            },
          },
        },
        () => {
          // this.updatePropsBlocksData();
          resolve(current);
        },
      );
    });
  }

  onMutateBlock(current, incoming) {
    return new Promise((resolve) => {
      const idTrailingBlock = uuid();
      const blocksData = { ...(this.state.blocksData || {}) };
      const newBlocksLayoutItems = [
        ...blocksData.blocks_layout.items,
        idTrailingBlock,
      ];
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        blocksData: {
          ...blocksData,
          blocks: {
            ...blocksData.blocks,
            [current]: {
              ...incoming,
            },
            [idTrailingBlock]: {
              '@type': settings.defaultBlockType,
            },
          },
          blocks_layout: {
            ...blocksData.blocks_layout,
            items: [...newBlocksLayoutItems],
          },
        },
      });
      this.setState(
        {
          blocksData: {
            ...blocksData,
            blocks: {
              ...blocksData.blocks,
              [current]: {
                ...incoming,
              },
              [idTrailingBlock]: {
                '@type': settings.defaultBlockType,
              },
            },
            blocks_layout: {
              ...blocksData.blocks_layout,
              items: [...newBlocksLayoutItems],
            },
          },
        },
        () => {
          // this.updatePropsBlocksData();
          resolve(current);
        },
      );
    });
  }

  onChangeField(current, incoming) {}

  onDeleteBlock(current) {
    if (this.state.blocksData.blocks_layout.items.length === 1) {
      this.setState(
        {
          blocksData: { blocks: {}, blocks_layout: { items: [] } },
        },
        () => {
          this.props.onDeleteBlock(this.props.block);
        },
      );
    } else {
      const newBlocks = {
        ...this.state.blocksData.blocks,
      };
      const newBlocksLayoutItems = [
        ...this.state.blocksData.blocks_layout.items,
      ];
      const position = newBlocksLayoutItems.indexOf(current);
      delete newBlocks[current];
      if (position > -1) {
        newBlocksLayoutItems.splice(position, 1);
      }
      this.setState(
        {
          blocksData: {
            ...this.state.blocksData,
            blocks: {
              ...newBlocks,
            },
            blocks_layout: {
              ...this.state.blocksData.blocks_layout,
              items: [...newBlocksLayoutItems],
            },
          },
        },
        () => {
          this.updatePropsBlocksData();
        },
      );
    }
  }

  onMoveBlock(current, incoming) {}

  onFocusPreviousBlock(block) {
    const blocks_layout = this.state.blocksData?.blocks_layout || {};
    if (this.state.selectedBlock) {
      const position = blocks_layout.items.indexOf(block);
      this.setState({
        selectedBlock:
          blocks_layout.items[position - 1] ||
          blocks_layout.items[blocks_layout.items.length - 1],
      });
    }
  }

  onFocusNextBlock(block) {
    const blocks_layout = this.state.blocksData?.blocks_layout || { items: [] };
    if (this.state.selectedBlock) {
      const position = blocks_layout.items.indexOf(block);
      this.setState({
        selectedBlock:
          blocks_layout.items[position + 1] || blocks_layout.items[0],
      });
    }
  }

  render() {
    const blocks = this.props.data.blocksData?.blocks || {};
    const blocks_layout = this.props.data.blocksData?.blocks_layout || {
      items: [],
    };
    return (
      <div
        role="presentation"
        className={cx(
          'grid-layout edit',
          this.props.data.grid_fluid ? 'ui container' : '',
        )}
        style={{ ...(getGridStyle(this.props.data) || {}) }}
        ref={this.gridContainer}
      >
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragStart={this.handleDragStart}
          onDragUpdate={this.onDragUpdate}
        >
          <Droppable droppableId="edit-form">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  position: 'relative',
                  ...(getRowStyle(this.props.data) || {}),
                }}
                className={cx('row edit', getRowClasses(this.props.data))}
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
                              getColumnClasses(blocks[block]),
                            )}
                          >
                            <div
                              style={{
                                position: 'relative',
                                height: '100%',
                              }}
                            >
                              <div
                                style={{
                                  visibility:
                                    this.state.selectedBlock === block
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
                                    this.state.selectedBlock === block
                                      ? 'visible'
                                      : 'hidden',
                                  display: 'inline-block',
                                }}
                                className="drag handle star wrapper"
                              >
                                <Icon
                                  name={
                                    this.state.selectedBlockFullControl ===
                                    block
                                      ? delightedSVG
                                      : neutralSVG
                                  }
                                  size="18px"
                                  onClick={() => {
                                    this.onFullControl(block);
                                  }}
                                />
                              </div>
                              <EditBlock
                                id={block}
                                index={index}
                                type={blocks[block]['@type']}
                                key={block}
                                handleKeyDown={this.handleKeyDown}
                                onAddBlock={this.onAddBlock}
                                onChangeBlock={this.onChangeBlock}
                                onMutateBlock={this.onMutateBlock}
                                onChangeField={this.onChangeField}
                                onDeleteBlock={this.onDeleteBlock}
                                onSelectBlock={this.onSelectBlock}
                                onMoveBlock={this.onMoveBlock}
                                onFocusPreviousBlock={this.onFocusPreviousBlock}
                                onFocusNextBlock={this.onFocusNextBlock}
                                properties={this.props.data.properties}
                                data={blocks[block]}
                                pathname={this.props.pathname}
                                block={block}
                                selected={
                                  this.state.selectedBlock === block &&
                                  this.state.selectedBlockFullControl !== block
                                }
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ),
                )}
                {provided.placeholder}
                {!isEmpty(this.state.placeholderProps) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: `${this.state.placeholderProps.clientY}px`,
                      height: `${
                        this.state.placeholderProps.clientHeight + 18
                      }px`,
                      background: '#eee',
                      width: `${this.state.placeholderProps.clientWidth}px`,
                      borderRadius: '3px',
                    }}
                  />
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {this.state.schema &&
        !this.state.selectedBlockFullControl &&
        !this.state.selectedBlock ? (
          <SidebarPortal selected={this.props.selected}>
            <InlineForm
              schema={this.state.schema}
              title={this.state.schema.title}
              onChangeField={(field, data) => {
                if (field === 'blocksData') {
                  this.setState({ blocksData: { ...data } }, () => {
                    this.updatePropsBlocksData();
                  });
                } else {
                  this.props.onChangeBlock(this.props.block, {
                    ...(this.props.data || {}),
                    [field]: data,
                  });
                }
              }}
              formData={this.props.data || {}}
              block={this.props.block}
            />
          </SidebarPortal>
        ) : this.state.blockSchema && this.state.selectedBlockFullControl ? (
          <SidebarPortal selected={this.props.selected}>
            <InlineForm
              schema={this.state.blockSchema}
              title={this.state.blockSchema.title}
              onChangeField={(field, newData) => {
                this.onChangeBlock(this.state.selectedBlockFullControl, {
                  ...blocks[this.state.selectedBlockFullControl],
                  [field]: newData,
                });
              }}
              formData={blocks[this.state.selectedBlockFullControl] || {}}
              block={this.state.selectedBlockFullControl}
            />
          </SidebarPortal>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default GridBlockEdit;
