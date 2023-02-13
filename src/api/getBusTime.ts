import axios, { AxiosResponse } from "axios";
import { config } from "dotenv";

config();

const getBusTime = (arsID: string) => {
  let url: string = "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid";
  let queryParams: string =
    "?" +
    encodeURIComponent("ServiceKey") +
    process.env.API_CODE; /* Service Key*/
  queryParams +=
    "&" + encodeURIComponent("arsId") + "=" + encodeURIComponent(arsID); /* */
  url = url + queryParams;
  return axios.get(url).then((response: AxiosResponse) => {
    return response.data;
  });
};

export { getBusTime };
