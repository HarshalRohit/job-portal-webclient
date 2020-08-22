import React from 'react';
import { Layout } from 'antd';

import MyHeader from './components/MyHeader.js'
import MyContent from './components/MyContent';

import './template-page.css';

const { Footer } = Layout;



// function MyHeader(){
//   let location = useLocation();
//   return (
//     <Header className='layout-header'>
//       <div className="logo">
//         Logo 
//       </div>
//       <div className="header-nav-menu">
//         <Menu mode="horizontal" defaultSelectedKeys={[location.pathname]} >
//           <Menu.Item key="/">
//             Home
//             <Link to="/" />
//           </Menu.Item>
//           <Menu.Item key="jobs">
//             Jobs
//             <Link to="/jobs" />
//           </Menu.Item>
//           <Menu.Item key="3">nav 3</Menu.Item>
//         </Menu>
//       </div>
//     </Header>
//   );
// }

function TemplatePage(){
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <MyHeader />
      <MyContent />
      <Footer style={{ textAlign: 'center' }}>Made with trial & error by Harshal Rohit</Footer>
    </Layout>
  );
};

export default TemplatePage;
