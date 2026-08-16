import { createContext, useEffect, useState } from "react";
export let Auth = createContext();
export function AuthProvider(props) {
  const [token, setToken] = useState(function () {
    return localStorage.getItem("token");
  });
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     setToken(localStorage.getItem("token"));
  //   }
  // }, []);
  return (
    <Auth.Provider value={{ token, setToken }}>{props.children}</Auth.Provider>
  );
}
