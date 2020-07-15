import React, { useState, useEffect } from 'react';
import {
    Card,
    List,
    Button,
    Modal,
    Form,
    Input, 
    Upload,
    notification,
} from 'antd';

const { Meta } = Card;
const serverUrl = `https://abracadabrant-livre-16709.herokuapp.com`;
// const serverUrl = 'http://localhost:3002';
const ModalApplyJob = (props) => {

    const { jobObj, visible, chngVisibility } = props;
  
    const url = `${serverUrl}/api/jobs/apply/${jobObj._id}`;
  
    const [ form ] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ files, setFiles ] = useState([]);
    const [ disableUploadBtn, setUploadBtnDisablity ] = useState(false);
  
    const uploadBtnProps = {
      accept: '.pdf, application/pdf',
  
      onRemove: () => {
        setFiles([]);
        setUploadBtnDisablity(false);
      },
      beforeUpload: file => {
        setUploadBtnDisablity(true);
        setFiles([file]);
        
        return false;
      },
      files,
    };
  
    const formLayoutProps = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
  
    const formValidationRules = {
      name: [
        {
            required: true,
            message: 'This field is required!',
        },
        {
            pattern: /^[A-Za-z\s]+$/,
            message: 'Should only have letters and spaces!'
        },
        {
            max: 100,
            message: 'Should be less than 100 characters!'
        }
      ],
      contact: [
        {
            required: true,
            message: 'This field is required!',
        },
        {
            pattern: /^[6-9]\d*$/,
            message: 'Invalid mobile number!'
        },
        {
            len: 10,
            message: 'Should contain 10 digits only!'
        },
      ],
      resume: [
        () => ({
          validator(rule, value) {
            if (!value)
              return Promise.reject('This field is required!');
  
            if(value.type!=='application/pdf')
              return Promise.reject('Should be pdf file!');
                            
            return Promise.resolve();
          },
        }),
      ]
    };
  
    const getSelectedFile = e => {
      if(e.fileList.length === 0)
      return null;
        
      return e && e.fileList[0].originFileObj;
    };
    
    const createAndPopulateFormData = (values) => {
      const fd = new FormData();
      for (const [key, value] of Object.entries(values)) {
        if(key==='resume'){
          fd.append(key, value, value.name);
        }
        else
          fd.append(key, value);
      };
  
      return fd;
    }
  
    const handleFormSubmit = async (values) => {
      
      const errorNotification = () => {
        notification.error({
          message: 'Aww! some error occured!!',
          description: `Sorry, your application could not be processed.
            Please try again later.`
        });
      };
      const successNotification = () => {
        notification.success({
          message: 'Success!',
          description: `We have received your application.`
        });
      };
  
      const formdata = createAndPopulateFormData(values);
  
      const reqOpts = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
          
      try {
        const response = await fetch(url, reqOpts);
        if(!response.ok){
          errorNotification();
        } else {
          successNotification();
        }
  
        setLoading(false);
      } catch (error) {
        setLoading(false);
        errorNotification();
        console.error('There has been a problem with your fetch operation:', error);
      }
  
    };
  
    const handleModalOk = async () => {
      try {
        setLoading(true);
        await form.validateFields();
        
        form.submit();
      } catch (error) {
        setLoading(false);
      }
              
    };
  
    const handleModalCancel = () => {
      form.resetFields();
      setUploadBtnDisablity(false);
      chngVisibility(false);
    };
  
    
    const JobModalBody = (
      <div>
        <h3>{jobObj.jobTitle}</h3>
        <h4>{jobObj.company} - {jobObj.location}</h4>
        {/* <hr /> */}
        <Form
          {...formLayoutProps} name="applyJob"
          form={form} onFinish={handleFormSubmit}
          // validateTrigger='onFinish'
        >
          <Form.Item label="Full Name" name="name"
            rules={formValidationRules.name}
          >
            <Input allowClear/>
          </Form.Item>
  
          <Form.Item label="Mobile No." name="contact"
            rules={formValidationRules.contact}
          >
            <Input addonBefore='+91' allowClear/>
          </Form.Item>
  
          <Form.Item label="Resume" name="resume"
            getValueFromEvent={getSelectedFile} required={true}
            rules={formValidationRules.resume}
          >
             <Upload {...uploadBtnProps} >
              <Button disabled={disableUploadBtn}>
                 Click to Upload
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    );
  
    const modalProps = {
      title: "Apply for...",
      centered: true,
      visible: visible,
      onOk: handleModalOk,
      onCancel: handleModalCancel,
      maskClosable: false,
      confirmLoading: loading,
      closable:false,
      cancelButtonProps: {disabled: loading},
      // okButtonProps: {disabled: !disableUploadBtn}
      okText: 'Submit',
      cancelText: 'Return',
    };
  
    return (
      <Modal {...modalProps} >
        {JobModalBody}
      </Modal>
    );
  }
  
  /* List Item component */
  function CardJob(props) {
    const { job: jobObj } = props;
    const cardDesc = (
      <>
        <h4>{jobObj.company} - {jobObj.location}</h4>
        <div>{jobObj.additionalDetails}</div>
      </>
    );
    
    const [ showJobModal, chngJobModalVisibility ] = useState(false);
  
    const ActionApplyJob = (
      <>
        <Button type='primary' onClick={() => chngJobModalVisibility(true)} >
          Apply for this Job
        </Button>
        <ModalApplyJob 
          jobObj={jobObj}
          visible={showJobModal}
          chngVisibility={chngJobModalVisibility} 
        />
      </>
    );
    return (
      <Card 
        style={{minWidth: '100%'}}
        actions={[ActionApplyJob]}
        // actions={[<ApplyJob job={jobObj} />]}
      >
        <Meta 
          title={<h3><strong>{jobObj.jobTitle}</strong></h3>}
          description={cardDesc}
        />
      </Card>
    );
  };
    
  function JobsPage() {
    const [data, setData] = useState([]);
    const [isDataFetching, setIsDataFetching] = useState(true);
  
    const errorNotification = () => {
      notification.error({
        message: 'Failed to retrieve list of jobs!!',
        description: 'Please try again later.'
      });
    };
  
    // Fetch jobs on component mount
    useEffect(() => {
      const fetchJobs = async () => {
        setIsDataFetching(true);
        
        try {
          const url = `${serverUrl}/api/jobs`;
          const fetchRes = await fetch(url);
  
          if(!fetchRes.ok){
            errorNotification();
          } else {
            let fetchData = await fetchRes.json();
            setData(fetchData);
          }
                  
        } catch(err) {
          errorNotification();
        }
  
        setIsDataFetching(false);
      };
      fetchJobs();  
    }, []);
  
    return (
      <div className="layout-content" >
        <div className="jobspage-container">
          <List
            dataSource={data}
            loading={isDataFetching}
            renderItem={item => (
              <List.Item key={item._id}>
                <CardJob job={item} />
                {/* Skeleton not useful here
                <Skeleton loading={loading} active></Skeleton> */}
              </List.Item>
            )}
          />
        </div>
      </div>
      
    );
};

export default JobsPage;