import { Breadcrumb, Button, Drawer, Form, Space, Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";

import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createTenant, getTenants, updateTenant } from "../../http/api";
import TenantFilter from "./TenantFilter";
import { useAuthStore } from "../../store";
import TenantForm from "./forms/TenantForm";
import { useForm } from "antd/es/form/Form";
import type { CreateTenant, FieldData, Tenant } from "../../types";
import { debounce } from "lodash";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (_text: string) => {
      return <div>{_text.slice(0, 50)}</div>;
    },
  },
];

const Tenants = () => {
  const queryClient = useQueryClient();
  const [searchForm] = Form.useForm();
  const [currentEditingTenant, setCurrentEditingTenant] =
    useState<Tenant | null>(null);
  const [queryParams, setQueryParams] = useState({
    perPage: 2,
    currentPage: 1,
  });
  const {
    data: tenants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1]),
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>,
      ).toString();

      return getTenants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: createTenantMutation } = useMutation({
    mutationKey: ["create-tenant"],
    mutationFn: (tenant: CreateTenant) =>
      createTenant(tenant).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setDrawerOpen(false);
      return;
    },
  });
  const { mutate: updateTenantMutation } = useMutation({
    mutationKey: ["update-tenant"],
    mutationFn: (tenant: CreateTenant) =>
      updateTenant(tenant, String(currentEditingTenant?.id)).then(
        (res) => res.data,
      ),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setDrawerOpen(false);
      return;
    },
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();
  const [tenantFormdata] = useForm();

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    tenantFormdata.resetFields();
    setCurrentEditingTenant(null);
  };

  const handleTenantFormSubmit = async () => {
    const isEditing = !!currentEditingTenant;

    await tenantFormdata.validateFields();
    if (isEditing) {
      updateTenantMutation(tenantFormdata.getFieldsValue());
    } else {
      createTenantMutation(tenantFormdata.getFieldsValue());
    }
    tenantFormdata.resetFields();
    handleDrawerClose();
  };

  const deboucedQUpdate = useMemo(() => {
    return debounce((value) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
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
    }
  };
  useEffect(() => {
    if (currentEditingTenant) {
      console.log(currentEditingTenant);
      tenantFormdata.setFieldsValue({
        ...currentEditingTenant,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrawerOpen(true);
    }
  }, [currentEditingTenant, tenantFormdata]);

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space vertical style={{ width: "100%" }} size={"large"}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Restaurants" },
          ]}
        ></Breadcrumb>
        {isLoading && <div>Loading.....</div>}
        {isError && <div>{error.message}</div>}
        <Form form={searchForm} onFieldsChange={onFilterChange}>
          <TenantFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setCurrentEditingTenant(null);
                setDrawerOpen(true);
              }}
            >
              Add Restaurant
            </Button>
          </TenantFilter>
        </Form>
        <Table
          columns={[
            ...columns,
            {
              title: "Action",
              render: (_text: string, record: Tenant) => {
                return (
                  <Button
                    type="link"
                    onClick={() => {
                      setCurrentEditingTenant(record);
                      setDrawerOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                );
              },
            },
          ]}
          dataSource={tenants?.data}
          pagination={{
            total: tenants?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => {
                return { ...prev, currentPage: page };
              });
            },
            showTotal: (total, range) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />
        <Drawer
          title={currentEditingTenant ? "Edit Restuarant" : "Create restaurant"}
          size={720}
          destroyOnHidden={true}
          open={drawerOpen}
          onClose={handleDrawerClose}
          extra={
            <Space>
              <Button onClick={handleDrawerClose}>Cancel</Button>
              <Button type="primary" onClick={handleTenantFormSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form form={tenantFormdata}>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
