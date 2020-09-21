import React from 'react';
import cx from 'classnames';

import { blocks } from '~/config';

const Block = ({
  context,
  setSelectedBlock,
  block,
  index,
  properties,
  pathname,
  openObjectBrowser,
  closeObjectBrowser,
  isObjectBrowserOpen,
  onChangeBlock,
  onMutateBlock,
  onSelectItem,
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
          selected={true}
          manage={true}
        />
      ) : null}
    </div>
  );
};

export default Block;
