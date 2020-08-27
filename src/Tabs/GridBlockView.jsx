import React, { useState, useEffect } from 'react';
import { Icon as VoltoIcon, BlockChooser } from '@plone/volto/components';

import { withFormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import { Tab, Button, Modal, Grid } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { Icon, SidebarPortal, TextWidget } from '@plone/volto/components';
import { Segment } from 'semantic-ui-react';
import { blocks } from '~/config';
import '../less/gridLayout.less';
// import { useFormStateContext } from '@plone/volto/components/manage/Form/FormContext';

const GridBlockView = (props) => {
  if (!__CLIENT__) return '';
  console.log('props in view', props.data);
  // const context = useFormStateContext();
  // console.log(context);

  const viewBlock = (block) => {
    // const { formData } = this.state; // destructuring
    // const blocksFieldname = getBlocksFieldname(formData);
    // const blocksDict = formData[blocksFieldname];

    let Block = null;
    let type = block['@type'].toLowerCase();
    Block = blocks.blocksConfig?.[type]?.view;

    let nop = () => {};
    console.log('current block', Block);
    // return JSON.stringify(Block);
    return Block ? (
      <Block
        key={block.id}
        // properties={props.data.properties}
        data={props.data.blocksData.blocks[block.id].data}
      />
    ) : null;
  };

  const ListElement = ({ block }) => {
    return (
      <div
        style={{
          padding: '.5rem',
        }}
        className={`column column-six ${block.className}`}
      >
        {viewBlock(props.data.blocksData.blocks[block.id])}
      </div>
    );
  };

  return (
    <div className="grid-layout">
      <div className="row">
        {props.data.blocksData.blocks_layout.length
          ? props.data.blocksData.blocks_layout.map((block) => (
              <ListElement block={block} />
            ))
          : ''}
      </div>
    </div>
  );
};
// export default withFormStateContext(GridBlockView);

export default GridBlockView;
