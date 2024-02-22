import env from './env';

type constructor<T> = {
  statusCode: number;
  title: string;
  message: string;
  success?: boolean;
  data?: T;
};

export class ApiResponse<T = null> {
  statusCode: number;
  title: string;
  message: string;
  success: boolean;
  data: T;

  constructor({ statusCode, message, data, title, success = true }: constructor<T>) {
    this.statusCode = statusCode;
    this.title = title
    this.message = message;
    this.success = success;

    if (typeof data === 'undefined') {
      this.data = null as T;
    } else {
      this.data = data;
    }
  }
}

export class ApiError<T = null> extends Error {
  statusCode: number;
  message: string;
  title: string;
  success: false;
  data: T;

  constructor({ statusCode, message, data, title }: constructor<T>) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.title = title;

    if (typeof data === 'undefined') {
      this.data = null as T;
    } else {
      this.data = data;
    }
  }

  getResponse() {
    return {
      message: this.message,
      data: this.data,
      title: this.title,
      success: this.success,
      statuscode: this.statusCode,
      stack: env.NODE_ENV === 'production' ? undefined : this.stack,
    };
  }
}
