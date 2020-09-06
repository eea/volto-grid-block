import React from 'react';
import cx from 'classnames';
import { blocks } from '~/config';
import { getColumnLayout } from '../helpers';
import {
  getColumnStyle,
  getColumnClasses,
  getGridStyle,
  getRowClasses,
  getRowStyle,
} from '../helpers';

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
    blocksData = { blocks: {}, blocks_layout: { items: [] } },
  } = props.data;
  return (
    <div
      className={cx('grid-layout', props.data.grid_fluid ? 'ui container' : '')}
      style={{ ...(getGridStyle(props.data) || {}) }}
    >
      <div
        className={cx('row', getRowClasses(props.data))}
        style={{ ...(getRowStyle(props.data) || {}) }}
      >
        {blocksData.blocks_layout?.items?.length
          ? blocksData.blocks_layout.items.map((block, blockIndex) => (
              <div
                key={`view-${block}`}
                className={cx(
                  'column',
                  getColumnClasses(blocksData.blocks[block]),
                )}
                style={{ ...(getColumnStyle(blocksData.blocks[block]) || {}) }}
              >
                <div
                  className="column-block-container"
                  style={{
                    height: blocksData.blocks[block].grid_column_height
                      ? `${blocksData.blocks[block].grid_column_height}px`
                      : '100%',
                  }}
                >
                  <Tile {...props} block={blocksData.blocks[block]} />
                </div>
              </div>
            ))
          : ''}
      </div>
    </div>
  );
};
export default GridBlockView;
