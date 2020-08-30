import React, { useState } from 'react';
import { Button, Input, Modal, TextArea } from 'semantic-ui-react';

const TileModal = (props) => {
  const nop = () => {};
  const {
    setOpen = nop,
    onSelectedBlockChange = nop,
    selectedBlock = {},
    open = false,
  } = props;
  const [className, setClassName] = useState(
    selectedBlock.grid_block_classname || '',
  );
  const [columnLayout, setColumnLayout] = useState({
    ...(selectedBlock.grid_block_column_layout || {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      default: 12,
    }),
  });
  const [inlineStyle, setInlineStyle] = useState(
    selectedBlock.grid_block_inline_style || '',
  );
  return (
    <Modal
      className="grid-block-modal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>Edit block style</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div className="description-item">
            <Input
              action="Block class"
              placeholder="Ex. xs-12 sm-6 md-4 lg-2"
              value={className}
              onChange={(event, data) => setClassName(data.value)}
            />
          </div>
          <div className="description-item">
            <p>Column layout</p>
            <div className="column-layout-grid">
              {columnLayout &&
                Object.entries(columnLayout).map(([key, value]) => (
                  <Input
                    key={`modal-column-${key}-${selectedBlock.div}`}
                    type="number"
                    action={key}
                    placeholder="Ex. 1"
                    value={value}
                    max="12"
                    min="0"
                    onChange={(event, data) => {
                      setColumnLayout({
                        ...columnLayout,
                        [key]: data.value,
                      });
                    }}
                  />
                ))}
            </div>
          </div>
          <div className="description-item">
            <p>Inline style:</p>
            <TextArea
              action="Block inline style"
              placeholder={'Ex. {"color" : "red"}'}
              value={
                typeof inlineStyle === 'object'
                  ? JSON.stringify(inlineStyle)
                  : inlineStyle
              }
              onChange={(event, data) => {
                let value;
                try {
                  value = JSON.parse(data.value);
                } catch {
                  value = data.value;
                }
                setInlineStyle(value);
              }}
            />
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Cancel" color="black" onClick={() => setOpen(false)} />
        <Button
          content="Save"
          color="blue"
          onClick={() => {
            onSelectedBlockChange({
              ...selectedBlock,
              grid_block_classname: className,
              grid_block_inline_style:
                typeof inlineStyle === 'object' ? inlineStyle : {},
              grid_block_column_layout: columnLayout,
            });
            setOpen(false);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default TileModal;
