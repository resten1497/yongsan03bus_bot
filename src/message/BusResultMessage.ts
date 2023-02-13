export const busResultMessage = (resultObject: busResult) => {
  const responseTeplate = {
    version: "2.0",
    template: {
      outputs: [
        {
          basicCard: {
            title: resultObject.stNm,
            thumbnail: {
              fixedRatio: true,

              imageUrl: resultObject.Image,
            },
            description: resultObject.description,
            buttons: [
              {
                action: "message",
                label: "다시 조회",
                messageText: resultObject.stNm,
              },
            ],
          },
        },
      ],
    },
  };

  return responseTeplate;
};
