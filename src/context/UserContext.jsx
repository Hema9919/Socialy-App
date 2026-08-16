import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  async function getUserData() {
    let { data } = await axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    console.log(data.data.user)
    setUserData(data.data.user)
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    }
  },[]);
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}
