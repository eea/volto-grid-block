import cx from 'classnames';
import { isEmpty, isObject } from 'lodash';

const makeSuperClass = (className, isSuper) => {
  if (isSuper) return `${className}-super`;
  return className;
};

export const getColumnLayout = (gridLayout) => {
  const deafult = gridLayout.default || 12;
  const xs = gridLayout.xs || null;
  const sm = gridLayout.sm || null;
  const md = gridLayout.md || null;
  const lg = gridLayout.lg || null;

  return cx(
    `column-${deafult}`,
    xs ? `xs-${xs}` : '',
    sm ? `sm-${sm}` : '',
    md ? `md-${md}` : '',
    lg ? `lg-${lg}` : '',
  );
};

export const getColumnClasses = (block) => {
  const columnSuper = block.grid_column_super;
  const columnLayout = getColumnLayout({
    default: block.grid_column_default,
    xs: block.grid_column_xs,
    sm: block.grid_column_sm,
    md: block.grid_column_md,
    lg: block.grid_column_lg,
  });
  const columnClassName = block.grid_column_class_name;
  const columnTextAlignment = makeSuperClass(
    `text-align-${block.grid_column_align_text || 'left'}`,
    columnSuper,
  );
  return cx(columnLayout, columnClassName, columnTextAlignment);
};

export const getColumnStyle = (block) => {
  const columnInlineStyle = isObject(block.grid_column_inline_style)
    ? block.grid_column_inline_style
    : {};
  const columnTextColor = block.grid_column_text_color || 'inherit';
  const columnBackgroundColor = block.grid_column_background_color || 'inherit';
  const columnMargin = block.grid_column_margin
    ? block.grid_column_margin
    : 'unset';
  const columnPadding = block.grid_column_padding
    ? block.grid_column_padding
    : 'unset';
  return {
    ...columnInlineStyle,
    color: columnTextColor,
    backgroundColor: columnBackgroundColor,
    margin: columnMargin,
    padding: columnPadding,
  };
};

export const getGridStyle = (data) => {
  const gridInlineStyle = isObject(data.grid_inline_style)
    ? data.grid_inline_style
    : {};
  const gridBackgroundColor = data.grid_background_color || 'inherit';
  const gridMargin = data.grid_margin ? data.grid_margin : 'unset';
  const gridPadding = data.grid_padding ? data.grid_padding : 'unset';
  return {
    ...gridInlineStyle,
    backgroundColor: gridBackgroundColor,
    margin: gridMargin,
    padding: gridPadding,
  };
};

export const getRowClasses = (data) => {
  const rowSuper = data.grid_row_super;
  const rowUiContainer = data.grid_row_fluid ? 'ui container' : '';
  const rowClassName = data.grid_row_class_name;
  const rowAlignText = makeSuperClass(
    `text-align-${data.grid_row_align_text || 'left'}`,
    rowSuper,
  );
  const rowAlignItems = makeSuperClass(
    `align-items-${data.grid_row_align_items || 'flex-start'}`,
    rowSuper,
  );
  const rowJustifyContent = makeSuperClass(
    `justify-content-${data.grid_row_justify_content || 'flex-start'}`,
    rowSuper,
  );
  return cx(
    rowUiContainer,
    rowClassName,
    rowAlignText,
    rowAlignItems,
    rowJustifyContent,
  );
};

export const getRowStyle = (data) => {
  const rowInlineStyle = isObject(data.grid_row_inline_style)
    ? data.grid_row_inline_style
    : {};
  const rowBackgroundColor = data.grid_row_background_color || 'inherit';
  const rowMargin = data.grid_row_margin ? data.grid_row_margin : 'unset';
  const rowPadding = data.grid_row_padding ? data.grid_row_padding : 'unset';
  return {
    ...rowInlineStyle,
    backgroundColor: rowBackgroundColor,
    margin: rowMargin,
    padding: rowPadding,
  };
};
