import React from 'react';
import Icon from '@plone/volto/components/theme/Icon/Icon';

import addSVG from '@plone/volto/icons/add.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import themeSVG from '@plone/volto/icons/theme.svg';
import upSVG from '@plone/volto/icons/up.svg';
import downSVG from '@plone/volto/icons/down.svg';

const RowToolbar = (props) => {
  return (
    <div className="block-edit-toolbar column xs-12 sm-12 md-12 lg-12">
      <div className="control">
        {props.rowIndex > 0 ? (
          <Icon
            name={upSVG}
            size="20"
            color="#fff"
            onClick={() =>
              props.onReorderRow(props.rowIndex, props.rowIndex - 1)
            }
          />
        ) : (
          ''
        )}
        {props.rowIndex < props.rowsLength - 1 ? (
          <Icon
            name={downSVG}
            size="20"
            color="#fff"
            onClick={() =>
              props.onReorderRow(props.rowIndex, props.rowIndex + 1)
            }
          />
        ) : (
          ''
        )}
      </div>
      <div className="control">
        <Icon
          name={addSVG}
          size="20"
          color="#fff"
          onClick={() => {
            props.onAddBlock(props.row);
          }}
        />
        <Icon
          name={themeSVG}
          size="20"
          color="#fff"
          onClick={() => {
            props.setSelectedRow(props.rowData);
            if (!props.openRowModal) {
              props.setOpenRowModal(true);
            }
          }}
        />
        <Icon
          name={clearSVG}
          size="20"
          color="#fff"
          onClick={() => {
            props.onDeleteRow(props.row, props.rowIndex);
          }}
        />
      </div>
    </div>
  );
};

export default RowToolbar;
