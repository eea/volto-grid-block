import React from 'react';
import cx from 'classnames';
import config from '@plone/volto/registry';
import {
  getColumnStyle,
  getColumnClasses,
  getGridClasses,
  getGridStyle,
  getRowClasses,
  getRowStyle,
} from '../helpers';

import '../less/gridLayout.less';

const Tile = React.memo((props) => {
  const { blocks } = config;
  const { block, id } = props;
  let Block = null;
  let type = block['@type'];
  Block = blocks.blocksConfig?.[type]?.view;
  return Block ? (
    <Block
      key={id}
      id={id}
      properties={props.properties}
      data={block}
      path={props.path}
    />
  ) : null;
});

const View = (props) => {
  const {
    blocksData = { blocks: {}, blocks_layout: { items: [] } },
  } = props.data;
  return (
    <div
      className={cx('grid-layout', getGridClasses(props.data))}
      style={{ ...(getGridStyle(props.data) || {}) }}
    >
      <div
        className={cx('row', getRowClasses(props.data))}
        style={{ ...(getRowStyle(props.data) || {}) }}
      >
        {blocksData.blocks_layout?.items?.length
          ? blocksData.blocks_layout.items.map((block, blockIndex) =>
              blocksData.blocks[block] ? (
                <div
                  key={`view-${block}`}
                  className={cx(
                    'column',
                    getColumnClasses(blocksData.blocks[block] || {}),
                    blocksData.blocks[block].grid_column_text_color_active
                      ? 'overwrite-color'
                      : '',
                  )}
                  style={{
                    ...(getColumnStyle(blocksData.blocks[block]) || {}),
                  }}
                >
                  <div
                    className="column-block-container"
                    style={{
                      height: blocksData.blocks?.[block].grid_column_height
                        ? `${blocksData.blocks?.[block].grid_column_height}px`
                        : '100%',
                    }}
                  >
                    <Tile
                      {...props}
                      block={blocksData.blocks[block]}
                      id={block}
                    />
                  </div>
                </div>
              ) : (
                ''
              ),
            )
          : ''}
      </div>
    </div>
  );
};
export default View;
