import { Request, Response } from "express";
import * as PurchaseService from "../services/purchase.service";
import { PurchaseQuery, CreatePurchaseBody, UpdatePurchaseBody } from "../dtos/purchase.dto";

async function getAllPurchases(req: Request<{}, any[], {}, PurchaseQuery>, res: Response) {
	const [purchases, total] = await PurchaseService.getAllPurchases(req.query);
	res.set("X-Total-Count", total.toString());
	res.status(200).json(purchases);
}

async function getPurchaseById(req: Request<{ id: string }>, res: Response) {
	const id = Number(req.params.id);
	const purchase = await PurchaseService.getPurchaseById(id);
	res.status(200).json(purchase);
}

async function createPurchase(req: Request<{}, any, CreatePurchaseBody>, res: Response) {
	const created = await PurchaseService.createPurchase(req.body);
	res.status(201).json(created);
}

async function updatePurchase(req: Request<{ id: string }, any, UpdatePurchaseBody>, res: Response) {
	const id = Number(req.params.id);
	const updated = await PurchaseService.updatePurchase(id, req.body);
	res.status(200).json(updated);
}

async function deletePurchase(req: Request<{ id: string }>, res: Response) {
	const id = Number(req.params.id);
	await PurchaseService.deletePurchase(id);
	res.status(200).json({ message: "Purchase deleted successfully" });
}

async function restorePurchase(req: Request<{ id: string }>, res: Response) {
	const id = Number(req.params.id);
	const restored = await PurchaseService.restorePurchase(id);
	res.status(200).json(restored);
}

export { getAllPurchases, getPurchaseById, createPurchase, updatePurchase, deletePurchase, restorePurchase };

