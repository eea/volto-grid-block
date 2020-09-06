import React from 'react';
import cx from 'classnames';
import { blocks } from '~/config';
import { getColumnLayout } from '../helpers';

import '../less/gridLayout.less';

const Tile = React.memo((props) => {
  const { block } = props;
  let Block = null;
  let type = block['@type'];
  Block = blocks.blocksConfig?.[type]?.view;

  return Block ? (
    <Block
      key={block.id}
      id={block.id}
      properties={props.properties}
      data={block}
      path={props.path}
    />
  ) : null;
});

const GridBlockView = (props) => {
  const {
    blocksData = { blocks: {}, blocks_layout: { rows: {}, items: [] } },
    className = '',
    inlineStyle = {},
  } = props.data;

  return <h1>VIW</h1>;
  if (!__CLIENT__) return '';
  return (
    <div
      className={cx('grid-layout', className)}
      style={{ ...(inlineStyle || {}) }}
    >
      {blocksData.blocks_layout?.items?.length
        ? blocksData.blocks_layout.items.map((row, rowIndex) => (
            <div
              key={row}
              className={cx(
                'row',
                blocksData.blocks_layout.rows[row].grid_row_classname,
              )}
              style={{
                ...(blocksData.blocks_layout.rows[row].grid_row_inline_style ||
                  {}),
              }}
            >
              {blocksData.blocks_layout.rows[row]?.items?.length
                ? blocksData.blocks_layout.rows[row].items.map(
                    (block, blockIndex) => (
                      <div
                        key={`view-${block}`}
                        className={cx(
                          'column',
                          getColumnLayout(
                            blocksData.blocks[block].grid_block_column_layout,
                          ),
                          blocksData.blocks[block].grid_block_classname,
                        )}
                        style={
                          typeof blocksData.blocks[block]
                            .grid_block_inline_style === 'object'
                            ? blocksData.blocks[block]
                                .grid_block_inline_style || {}
                            : {}
                        }
                      >
                        <Tile {...props} block={blocksData.blocks[block]} />
                      </div>
                    ),
                  )
                : ''}
            </div>
          ))
        : ''}
    </div>
  );
};
export default GridBlockView;
