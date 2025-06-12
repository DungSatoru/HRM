import React, { useEffect, useState } from 'react';
import { createAttendance, getAttendanceById, updateAttendance } from '~/services/attendanceService';
import { getEmployees } from '~/services/employeeService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '~/components/Loading/Loading';
import { Modal, Form, Input, DatePicker, TimePicker, Button, Row, Col, Select } from 'antd';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const AttendanceForm = ({ visible, onClose, onSuccess, mode, attendanceId }) => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Luôn fetch danh sách nhân viên
        const empData = await getEmployees();
        setEmployees(empData);

        if (mode === 'edit' && attendanceId) {
          const data = await getAttendanceById(attendanceId);
          form.setFieldsValue({
            userId: data.userId,
            fullName: data.fullName,
            date: data.date ? moment(data.date) : null,
            checkIn: data.checkIn ? moment(data.checkIn, 'HH:mm') : null,
            checkOut: data.checkOut ? moment(data.checkOut, 'HH:mm') : null,
          });

          const selectedEmp = empData.find(emp => emp.userId === data.userId);
          setSelectedName(selectedEmp?.fullName || data.fullName);
        } else {
          form.resetFields();
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      form.resetFields(); // Reset form mỗi khi mở lại
      fetchData();
    }
  }, [mode, attendanceId, visible, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const checkIn = values.checkIn.format('HH:mm');
      const checkOut = values.checkOut.format('HH:mm');

      if (moment(checkIn, 'HH:mm').isAfter(moment(checkOut, 'HH:mm'))) {
        throw new Error('Giờ vào không thể sau giờ ra!');
      }

      const formattedData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        checkIn,
        checkOut,
      };

      if (mode === 'create') {
        if (!form.getFieldValue('userId')) {
          throw new Error('Vui lòng chọn nhân viên trước khi tạo chấm công!');
        }
        await createAttendance(formattedData);
      } else {
        await updateAttendance(attendanceId, formattedData);
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast.error(error?.message || 'Đã xảy ra lỗi!');
      console.error('Lỗi khi xử lý form chấm công:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Row gutter={16}>
              <Col md={12}>
                {mode === 'create' ? (
                  <Form.Item
                    label="Tìm kiếm nhân viên"
                    name="userId"
                    rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn nhân viên"
                      suffixIcon={<UserOutlined />}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {employees.map((emp) => (
                        <Select.Option key={emp.userId} value={emp.userId}>
                          {emp.fullName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item label="Nhân viên">
                    <Input value={selectedName} disabled />
                  </Form.Item>
                )}
              </Col>

              <Col md={12}>
                <Form.Item label="Ngày" name="date" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled={mode === 'edit'} />
                </Form.Item>
              </Col>

              <Col md={12}>
                <Form.Item
                  label="Giờ vào"
                  name="checkIn"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ vào' }]}
                >
                  <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col md={12}>
                <Form.Item
                  label="Giờ ra"
                  name="checkOut"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ ra' }]}
                >
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
          </>
        )}
      </Form>
    </Modal>
  );
};

export default AttendanceForm;
