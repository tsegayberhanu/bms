import { Router } from "express";
import { BillController } from "./bill.controller.js";
import { authenticateUser, authorizeUser } from "../../shared/middlewares/auth.middleware.js";
const billRouter = Router();

billRouter.post("/", authenticateUser, authorizeUser(["BILLER"]), BillController.createBill);
billRouter.get("/", authenticateUser, BillController.getBills);
billRouter.get("/:id", authenticateUser, BillController.getBillById);
billRouter.patch("/:id", authenticateUser, authorizeUser(["BILLER"]), BillController.updateBill);
billRouter.delete("/:id",  authenticateUser,  authorizeUser(["BILLER"]),BillController.deleteBill)


export {billRouter};
