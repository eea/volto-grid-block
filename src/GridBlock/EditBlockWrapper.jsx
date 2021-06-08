import React from 'react';
import { Icon, BlockChooser } from '@plone/volto/components';
import { blockHasValue } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { Button } from 'semantic-ui-react';
import includes from 'lodash/includes';
import isBoolean from 'lodash/isBoolean';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import { getClasses, getStyle } from '@eeacms/volto-grid-block/helpers';

import dragSVG from '@plone/volto/icons/drag.svg';
import addSVG from '@plone/volto/icons/circle-plus.svg';
import trashSVG from '@plone/volto/icons/delete.svg';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
  delete: {
    id: 'delete',
    defaultMessage: 'delete',
  },
});

class EditBlockWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewBlockOpened: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (
      this.blockNode.current &&
      doesNodeContainClick(this.blockNode.current, e)
    )
      return;

    if (this.state.addNewBlockOpened) {
      this.setState({
        addNewBlockOpened: false,
      });
      return true;
    }
  };

  blockNode = React.createRef();

  render() {
    const { intl, blockProps, draginfo, extraControls, children } = this.props;

    const {
      allowedBlocks,
      block,
      data,
      onDeleteBlock,
      onMutateBlock,
      selected,
      index,
      latest,
    } = blockProps;
    const type = data['@type'];
    const { disableNewBlocks } = data;

    const required = isBoolean(data.required)
      ? data.required
      : includes(config.blocks.requiredBlocks, type);
    return (
      <div ref={this.blockNode} className="block-editor-wrapper">
        <div
          ref={draginfo?.innerRef}
          {...(selected ? draginfo?.draggableProps : null)}
          className={`block-editor block-editor-${data['@type']}${
            latest ? ' last-child' : ''
          }`}
        >
          {!selected && (
            <div
              style={{
                display: 'none',
                // keep react-beautiful-dnd happy
              }}
              {...draginfo.dragHandleProps}
            ></div>
          )}
          <div className={cx('ui drag block inner')}>
            <div
              className={cx(
                type,
                'grid-column-block',
                getClasses(data.block_class_name, false, data.block_text_align),
              )}
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
              <div style={{ position: 'relative' }}>
                {selected && (
                  <div className="block-toolbar">
                    <div
                      style={{
                        display: 'inline-block',
                      }}
                      {...draginfo.dragHandleProps}
                      className="drag handle wrapper-column-block"
                    >
                      <Button icon basic title="Drag and drop">
                        <Icon name={dragSVG} size="19px" />
                      </Button>
                    </div>

                    {extraControls}

                    {!disableNewBlocks && !blockHasValue(data) && (
                      <Button
                        icon
                        basic
                        title="Add block"
                        onClick={() => {
                          this.setState({
                            addNewBlockOpened: !this.state.addNewBlockOpened,
                          });
                        }}
                        className="column-block-add-button"
                      >
                        <Icon name={addSVG} className="" size="19px" />
                      </Button>
                    )}
                    {!required && ((latest && index > 0) || !latest) && (
                      <Button
                        icon
                        basic
                        title="Remove block"
                        onClick={() => onDeleteBlock(block)}
                        className="delete-button-column-block"
                        aria-label={intl.formatMessage(messages.delete)}
                      >
                        <Icon name={trashSVG} size="19px" />
                      </Button>
                    )}
                    {this.state.addNewBlockOpened && (
                      <BlockChooser
                        onMutateBlock={(id, value) => {
                          this.setState({ addNewBlockOpened: false });
                          onMutateBlock(id, value);
                        }}
                        currentBlock={block}
                        allowedBlocks={allowedBlocks}
                      />
                    )}
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(EditBlockWrapper);
