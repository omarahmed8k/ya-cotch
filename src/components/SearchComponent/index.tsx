import * as React from 'react';
import { Component } from 'react';
import {Input } from 'antd';
import { L } from '../../i18next';
import './index.less';


export interface ISearchComponentProps {
    onSearch: (value:any) => void;
    searchText?:string;
}


class SearchComponent extends Component<ISearchComponentProps, any> {
    
      render() {
        const { onSearch } = this.props;
        return (
          <Input.Search
          placeholder={this.props.searchText ? this.props.searchText : L("SearchHere")}
          allowClear
          className="table-search"
          enterButton
          size="middle"
          title={this.props.searchText ? this.props.searchText : L("SearchHere")}
          onSearch={onSearch}
        />
        );
    }
}

export default SearchComponent;