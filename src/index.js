import codeSVG from '@plone/volto/icons/code.svg';
import GridBlockEdit from './GridBlock/Edit';
import GridBlockView from './GridBlock/View';

import BlocksListWidget from './Widgets/BlocksListWidget';
import ColorPickerWidget from './Widgets/ColorPickerWidget';
import JsonTextWidget from './Widgets/JsonTextWidget';

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
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    blockHasOwnFocusManagement: true,
  };

  config.widgets.widget.blocks_list = BlocksListWidget;
  config.widgets.widget.color_picker = ColorPickerWidget;
  config.widgets.widget.json_text = JsonTextWidget;

  return config;
};
