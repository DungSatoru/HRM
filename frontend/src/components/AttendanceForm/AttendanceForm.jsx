import React, { useEffect, useState } from 'react';
import { createAttendance, getAttendanceById, updateAttendance } from '~/services/attendanceService';
import { getEmployees } from '~/services/employeeService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '~/components/Loading/Loading';
import { Modal, Form, Input, DatePicker, TimePicker, Button, Select, List, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const AttendanceForm = ({ visible, onClose, onSuccess, mode, attendanceId }) => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [form] = Form.useForm();
  const [showEmployeeList, setShowEmployeeList] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mode === 'edit' && attendanceId) {
          const data = await getAttendanceById(attendanceId);
          console.log('Dữ liệu lấy được: ', data); // Debug log
          form.setFieldsValue({
            date: data.date ? moment(data.date) : null,
            checkIn: data.checkIn ? moment(data.checkIn, 'HH:mm') : null,
            checkOut: data.checkOut ? moment(data.checkOut, 'HH:mm') : null,
            note: data.note || '',
          });
        } else if (mode === 'create') {
          const empData = await getEmployees();
          setEmployees(empData);
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) fetchData();
  }, [mode, attendanceId, visible, form]);

  const handleSelectEmployee = (emp) => {
    setSelectedName(emp.fullName);
    setSearchTerm('');
    setShowEmployeeList(false);
    form.setFieldsValue({
      userId: emp.userId,
      fullName: emp.fullName,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const formattedData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        checkIn: values.checkIn ? values.checkIn.format('HH:mm') : '',
        checkOut: values.checkOut ? values.checkOut.format('HH:mm') : '',
      };

      if (mode === 'create') {
        if (!form.getFieldValue('userId')) {
          toast.error('Vui lòng chọn nhân viên.');
          return;
        }
        await createAttendance(formattedData);
      } else if (mode === 'edit') {
        await updateAttendance(attendanceId, formattedData);
      }
      onSuccess?.();
      onClose?.();
    } catch (error) {
      if (error.errorFields) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      } else {
        toast.error('Đã xảy ra lỗi!');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Modal
      title={mode === 'create' ? 'Tạo mới chấm công' : 'Chỉnh sửa chấm công'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      closeIcon={<CloseOutlined />}
      destroyOnClose
    >
      {loading ? (
        <Loading />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col md={12}>
              {mode === 'create' && (
                <Form.Item
                  label="Tìm kiếm nhân viên"
                  name="userId"
                  rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                >
                  <div style={{ position: 'relative' }}>
                    <Input
                      placeholder="Nhập tên nhân viên..."
                      value={searchTerm || selectedName}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedName('');
                        form.setFieldsValue({
                          userId: '',
                          fullName: '',
                        });
                        setShowEmployeeList(true);
                      }}
                      onFocus={() => setShowEmployeeList(true)}
                    />
                    {showEmployeeList && searchTerm && filteredEmployees.length > 0 && (
                      <List
                        style={{
                          position: 'absolute',
                          zIndex: 1,
                          width: '100%',
                          maxHeight: 200,
                          overflowY: 'auto',
                          backgroundColor: '#fff',
                          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                          marginTop: 4,
                        }}
                        dataSource={filteredEmployees}
                        renderItem={(emp) => (
                          <List.Item
                            style={{ padding: '8px 12px', cursor: 'pointer' }}
                            onClick={() => handleSelectEmployee(emp)}
                          >
                            {emp.fullName} ({emp.userId})
                          </List.Item>
                        )}
                      />
                    )}
                  </div>
                </Form.Item>
              )}
            </Col>
            <Col md={12}>
              <Form.Item label="Ngày" name="date" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled={mode === 'edit'} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Giờ vào" name="checkIn" rules={[{ required: true, message: 'Vui lòng chọn giờ vào' }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Giờ ra" name="checkOut" rules={[{ required: true, message: 'Vui lòng chọn giờ ra' }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === 'create' ? 'Tạo chấm công' : 'Lưu thay đổi'}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AttendanceForm;
