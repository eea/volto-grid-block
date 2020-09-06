import React from 'react';

import { Button, Modal, Grid } from 'semantic-ui-react';

import penIcon from '@plone/volto/icons/pen.svg';
import { BodyClass } from '@plone/volto/helpers';
import { Icon as VoltoIcon } from '@plone/volto/components';
import clearIcon from '@plone/volto/icons/clear.svg';
import Block from './Block';

const BlockEditorModal = (props) => {
  return (
    <Modal className="mosaic-modal" open={true} size="fullscreen">
      <BodyClass className="mosaic-page-modal-open" />

      <Modal.Content scrolling>
        <div className="editor-toolbar-wrapper" />
        <Block {...props} />
      </Modal.Content>
      <Modal.Actions>
        <Grid columns={2}>
          <Grid.Column style={{ textAlign: 'left', width: '100%' }}>
            {/* <div className="block-editor-container">
              <Button onClick={() => this.setState({ showBlockChooser: true })}>
                {this.state.blockData['@type'] && selectedBlock
                  ? selectedBlock.title
                  : 'Set type'}
              </Button>

              <div ref={(node) => (this.ref = node)} style={{ width: '100%' }}>
                {this.state.showBlockChooser && (
                  <BlockChooser
                    onMutateBlock={this.onMutateBlock}
                    currentBlock={this.state.blockData['@type']}
                  />
                )}
              </div>
            </div> */}
          </Grid.Column>
          <Grid.Column style={{ textAlign: 'center', width: '100%' }}>
            <Button.Group>
              <Button basic circular primary onClick={() => props.onClose()}>
                <VoltoIcon name={penIcon} className="circled" />
              </Button>
              <Button
                basic
                circular
                secondary
                size="big"
                onClick={() => props.onClose()}
              >
                <VoltoIcon name={clearIcon} className="circled" />
              </Button>
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default BlockEditorModal;
