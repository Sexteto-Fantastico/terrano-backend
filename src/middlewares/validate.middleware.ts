import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { BadRequestError } from "../errors";

export const validateRequest = (schema: ZodType<any, any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsedData.body !== undefined) {
        req.body = parsedData.body;
      }

      if (parsedData.query !== undefined) {
        Object.defineProperty(req, "query", {
          value: parsedData.query,
          writable: true,
          configurable: true,
        });
      }

      if (parsedData.params !== undefined) {
        Object.defineProperty(req, "params", {
          value: parsedData.params,
          writable: true,
          configurable: true,
        });
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        next(new BadRequestError(`Validation failed: ${errorMessages}`));
      } else {
        next(error);
      }
    }
  };
};
