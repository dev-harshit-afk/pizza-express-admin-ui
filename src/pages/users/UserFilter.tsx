import { Button, Card, Col, Input, Row, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const UserFilter = () => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Input.Search />
            </Col>
            <Col>
              <Select
                style={{ width: 120 }}
                placeholder="Select Role"
                options={[{ value: "Admin" }, { value: "Manager" }]}
              ></Select>
            </Col>
            <Col>
              <Select
                style={{ width: 120 }}
                placeholder="Status"
                options={[{ value: "Admin" }, { value: "Manager" }]}
              ></Select>
            </Col>
          </Row>
        </Col>

        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          <Button type="primary" icon={<PlusOutlined />}>
            Create users
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default UserFilter;
