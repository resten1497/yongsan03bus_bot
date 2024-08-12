import { configDotenv } from "dotenv";
import "dotenv/config";

configDotenv({ path: "./custom/path" });

import "./instrument";

import { getBusTime } from "./api";
import xml2js, { XmlDeclarationAttributes } from "xml2js";
import express from "express";
import bodyParser from "body-parser";
import { getBusImage, getBusSize } from "./util";
import { busResultMessage } from "./message";
import { busResult } from "../src/interface/busResult.interface";
import * as Sentry from "@sentry/node";

var fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

const parser = new xml2js.Parser({
  explicitArray: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Sentry.setupExpressErrorHandler(app);

app.post("/", function (req, res) {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleImage: {
            imageUrl:
              "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
            altText: "hello I'm Ryan",
          },
        },
      ],
    },
  };
  res.status(200).send(responseBody);
});

const PromiseParser = (data: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    parser.parseString(data, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

app.post("/getBusArriveInformation", async (req, res) => {
  let arsId = req.body.action.params.arsid;
  let data = await getBusTime(arsId);
  const result = await PromiseParser(data);
  let itemList = result.ServiceResult.msgBody.itemList;
  if (itemList.length > 1) {
    itemList = result.ServiceResult.msgBody.itemList[0];
  }
  let arrmsg1 = itemList.arrmsg1;
  let arrmsg2 = itemList.arrmsg2;
  let veh1 = itemList.vehId1;
  let veh2 = itemList.vehId2;
  let resultObject: busResult = {
    stNm: "",
    Image: "",
    description: "",
  };

  resultObject.stNm = itemList.stNm;

  if (arrmsg1 !== "운행종료") {
    switch (arrmsg1) {
      case "곧 도착":
        resultObject.description =
          "이번 버스 : " + getBusSize(veh1).label + "\n" + arrmsg1 + "\n";
        break;
      case "출발대기":
        resultObject.description = "이번 버스 : " + arrmsg1 + "\n";
        break;
      default:
        let split_Minute1 = arrmsg1.split("분");
        let Station_result1 = split_Minute1[1]
          .split("[")[1]
          .slice(0, -1)
          .replace("번째", "정류장");
        resultObject.description =
          "이번 버스 : " +
          getBusSize(veh1).label +
          "\n" +
          Station_result1 +
          ", " +
          split_Minute1[0] +
          "분 후 도착\n";
        break;
    }

    if (arrmsg2 !== "출발대기") {
      let split_Minute2 = arrmsg2.split("분");
      let Station_result2 = split_Minute2[1]
        .split("[")[1]
        .slice(0, -1)
        .replace("번째", "정류장");
      resultObject.description +=
        "다음 버스 : " +
        getBusSize(veh2).label +
        "\n" +
        Station_result2 +
        ", " +
        split_Minute2[0] +
        "분 후 도착\n";
    } else {
      resultObject.description += "다음 버스 : " + arrmsg2;
    }
    resultObject.Image =
      `${req.protocol}://${req.get("host")}/img/` +
      getBusImage(getBusSize(veh1).code, getBusSize(veh2).code);
    res.status(200).send(busResultMessage(resultObject));
  } else {
  }
});

app.get("/img/:name", (req, res) => {
  var filename = "./src/assets/Image/" + req.params.name;
  fs.readFile(filename, (err: NodeJS.ErrnoException | null, data: Buffer) => {
    res.writeHead(200, { "Context-Type": "image/jpg" }); //보낼 헤더를 만듬
    res.write(data); //본문을 만들고
    res.end(); //클라이언트에게 응답을 전송한다
  });
});

app.listen(port, function () {
  console.log(`app is Listening at ${port}`);
});
