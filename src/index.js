import codeSVG from '@plone/volto/icons/code.svg';
import { GridBlockEdit, GridBlockView } from 'volto-grid-block/GridBlock';
import { GRIDBLOCK } from './constants';

export default (config) => {
  config.blocks.blocksConfig[GRIDBLOCK] = {
    id: GRIDBLOCK,
    title: 'Grid block',
    icon: codeSVG,
    group: 'text',
    view: GridBlockView,
    edit: GridBlockEdit,
    restricted: false,
    mostUsed: true,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
