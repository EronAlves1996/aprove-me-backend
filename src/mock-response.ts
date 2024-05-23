export const mockResponse = () => {
  const mockRes = {
    statusCode: 0,
    send: () => {},
    setHeader: () => {},
    json: () => {},
  };
  mockRes.send = jest.fn().mockReturnValue(mockRes);
  mockRes.setHeader = jest.fn().mockReturnValue(mockRes);
  mockRes.json = jest.fn().mockReturnValue(mockRes);
  return mockRes;
};
