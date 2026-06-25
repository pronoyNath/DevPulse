type TResponseData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

const sendResponse = <T>(res: any, data: TResponseData<T>) => {
  const body: Record<string, unknown> = {
    success: data.success,
    message: data.message,
  };

  if (data.data !== undefined) body["data"] = data.data;
  if (data.errors !== undefined) body["errors"] = data.errors;

  res.status(data.statusCode).json(body);
};

export default sendResponse;
