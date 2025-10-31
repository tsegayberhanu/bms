-- CreateEnum
CREATE TYPE "BillPaymentMode" AS ENUM ('FULL_ONLY', 'ALLOW_PARTIAL');

-- AlterEnum
ALTER TYPE "BillStatus" ADD VALUE 'PARTIAL';

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "paymentMode" "BillPaymentMode" NOT NULL DEFAULT 'ALLOW_PARTIAL';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "note" TEXT;

-- CreateIndex
CREATE INDEX "Bill_billerId_idx" ON "Bill"("billerId");

-- CreateIndex
CREATE INDEX "Bill_customerId_idx" ON "Bill"("customerId");

-- CreateIndex
CREATE INDEX "Payment_billId_idx" ON "Payment"("billId");

-- CreateIndex
CREATE INDEX "Payment_customerId_idx" ON "Payment"("customerId");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");
