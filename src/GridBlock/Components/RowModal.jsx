import React, { useState } from 'react';
import { Button, Input, Modal } from 'semantic-ui-react';

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
          <Input
            action="Row class"
            placeholder="Ex. align-items-stretch"
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
            onSelectedRowChange({
              ...selectedRow,
              grid_row_classname: className,
            });
            setOpen(false);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default RowModal;
