export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message: string, statusCode = 401) {
    super(message, statusCode);
    this.name = "AuthError";
  }
}

export class NoteError extends AppError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode);
    this.name = "NoteError";
  }
}

export class AIError extends AppError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode);
    this.name = "AIError";
  }
}
