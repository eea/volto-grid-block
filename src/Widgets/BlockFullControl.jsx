import React, { useState } from 'react';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import Icon from '@plone/volto/components/theme/Icon/Icon';
import clearSVG from '@plone/volto/icons/clear.svg';
import starSVG from '@plone/volto/icons/star.svg';
import halfStarSVG from '@plone/volto/icons/half-star.svg';
import hideSVG from '@plone/volto/icons/hide.svg';
import showSVG from '@plone/volto/icons/show.svg';

const BlockControl = (props) => {
  const [fullControl, setFullControl] = useState(false);
  const { data = {}, block = null, schema = {} } = props || {};
  return (
    <div>
      {schema.fieldsets && schema.properties && schema.required ? (
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(field, value) => {
            props.onChange(props.id, {
              ...props.blocksData,
              blocks: {
                ...props.blocksData.blocks,
                [block]: {
                  ...data,
                  [field]: value,
                },
              },
            });
          }}
          formData={props.data}
          block={props.block}
        />
      ) : (
        'Control not provided'
      )}
    </div>
  );
};

export default BlockControl;
