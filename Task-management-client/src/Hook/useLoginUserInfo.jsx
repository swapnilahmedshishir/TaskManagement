import { useContext } from "react";
import { AppContext } from "../Context/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSequre from "./useAxiosSequre";

const useLoginUserInfo = () => {
  const { user, isLoading } = useContext(AppContext);
  const axiosSecure = useAxiosSequre();
  // Use React Query to fetch the admin status
  const {
    data,
    isLoading: isUserLoading,
    refetch,
  } = useQuery({
    queryKey: [user?.email, "loginUserInfo"],
    enabled: !isLoading,
    queryFn: async () => {
      if (!user?.email) return false;
      const response = await axiosSecure.get(`/api/loginUser/${user?.email}`);
      return response.data;
    },
  });

  return [data, isUserLoading, refetch];
};

export default useLoginUserInfo;
