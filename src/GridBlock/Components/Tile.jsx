import React from 'react';
import cx from 'classnames';
import { withFormStateContext } from '@plone/volto/components/manage/Form/FormContext';

import { blocks } from '~/config';

import TileControl from './TileControl';

const Tile = React.memo((props) => {
  const {
    setSelectedBlock,
    setBlockChooser,
    setOpenTileModal,
    blockChooser,
    selectedBlock,
    block,
    index,
    properties,
    pathname,
    openObjectBrowser,
    closeObjectBrowser,
    isObjectBrowserOpen,
    onSelectBlock,
    handleKeyDown,
    onChangeBlock,
    onMutateBlock,
    onAddBlock,
    onDeleteBlock,
    onSelectItem,
    setOpenBlockEditModal,
  } = props;
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
          handleKeyDown={handleKeyDown}
          onAddBlock={onAddBlock}
          onChangeBlock={onChangeBlock}
          onMutateBlock={onMutateBlock}
          onChangeField={props.onChangeField}
          onDeleteBlock={props.onDeleteBlock}
          onSelectBlock={onSelectBlock}
          onMoveBlock={props.onMoveBlock}
          onFocusPreviousBlock={props.onFocusPreviousBlock}
          onFocusNextBlock={props.onFocusNextBlock}
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
          toolbarAlways={true}
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
});

export default withFormStateContext(Tile);
