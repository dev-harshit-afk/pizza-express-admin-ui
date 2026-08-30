import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import type { Tenant } from "../../../types";
const UserForm = ({ isEditMode = false }) => {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => getTenants().then((res) => res.data),
  });
  return (
    <Space vertical style={{ width: "100%" }} size={"large"}>
      <Card title="Basic Info" variant="borderless">
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter firstName" }]}
            >
              <Input placeholder="Please enter first name" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter lastName" }]}
            >
              <Input placeholder="Please enter last name" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please provide email" }]}
            >
              <Input
                type={"email"}
                placeholder="Please enter email"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {!isEditMode && (
        <Card variant="borderless" title="Security">
          <Row>
            <Col>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please provide password" }]}
              >
                <Input.Password
                  placeholder="Please enter the password"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      )}

      <Card variant="borderless" title="Role">
        <Row style={{ width: "100%" }} gutter={20}>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please provide role" }]}
            >
              <Select
                id="selectBoxIbnUserForm"
                style={{ width: "100%" }}
                placeholder="Status"
                options={[
                  { value: "Admin" },
                  { value: "Manager" },
                  { value: "User" },
                ]}
                onChange={() => {}}
                allowClear={true}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="tenantId"
              label="Restaurant"
              rules={[{ required: true, message: "Please provide restaurant" }]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Tenant"
                options={tenants?.map((tenant: Tenant) => {
                  return { label: tenant.name, value: tenant.id };
                })}
                onChange={() => {}}
                allowClear={true}
              ></Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default UserForm;
