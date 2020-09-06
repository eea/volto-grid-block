import React, { useState } from 'react';
import { Button, Label, Modal, TextArea } from 'semantic-ui-react';

const GridBlockModal = (props) => {
  const nop = () => {};
  const { setOpen = nop, onChange = nop, data = {}, open = false } = props;
  const [className, setClassName] = useState(data.className || '');
  const [inlineStyle, setInlineStyle] = useState(data.inlineStyle || '');
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
            <Label pointing="below">Grid layout class</Label>
            <TextArea
              placeholder="Ex. ui container"
              value={className}
              onChange={(event, data) => setClassName(data.value)}
            />
          </div>
          <div className="description-item">
            <Label pointing="below">Inline style</Label>
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
            onChange({
              ...data,
              className: className,
              inlineStyle: inlineStyle,
            });
            setOpen(false);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default GridBlockModal;
