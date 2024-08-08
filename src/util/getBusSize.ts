import { busSize } from "../interface/busSize.interface";

const BigSize = ["102025099"];
const SmallSize = [
  "102025101",
  "102025098",
  "102025103",
  "102025100",
  "102025102",
];

const getBusSize = (BusVehID: string): busSize => {
  // 큰버스의 경우 2, 작은 버스인 경우 1, 값이 없는경우 0
  if (BigSize.includes(BusVehID)) {
    return { code: 2, label: "큰버스" };
  } else if (SmallSize.includes(BusVehID))
    return { code: 1, label: "작은버스" };
  else return { code: 0, label: "출발 대기" };
};

export { getBusSize };
