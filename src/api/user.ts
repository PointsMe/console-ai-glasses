import { http } from "@/utils/http";

interface ApiResponseData<T> {
  code: number;
  data: T;
  msg: string;
}
export type UserResult = {
  code: number;
  data: {
    token: string;
    account: {
      id: string;
      username: string;
      number: string;
      mobile: string;
      avatar: string;
      email: string;
      perms: Array<string>;
    };
  };
  msg: string;
};

export type MerchantDetailResult = {
  id: string;
  createdAt: string;
  code: string;
  name: string;
  logoUrl: string;
  description: string;
  company: {
    id: string;
    type: number | string;
    name: string;
    firstName: string | null;
    lastName: string | null;
    vatNumber: string | null;
    taxCode: string | null;
    country: {
      id: string | null;
      name: string | null;
      code: string | null;
    };
    province: {
      id: string | null;
      name: string | null;
      code: string | null;
    };
    city: string | null;
    zipcode: string | null;
    address: string | null;
    houseNumber: string;
    contactPhone: string;
    contactName: string;
    contactEmail: string;
    receiptCode: string | null;
    receiptEmail: string | null;
    siret: string | null;
    naf: string | null;
    rcs: string | null;
    cs: string | null;
  };
};
export type countryResponseData = ApiResponseData<MerchantDetailResult>;
export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>(
    "post",
    "/login",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

/** 获取商家详情 */
export const getMerchantDetail = () => {
  return http.request<countryResponseData>("post", "/merchant/detail", {
    data: {}
  });
};
/** 获取门店列表 */
export const getShopList = (data?: object) => {
  return http.request<any>("post", "/shop/page", { data });
};
export const getCountryListApi = () => {
  return http.request<any>("post", "/region/country/list");
};
export const getProvinceListApi = (data: any) => {
  return http.request<any>(
    "post",
    "/region/province/list",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
export const getCityListApi = (data: any) => {
  return http.request<any>(
    "post",
    "/region/city/list",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
/** 新增门店 */
export const addShop = (data?: object) => {
  return http.request<any>("post", "/shop/create", { data });
};
/** 修改门店 */
export const updateShop = (data?: object) => {
  return http.request<any>("post", "/shop/update", { data });
};

export const selectorShop = (data?: object) => {
  return http.request<any>("post", "/shop/selector", { data });
};
/** 员工列表 */
export const getEmployeeList = (data?: object) => {
  return http.request<any>("post", "/employee/page", { data });
};

/** 新增列表 */
export const addEmployeeApi = (data?: object) => {
  return http.request<any>("post", "/employee/create", { data });
};
/** 新增列表 */
export const getEmployeeDetailApi = (data?: object) => {
  return http.request<any>(
    "post",
    "/employee/detail",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
/** 新增列表 */
export const updateEmployeeApi = (data?: object) => {
  return http.request<any>("post", "/employee/update", { data });
};
export const getShopDetailApi = (data?: object) => {
  return http.request<any>(
    "post",
    "/shop/detail",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
export const getCameraListApi = (data?: object) => {
  return http.request<any>("post", "/device/camera/page", { data });
};
export const getviolationListApi = (data?: object) => {
  return http.request<any>("post", "/violation/page", { data });
};
export const getDisputeListApi = (data?: object) => {
  return http.request<any>("post", "/dispute/page", { data });
};
export const getViolationDetailApi = (data?: object) => {
  return http.request<any>(
    "post",
    "/violation/detail",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
export const getDisputeDetailApi = (data?: object) => {
  return http.request<any>(
    "post",
    "/dispute/detail",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
export const resetPasswordApi = (data?: object) => {
  return http.request<any>(
    "post",
    "/employee/password/reset",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
export const resetMobileApi = (data?: object) => {
  return http.request<any>(
    "post",
    "/employee/mobile/update",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
export const resetEmailApi = (data?: object) => {
  return http.request<any>(
    "post",
    "/employee/email/update",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
export const deleteEmployeeApi = (data?: object) => {
  return http.request<any>(
    "post",
    "/employee/delete",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
