export const ColumnLayoutSchema = () => ({
  title: 'Column layout',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['mobile', 'tablet', 'computer', 'largeScreen', 'widescreen'],
    },
  ],
  properties: {
    mobile: {
      title: 'Mobile size',
      type: 'number',
      minimum: 1,
      maximum: 12,
      onBlur: () => null,
      onClick: () => null,
    },
    tablet: {
      title: 'Tablet size',
      type: 'number',
      minimum: 1,
      maximum: 12,
      onBlur: () => null,
      onClick: () => null,
    },
    computer: {
      title: 'Computer size',
      type: 'number',
      minimum: 1,
      maximum: 12,
      onBlur: () => null,
      onClick: () => null,
    },
    largeScreen: {
      title: 'Large screen size',
      type: 'number',
      minimum: 1,
      maximum: 12,
      onBlur: () => null,
      onClick: () => null,
    },
    widescreen: {
      title: 'Wide screen size',
      type: 'number',
      minimum: 1,
      maximum: 12,
      onBlur: () => null,
      onClick: () => null,
    },
  },
  required: [],
});
