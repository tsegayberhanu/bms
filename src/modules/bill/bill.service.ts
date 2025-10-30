import { BillStatus, Role, type Bill } from "../../generated/prisma/client.js";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../shared/errors/http-errors.js";
import type { RequestUser } from "../auth/auth.types.js";
import { BillRepository } from "./bill.repository.js";
import type {
  BillFilter,
  CreateBillInput,
  UpdateBillInput,
} from "./bill.types.js";

export class BillService {
  private static isUserAuthorized(bill: Bill, user: RequestUser): boolean {
    const isOwner =
      bill.billerId === user.userId || bill.customerId === user.userId;
    const isAdmin = user.role === Role.ADMIN;
    return isOwner || isAdmin;
  }
  static async createBill(data: CreateBillInput): Promise<Bill> {
    const bill = await BillRepository.create(data);
    // call reminder worker
    return bill
  }
  static async getBillById(
    id: string,
    user: RequestUser
  ): Promise<Bill | null> {
    const bill = await BillRepository.findById(id);

    if (!bill) {
      throw new NotFoundError(`Bill with ID ${id} not found.`);
    }

    if (!this.isUserAuthorized(bill, user)) {
      throw new ForbiddenError("You are not allowed to view this bill.");
    }

    return bill;
  }
  static async updateBill(
    authUser: RequestUser,
    id: string,
    data: UpdateBillInput
  ): Promise<Bill> {
    if (Object.keys(data).length === 0) {
      throw new ValidationError("Update payload cannot be empty.");
    }
    const existingBill = await BillRepository.findById(id);
    if (!existingBill) {
      throw new NotFoundError(`Bill ID '${id}' not found.`);
    }
    if (authUser.userId !== existingBill.billerId) {
      throw new UnauthorizedError("Biller authorization required for update.");
    }
    if (existingBill.status === BillStatus.PAID) {
      throw new Error(`Cannot update bill status: ${existingBill.status}.`);
    }
    return BillRepository.updateById(id, data);
  }
  static async deleteBill(id: string, authUser: RequestUser): Promise<Bill> {
    const existingBill = await BillRepository.findById(id);
    if (!existingBill) {
      throw new NotFoundError(`Bill ID '${id}' not found.`);
    }
    if (authUser.userId !== existingBill.billerId) {
      throw new UnauthorizedError("Biller authorization required for update.");
    }
    return await BillRepository.deleteById(id);
  }
  static async getBills(
    authUser: RequestUser,
    filters: BillFilter
  ): Promise<Bill[]> {
    const filter: BillFilter = { ...filters };
    if (filter.customerId) {
      if (
        authUser.role === Role.CUSTOMER &&
        filter.customerId !== authUser.userId
      ) {
        throw new UnauthorizedError(
          "Customer cannot query bills for another customer."
        );
      }
    }
    if (filter.billerId) {
      if (
        authUser.role === Role.BILLER &&
        filter.billerId !== authUser.userId
      ) {
        throw new UnauthorizedError(
          "Biller cannot query bills for another biller."
        );
      }
    }
    if (authUser.role === Role.CUSTOMER) {
      filter.customerId = authUser.userId; // enforce self bills
    } else if (authUser.role === Role.BILLER) {
      filter.billerId = authUser.userId; // enforce their own issued bills
    }

    return BillRepository.getBills(filter);
  }
}
