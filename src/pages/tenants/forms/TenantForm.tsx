import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Space } from "antd";
import { getTenants } from "../../../http/api";
const TenantForm = ({ isEditMode = false }) => {
  //   const { data: tenants } = useQuery({
  //     queryKey: ["tenants"],
  //     queryFn: () => getTenants("").then((res) => res.data),
  //   });
  return (
    <Space vertical style={{ width: "100%" }} size={"large"}>
      <Card title="Restaurant Info" variant="borderless">
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please enter Restaurant Name" },
              ]}
            >
              <Input placeholder="Please enter Restaurant name" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input placeholder="Please enter address" size="large" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default TenantForm;
