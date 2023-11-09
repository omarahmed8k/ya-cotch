import * as React from 'react';
import { Avatar, Button, Card, Dropdown, Menu, Table, Tag,Select } from 'antd';
import { inject, observer } from 'mobx-react';
import CategoryStore from '../../stores/categoryStore';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import CreateOrUpdateCategory from './components/createOrUpdateCategory';
import CategoryDetailsModal from './components/categoryDetailsModal';
import { CreateCategoryDto } from '../../services/categories/dto/createCategoryDto';
import { UpdateCategoryDto } from '../../services/categories/dto/updateCategoryDto';
import { CategoryDto } from '../../services/categories/dto/categoryDto';
import { popupConfirm } from '../../lib/popupMessages';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import { CheckSquareOutlined, EyeOutlined,EditOutlined,FilterOutlined,PlusOutlined,CaretDownOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import SearchComponent from '../../components/SearchComponent';
import CategoryType from '../../services/types/categoryType';

export interface ICategoriesProps {
  categoryStore?: CategoryStore;
}

export interface ICategoriesState {
  categoryModalVisible: boolean;
  categoriesModalId: number;
  categoryModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount:number;
  };
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  isActiveFilter?:boolean;
  keyword?:string;
  typeFilter?:CategoryType;
  categoryDetailsModalVisible:boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.CategoryStore)
@observer
export class Categories extends AppComponentBase<ICategoriesProps, ICategoriesState> {
  formRef = React.createRef<FormInstance>();

  state = {
    categoryModalVisible: false,
    categoriesModalId: 0,
    categoryModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount:0
    },
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    isActiveFilter:undefined,
    keyword:undefined,
    categoryDetailsModalVisible:false,
    typeFilter:undefined,

  };

  async componentDidMount() {
    this.updateCategoriesList(this.state.meta.pageSize, 0);
  }

  async updateCategoriesList(maxResultCount: number, skipCount: number) {
    this.props.categoryStore!.maxResultCount = maxResultCount;
    this.props.categoryStore!.skipCount = skipCount;
    this.props.categoryStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.categoryStore!.keyword = this.state.keyword;
    this.props.categoryStore!.type = this.state.typeFilter;
    this.props.categoryStore!.getCategories();
  }

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({isActiveFilter:value === 3 ? undefined : value === 1 ? true : false});
          }}
          value={this.state.isActiveFilter=== undefined ? 3 : !this.state.isActiveFilter ? 0 : 1}
        >
          <Select.Option key={1} value={1}>{L('Activated')}</Select.Option>
          <Select.Option key={0} value={0}>{L('Deactivated')}</Select.Option>
          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateCategoriesList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({isActiveFilter:undefined},()=>{
              this.updateCategoriesList(this.state.meta.pageSize,this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });

  getColumnTypeSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
           
            this.setState({typeFilter:value === 3 ? undefined : value});
          }}
          value={this.state.typeFilter=== undefined ? 3 : this.state.typeFilter }
        >
          <Select.Option key={1} value={1}>{L('Dishes')}</Select.Option>
          <Select.Option key={0} value={0}>{L('Courses1')}</Select.Option>
          <Select.Option key={2} value={2}>{L('Products')}</Select.Option>

          
          <Select.Option key={3} value={3}>{L('All')}</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateCategoriesList(this.state.meta.pageSize,this.state.meta.skipCount);
          }}
         
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({typeFilter:undefined},()=>{
              this.updateCategoriesList(this.state.meta.pageSize,this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });

  async openCategoryModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.categoryStore!.categoryModel=undefined;
      this.setState({ categoryModalType: 'create' });
    } else {
      await this.props.categoryStore!.getCategory(entityDto);
      this.setState({ categoryModalType: 'edit' });
    }
    this.setState({ categoryModalVisible: !this.state.categoryModalVisible, categoriesModalId: entityDto.id });
  }


  createOrUpdateCategory = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.imageUrl = document.getElementById('category-image')!.getAttribute("value") ?document.getElementById('category-image')!.getAttribute("value") : this.props.categoryStore!.categoryModel?.imageUrl;    
      values.iconUrl = document.getElementById('category-icon')!.getAttribute("value") ?document.getElementById('category-icon')!.getAttribute("value"): this.props.categoryStore!.categoryModel?.iconUrl;          
      if (this.state.categoriesModalId === 0) {
        await this.props.categoryStore!.createCategory(values as CreateCategoryDto);
      } else {
        values.id = this.state.categoriesModalId;
        await this.props.categoryStore!.updateCategory(values as UpdateCategoryDto);
      }
      this.setState({ categoryModalVisible: false });
      form!.resetFields();
    });
     
  }

  onSwitchCategoryActivation = async (category: CategoryDto) => {
    popupConfirm(async () => {
      if(category.isActive)
      await this.props.categoryStore!.categoryDeactivation({ id: category.id });
      else
      await this.props.categoryStore!.categoryActivation({ id: category.id });
    }, category.isActive ? L('AreYouSureYouWantToDeactivateThisCategory') : L('AreYouSureYouWantToActivateThisCategory'));
  }

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  async openCategoryDetailsModal(entityDto: EntityDto) {
    await this.props.categoryStore!.getCategory(entityDto);
    this.setState({ categoryDetailsModalVisible: !this.state.categoryDetailsModalVisible, categoriesModalId: entityDto.id });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }
  categoriesTableColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: CategoryDto) => {
        return (
          <div onClick={() => this.openImageModal(item.imageUrl!, item.enName)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
            <Avatar shape='square' size={50} src={item.imageUrl} />
          </div>
        );
      }
    },
    {
      title: L('Icon'),
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      render: (iconUrl: string, item: CategoryDto) => {
        return (
          <div onClick={() => this.openImageModal(item.iconUrl!, item.enName)} style={{ display: 'inline-block', cursor: "zoom-in" }}>
            <Avatar shape='square' size={50} src={item.iconUrl} />
          </div>
        );
      }
    },
    {
      title: L('Type'),
      dataIndex: 'type',
      key: 'type',
      ...this.getColumnTypeSearchProps(),
      render: (type: number) => {
        switch(type){
          case CategoryType.Dishes:
            return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Dishes')}</Tag>;
          case CategoryType.Courses:
            return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Courses1')}</Tag>;
          case CategoryType.Products:
            return <Tag color={'processing'} className='ant-tag-disable-pointer'>{L('Products')}</Tag>;
          
            
        }
        return "";
      }
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      ...this.getColumnStatusSearchProps(),
      render: (isActive: boolean) => {
        return <Tag color={isActive ? 'green' : 'volcano'} className='ant-tag-disable-pointer'>{isActive ? L('Active') : L('Inactive')}</Tag>;
      }
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: CategoryDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                   <Menu.Item onClick={() => this.openCategoryDetailsModal({ id: item.id })}>
                  <EyeOutlined className="action-icon"  />
                  <button className="inline-action">{L('Details')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.openCategoryModal({ id: item.id })}>
                  <EditOutlined   className="action-icon" />
                  <button className="inline-action">{L('Edit')}</button>
                </Menu.Item>
                <Menu.Item onClick={() => this.onSwitchCategoryActivation(item)}>
                 <CheckSquareOutlined  className="action-icon" />
                  <button className="inline-action" >{item.isActive ? L('Deactivate') : L('Activate')}</button>
                </Menu.Item>
              
              </Menu>
            }
            placement="bottomLeft"
          >
            <Button type="primary" icon={<CaretDownOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateCategoriesList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateCategoriesList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const categories = this.props.categoryStore!.categories;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.categoryStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Categories')}</span>

            <Button type="primary" style={{ float: localization.getFloat(), margin: '0 5px' }} icon={<PlusOutlined/>} onClick={() => this.openCategoryModal({ id: 0 })}>
              {L('AddCategory')}
            </Button>
          </div>
        }
      >
          <SearchComponent
          searchText={L('SearchByName')}
        onSearch={(value: string)=>{
          this.setState({keyword:value},()=>{
            this.updateCategoriesList(this.state.meta.pageSize,this.state.meta.skipCount);
          });
        }}
        />

        <Table
          pagination={pagination}
          rowKey={record => record.id + ""}
          style={{ marginTop: '12px' }}
          loading={this.props.categoryStore!.loadingCategories}
          dataSource={categories === undefined ? [] : categories}
          columns={this.categoriesTableColumns}

        />

        <CreateOrUpdateCategory
          formRef={this.formRef}
          visible={this.state.categoryModalVisible}
          onCancel={() =>
            this.setState({
              categoryModalVisible: false,
            })
          }
          modalType={this.state.categoryModalType}
          onOk={this.createOrUpdateCategory}
          isSubmittingCategory={this.props.categoryStore!.isSubmittingCategory}
          categoryStore={this.props.categoryStore}
        />

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => { this.closeImageModal(); }} />

<CategoryDetailsModal
          visible={this.state.categoryDetailsModalVisible}
          onCancel={() =>
            this.setState({
              categoryDetailsModalVisible: false,
            })
          }
          categoryStore={this.props.categoryStore!}
        />
      </Card>
    );
  }
}

export default Categories;
