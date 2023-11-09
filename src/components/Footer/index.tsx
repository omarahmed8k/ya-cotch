import * as React from 'react';
import { Col } from 'antd';
import './index.less';

const Footer = () => {
  return (
      <Col className={"footer"}>
        Powered by <a href="www.facebook.com" target="_blank">Right Access</a> - YaCotch &copy; {new Date().getFullYear()}
      </Col>
  );
};
export default Footer;
