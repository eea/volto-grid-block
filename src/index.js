import codeSVG from '@plone/volto/icons/code.svg';
import { GridBlockEdit, GridBlockView } from './Tabs';
import { GRIDBLOCK } from './constants';
import { tabs_block, content } from './reducers';

console.log('alalala', GRIDBLOCK, GridBlockEdit, GridBlockView);
export default (config) => {
  // config.blocks.blocksConfig[TABSBLOCK] = {
  //   id: TABSBLOCK,
  //   title: 'Section',
  //   icon: codeSVG,
  //   group: 'text',
  //   view: TabsBlockView,
  //   edit: TabsBlockEdit,
  //   restricted: false,
  //   mostUsed: true,
  //   sidebarTab: 1,
  //   security: {
  //     addPermission: [],
  //     view: [],
  //   },
  // };
  config.blocks.blocksConfig[GRIDBLOCK] = {
    id: GRIDBLOCK,
    title: 'Grid block',
    icon: codeSVG,
    group: 'text',
    view: GridBlockView,
    edit: GridBlockEdit,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
