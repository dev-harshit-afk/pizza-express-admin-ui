import { Breadcrumb, Button, Drawer, Form, Space, Table } from "antd";
import { Link, Navigate } from "react-router-dom";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { useAuthStore, type User } from "../../store";
import UserFilter from "./UserFilter";
import { useState } from "react";
import UserForm from "./forms/UserForm";

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
];
const Users = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onCloseDrawer = () => {
    setDrawerOpen(false);
  };
  const onOpenDrawer = () => {
    setDrawerOpen(true);
  };
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers().then((res) => res.data),
  });

  const { user } = useAuthStore();

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space vertical style={{ width: "100%" }} size={"large"}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
        ></Breadcrumb>
        {isLoading && <div>Loading.....</div>}
        {isError && <div>{error.message}</div>}
        {/* <ul>{users && (<div>users?.map((user: User) => <li>{user.firstName}</li></div>)}</ul> */}
        <UserFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onOpenDrawer}>
            Create users
          </Button>
        </UserFilter>
        <Table columns={columns} dataSource={users} />
        <Drawer
          title="Create new user"
          size={720}
          destroyOnHidden={true}
          onClose={onCloseDrawer}
          open={drawerOpen}
          extra={
            <Space>
              <Button onClick={onCloseDrawer}>Cancel</Button>
              <Button onClick={onCloseDrawer} type="primary">
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" requiredMark={false}>
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
