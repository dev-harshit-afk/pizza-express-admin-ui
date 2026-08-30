import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { Link, Navigate } from "react-router-dom";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser, getUsers, updateUser } from "../../http/api";
import { useAuthStore, type User } from "../../store";
import UserFilter from "./UserFilter";
import { useEffect, useMemo, useState } from "react";
import UserForm from "./forms/UserForm";
import type { CreateUser, FieldData } from "../../types";
import { debounce } from "lodash";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Restaurants",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return <div>{record.tenant?.name}</div>;
    },
  },
];
const Users = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentUserEditing, setCurrentEditingUser] = useState<User | null>(
    null,
  );
  const [queryParams, setQueryParams] = useState({
    perPage: 2,
    currentPage: 1,
  });
  const onCloseDrawer = () => {
    setCurrentEditingUser(null);
    setDrawerOpen(false);
  };
  const onOpenDrawer = () => {
    setDrawerOpen(true);
  };
  const {
    data: users,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1]),
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>,
      ).toString();

      return getUsers(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { user } = useAuthStore();
  const { mutate: createUserMutation } = useMutation({
    mutationKey: ["user"],
    mutationFn: (user: CreateUser) => createUser(user).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDrawerOpen(false);
      return;
    },
  });
  const { mutate: updateUserMutation } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: (user: CreateUser) =>
      updateUser(user, currentUserEditing!.id).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDrawerOpen(false);
      return;
    },
  });

  const onHandleSubmit = async () => {
    const isEditing = !!currentUserEditing;
    await form.validateFields();

    if (isEditing) {
      updateUserMutation(form.getFieldsValue());
    } else {
      createUserMutation(form.getFieldsValue());
    }

    form.resetFields();
    setCurrentEditingUser(null);
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
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  useEffect(() => {
    if (currentUserEditing) {
      console.log(currentUserEditing);
      form.setFieldsValue({
        ...currentUserEditing,
        tenantId: currentUserEditing.tenant?.id,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrawerOpen(true);
    }
  }, [currentUserEditing]);

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space vertical style={{ width: "100%" }} size={"large"}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Users" },
            ]}
          ></Breadcrumb>
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {isError && <Typography.Text>{error.message}</Typography.Text>}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UserFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onOpenDrawer}
            >
              Create users
            </Button>
          </UserFilter>
        </Form>

        <Table
          columns={[
            ...columns,
            {
              title: "Action",
              render: (_text: string, record: User) => {
                return (
                  <Button
                    type="link"
                    onClick={() => setCurrentEditingUser(record)}
                  >
                    Edit
                  </Button>
                );
              },
            },
          ]}
          dataSource={users?.data}
          pagination={{
            total: users?.total,
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
          title={currentUserEditing ? "Edit User" : "Create new user"}
          size={720}
          destroyOnHidden={true}
          onClose={onCloseDrawer}
          open={drawerOpen}
          extra={
            <Space>
              <Button onClick={onCloseDrawer}>Cancel</Button>
              <Button onClick={onHandleSubmit} type="primary">
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" requiredMark={false} form={form}>
            <UserForm isEditMode={!!currentUserEditing} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
