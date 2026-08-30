import { Navigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Icon, { BellFilled } from "@ant-design/icons";
import Home from "../components/icons/Home";
import Logo from "../components/icons/Logo";
import { useState } from "react";
import UserIcon from "../components/icons/UserIcon";
import { foodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <Icon component={Home} />,
      label: <NavLink to="/">Home</NavLink>,
    },

    {
      key: "/restaurants",
      icon: <Icon component={foodIcon} />,
      label: <NavLink to="/restaurants">Restaurants</NavLink>,
    },
    {
      key: "/products",
      icon: <Icon component={BasketIcon} />,
      label: <NavLink to="/products">Products</NavLink>,
    },
    {
      key: "/promos",
      icon: <Icon component={GiftIcon} />,
      label: <NavLink to="/promos">Promos</NavLink>,
    },
  ];

  if (role === "admin") {
    const menus = [...baseItems];
    menus.splice(1, 0, {
      key: "/users",
      icon: <Icon component={UserIcon} />,
      label: <NavLink to="/users">Users</NavLink>,
    });

    return menus;
  }
  return baseItems;
};

const Dashboard = () => {
  const location = useLocation();
  const { user, logout: logoutFromStore } = useAuthStore();
  const { mutate: logoutMutation } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutFromStore();
      return;
    },
  });
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  if (user === null) {
    return (
      <Navigate
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }
  const items = getMenuItems(user.role);

  console.log(items);

  return (
    <div>
      <Layout style={{ minHeight: "100vh", background: colorBgContainer }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="sidebar-logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={["/"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Flex
              gap="middle"
              align="start"
              justify="space-between"
              style={{ padding: "0 16px" }}
            >
              <Badge
                text={
                  user.role === "admin" ? "You are admin" : user.tenant?.name
                }
                status="success"
              />
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutMutation(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Avatar
                    style={{
                      backgroundColor: "#fde3cf",
                      color: "#f56a00",
                    }}
                  >
                    U
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "24px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>Pizza express shop</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
