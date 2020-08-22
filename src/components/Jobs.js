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
  Progress,
} from 'antd';
const axios = require('axios').default;

const { Meta } = Card;
const serverUrl = `https://abracadabrant-livre-16709.herokuapp.com`;
const antdNotificationDuration = 10;

/* TODO: refactor this */
const FormApplyJob = (props) => {

  const {
    form,
    isUploadBtnDisabled,
    chngUploadBtnDisability,
  } = props;

  const [files, setFiles] = useState([]);

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

          if (value.type !== 'application/pdf')
            return Promise.reject('Should be pdf file!');

          return Promise.resolve();
        },
      }),
    ]
  };

  const fileRemove = () => {
    setFiles([]);
    chngUploadBtnDisability(false);
  };

  const fileBeforeUpload = file => {
    chngUploadBtnDisability(true);
    setFiles([file]);

    // to prevent default upload behaviour
    return false; 
  };

  const getSelectedFile = e => {
    if (e.fileList.length === 0)
      return null;

    return e && e.fileList[0].originFileObj;
  };

  const uploadBtnProps = {
    accept: '.pdf, application/pdf',
    onRemove: fileRemove,
    beforeUpload: fileBeforeUpload,
    files, // IDK why this have to be set
  };

  return (
    <Form
      {...formLayoutProps} name="applyJob"
      form={form}
    >
      <Form.Item label="Full Name" name="name"
        rules={formValidationRules.name}
      >
        <Input allowClear />
      </Form.Item>

      <Form.Item label="Mobile No." name="contact"
        rules={formValidationRules.contact}
      >
        <Input addonBefore='+91' allowClear />
      </Form.Item>

      <Form.Item label="Resume" name="resume"
        getValueFromEvent={getSelectedFile} required={true}
        rules={formValidationRules.resume}
      >
        <Upload {...uploadBtnProps} >
          <Button disabled={isUploadBtnDisabled}>
            Click to Upload
          </Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

const ModalApplyJob = (props) => {

  const { jobObj, visible, setIsModalVisible } = props;

  const [form] = Form.useForm();
  const [isReqProcessing, setIsReqProcessing] = useState(false);
  const [isUploadBtnDisabled, SetIsUploadBtnDisabled] = useState(false);
  const [isProgBarHidden, setIsProgBarHidden] = useState(true);
  const [uploadPercent, setUploadPercent] = useState(0);

  const setProgressBarVal = (e) => {
    const uploadPercent = Number.parseInt(e.loaded / e.total * 100);
    setUploadPercent(uploadPercent);
  };

  const createAndPopulateNativeForm = (form) => {
    const fd = new FormData();
    const formItemNames = ['name', 'contact', 'resume'];

    for (const key of formItemNames) {
      const val = form.getFieldValue(key);
      if (key === 'resume')
        fd.append(key, val, val.name);
      else
        fd.append(key, val);
    };

    return fd;
  };

  const handleFormSubmit = async (values) => {
    const errorNotification = () => {
      notification.error({
        message: 'Aww! some error occured!!',
        description: `Sorry, your application could not be processed.
          Please try again later.`,
        duration: antdNotificationDuration,
      });
    };

    const successNotification = () => {
      notification.success({
        message: 'Success!',
        description: `We have received your application.`,
        duration: antdNotificationDuration,
      });
    };
    
    const applyJobURL = `${serverUrl}/api/jobs/apply/${jobObj._id}`;
    const formdata = createAndPopulateNativeForm(form);
    const axiosOpts = { onUploadProgress: setProgressBarVal };

    try {
      await axios.post(applyJobURL, formdata, axiosOpts);
      successNotification();
    } catch (error) {
      errorNotification();
    }
  };


  const handleModalOk = async () => {
    setIsReqProcessing(true);

    try {
      await form.validateFields();

      setIsProgBarHidden(false);

      await handleFormSubmit();
    } catch (error) {
      console.log('form validatation error', error);
    }

    setIsReqProcessing(false);
  };

  /* Reset the modal
    Ideally should reset on react unmount but i guess
      i am not able to do that
    */
  const handleModalCancel = () => {
    form.resetFields();
    SetIsUploadBtnDisabled(false);
    setIsModalVisible(false);
    setIsProgBarHidden(true);
    setUploadPercent(0);
  };


  const JobModalBody = (
    <div disabled={true}>
      <h3>{jobObj.jobTitle}</h3>
      <h4>{jobObj.company} - {jobObj.location}</h4>
      <FormApplyJob
        form={form}
        isUploadBtnDisabled={isUploadBtnDisabled}
        chngUploadBtnDisability={SetIsUploadBtnDisabled}
      />
      <div hidden={isProgBarHidden}>
        <h4>Resume upload progress: </h4>
        <Progress percent={uploadPercent} />
      </div>
    </div>
  );

  const modalProps = {
    title: "Apply for...",
    centered: true,
    visible: visible,
    onOk: handleModalOk,
    onCancel: handleModalCancel,
    maskClosable: false,
    confirmLoading: isReqProcessing,
    closable: false,
    cancelButtonProps: { disabled: isReqProcessing },
    okText: 'Submit',
    cancelText: 'Return',
  };

  return (
    <Modal {...modalProps} >
      {JobModalBody}
    </Modal>
  );
};

/* List Item component */
function CardJob(props) {
  const { jobObj } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const ActionApplyJob = (
    <>
      <Button type='primary' onClick={() => setIsModalVisible(true)} >
        Apply for this Job
      </Button>
      <ModalApplyJob
        jobObj={jobObj}
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  );

  const cardDesc = (
    <>
      <h4>{jobObj.company} - {jobObj.location}</h4>
      <div>{jobObj.additionalDetails}</div>
    </>
  );

  return (
    <Card
      style={{ minWidth: '100%' }}
      actions={[ActionApplyJob]}
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

  // TODO: calls on every tab change, move to parent somehow
  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setIsDataFetching(true);

      try {
        const url = `${serverUrl}/api/jobs`;
        const fetchRes = await fetch(url);

        if (!fetchRes.ok) {
          errorNotification();
        } else {
          let fetchData = await fetchRes.json();
          setData(fetchData);
        }

      } catch (err) {
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
              <CardJob jobObj={item} />
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