import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import BlockFullControl from './BlockFullControl';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import clearSVG from '@plone/volto/icons/clear.svg';
import starSVG from '@plone/volto/icons/star.svg';
import halfStarSVG from '@plone/volto/icons/half-star.svg';
import hideSVG from '@plone/volto/icons/hide.svg';
import showSVG from '@plone/volto/icons/show.svg';
import cx from 'classnames';

const BlockControl = (props) => {
  const [fullControl, setFullControl] = useState(false);
  const { data = {}, block = null, index = 0 } = props || {};
  return (
    <Draggable key={block} draggableId={block} index={index}>
      {(providedDrag) => (
        <div
          className="block-list-widget-control-container mb-0-super"
          ref={providedDrag.innerRef}
          {...providedDrag.draggableProps}
          {...providedDrag.dragHandleProps}
        >
          <div
            className={cx(
              'block-list-widget-control',
              fullControl ? 'fullcontrol' : '',
            )}
          >
            <div className="control">
              <Icon
                className="mr-1"
                name={data.highlight ? showSVG : hideSVG}
                size="20"
                color="#fff"
                onClick={() => {
                  props.onHighlight(!data.highlight, block);
                }}
              />
              <span>{data['@type']}</span>
            </div>
            <div className="control">
              <Icon
                name={fullControl ? starSVG : halfStarSVG}
                size="20"
                color="#fff"
                onClick={() => {
                  setFullControl(!fullControl);
                }}
              />
              <Icon
                name={clearSVG}
                size="20"
                color="#fff"
                onClick={() => {
                  props.onDeleteBlock(block, index);
                }}
              />
            </div>
          </div>
          {fullControl ? (
            <BlockFullControl {...props} onChange={props.onChange} />
          ) : (
            ''
          )}
        </div>
      )}
    </Draggable>
  );
};

export default BlockControl;
