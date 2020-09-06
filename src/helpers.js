export const getColumnLayout = (columnLayout) => {
  let className = `column-${columnLayout?.default || 12}`;
  if (columnLayout) {
    Object.entries(columnLayout).forEach(([key, value]) => {
      const columns = parseInt(value);
      if (
        key !== 'default' &&
        !isNaN(columns) &&
        columns >= 0 &&
        columns <= 12
      ) {
        className += ` ${key}-${columns}`;
      }
    });
  }
  return className;
};
