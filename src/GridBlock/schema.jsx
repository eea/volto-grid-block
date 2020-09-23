export const getBlocksSchema = (props) => ({
  title: 'Block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['package'],
    },
  ],
  properties: {},
  required: [],
});

export const getBlockFullControlSchema = (props) => ({
  title: 'Block fullcontrol',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [],
    },
    {
      id: 'layout',
      title: 'Layout',
      fields: [
        'grid_column_default',
        'grid_column_xs',
        'grid_column_sm',
        'grid_column_md',
        'grid_column_lg',
      ],
    },
    {
      id: 'fullcontrol',
      title: 'Style',
      fields: [
        'grid_column_super',
        'grid_column_class_name',
        'grid_column_height',
        'grid_column_align_text',
        'grid_column_text_color',
        'grid_column_background_color',
      ],
    },
    {
      id: 'advanced_fullcontrol',
      title: 'Advanced settings',
      fields: [
        'grid_column_margin',
        'grid_column_padding',
        'grid_column_inline_style',
      ],
    },
  ],
  properties: {
    grid_column_default: {
      title: 'default',
      type: 'number',
      minimum: 1,
      maximum: 12,
    },
    grid_column_xs: {
      title: 'xs',
      type: 'number',
      minimum: 1,
      maximum: 12,
    },
    grid_column_sm: {
      title: 'sm',
      type: 'number',
      minimum: 1,
      maximum: 12,
    },
    grid_column_md: {
      title: 'md',
      type: 'number',
      minimum: 1,
      maximum: 12,
    },
    grid_column_lg: {
      title: 'lg',
      type: 'number',
      minimum: 1,
      maximum: 12,
    },
    grid_column_super: {
      title: 'Super',
      type: 'boolean',
    },
    grid_column_class_name: {
      title: 'Class name',
      widget: 'textarea',
    },
    grid_column_height: {
      title: 'Height',
      type: 'number',
      minimum: 1,
    },
    grid_column_align_text: {
      title: 'Text align',
      widget: 'align',
    },
    grid_column_text_color: {
      title: 'Text color',
      widget: 'color_picker',
    },
    grid_column_background_color: {
      title: 'Background color',
      widget: 'color_picker',
    },
    grid_column_margin: {
      title: 'Margin',
      widget: 'textarea',
    },
    grid_column_padding: {
      title: 'Padding',
      widget: 'textarea',
    },
    grid_column_inline_style: {
      title: 'Inline style',
      widget: 'json_text',
    },
  },
  required: [],
});

export const makeSchema = (props) => {
  return {
    title: props.schemaTitle || 'Title',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [],
      },
      {
        id: 'blocks',
        title: 'Blocks configuration',
        fields: ['blocksData'],
      },
      {
        id: 'grid_fullcontrol',
        title: 'Grid advanced settings',
        fields: [
          'grid_fluid',
          'grid_overwrite_layout',
          'grid_class_name',
          'grid_background_color',
          'grid_margin',
          'grid_padding',
          'grid_inline_style',
        ],
      },
      {
        id: 'row_fullcontrol',
        title: 'Row advanced settings',
        fields: [
          'grid_row_super',
          'grid_row_fluid',
          'grid_row_class_name',
          'grid_row_align_text',
          'grid_row_align_items',
          'grid_row_justify_content',
          'grid_row_background_color',
          'grid_row_margin',
          'grid_row_padding',
          'grid_row_inline_style',
        ],
      },
    ],
    properties: {
      blocksData: {
        title: 'Blocks data',
        widget: 'blocks_list',
        schema: getBlockFullControlSchema(props),
      },
      grid_fluid: {
        title: 'Fluid',
        type: 'boolean',
      },
      grid_overwrite_layout: {
        title: 'Overwrite layout',
        type: 'boolean',
      },
      grid_class_name: {
        title: 'Class name',
        widget: 'textarea',
      },
      grid_background_color: {
        title: 'Grid background color',
        widget: 'color_picker',
      },
      grid_margin: {
        title: 'Margin',
        widget: 'textarea',
      },
      grid_padding: {
        title: 'Padding',
        widget: 'textarea',
      },
      grid_inline_style: {
        title: 'Inline style',
        widget: 'json_text',
      },
      grid_row_super: {
        title: 'Super',
        type: 'boolean',
      },
      grid_row_fluid: {
        title: 'Fluid',
        type: 'boolean',
      },
      grid_row_class_name: {
        title: 'Class name',
        widget: 'textarea',
      },
      grid_row_align_text: {
        title: 'Align text',
        widget: 'align',
      },
      grid_row_align_items: {
        title: 'Align items',
        type: 'array',
        choices: [
          ['flex-start', 'flex-start'],
          ['flex-end', 'flex-end'],
          ['stretch', 'stretch'],
          ['center', 'center'],
          ['baseline', 'baseline'],
          ['initial', 'initial'],
          ['inherit', 'inherit'],
        ],
      },
      grid_row_justify_content: {
        title: 'Justify content',
        type: 'array',
        choices: [
          ['flex-start', 'flex-start'],
          ['flex-end', 'flex-end'],
          ['center', 'center'],
          ['space-between', 'space-between'],
          ['space-around', 'space-around'],
          ['initial', 'initial'],
          ['inherit', 'inherit'],
        ],
      },
      grid_row_background_color: {
        title: 'Row background color',
        widget: 'color_picker',
      },
      grid_row_margin: {
        title: 'Margin',
        widget: 'textarea',
      },
      grid_row_padding: {
        title: 'Padding',
        widget: 'textarea',
      },
      grid_row_inline_style: {
        title: 'Inline style',
        widget: 'json_text',
      },
    },
    required: [],
  };
};
