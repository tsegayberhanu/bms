import type { NextFunction, Request, Response } from "express";
import { BillService } from "./bill.service.js";
import { createBillSchema, updateBillSchema} from "./bill.validation.js";
import { APIResponder, parseWithSchema, type APIResponse } from "../../shared/utils/index.js";
import type { CreateBillInput, UpdateBillInput } from "./bill.types.js";

export class BillController {
  static async getBills(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { status, billerId, customerId, dueDateFrom, dueDateTo } = req.query;
      const filters = {
        status: status as any,
        billerId: billerId as string | undefined,
        customerId: customerId as string | undefined,
        dueDateFrom: dueDateFrom ? new Date(dueDateFrom as string) : undefined,
        dueDateTo: dueDateTo ? new Date(dueDateTo as string) : undefined,
      };

      const authUser = req.user;
      const bills = await BillService.getBills(authUser, filters);
      APIResponder.ok(res, bills, "BILLS_FETCHED", "Bills retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }
  static async createBill(
    req: Request<unknown, unknown, CreateBillInput>,
    res: Response<APIResponse>,
    next: NextFunction
  ) {
    try {
      const data = parseWithSchema(createBillSchema, req.body);
      const billerId = req.user.userId;
      const bill = await BillService.createBill({  ...data, billerId });
      APIResponder.created(
        res,
        bill,
        "BILL_CREATED",
        "Bill created successfully."
      );
    } catch (error) {
      next(error);
    }
  }
  static async getBillById(req: Request, res: Response, next: NextFunction) {
    try {
      const bill = await BillService.getBillById(req.params.id, req.user);

      APIResponder.ok(
        res,
        bill,
        "BILL_FETCHED",
        "Bill retrieved successfully."
      );
    } catch (error) {
      next(error);
    }
  }
  static async updateBill(
    req: Request<{ id: string }, unknown, UpdateBillInput>,
    res: Response<APIResponse>,
    next: NextFunction
  ) {
    try {
      const data = parseWithSchema(updateBillSchema, req.body);
      const bill = await BillService.updateBill(req.user, req.params.id, data);
      APIResponder.ok(
        res,
        bill,
        "BILL_UPDATED",
        "Bill updated successfully."
      );
    } catch (error) {
      next(error);
    }
  }
  static async deleteBill(
    req: Request<{ id: string }>,
    res: Response<APIResponse>,
    next: NextFunction
  ) {
    try {
      const billId = req.params.id;
      const authUser = req.user
      const deleted = await BillService.deleteBill(billId, authUser);
      APIResponder.ok(
        res,
        deleted,
        "BILL_DELETED",
        "Bill deleted successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}
