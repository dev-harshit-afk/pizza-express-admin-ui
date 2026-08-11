import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { self } from "../http/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const getUser = async () => {
  const { data } = await self();
  return data;
};

const Root = () => {
  const { setUser } = useAuthStore();
  const { data } = useQuery({
    queryKey: ["self"],
    queryFn: getUser,
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }

      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Root;
