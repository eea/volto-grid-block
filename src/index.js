import codeSVG from '@plone/volto/icons/code.svg';
import { GridBlockEdit, GridBlockView } from './GridBlock';

import { variants } from './grid';
import { GRIDBLOCK } from './constants';

import ColumnLayoutWidget from './Widgets/ColumnLayoutWidget';
import ColorPickerWidget from './Widgets/ColorPickerWidget';
import JsonTextWidget from './Widgets/JsonTextWidget';
import CssWidget from './Widgets/CssWidget';

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
    variants,
    security: {
      addPermission: [],
      view: [],
    },
    blockHasOwnFocusManagement: true,
  };

  config.widgets.widget.column_layout = ColumnLayoutWidget;
  config.widgets.widget.color_picker = ColorPickerWidget;
  config.widgets.widget.json_text = JsonTextWidget;
  config.widgets.widget.css = CssWidget;

  return config;
};
