import React from 'react';
import { getBaseUrl } from '@plone/volto/helpers';
import { defineMessages } from 'react-intl';
import { map } from 'lodash';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from '@plone/volto/helpers';
import { getClasses, getStyle } from '@eeacms/volto-grid-block/helpers';
import { blocks } from '~/config';
import cx from 'classnames';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const RenderBlocks = (props) => {
  const { location, intl, content, metadata } = props;
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);

  return hasBlocksData(content) ? (
    <>
      {map(content[blocksLayoutFieldname].items, (block) => {
        const Block =
          blocks.blocksConfig[content[blocksFieldname]?.[block]?.['@type']]?.[
            'view'
          ] || null;
        const data = content[blocksFieldname][block];
        return Block !== null ? (
          <div
            key={block}
            className={cx(getClasses(data.block_class_name))}
            style={getStyle({
              style: data.block_css?.style,
              margin: data.block_margin,
              padding: data.block_padding,
              backgroundColor: data.block_background_color?.active
                ? data.block_background_color.color
                : null,
              textColor: data.block_text_color?.active
                ? data.block_text_color.color
                : null,
            })}
          >
            <Block
              key={block}
              id={block}
              metadata={metadata}
              properties={content}
              data={content[blocksFieldname][block]}
              path={getBaseUrl(location?.pathname || '')}
            />
          </div>
        ) : (
          <div key={block}>
            {intl.formatMessage(messages.unknownBlock, {
              block: content[blocksFieldname]?.[block]?.['@type'],
            })}
          </div>
        );
      })}
    </>
  ) : (
    ''
  );
};

export default RenderBlocks;
