import codeSVG from '@plone/volto/icons/code.svg';
import {
  GridBlockDeprecatedEdit,
  GridBlockDeprecatedView,
} from './GridBlockDeprecated';
import { GridBlockEdit, GridBlockView } from './GridBlock';

import BlocksListWidget from './Widgets/BlocksListWidget';
import ColorPickerWidget from './Widgets/ColorPickerWidget';
import JsonTextWidget from './Widgets/JsonTextWidget';

import { GRIDBLOCK_DEPRECATED, GRIDBLOCK } from './constants';

export default (config) => {
  config.blocks.blocksConfig[GRIDBLOCK_DEPRECATED] = {
    id: GRIDBLOCK_DEPRECATED,
    title: 'Grid block deprecated',
    icon: codeSVG,
    group: 'text',
    view: GridBlockDeprecatedView,
    edit: GridBlockDeprecatedEdit,
    restricted: false,
    mostUsed: false,
    security: {
      addPermission: [],
      view: [],
    },
    blockHasOwnFocusManagement: true,
  };

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
    blockHasOwnFocusManagement: true,
  };

  config.widgets.widget.blocks_list = BlocksListWidget;
  config.widgets.widget.color_picker = ColorPickerWidget;
  config.widgets.widget.json_text = JsonTextWidget;

  return config;
};
