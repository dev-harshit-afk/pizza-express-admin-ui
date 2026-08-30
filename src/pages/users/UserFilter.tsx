import { Card, Col, Form, Input, Row, Select } from "antd";

type UsersFilterProps = {
  children: React.ReactNode;
};

const UserFilter = ({ children }: UsersFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item name="q">
                <Input.Search placeholder="search" allowClear={true} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="role">
                <Select
                  style={{ width: 120 }}
                  placeholder="Select Role"
                  options={[{ value: "Admin" }, { value: "Manager" }]}
                  allowClear={true}
                ></Select>
              </Form.Item>
            </Col>
            {/* <Col>
              <Select
                style={{ width: 120 }}
                placeholder="Status"
                options={[{ value: "Active" }, { value: "Ban" }]}
                allowClear={true}
              ></Select>
            </Col> */}
          </Row>
        </Col>

        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default UserFilter;
