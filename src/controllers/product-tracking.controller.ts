import {
    Request,
    Response,
} from "express";

import * as ProductTrackingService
    from "../services/product-tracking.service";

export async function getProductTracking(
    req: Request,
    res: Response
) {
    const result =
        await ProductTrackingService.getProductTracking(
            Number(
                req.query.productId
            )
        );

    return res
        .status(200)
        .json(result);
}