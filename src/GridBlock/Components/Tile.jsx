import React from 'react';
import cx from 'classnames';
import { withFormStateContext } from '@plone/volto/components/manage/Form/FormContext';

import { blocks } from '~/config';

import TileControl from './TileControl';

const Tile = React.memo(
  ({
    context,
    setSelectedBlock,
    setBlocksData,
    setBlockChooser,
    setOpenTileModal,
    blockChooser,
    selectedBlock,
    blocksData,
    block,
    index,
    properties,
    pathname,
    openObjectBrowser,
    closeObjectBrowser,
    isObjectBrowserOpen,
    onChangeBlock,
    onMutateBlock,
    onAddBlock,
    onDeleteBlock,
    onSelectItem,
    setOpenBlockEditModal,
  }) => {
    let Block = null;
    let type = block['@type'];
    Block = blocks.blocksConfig?.[type]?.edit;
    let nop = () => {};

    return (
      <div
        className={cx(
          'block-edit-wrapper ui rised segment',
          block.grid_block_classname,
        )}
        style={{
          ...(block.grid_block_inline_style || {}),
        }}
      >
        {Block ? (
          <Block
            id={block.id}
            index={index}
            type={block['@type']}
            key={block.id}
            handleKeyDown={nop}
            onAddBlock={nop}
            onChangeBlock={onChangeBlock}
            onMutateBlock={onMutateBlock}
            onChangeField={nop}
            onDeleteBlock={nop}
            onSelectBlock={nop}
            onMoveBlock={nop}
            onFocusPreviousBlock={nop}
            onFocusNextBlock={nop}
            openObjectBrowser={() => {
              setSelectedBlock(block);
              openObjectBrowser({ onSelectItem });
            }}
            closeObjectBrowser={closeObjectBrowser}
            properties={properties}
            isObjectBrowserOpen={isObjectBrowserOpen}
            data={block}
            pathname={pathname}
            block={block.id}
            selected={selectedBlock.id === block.id}
            manage={true}
          />
        ) : null}
        <TileControl
          blockView={!!Block}
          setSelectedBlock={setSelectedBlock}
          setBlockChooser={setBlockChooser}
          setOpenTileModal={setOpenTileModal}
          blockChooser={blockChooser}
          block={block}
          onDeleteBlock={onDeleteBlock}
          setOpenBlockEditModal={setOpenBlockEditModal}
        />
      </div>
    );
  },
);

export default withFormStateContext(Tile);
