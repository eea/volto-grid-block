import React from 'react';
import Icon from '@plone/volto/components/theme/Icon/Icon';

import addSVG from '@plone/volto/icons/circle-plus.svg';
import substractSVG from '@plone/volto/icons/circle-minus.svg';
import themeSVG from '@plone/volto/icons/theme.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import editingSVG from '@plone/volto/icons/editing.svg';
import contentSVG from '@plone/volto/icons/content.svg';

const TileControl = (props) => {
  const nop = () => {};
  const {
    setSelectedBlock = nop,
    setBlockChooser = nop,
    setOpenTileModal = nop,
    onDeleteBlock = nop,
    blockChooser = false,
    block = {},
    setOpenBlockEditModal,
  } = props;
  if (props.blockView) {
    return (
      <div className="block-edit-control mt-1">
        <Icon
          name={editingSVG}
          size="20"
          color="#4296B3"
          onClick={() => setSelectedBlock(block)}
        />
        <Icon
          name={contentSVG}
          size="20"
          color="#4296B3"
          onClick={() => {
            setSelectedBlock(block);
            setOpenBlockEditModal(true);
          }}
        />
        <Icon
          name={themeSVG}
          size="20"
          color="#4296B3"
          onClick={() => {
            setSelectedBlock(block);
            setOpenTileModal(true);
          }}
        />
        <Icon
          name={deleteSVG}
          size="20"
          color="#EC776A"
          onClick={() => {
            onDeleteBlock(block);
            setSelectedBlock({});
            setBlockChooser(false);
          }}
        />
      </div>
    );
  }
  return (
    <div className="block-edit-control mt-1">
      {!blockChooser ? (
        <>
          <Icon
            name={addSVG}
            size="20"
            color="#4296B3"
            onClick={() => {
              setSelectedBlock(block);
              setBlockChooser(true);
            }}
          />
        </>
      ) : (
        <Icon
          name={substractSVG}
          size="20"
          color="#4296B3"
          onClick={() => setBlockChooser(false)}
        />
      )}

      <Icon
        name={deleteSVG}
        size="20"
        color="#EC776A"
        onClick={() => {
          onDeleteBlock(block);
          setBlockChooser(false);
        }}
      />
    </div>
  );
};

export default TileControl;
