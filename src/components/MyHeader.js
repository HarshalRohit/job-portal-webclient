import React, { useState } from 'react';
import { useLocation, Link  } from "react-router-dom";
import { Layout, Menu, Button, Tooltip } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

import './MyHeader.css'

const { Header } = Layout;

const NavMenu = (props) => {
  let location = useLocation();
  const menuDisplayMode = props.mode || 'horizontal';
  const onClickHandler = props.onClick || undefined
  
  return (
    <Menu 
      mode={menuDisplayMode} 
      defaultSelectedKeys={[location.pathname]} 
      onClick={onClickHandler}
      style={{border: '0px'}}
    >
      <Menu.Item key="/">
        Home
        <Link to="/" />
      </Menu.Item>
      <Menu.Item key="/jobs">
        Jobs
        <Link to="/jobs" />
      </Menu.Item>
      <Menu.Item key="3">nav 3</Menu.Item>
    </Menu>
  );
};

function MyHeader(){

  // const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isPortrait = useMediaQuery({ query: '(max-width: 767px)' });
  const [showMenu, setMenuStatus] = useState(false);
  const menuItemClickHandler = () => setMenuStatus(false);
  const menuBtnClickHandler = () => setMenuStatus(!showMenu);
    
  return (
    <Header className='header' >
      <div className='header-navbar'>
        <div className="logo">
          {/* Logo  */}
        </div>
        { !isPortrait &&
          <div className="navbar-tabs-container">
            <NavMenu mode="horizontal" />
          </div>
        }

        { isPortrait &&
          <div>
            <Tooltip title="Menu">
              <Button 
                type="text" 
                size="large"
                icon={<MenuOutlined />}
                onClick={menuBtnClickHandler} 
              />
            </Tooltip>
          </div>
        }
      </div>
      <div>
        { showMenu &&
          <div>
              <NavMenu mode="vertical" onClick={menuItemClickHandler}/>
          </div>
        }
      </div>
    </Header>
  );
}

export default MyHeader;