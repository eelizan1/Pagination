// mirrors the response dto we have in the backend
// the generic T will be of type Page which will be passed to the data property
export interface ApiResponse<T> {
  timeStamp: string;
  statusCode: number;
  status: string;
  message: string;
  data: { page: T };
}
