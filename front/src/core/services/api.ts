import axios, { AxiosError } from 'axios';
import { CONFIG } from '../configs';
import Cookies from "js-cookie";

interface IToken {
  usuarioProfessor: string;
  isImpersonating: string;
  role: string[];
  membroDe: string[];
  nome: string;
  username: string;
}

export const AuthCookieName = "auth_token";
export const useApi = () => {
  const getApiUrl = () => {
    let url;
    var pathname = window.location.href
    // console.log(CONFIG.GATEWAY_URL)
    if(pathname.includes("localhost")){
      url = CONFIG.API_URL
    } else if(pathname.includes("-stg")){
      url = "https://oci-api-stg.sinprors.org.br";
    } else {
      url = "http://snp0:5000"
    }
    return url;
  }
  const api = axios.create({
    baseURL: getApiUrl(),
  });

  api.interceptors.request.use(async (config) => {
    const token = Cookies.get(AuthCookieName);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error: AxiosError) {
      if (401 === error?.response?.status) {
        logout();
        // alert("Houve um problema de autenticação, por favor logue novamente.");
        // if(window.location.href.includes("/login"))
        //   window.location.href = "/login";
      } else {
        return Promise.reject(error);
      }
    }
  );
  const setToken = (token: string) => {
    Cookies.set(AuthCookieName, token, { domain: "sinprors.org.br" });
  };
  const getToken = () => {
    return Cookies.get(AuthCookieName);
  };

  const getDecodedToken = (): IToken | undefined => {
    const { getToken } = useApi();
    // const token = getToken();
    // if(token){
    //   //@ts-ignore
    //   return jwt_decode(token!);
    // }
    return undefined;
  }
  const logout = () => {
    Cookies.remove(AuthCookieName, { domain: "sinprors.org.br" });
    window.location.href = "/login";
  }
  const isLogado = () => {
    const token = getDecodedToken();
    return token?.usuarioProfessor != undefined;
    // return api.get("auth/validar")
    // .then((res: AxiosResponse<ApiResponse>) => {
    //   return res.data.type == ResponseType.Success;
    // })
    // .catch(() => {
    //   return false;
    // });
  }

  return { api, isLogado, getToken, setToken, logout, getDecodedToken };
};