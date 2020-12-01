export const GridBlockSchema = () => ({
  title: 'Grid block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['grid_size', 'data'],
    },
    {
      id: 'advanced_grid',
      title: 'Advanced Grid style',
      fields: [
        'grid_class_name',
        'grid_margin',
        'grid_padding',
        'grid_background_color',
        'grid_text_color',
        'grid_css',
      ],
    },
    {
      id: 'advanced_row',
      title: 'Advanced Row style',
      fields: [
        'row_ui_container',
        'row_class_name',
        'row_margin',
        'row_padding',
        'row_background_color',
        'row_css',
      ],
    },
  ],
  properties: {
    grid_size: {
      title: 'Grid size',
      type: 'number',
      minimum: 1,
      maximum: 12,
      onBlur: () => null,
      onClick: () => null,
    },
    data: {
      title: 'Columns',
      widget: 'column_layout',
    },
    grid_class_name: {
      title: 'Class name',
      type: 'array',
      items: {
        choices: [],
      },
    },
    grid_margin: {
      title: 'Margin',
      widget: 'textarea',
    },
    grid_padding: {
      title: 'Padding',
      widget: 'textarea',
    },
    grid_background_color: {
      title: 'Background color',
      widget: 'color_picker',
    },
    grid_text_color: {
      title: 'Text color',
      widget: 'color_picker',
    },
    grid_css: {
      title: 'Style',
      widget: 'css',
    },
    row_ui_container: {
      title: 'UI container',
      type: 'boolean',
    },
    row_class_name: {
      title: 'Class name',
      type: 'array',
      items: {
        choices: [],
      },
    },
    row_margin: {
      title: 'Margin',
      widget: 'textarea',
    },
    row_padding: {
      title: 'Padding',
      widget: 'textarea',
    },
    row_background_color: {
      title: 'Background color',
      widget: 'color_picker',
    },
    row_css: {
      title: 'Style',
      widget: 'css',
    },
  },
  required: [],
});

export const ColumnSchema = () => ({
  title: 'Column',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'column_layout',
        'column_ui_container',
        'column_class_name',
        'column_margin',
        'column_padding',
        'column_background_color',
        'column_text_color',
        'column_css',
      ],
    },
  ],
  properties: {
    column_layout: {
      title: 'Column layout',
      widget: 'json_text',
    },
    column_ui_container: {
      title: 'UI container',
      type: 'boolean',
    },
    column_class_name: {
      title: 'Class name',
      type: 'array',
      items: {
        choices: [],
      },
    },
    column_margin: {
      title: 'Margin',
      widget: 'textarea',
    },
    column_padding: {
      title: 'Padding',
      widget: 'textarea',
    },
    column_background_color: {
      title: 'Background color',
      widget: 'color_picker',
    },
    column_text_color: {
      title: 'Text color',
      widget: 'color_picker',
    },
    column_css: {
      title: 'Style',
      widget: 'css',
    },
  },
  required: [],
});

export const BlockSchema = () => ({
  title: 'Block',
  fieldsets: [
    {
      id: 'default',
      title: 'Advanced',
      fields: [
        'block_class_name',
        'block_margin',
        'block_padding',
        'block_background_color',
        'block_text_color',
        'block_css',
      ],
    },
  ],
  properties: {
    block_class_name: {
      title: 'Class name',
      type: 'array',
      items: {
        choices: [],
      },
    },
    block_margin: {
      title: 'Margin',
      widget: 'textarea',
    },
    block_padding: {
      title: 'Padding',
      widget: 'textarea',
    },
    block_background_color: {
      title: 'Background color',
      widget: 'color_picker',
    },
    block_text_color: {
      title: 'Text color',
      widget: 'color_picker',
    },
    block_css: {
      title: 'Style',
      widget: 'css',
    },
  },
  required: [],
});
