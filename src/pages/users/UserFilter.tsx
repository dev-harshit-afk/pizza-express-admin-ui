import { Button, Card, Col, Input, Row, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type UsersFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
};

const UserFilter = ({ onFilterChange }: UsersFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Input.Search
                placeholder="search"
                onChange={(e) => onFilterChange("searchFilter", e.target.value)}
                allowClear={true}
              />
            </Col>
            <Col>
              <Select
                style={{ width: 120 }}
                placeholder="Select Role"
                options={[{ value: "Admin" }, { value: "Manager" }]}
                onChange={(selectedItem) =>
                  onFilterChange("roleFilter", selectedItem)
                }
                allowClear={true}
              ></Select>
            </Col>
            <Col>
              <Select
                style={{ width: 120 }}
                placeholder="Status"
                options={[{ value: "Active" }, { value: "Ban" }]}
                onChange={(statuFilter) =>
                  onFilterChange("roleFilter", statuFilter)
                }
                allowClear={true}
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
