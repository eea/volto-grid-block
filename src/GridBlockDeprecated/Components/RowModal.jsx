import React, { useState } from 'react';
import { Button, Input, Modal, TextArea } from 'semantic-ui-react';

const RowModal = (props) => {
  const nop = () => {};
  const {
    setOpen = nop,
    onSelectedRowChange = nop,
    selectedRow = {},
    open = false,
  } = props;
  const [className, setClassName] = useState(
    selectedRow.grid_row_classname || '',
  );
  const [inlineStyle, setInlineStyle] = useState(
    selectedRow.grid_row_inline_style || '',
  );
  return (
    <Modal
      className="grid-block-modal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>Edit row style</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div className="description-item">
            <Input
              action="Row class"
              placeholder="Ex. align-items-stretch"
              value={className}
              onChange={(event, data) => setClassName(data.value)}
            />
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
            onSelectedRowChange({
              ...selectedRow,
              grid_row_classname: className,
              grid_row_inline_style: inlineStyle,
            });
            setOpen(false);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default RowModal;
