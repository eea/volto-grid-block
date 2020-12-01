import React from 'react';
import { connect } from 'react-redux';
import { SidebarPortal, Icon } from '@plone/volto/components';
import { setSidebarTab } from '@plone/volto/actions';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { BlocksForm } from '@eeacms/volto-blocks-form/components';
import { emptyBlocksForm } from '@eeacms/volto-blocks-form/helpers';
import { GRIDBLOCK } from '@eeacms/volto-grid-block/constants';
import {
  empty,
  getColumns,
  getClasses,
  getStyle,
} from '@eeacms/volto-grid-block/helpers';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import { Grid, Segment, Button } from 'semantic-ui-react';
import { blocks, settings } from '~/config';
import ColumnVariations from './ColumnVariations';
import EditBlockWrapper from './EditBlockWrapper';
import View from './View';
import { GridBlockSchema, ColumnSchema, BlockSchema } from './schema';

import tuneSVG from '@plone/volto/icons/tune.svg';
import upSVG from '@plone/volto/icons/up.svg';
import copySVG from '@plone/volto/icons/copy.svg';
import pasteSVG from '@plone/volto/icons/paste.svg';
import enterSVG from '@plone/volto/icons/enter.svg';
import showSVG from '@plone/volto/icons/show.svg';
import hideSVG from '@plone/volto/icons/hide.svg';

import '@eeacms/volto-grid-block/less/grid-block.less';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onChangeColumnField = this.onChangeColumnField.bind(this);
    this.onChangeBlockField = this.onChangeBlockField.bind(this);
    this.copyData = this.copyData.bind(this);
    this.pasteData = this.pasteData.bind(this);
    this.state = {
      activeColumn: null,
      activeBlock: null,
      colSelections: {},
      preview: false,
    };
    this.gridBlockContainer = React.createRef();
  }

  handleClickOutside(event) {
    const sidebars = document.querySelectorAll('.sidebar-container');
    const modals = document.querySelectorAll('.ui.modal');
    const blocks = document.querySelectorAll('.block-editor-wrapper');
    let inSidebar = false;
    let inModal = false;
    let inBlock = false;

    for (let sidebar of sidebars) {
      if (sidebar.contains(event.target) && !inSidebar) {
        inSidebar = true;
        break;
      }
    }

    for (let modal of modals) {
      if (modal.contains(event.target) && !inModal) {
        inModal = true;
        break;
      }
    }

    for (let block of blocks) {
      if (block.contains(event.target) && !inBlock) {
        inBlock = true;
        break;
      }
    }

    if (
      this.gridBlockContainer &&
      this.gridBlockContainer.current &&
      (!this.gridBlockContainer.current.contains(event.target) || !inBlock) &&
      !inSidebar &&
      !inModal
    ) {
      this.setState({
        activeColumn: null,
        activeBlock: null,
        colSelections: {},
      });
    }
  }

  createFrom = (initialData) => {
    const { grid_cols, grid_size } = initialData;
    return {
      data: empty(grid_cols.length, grid_cols),
      grid_size,
    };
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  UNSAFE_componentWillMount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  onChangeColumnField = (id, value, columnId) => {
    const { data, onChangeBlock, block } = this.props;
    const columnsData = data.data;
    onChangeBlock(block, {
      ...data,
      data: {
        ...columnsData,
        blocks: {
          ...columnsData.blocks,
          [columnId]: {
            ...columnsData.blocks?.[columnId],
            [id]: value,
          },
        },
      },
    });
  };

  onChangeBlockField = (id, value, columnId, blockId) => {
    const { data, onChangeBlock, block } = this.props;
    const columnsData = data.data;
    onChangeBlock(block, {
      ...data,
      data: {
        ...columnsData,
        blocks: {
          ...columnsData.blocks,
          [columnId]: {
            ...columnsData.blocks?.[columnId],
            blocks: {
              ...columnsData.blocks?.[columnId].blocks,
              [blockId]: {
                ...columnsData.blocks?.[columnId].blocks[blockId],
                [id]: value,
              },
            },
          },
        },
      },
    });
  };

  copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(this.props.data));
  };

  pasteData = () => {
    navigator.clipboard.readText().then((text) => {
      try {
        const newData = JSON.parse(text);
        if (newData['@type'] === GRIDBLOCK) {
          this.props.onChangeBlock(this.props.block, {
            ...newData,
          });
        }
      } catch {}
    });
  };

  render() {
    const {
      data,
      block,
      selected,
      pathname,
      onChangeBlock,
      onAddBlock,
    } = this.props;
    const columnsData = data.data;
    const metadata = this.props.metadata || this.props.properties;
    const { grid_size } = data;
    const columnList = getColumns(columnsData);

    const activeColumnData = this.state.activeColumn
      ? columnsData.blocks[this.state.activeColumn]
      : {};
    const activeBlockData =
      this.state.activeColumn && this.state.activeBlock
        ? columnsData.blocks[this.state.activeColumn].blocks[
            this.state.activeBlock
          ]
        : {};

    const { variants } = blocks.blocksConfig[GRIDBLOCK];

    return (
      <div
        role="presentation"
        className="grid-block-container edit"
        ref={this.gridBlockContainer}
      >
        {!Object.keys(data.data || {}).length ? (
          <ColumnVariations
            variants={variants}
            data={data}
            onChange={(initialData) => {
              onChangeBlock(block, {
                ...data,
                ...this.createFrom(initialData),
              });
            }}
          />
        ) : this.state.preview ? (
          <View {...this.props} />
        ) : (
          <Grid
            columns={grid_size}
            className={cx('grid-block', getClasses(data.grid_class_name))}
            style={getStyle({
              style: data.grid_css?.style,
              margin: data.grid_margin,
              padding: data.grid_padding,
              backgroundColor: data.grid_background_color?.active
                ? data.grid_background_color.color
                : null,
              textColor: data.grid_text_color?.active
                ? data.grid_text_color.color
                : null,
            })}
            stackable
          >
            <Grid.Row
              className={cx(
                'grid-row',
                getClasses(data.row_class_name, data.row_ui_container),
              )}
              style={getStyle({
                style: data.row_css?.style,
                margin: data.row_margin,
                padding: data.row_padding,
                backgroundColor: data.row_background_color?.active
                  ? data.row_background_color.color
                  : null,
                textColor: null,
              })}
            >
              {columnList.map(([columnId, column], index) => (
                <Grid.Column
                  className={cx(
                    'grid-column',
                    getClasses(
                      column.column_class_name,
                      column.column_ui_container,
                    ),
                  )}
                  style={getStyle({
                    style: column.column_css?.style,
                    margin: column.column_margin,
                    padding: column.column_padding,
                    backgroundColor: column.column_background_color?.active
                      ? column.column_background_color.color
                      : null,
                    textColor: column.column_text_color?.active
                      ? column.column_text_color.color
                      : null,
                  })}
                  key={columnId}
                  {...column.column_layout}
                >
                  <BlocksForm
                    key={columnId}
                    metadata={metadata}
                    properties={isEmpty(column) ? emptyBlocksForm() : column}
                    selectedBlock={
                      selected ? this.state.colSelections[columnId] : null
                    }
                    onSelectBlock={(blockId) => {
                      this.setState(
                        {
                          colSelections: {
                            [columnId]: blockId,
                          },
                          activeColumn: null,
                          activeBlock: null,
                        },
                        () => {
                          this.props.setSidebarTab(1);
                        },
                      );
                    }}
                    onChangeFormData={(newFormData) => {
                      onChangeBlock(block, {
                        ...data,
                        data: {
                          ...columnsData,
                          blocks: {
                            ...columnsData.blocks,
                            [columnId]: newFormData,
                          },
                        },
                      });
                    }}
                    onChangeField={(id, value) => {
                      // this.onChangeColumnData(id, value, columnId)
                    }}
                    pathname={pathname}
                  >
                    {({ draginfo }, editBlock, blockProps) => (
                      <EditBlockWrapper
                        draginfo={draginfo}
                        blockProps={{
                          ...blockProps,
                          latest:
                            column.blocks_layout.items.indexOf(
                              blockProps.block,
                            ) ===
                            column.blocks_layout.items.length - 1,
                        }}
                        extraControls={
                          <>
                            <Button
                              icon
                              basic
                              title="Edit column"
                              onClick={() => {
                                this.setState({
                                  activeColumn: columnId,
                                  activeBlock: blockProps.block,
                                });
                                this.props.setSidebarTab(1);
                              }}
                            >
                              <Icon name={tuneSVG} size="19px" />
                            </Button>
                          </>
                        }
                      >
                        {editBlock}
                      </EditBlockWrapper>
                    )}
                  </BlocksForm>
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        )}
        {selected &&
        !this.state.activeColumn &&
        Object.keys(this.state.colSelections).length === 0 ? (
          <SidebarPortal selected={true}>
            <div className="grid-block-sidebar no-inline-form-header">
              <Segment>
                <header className="header pulled">
                  <h2>{GridBlockSchema().title}</h2>
                </header>
                <div className="buttons-wrapper">
                  <Button
                    icon
                    basic
                    title="Add new block below the grid"
                    onClick={() => {
                      this.setState({ preview: !this.state.preview });
                      onAddBlock(
                        settings.defaultBlockType,
                        this.props.index + 1,
                      );
                    }}
                  >
                    <Icon name={enterSVG} size="22px" />
                  </Button>
                  <Button
                    icon
                    basic
                    title="Copy grid block data"
                    onClick={this.copyData}
                  >
                    <Icon name={copySVG} size="22px" />
                  </Button>
                  <Button
                    icon
                    basic
                    title="Paste grid block data"
                    onClick={this.pasteData}
                  >
                    <Icon name={pasteSVG} size="22px" />
                  </Button>
                  <Button
                    icon
                    basic
                    title={this.state.preview ? 'Hide preview' : 'Show preview'}
                    onClick={() => {
                      this.setState({ preview: !this.state.preview });
                    }}
                  >
                    <Icon
                      name={this.state.preview ? hideSVG : showSVG}
                      size="22px"
                    />
                  </Button>
                </div>
              </Segment>
              <InlineForm
                schema={GridBlockSchema()}
                title="Grid block"
                onChangeField={(id, value) => {
                  if (id === 'Activate column') {
                    this.setState(
                      {
                        activeColumn: value,
                        colSelections: {
                          [value]:
                            columnsData.blocks[value].blocks_layout.items[0],
                        },
                      },
                      () => {
                        this.props.setSidebarTab(1);
                      },
                    );
                    return;
                  }
                  onChangeBlock(block, {
                    ...data,
                    [id]: value,
                  });
                }}
                formData={data}
              />
            </div>
          </SidebarPortal>
        ) : selected && this.state.activeColumn && !this.state.activeBlock ? (
          <SidebarPortal selected={true}>
            <div className="grid-block-sidebar">
              <Segment>
                <Button
                  onClick={() =>
                    this.setState({
                      activeColumn: null,
                      activeBlock: null,
                      colSelections: {},
                    })
                  }
                >
                  <Icon name={upSVG} size="14px" />
                  Edit grid block
                </Button>
              </Segment>
              <InlineForm
                schema={ColumnSchema()}
                title={`Column ${
                  columnsData.blocks_layout.items.indexOf(
                    this.state.activeColumn,
                  ) + 1
                }`}
                onChangeField={(id, value) => {
                  this.onChangeColumnField(id, value, this.state.activeColumn);
                }}
                formData={activeColumnData}
              />
            </div>
          </SidebarPortal>
        ) : selected &&
          this.state.activeBlock &&
          Object.keys(activeBlockData).length &&
          this.state.activeBlock ===
            this.state.colSelections[this.state.activeColumn] ? (
          <SidebarPortal selected={true}>
            <div className="grid-block-sidebar">
              <Segment>
                <Button onClick={() => this.setState({ activeBlock: null })}>
                  <Icon name={upSVG} size="14px" />
                  Edit parent column block
                </Button>
              </Segment>
              <InlineForm
                schema={BlockSchema()}
                title={`Block (${activeBlockData['@type']})`}
                onChangeField={(id, value) => {
                  this.onChangeBlockField(
                    id,
                    value,
                    this.state.activeColumn,
                    this.state.activeBlock,
                  );
                }}
                formData={activeBlockData}
              />
            </div>
          </SidebarPortal>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return {};
  },
  { setSidebarTab },
)(Edit);
