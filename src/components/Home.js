import React from 'react';
import { PlusOutlined } from '@ant-design/icons';

import './Home.css';

import  contact1  from '../images/contact-1.webp'
import  contact2  from '../images/contact-2.webp'
import  contact3  from '../images/contact-3.webp'
// import  contact4  from '../images/contact-4.webp'
import { Card } from 'antd';

const { Meta } = Card;




function AboutUsContent() {
    return (
    <>
        <div className='aboutus-content-title'>
            The people behind this nice initiative:
        </div>
        <div className='aboutus-content'>
            <Card
                style={{ width: 200, border: '0px', paddingBottom: '10px' }}
                cover={<img alt="example" src={contact1} />}
            >
                <Meta title="Europe Street beat" description="Sr. Lead @ worktech" />
            </Card>
            <Card
                style={{ width: 200, border: '0px', paddingBottom: '10px' }}
                cover={<img alt="example" src={contact2} />}
            >
                <Meta title="Europe Street beat" description="Sr. Manager @ Mech Engineers" />
            </Card>
            <Card
                style={{ width: 200, border: '0px', paddingBottom: '10px' }}
                cover={<img alt="example" src={contact3} />}
            >
                <Meta title="Europe Street beat" description="Marketing Head @ E-Shop" />
            </Card>
            {/* <Card
                style={{ width: 200 }}
                cover={<img alt="example" src={contact4} />}
            >
                <Meta title="Europe Street beat" description="www.instagram.com" />
            </Card> */}
            
        </div>
    </>
    );
};

function AboutUs() {
    return (
        <section className='aboutus-div'>
            <section className='aboutus-header'>
                {/* style={{fontWeight: '4em'}} */}
                <PlusOutlined />
                ABOUT US
            </section>

            <AboutUsContent />      
        </section>
    );
  };

function Home() {
    return (
        <div className="home-container">
            <section className="hero">
                <div className="hero-inner" />
                slasjf;dsfjdsfaj;
            </section>
            <AboutUs />
        </div>
    );
  };

export default Home;