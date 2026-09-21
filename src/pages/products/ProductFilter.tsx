import { Card, Col, Form, Input, Row, Select, Switch, Typography } from "antd";
import { getCategories, getTenants } from "../../http/api";
import { useQuery } from "@tanstack/react-query";
import type { Category, Tenant } from "../../types";

type ProductFilterProps = {
  children: React.ReactNode;
};

const ProductFilter = ({ children }: ProductFilterProps) => {
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () =>
      getTenants(`perPage=100&currentPage=1`).then((res) => res.data),
  });

  const { data: category } = useQuery({
    queryKey: ["category"],
    queryFn: () => getCategories("").then((res) => res.data),
  });

  const restaurantOptions =
    restaurants?.data.map((restaurant: Tenant) => ({
      value: restaurant.id,
      label: restaurant.name,
    })) || [];

  const categoryOptions =
    category?.data.map((cat: Category) => ({
      value: cat._id,
      label: cat.name,
    })) || [];

  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item name="q">
                <Input.Search placeholder="search" allowClear={true} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="tenantId">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Restaurans"
                  options={restaurantOptions}
                  allowClear={true}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="categoryId">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select category"
                  options={categoryOptions}
                  allowClear={true}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isPublish" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Typography.Text style={{ marginLeft: 8 }}>
                isPublished
              </Typography.Text>
            </Col>
          </Row>
        </Col>

        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductFilter;
