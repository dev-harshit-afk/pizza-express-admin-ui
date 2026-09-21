import {
  Form,
  Breadcrumb,
  Button,
  Flex,
  Image,
  Space,
  Table,
  Tag,
  Typography,
  Spin,
} from "antd";
import { Link } from "react-router-dom";
import {
  PlusOutlined,
  RightOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ProductFilter from "./ProductFilter";
import type { FieldData, Product } from "../../types";
import { getProducts } from "../../http/api";
import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: 400,
    key: "name",
    render: (_text: string, record: Product) => {
      return (
        <Space>
          <Image src={record.imageUrl} width={50} height={50} />
          <Typography> {record.name}</Typography>
        </Space>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 400,
  },

  {
    title: "Status",
    dataIndex: "isPublish",
    width: 200,
    key: "isPublish",
    render: (_text: string, record: Product) => {
      return record.isPublish ? (
        <Tag color={"green"}>Published</Tag>
      ) : (
        <Tag color={"purple"}>draft</Tag>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",

    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:mm  ")}
        </Typography.Text>
      );
    },
  },
];

const Product = () => {
  const { user } = useAuthStore();

  const [filterForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    limit: 4,
    page: 1,
    tenantId: user?.role === "admin" ? undefined : user?.tenant?.id,
  });
  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1]),
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>,
      ).toString();

      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const deboucedQUpdate = useMemo(() => {
    return debounce((value) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
    }, 500);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      deboucedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        page: 1,
      }));
    }
  };

  console.log("profdutc", products);

  return (
    <Space vertical style={{ width: "100%" }} size={"large"}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Products" },
          ]}
        ></Breadcrumb>
        {isFetching && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        )}
        {isError && <Typography.Text>{error.message}</Typography.Text>}
      </Flex>
      <Form form={filterForm} onFieldsChange={onFilterChange}>
        <ProductFilter>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
            Create Product
          </Button>
        </ProductFilter>
      </Form>
      <Table
        columns={[
          ...columns,
          {
            title: "Action",
            render: (_text: string, record: Product) => {
              return (
                <Button type="link" onClick={() => {}}>
                  Edit
                </Button>
              );
            },
          },
        ]}
        dataSource={products?.data}
        pagination={{
          total: products?.total,
          pageSize: queryParams.limit,
          current: queryParams.page,
          onChange: (page) => {
            setQueryParams((prev) => {
              return { ...prev, page: page };
            });
          },
          showTotal: (total, range) => {
            return `Showing ${range[0]}-${range[1]} of ${total} items`;
          },
        }}
      />
    </Space>
  );
};

export default Product;
