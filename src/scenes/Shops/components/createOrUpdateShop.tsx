import * as React from 'react';
import { Modal, Button, Row, Col, Form, Input, Select, Tabs, TimePicker, message } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import { FormInstance } from 'antd/lib/form';
import {
  ContactsOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import locationsService from '../../../services/locations/locationsService';
import LocationType from '../../../services/types/locationType';
import './createOrUpdateShop.css';
import { OpeningDayDto } from '../../../services/restaurants/dto/openingDayDto';
import { ImageAttr } from '../../../services/dto/imageAttr';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
import Text from 'antd/lib/typography/Text';
import ShopStore from '../../../stores/shopStore';
import { CreateShopDto } from '../../../services/shops/dto/createShopDto';
import { UpdateShopDto } from '../../../services/shops/dto/updateShopDto';

const { TabPane } = Tabs;

interface IOTRow {
  checked: boolean;
  from: Date;
  to: Date;
  day: number;
}

export interface ICreateOrUpdateShopProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  shopStore?: ShopStore;
  isSubmittingShop: boolean;
}

export interface ICreateOrUpdateShopState {
  cities: Array<LiteEntityDto>;
  defaultenLogo: Array<ImageAttr>;
  defaultArLogo: Array<ImageAttr>;
  defaultenCover: Array<ImageAttr>;
  defaultArCover: Array<ImageAttr>;
  loadindOP: boolean;
  openingTimes: Array<OpeningDayDto>;
  openingTimesRows: IOTRow[];

  timestamp: number;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 9 },
    xl: { span: 9 },
    xxl: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 12 },
    xl: { span: 12 },
    xxl: { span: 12 },
  },
};

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 },
  xxl: { span: 12 },
};

@inject(Stores.ShopStore)
@observer
class CreateOrUpdateShop extends React.Component<
  ICreateOrUpdateShopProps,
  ICreateOrUpdateShopState
> {
  formRef = React.createRef<FormInstance>();

  cities: Array<LiteEntityDto> = [];
  openingTimesRows: any = [];
  openingTimes: IOTRow[] = [];

  state = {
    cities: [],
    defaultenLogo: [],
    defaultArLogo: [],
    defaultenCover: [],
    defaultArCover: [],
    openingTimesRows: [],
    loadindOP: false,

    openingTimes: [],
    timestamp: new Date().getMilliseconds(),
  };

  async componentDidMount() {
    let result = await locationsService.getAllLite({ type: LocationType.City });
    this.cities = result.items;
    this.setState({ cities: result.items });

    for (let day = 0; day < 7; day++) {
      let cur = [].filter((x: OpeningDayDto) => x.day === day);
      if (cur.length === 0) {
        this.openingTimes.push({
          checked: false,
          day,
          from: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate(),
            10,
            0,
            0
          ),
          to: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate(),
            22,
            0,
            0
          ),
        } as IOTRow);
      }
    }
    this.setState({ openingTimesRows: this.openingTimes });
  }

  toggleDatePickerDisableStatus = (disabled: boolean, dayOfWeek: number) => {
    let fromTimeSpanelement: HTMLSpanElement = document.getElementsByClassName('fromTimePicker')[
      dayOfWeek
    ] as HTMLSpanElement;
    let toTimeSpanelement: HTMLElement = document.getElementsByClassName('toTimePicker')[
      dayOfWeek
    ] as HTMLElement;

    if (!disabled) {
      fromTimeSpanelement.setAttribute('style', 'pointer-events:none');
      toTimeSpanelement.setAttribute('style', 'pointer-events:none');
    } else {
      fromTimeSpanelement.setAttribute('style', 'pointer-events:auto');
      toTimeSpanelement.setAttribute('style', 'pointer-events:auto');
    }

    let fromTimeInput: HTMLInputElement = fromTimeSpanelement.querySelector(
      'input'
    ) as HTMLInputElement;
    fromTimeInput.disabled = !disabled;
    let toTimeInput: HTMLInputElement = toTimeSpanelement.querySelector(
      'input'
    ) as HTMLInputElement;
    toTimeInput.disabled = !disabled;
  };

  handleTimePickerStatus = (selected: boolean, index: number) => {
    this.toggleDatePickerDisableStatus(selected, index);

    (this.state.openingTimesRows[index] as IOTRow).checked = selected;
  };

  componentDidUpdate() {
    const { shopModel } = this.props.shopStore!;

    if (
      this.state.defaultArCover.length === 0 &&
      shopModel !== undefined &&
      shopModel.arCover !== null
    ) {
      this.setState({
        defaultArCover: [
          {
            uid: 1,
            name: `arCover.png`,
            status: 'done',
            url: shopModel.arCover,
            thumbUrl: shopModel.arCover,
          },
        ],
      });
    }

    if (shopModel === undefined && this.state.defaultArCover.length > 0) {
      this.setState({ defaultArCover: [] });
    }

    if (
      shopModel !== undefined &&
      shopModel.arCover !== null &&
      this.state.defaultArCover.length > 0 &&
      this.state.defaultArCover[0]['url'] !== shopModel.arCover
    ) {
      this.setState({ defaultArCover: [] });
    }

    if (
      this.state.defaultArLogo.length === 0 &&
      shopModel !== undefined &&
      shopModel.arLogo !== null
    ) {
      this.setState({
        defaultArLogo: [
          {
            uid: 1,
            name: `arLogo.png`,
            status: 'done',
            url: shopModel.arLogo,
            thumbUrl: shopModel.arLogo,
          },
        ],
      });
    }

    if (shopModel === undefined && this.state.defaultArLogo.length > 0) {
      this.setState({ defaultArLogo: [] });
    }

    if (
      shopModel !== undefined &&
      shopModel.arLogo !== null &&
      this.state.defaultArLogo.length > 0 &&
      this.state.defaultArLogo[0]['url'] !== shopModel.arLogo
    ) {
      this.setState({ defaultArLogo: [] });
    }

    if (
      this.state.defaultenCover.length === 0 &&
      shopModel !== undefined &&
      shopModel.enCover !== null
    ) {
      this.setState({
        defaultenCover: [
          {
            uid: 1,
            name: `arCover.png`,
            status: 'done',
            url: shopModel.enCover,
            thumbUrl: shopModel.enCover,
          },
        ],
      });
    }

    if (shopModel === undefined && this.state.defaultenCover.length > 0) {
      this.setState({ defaultenCover: [] });
    }

    if (
      shopModel !== undefined &&
      shopModel.enCover !== null &&
      this.state.defaultenCover.length > 0 &&
      this.state.defaultenCover[0]['url'] !== shopModel.enCover
    ) {
      this.setState({ defaultenCover: [] });
    }

    if (
      this.state.defaultenLogo.length === 0 &&
      shopModel !== undefined &&
      shopModel.enLogo !== null
    ) {
      this.setState({
        defaultenLogo: [
          {
            uid: 1,
            name: `arCover.png`,
            status: 'done',
            url: shopModel.enLogo,
            thumbUrl: shopModel.enLogo,
          },
        ],
      });
    }

    if (shopModel === undefined && this.state.defaultenLogo.length > 0) {
      this.setState({ defaultenLogo: [] });
    }

    if (
      shopModel !== undefined &&
      shopModel.enLogo !== null &&
      this.state.defaultenLogo.length > 0 &&
      this.state.defaultenLogo[0]['url'] !== shopModel.enLogo
    ) {
      this.setState({ defaultenLogo: [] });
    }

    if (
      this.openingTimes.length > 0 &&
      shopModel !== undefined &&
      !this.state.loadindOP // restaurantModel.openingDays && restaurantModel.openingDays.length>0 &&
    ) {
      this.openingTimes = [];
      for (let day = 0; day < 7; day++) {
        let cur = shopModel.openingDays.filter((x: OpeningDayDto) => x.day === day);
        if (cur.length === 0) {
          this.openingTimes.push({
            checked: false,
            day,
            from: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              new Date().getDate(),
              10,
              0,
              0
            ),
            to: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              new Date().getDate(),
              22,
              0,
              0
            ),
          } as IOTRow);
        } else {
          this.openingTimes.push({
            checked: cur[0]['checked'] !== undefined ? cur[0]['checked'] : true,
            day,
            from: new Date(cur[0]['from']),
            to: new Date(cur[0]['to']),
          } as IOTRow);
        }
      }
      this.setState({
        openingTimesRows: this.openingTimes,
        loadindOP: true,
      });
    }
  }

  handleSubmit = async () => {
    let openingTimes: Array<OpeningDayDto> = [];
    this.state.openingTimesRows.map((item: IOTRow) => {
      if (item.checked) {
        openingTimes.push({
          day: item.day,
          from: moment(item.from).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
          to: moment(item.to).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
        });
      }
    });

    const form = this.formRef.current;
    form!
      .validateFields()
      .then(async (values: any) => {
        values.openingDays = openingTimes;
        values.arLogo =
          document.getElementById('arLogo-image')!.getAttribute('value') !== null
            ? document.getElementById('arLogo-image')!.getAttribute('value')
            : this.props.shopStore!.shopModel?.arLogo;
        values.arCover =
          document.getElementById('arCover-image')!.getAttribute('value') !== null
            ? document.getElementById('arCover-image')!.getAttribute('value')
            : this.props.shopStore!.shopModel?.arCover;
        values.enLogo =
          document.getElementById('enLogo-image')!.getAttribute('value') !== null
            ? document.getElementById('enLogo-image')!.getAttribute('value')
            : this.props.shopStore!.shopModel?.enLogo;
        values.enCover =
          document.getElementById('enCover-image')!.getAttribute('value') !== null
            ? document.getElementById('enCover-image')!.getAttribute('value')
            : this.props.shopStore!.shopModel?.enCover;

        if (this.props.modalType === 'create') {
          await this.props.shopStore!.createShop(values as CreateShopDto);
        } else {
          values.id = this.props.shopStore!.shopModel?.id;
          values.cityId = this.props.shopStore!.shopModel?.cityId;
          values.phoneNumber = this.props.shopStore!.shopModel?.phoneNumber;

          await this.props.shopStore!.updateShop(values as UpdateShopDto);
        }
        await this.props.shopStore!.getShops();
        this.props.onCancel();
        form!.resetFields();
      })
      .catch((reason: any) => {
        message.error(L('PleaseFillAllRequiredFileds'));
      });
  };

  handleCancel = () => {
    this.openingTimes = [];
    for (let day = 0; day < 7; day++) {
      this.openingTimes.push({
        checked: false,
        day,
        from: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate(),
          10,
          0,
          0
        ),
        to: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate(),
          22,
          0,
          0
        ),
      } as IOTRow);
    }

    this.setState({ loadindOP: false, openingTimesRows: this.openingTimes }, () => {
      this.props.onCancel();
    });
  };

  render() {
    const { visible, modalType } = this.props;
    const { shopModel } = this.props.shopStore!;

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateShop') : L('EditShop')}
        onCancel={this.handleCancel}
        centered
        width={'80%'}
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingShop}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <div className="shop-modal">
          <Form ref={this.formRef}>
            <Row>
              <Tabs defaultActiveKey="1" className="restaurant-tabs">
                <TabPane
                  tab={
                    <span>
                      <InfoCircleOutlined />
                      {L('General')}
                    </span>
                  }
                  key="1"
                >
                  <Row>
                    <Col {...colLayout}>
                      <Form.Item
                        label={L('ArName')}
                        name="arName"
                        colon={false}
                        initialValue={
                          shopModel !== undefined && shopModel.arName ? shopModel.arName : undefined
                        }
                        {...formItemLayout}
                        rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item
                        label={L('EnName')}
                        name="enName"
                        colon={false}
                        initialValue={
                          shopModel !== undefined && shopModel.enName ? shopModel.enName : undefined
                        }
                        {...formItemLayout}
                        rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item
                        label={L('ArDescription')}
                        name="arDescription"
                        colon={false}
                        initialValue={
                          shopModel !== undefined && shopModel.arDescription
                            ? shopModel.arDescription
                            : undefined
                        }
                        {...formItemLayout}
                        rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item
                        label={L('EnDescription')}
                        name="enDescription"
                        colon={false}
                        initialValue={
                          shopModel !== undefined && shopModel.enDescription
                            ? shopModel.enDescription
                            : undefined
                        }
                        {...formItemLayout}
                        rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item label={L('ArLogo')} {...formItemLayout} colon={false} required>
                        <img id="arLogo-image" style={{ display: 'none' }} alt="img" />

                        <EditableImage
                          defaultFileList={
                            shopModel !== undefined && shopModel.arLogo !== null
                              ? this.state.defaultArLogo
                              : []
                          }
                          onSuccess={(fileName) => {
                            document
                              .getElementById('arLogo-image')!
                              .setAttribute('value', fileName);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item label={L('EnLogo')} {...formItemLayout} colon={false} required>
                        <img id="enLogo-image" style={{ display: 'none' }} alt="img" />

                        <EditableImage
                          defaultFileList={
                            shopModel !== undefined && shopModel.enLogo !== null
                              ? this.state.defaultenLogo
                              : []
                          }
                          onSuccess={(fileName) => {
                            document
                              .getElementById('enLogo-image')!
                              .setAttribute('value', fileName);
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col {...colLayout}>
                      <Form.Item label={L('ArCover')} {...formItemLayout} colon={false}>
                        <img id="arCover-image" style={{ display: 'none' }} alt="img" />

                        <EditableImage
                          defaultFileList={
                            shopModel !== undefined && shopModel.arCover !== null
                              ? this.state.defaultArCover
                              : []
                          }
                          onSuccess={(fileName) => {
                            document
                              .getElementById('arCover-image')!
                              .setAttribute('value', fileName);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item label={L('EnCover')} {...formItemLayout} colon={false}>
                        <img id="enCover-image" style={{ display: 'none' }} alt="img" />

                        <EditableImage
                          defaultFileList={
                            shopModel !== undefined && shopModel.enCover !== null
                              ? this.state.defaultenCover
                              : []
                          }
                          onSuccess={(fileName) => {
                            document
                              .getElementById('enCover-image')!
                              .setAttribute('value', fileName);
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>
                {modalType === 'create' ? (
                  <TabPane
                    tab={
                      <span>
                        <UserOutlined />
                        {L('ShopManager')}
                      </span>
                    }
                    key="2"
                  >
                    <Row>
                      <Col {...colLayout}>
                        <Form.Item
                          label={L('Name')}
                          name="managerName"
                          {...formItemLayout}
                          colon={false}
                          rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col {...colLayout}>
                        <Form.Item
                          label={L('PhoneNumber')}
                          name="managerPhoneNumber"
                          colon={false}
                          {...formItemLayout}
                          rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col {...colLayout}>
                        <Form.Item
                          label={L('ManagerEmail')}
                          name="managerEmail"
                          colon={false}
                          {...formItemLayout}
                          rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col {...colLayout}>
                        <Form.Item
                          label={L('Password')}
                          name="managerPassword"
                          {...formItemLayout}
                          colon={false}
                          rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                        >
                          <Input.Password visibilityToggle />
                        </Form.Item>
                      </Col>
                      <Col {...colLayout}>
                        <Form.Item
                          label={L('ConfirmPassword')}
                          colon={false}
                          dependencies={['managerPassword']}
                          name="confirmPassword"
                          {...formItemLayout}
                          rules={[
                            { required: true, message: L('ThisFieldIsRequired') },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('managerPassword') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(L('TheTwoPasswordsThatYouEnteredDoNotMatch'))
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password visibilityToggle />
                        </Form.Item>
                      </Col>
                    </Row>
                  </TabPane>
                ) : null}
                <TabPane
                  tab={
                    <span>
                      <FieldTimeOutlined />
                      {L('OpeningTimes')}
                    </span>
                  }
                  key="3"
                >
                  <Row>
                    <div className="opening-times-row">
                      <Text style={{ width: '5%' }}></Text>
                      <Text style={{ width: '10%' }}>{L('Day')}</Text>
                      <Text style={{ width: '20%' }}>{L('FromTime')}</Text>
                      <Text style={{ width: '20%' }}>{L('ToTime')}</Text>
                    </div>

                    {this.state.openingTimesRows.map((row: IOTRow, key: number) => {
                      return (
                        <div className="opening-times-row" key={key}>
                          <Form.Item
                            style={{ width: '5%' }}
                            key={`item-${key}`}
                            name={`openingTime_${key}`}
                            initialValue={row.checked}
                            valuePropName="defaultChecked"
                          >
                            <Input
                              type="checkbox"
                              className="openTime-checkbox"
                              style={{ width: '2%' }}
                              onChange={(e) => {
                                this.handleTimePickerStatus(e.target.checked, key);
                                return e.target.checked;
                              }}
                            />
                          </Form.Item>

                          <Text style={{ width: '10%' }}>{timingHelper.getDay(key)}</Text>

                          <Form.Item
                            style={{ width: '20%' }}
                            name={`fromTime_${key}`}
                            initialValue={moment(row.from.toString())}
                          >
                            <TimePicker
                              use12Hours={true}
                              minuteStep={30}
                              onChange={(time: any) => {
                                (this.state.openingTimesRows[key] as IOTRow).from = time.toDate();
                              }}
                              className="fromTimePicker"
                              format={timingHelper.defaultTimeFormat}
                            />
                          </Form.Item>
                          <Form.Item
                            style={{ width: '20%' }}
                            name={`toTime_${key}`}
                            initialValue={moment(row.to.toString())}
                          >
                            <TimePicker
                              use12Hours={true}
                              minuteStep={30}
                              onChange={(time: any) => {
                                (this.state.openingTimesRows[key] as IOTRow).to = time.toDate();
                              }}
                              className="toTimePicker"
                              format={timingHelper.defaultTimeFormat}
                            />
                          </Form.Item>
                        </div>
                      );
                    })}
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <ContactsOutlined />
                      {L('Contacts')}
                    </span>
                  }
                  key="4"
                >
                  <Row>
                    <Col {...colLayout}>
                      <Form.Item
                        label={L('City')}
                        name="cityId"
                        colon={false}
                        {...formItemLayout}
                        initialValue={
                          shopModel !== undefined && shopModel.cityId
                            ? shopModel.city!.value
                            : undefined
                        }
                        rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                      >
                        <Select
                          placeholder={L('PleaseSelectCity')}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option: any) =>
                            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.cities.length > 0 &&
                            this.state.cities.map((element: LiteEntityDto) => (
                              <Select.Option key={element.value} value={element.value}>
                                {element.text}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col {...colLayout}>
                      <Form.Item
                        label={L('Street')}
                        name="street"
                        colon={false}
                        {...formItemLayout}
                        initialValue={
                          shopModel !== undefined && shopModel.street ? shopModel.street : undefined
                        }
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col {...colLayout}>
                      <Form.Item
                        label={L('BuildingNumber')}
                        name="buildingNumber"
                        colon={false}
                        {...formItemLayout}
                        initialValue={
                          shopModel !== undefined && shopModel.buildingNumber
                            ? shopModel.buildingNumber
                            : undefined
                        }
                      >
                        <Input type="number" min="0" />
                      </Form.Item>
                    </Col>

                    <Col {...colLayout}>
                      <Form.Item
                        label={L('PhoneNumber')}
                        name="phoneNumber"
                        colon={false}
                        rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                        {...formItemLayout}
                        initialValue={
                          shopModel !== undefined && shopModel.phoneNumber
                            ? shopModel.phoneNumber
                            : undefined
                        }
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item
                        label={L('FacebookUrl')}
                        name="facebookUrl"
                        colon={false}
                        initialValue={
                          shopModel !== undefined && shopModel.facebookUrl
                            ? shopModel.facebookUrl
                            : undefined
                        }
                        {...formItemLayout}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item
                        label={L('TwitterUrl')}
                        colon={false}
                        name="twitterUrl"
                        initialValue={
                          shopModel !== undefined && shopModel.twitterUrl
                            ? shopModel.twitterUrl
                            : undefined
                        }
                        {...formItemLayout}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item
                        label={L('InstagramUrl')}
                        colon={false}
                        name="instagramUrl"
                        initialValue={
                          shopModel !== undefined && shopModel.instagramUrl
                            ? shopModel.instagramUrl
                            : undefined
                        }
                        {...formItemLayout}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col {...colLayout}>
                      <Form.Item
                        label={L('Website')}
                        name="websiteUrl"
                        colon={false}
                        {...formItemLayout}
                        initialValue={
                          shopModel !== undefined && shopModel.websiteUrl
                            ? shopModel.websiteUrl
                            : undefined
                        }
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Row>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default CreateOrUpdateShop;
