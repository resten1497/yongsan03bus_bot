const getBusImage = (BusVeh1: number, BusVeh2: number): string => {
  //getBusImage(BusVeh1)
  return "yongsan03" + setBusImage(BusVeh1) + setBusImage(BusVeh2) + ".png";
};

const setBusImage = (BusVeh: number): string | undefined => {
  switch (BusVeh) {
    case 1:
      return "_small";
    case 2:
      return "_big";
    case 0:
      return "_null";
    default:
      break;
  }
};

export { getBusImage };
