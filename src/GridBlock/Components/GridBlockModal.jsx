import React, { useState } from 'react';
import { Button, Input, Modal } from 'semantic-ui-react';

const GridBlockModal = (props) => {
  const nop = () => {};
  const { setOpen = nop, onChange = nop, data = {}, open = false } = props;
  const [className, setClassName] = useState(data.classname || '');
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
          <Input
            action="Row class"
            placeholder="Ex. ui container"
            value={className}
            onChange={(event, data) => setClassName(data.value)}
          />
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
            });
            setOpen(false);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default GridBlockModal;
