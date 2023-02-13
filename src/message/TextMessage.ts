export const TextMessage = (message: string) => {
  const responseTeplate: object = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: message,
          },
        },
      ],
    },
  };

  return responseTeplate;
};
