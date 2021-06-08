import { v4 as uuid } from 'uuid';
import isArray from 'lodash/isArray';
import transform from 'css-to-react-native';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import { emptyBlocksForm } from '@plone/volto/helpers';

export const cssParser = (css) => {
  return new Promise((resolve, reject) => {
    postcss([autoprefixer])
      .process(css, {})
      .then((result) => {
        const cssArray = [];
        result.root.nodes.forEach((node) => {
          if (node.prop && node.value) {
            cssArray.push([node.prop, node.value]);
          }
        });
        resolve(transform(cssArray));
      })
      .catch((error) => {
        reject({});
      });
  });
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const empty = (count, layouts) => {
  const blocks = {};
  const items = [];
  for (let x = 0; x < count; x++) {
    const id = uuid();
    blocks[id] = { ...emptyBlocksForm(), column_layout: { ...layouts[x] } };
    items.push(id);
  }
  return {
    blocks,
    blocks_layout: {
      items,
    },
  };
};

export const getColumns = (data) => {
  return (data?.blocks_layout?.items || []).map((id) => [
    id,
    data.blocks?.[id],
  ]);
};

export const getClasses = (classes, container, textAlign) => {
  const alignments = {
    left: 'left aligned',
    center: 'center aligned',
    right: 'right aligned',
    undefined: null,
    null: null,
  };
  const containers = {
    true: 'ui container',
    false: null,
    undefined: null,
    null: null,
  };
  const fullClassesArray = isArray(classes)
    ? [...classes, containers[container], alignments[textAlign]]
    : [containers[container], alignments[textAlign]];
  return fullClassesArray.filter((classname) => classname).join(' ');
};

export const getStyle = (data) => {
  const {
    style = {},
    margin = null,
    padding = null,
    backgroundColor = null,
    textColor = null,
    justifyContent = null,
  } = data;
  const newStyle = {};
  if (margin) newStyle.margin = margin;
  if (padding) newStyle.padding = padding;
  if (backgroundColor) newStyle.backgroundColor = backgroundColor;
  if (textColor) newStyle.color = textColor;
  if (justifyContent) newStyle.justifyContent = justifyContent;
  return {
    ...newStyle,
    ...style,
  };
};
