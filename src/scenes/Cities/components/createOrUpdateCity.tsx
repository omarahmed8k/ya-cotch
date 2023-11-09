import * as React from 'react';
import { Form, Modal, Button, Input,Select } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import LocationStore from '../../../stores/locationStore';
import LocationType from '../../../services/types/locationType';
import localization from '../../../lib/localization';
import locationsService from '../../../services/locations/locationsService';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';


export interface ICreateOrUpdateLocationProps{
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  locationStore?: LocationStore;
  onOk: () => void;
  isSubmittingLocation: boolean;
  formRef:React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 },
  },
};

@inject(Stores.LocationStore)
@observer
class CreateOrUpdateCity extends React.Component<ICreateOrUpdateLocationProps, any> {
  countries:LiteEntityDto[]=[];
  
  async componentDidMount(){
    let result = await locationsService.getAllLite({type:LocationType.Country});
    this.countries = result.items;
  }
  
  handleSubmit = async () => {
    await this.props.onOk();
  }

  handleCancel = () => {
    this.props.onCancel();
    this.props.locationStore!.locationModel=undefined;
  }

  render() {
   
    const { visible, modalType } = this.props;
    const { locationModel } = this.props.locationStore!;
   
    
    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ?  L('CreateCity') : L('EditCity') }
         className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
       
        onCancel={this.handleCancel}
        centered
        maskClosable={false}
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={this.props.isSubmittingLocation} onClick={this.handleSubmit}>
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
        
            <>
              <FormItem label={L('ArName')} name="arName" {...formItemLayout}
               rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}
               colon={false}

              initialValue={locationModel !== undefined ? locationModel.arName : undefined}
              >
                  <Input /> 
              </FormItem>
              <FormItem label={L('EnName')} name="enName"  {...formItemLayout}
            rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}
            colon={false}

              initialValue={locationModel !== undefined ? locationModel.enName : undefined}
              >
                  <Input />
                
              </FormItem>
              
                <FormItem  name="parentId" 
                  {...formItemLayout}
                  label={L('Country')}
                  rules= {[{ required: true, message: L('ThisFieldIsRequired') }]}

                  initialValue={locationModel !== undefined ? locationModel.parent.value : undefined}
                >
                     <Select
          placeholder={L('PleaseSelectCountry')}  
          showSearch
          optionFilterProp="children"
          filterOption={(input, option:any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          >
          {this.countries.length>0 && this.countries.map((element:LiteEntityDto) => <Select.Option key={element.value} value={element.value}>{element.text}</Select.Option>)}
        </Select>
                </FormItem>
             
            </>
         
           
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateCity;
