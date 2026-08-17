import { Breadcrumb, Space, Table } from "antd";
import { Link, Navigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { useAuthStore, type User } from "../../store";
import UserFilter from "./UserFilter";

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
        <UserFilter />
        <Table columns={columns} dataSource={users} />
      </Space>
    </>
  );
};

export default Users;
