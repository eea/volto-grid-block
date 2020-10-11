import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { v4 as uuid } from 'uuid';
import { BlockChooser } from '@plone/volto/components';
import cx from 'classnames';
import { reorder } from '../GridBlockDeprecated/utils';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Icon from '@plone/volto/components/theme/Icon/Icon';
import addSVG from '@plone/volto/icons/circle-plus.svg';
import substractSVG from '@plone/volto/icons/circle-minus.svg';
import copySVG from '@plone/volto/icons/copy.svg';
import pasteSVG from '@plone/volto/icons/paste.svg';

import BlockControl from './BlockControl';

const BlocksListWidget = (props) => {
  const [blockChooser, setBlockChooser] = useState(false);
  const [blocksData, setBlocksData] = useState(props.value);
  const { blocks = {}, blocks_layout = {} } = blocksData || {};

  useEffect(() => {
    setBlocksData(props.value);
    /* eslint-disable-next-line */
  }, [props.value])

  const onAddBlock = (current, incoming) => {
    const blockId = uuid();
    props.onChange(props.id, {
      blocks: {
        ...(blocksData?.blocks || {}),
        [blockId]: {
          ...incoming,
        },
      },
      blocks_layout: {
        ...(blocksData?.blocks_layout || {}),
        items: [...(blocksData?.blocks_layout?.items || []), blockId],
      },
    });
    setBlockChooser(false);
  };

  const onDeleteBlock = (block, index) => {
    const newBlocks = { ...blocks };
    const new_blocks_layout = { ...blocks_layout };
    delete newBlocks[block];
    new_blocks_layout.items.splice(index, 1);
    props.onChange(props.id, {
      blocks: { ...newBlocks },
      blocks_layout: { ...new_blocks_layout },
    });
  };

  const onHighlight = (highlight, block) => {
    props.onChange(props.id, {
      ...blocksData,
      blocks: {
        ...blocks,
        [block]: {
          ...(blocks[block] || {}),
          highlight,
        },
      },
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const new_blocks_layout_items = reorder(
        blocks_layout.items,
        source.index,
        destination.index,
      );
      props.onChange(props.id, {
        ...blocksData,
        blocks_layout: {
          ...blocks_layout,
          items: [...new_blocks_layout_items],
        },
      });
    } else {
      //  WIP
    }
  };

  return (
    <div className="blocks-list-widget">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'blocks-list'}>
          {(providedDrop) => (
            <>
              <div ref={providedDrop.innerRef}>
                {blocks_layout?.items?.length
                  ? blocks_layout.items.map((blockId, index) => (
                      <BlockControl
                        key={blockId}
                        data={blocks[blockId]}
                        block={blockId}
                        blocksData={blocksData}
                        index={index}
                        onDeleteBlock={onDeleteBlock}
                        onHighlight={onHighlight}
                        id={props.id}
                        onChange={props.onChange}
                        schema={props.schema || null}
                      />
                    ))
                  : ''}
              </div>
              {providedDrop.placeholder}
            </>
          )}
        </Droppable>
      </DragDropContext>
      <div className="column">
        <Icon
          name={blockChooser ? substractSVG : addSVG}
          size="20"
          color="#4296B3"
          onClick={() => {
            setBlockChooser(!blockChooser);
          }}
        />
        <Icon
          name={copySVG}
          size="20"
          color="#4296B3"
          onClick={() => {
            props.onChange('copy', {});
          }}
        />
        <Icon
          name={pasteSVG}
          size="20"
          color="#4296B3"
          onClick={() => {
            props.onChange('paste', {});
          }}
        />
      </div>
      <div
        className={cx(
          'column block-chooser-container',
          blockChooser ? 'active' : '',
        )}
      >
        <BlockChooser
          onMutateBlock={onAddBlock}
          currentBlock={
            blocks_layout?.items?.[blocks_layout?.items?.length - 1] || null
          }
        />
      </div>
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
    discodata_query: state.discodata_query,
  })),
)(BlocksListWidget);
