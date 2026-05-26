import { AppError, ConflictError, BadRequestError } from "./app-error";

interface TypeORMQueryError extends Error {
  code?: string;
  errno?: number;
  sqlMessage?: string;
  sql?: string;
  driverError?: {
    code?: string;
    errno?: number;
    sqlMessage?: string;
  };
}

const MYSQL_ERROR_MAP: Record<string, (error: TypeORMQueryError) => AppError> =
  {
    ER_DUP_ENTRY: (error) => {
      const match = error.message?.match(
        /Duplicate entry '(.+?)' for key '(.+?)'/
      );
      const value = match?.[1] ?? "unknown";
      const key = match?.[2] ?? "unknown";
      return new ConflictError(
        `Duplicate entry: the value '${value}' already exists for '${key}'.`
      );
    },

    ER_NO_REFERENCED_ROW_2: (error) => {
      const match = error.message?.match(
        /FOREIGN KEY \(`(.+?)`\) REFERENCES `(.+?)`/
      );
      const column = match?.[1] ?? "unknown";
      const table = match?.[2] ?? "unknown";
      return new BadRequestError(
        `Foreign key constraint failed: the referenced record in '${table}' (column '${column}') does not exist.`
      );
    },

    ER_ROW_IS_REFERENCED_2: (error) => {
      const match = error.message?.match(
        /FOREIGN KEY \(`(.+?)`\) REFERENCES `(.+?)`/
      );
      const column = match?.[1] ?? "unknown";
      const table = match?.[2] ?? "unknown";
      return new ConflictError(
        `Cannot delete or update: this record is still referenced by '${table}' (column '${column}').`
      );
    },

    ER_DATA_TOO_LONG: (error) => {
      const match = error.message?.match(/Data too long for column '(.+?)'/);
      const column = match?.[1] ?? "unknown";
      return new BadRequestError(
        `Data too long for column '${column}'. Please reduce the length of the value.`
      );
    },

    ER_BAD_NULL_ERROR: (error) => {
      const match = error.message?.match(/Column '(.+?)' cannot be null/);
      const column = match?.[1] ?? "unknown";
      return new BadRequestError(
        `The field '${column}' is required and cannot be null.`
      );
    },

    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: (error) => {
      const match = error.message?.match(
        /Incorrect (\w+) value: '(.+?)' for column '(.+?)'/
      );
      const type = match?.[1] ?? "unknown";
      const value = match?.[2] ?? "unknown";
      const column = match?.[3] ?? "unknown";
      return new BadRequestError(
        `Invalid ${type} value '${value}' for field '${column}'.`
      );
    },

    ER_NO_DEFAULT_FOR_FIELD: (error) => {
      const match = error.message?.match(
        /Field '(.+?)' doesn't have a default value/
      );
      const column = match?.[1] ?? "unknown";
      return new BadRequestError(`The field '${column}' is required.`);
    },

    ER_LOCK_DEADLOCK: () => {
      return new AppError(
        "A database conflict occurred. Please try again.",
        503
      );
    },
  };

export function handleDatabaseError(error: unknown): AppError | null {
  const queryError = error as TypeORMQueryError;

  const errorCode = queryError?.code ?? queryError?.driverError?.code;

  if (!errorCode) return null;

  const handler = MYSQL_ERROR_MAP[errorCode];
  if (handler) {
    return handler(queryError);
  }

  return null;
}
