import React, { useState, useEffect } from 'react';
import { Icon as VoltoIcon, BlockChooser } from '@plone/volto/components';

import { withFormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import { Tab, Button, Modal, Grid } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { Icon, SidebarPortal, TextWidget } from '@plone/volto/components';
import { Segment } from 'semantic-ui-react';
import { blocks } from '~/config';
import '../less/gridLayout.less';

import { ListManager } from 'react-beautiful-dnd-grid';

const GridBlockEdit = (props) => {
  console.log('props in grid block', props);
  const initial = uuid();
  const initialState = props.data?.blocksData
    ? props.data.blocksData
    : {
        blocks: {
          [initial]: {
            id: initial,
            blockChooser: false,
            data: {},
          },
        },
        blocks_layout: [{ id: initial, width: 6, order: 0 }],
      };
  const [blocksData, setBlocksData] = useState(initialState);

  console.log('blocks data', blocksData);

  const reorderList = (sourceIndex, destinationIndex) => {
    if (destinationIndex === sourceIndex) {
      return;
    }
    const list = blocksData.blocks_layout;
    if (destinationIndex === 0) {
      list[sourceIndex].order = list[0].order - 1;
      updateSortedList();
      return;
    }
    if (destinationIndex === list.length - 1) {
      list[sourceIndex].order = list[list.length - 1].order + 1;
      updateSortedList();
      return;
    }
    if (destinationIndex < sourceIndex) {
      list[sourceIndex].order =
        (list[destinationIndex].order + list[destinationIndex - 1].order) / 2;
      updateSortedList();
      return;
    }
    list[sourceIndex].order =
      (list[destinationIndex].order + list[destinationIndex + 1].order) / 2;
    updateSortedList();
  };

  const sortList = (list) => {
    return list.slice().sort((first, second) => first.order - second.order);
  };

  const updateSortedList = () => {
    setBlocksData({
      ...blocksData,
      blocks_layout: sortList(blocksData.blocks_layout),
    });
  };

  const ListElement = ({ block }) => {
    return (
      <div
        style={{
          padding: '.5rem',
          border: '1px dashed black',
        }}
        className="column column-six"
      >
        {!blocksData.blocks[block.id]['@type'] ? (
          <>
            <Button
              onClick={() => {
                setBlocksData({
                  ...blocksData,
                  blocks: {
                    ...blocksData.blocks,
                    [block.id]: {
                      ...blocksData.blocks[block.id],
                      blockChooser: true,
                      data: {},
                    },
                  },
                  blocks_layout: [...blocksData.blocks_layout],
                });
              }}
            >
              Chose block
            </Button>

            {blocksData.blocks[block.id].blockChooser && (
              <BlockChooser
                onMutateBlock={onMutateBlock}
                currentBlock={blocksData.blocks[block.id]}
              />
            )}
          </>
        ) : (
          renderEditBlock(blocksData.blocks[block.id])
        )}
      </div>
    );
  };

  // useEffect(() => {
  //   props.onChangeBlock(props.block, {
  //     ...props.data,
  //     blocksData: {
  //       ...blocksData,
  //     },
  //   });
  // }, [blocksData.blocks]);

  const onMutateBlock = (current, incoming) => {
    console.log('onmutate', current, incoming);

    setBlocksData({
      ...blocksData,
      blocks: {
        ...blocksData.blocks,
        [current.id]: {
          ...current,
          ...incoming,
          blockChooser: false,
          data: {
            ...blocksData.blocks[current.id].data,
          },
        },
      },
      blocks_layout: [...blocksData.blocks_layout],
    });
  };

  const onChangeBlock = (blockId, data) => {
    setBlocksData({
      ...blocksData,
      blocks: {
        ...blocksData.blocks,
        [blockId]: {
          ...blocksData.blocks[blockId],
          blockChooser: false,
          data,
        },
      },
      blocks_layout: [...blocksData.blocks_layout],
    });
  };

  const renderEditBlock = (block) => {
    // const { formData } = this.state; // destructuring
    // const blocksFieldname = getBlocksFieldname(formData);
    // const blocksDict = formData[blocksFieldname];

    let Block = null;
    let type = block['@type'].toLowerCase();
    Block = blocks.blocksConfig?.[type]?.edit;

    let nop = () => {};
    console.log('current block', Block);
    // return JSON.stringify(Block);
    return Block ? (
      <Block
        id={block}
        block={block.id}
        data={block.data}
        properties={props.properties}
        onAddBlock={nop}
        onChangeBlock={onChangeBlock}
        onMutateBlock={onMutateBlock}
        onChangeField={nop}
        onDeleteBlock={nop}
        onSelectBlock={nop}
        handleKeyDown={nop}
        pathname={''}
        onMoveBlock={nop}
        onFocusPreviousBlock={nop}
        onFocusNextBlock={nop}
        selected={true}
        index={0}
        ref={{}}
        blockNode={block.data}
      />
    ) : null;
  };

  return (
    <>
      <div className="row-block-controls">
        <button
          onClick={() => {
            const id = uuid();
            setBlocksData({
              ...blocksData,
              blocks: {
                ...blocksData.blocks,
                [id]: {
                  id,
                  blockChooser: false,
                  data: {},
                },
              },
              blocks_layout: [
                ...blocksData.blocks_layout,
                { id, width: 6, order: blocksData.blocks_layout.length },
              ],
            });
          }}
        >
          Add block
        </button>
      </div>
      <div className="grid-layout">
        <div className="row">
          {blocksData.blocks_layout.length
            ? blocksData.blocks_layout.map((block) => (
                <ListElement block={block} />
              ))
            : ''}
          {/* <ListManager
            items={blocksData.blocks_layout}
            direction="horizontal"
            maxItems={blocksData.blocks_layout.length}
            render={(block) => <ListElement block={block} />}
            onDragEnd={reorderList}

          /> */}
        </div>
      </div>
    </>
  );
};
export default withFormStateContext(GridBlockEdit);
