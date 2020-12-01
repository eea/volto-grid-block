import React from 'react';
import { Card } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

export default ({ data, onChange, children, variants }) => {
  return (
    <div className="pa-1">
      <h4>Select layout:</h4>
      <Card.Group centered itemsPerRow={7}>
        {variants.map(({ icon, defaultData, title }, index) => (
          <Card key={index} onClick={() => onChange(defaultData)}>
            <Card.Content>
              <Icon name={icon} size="55" />
              {title ? <p>{title}</p> : ''}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
};
