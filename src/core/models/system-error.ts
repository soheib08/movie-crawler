export enum SystemErrorEnum {
  ImportMovieError,
}

export class SystemErrorData {}


export class SystemError {
  id: string;
  type: SystemErrorEnum;
  message: string;
  data: SystemErrorData;
}
