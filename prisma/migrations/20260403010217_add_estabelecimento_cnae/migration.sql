/*
  Warnings:

  - You are about to drop the column `cnaePrincipal` on the `estabelecimento` table. All the data in the column will be lost.
  - You are about to drop the column `cnaeSecundaria` on the `estabelecimento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "estabelecimento" DROP COLUMN "cnaePrincipal",
DROP COLUMN "cnaeSecundaria";

-- CreateTable
CREATE TABLE "estabelecimento_cnae" (
    "id" SERIAL NOT NULL,
    "estabelecimentoId" INTEGER NOT NULL,
    "cnaeId" INTEGER NOT NULL,
    "isPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estabelecimento_cnae_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estabelecimento_cnae_estabelecimentoId_cnaeId_key" ON "estabelecimento_cnae"("estabelecimentoId", "cnaeId");

-- AddForeignKey
ALTER TABLE "estabelecimento_cnae" ADD CONSTRAINT "estabelecimento_cnae_estabelecimentoId_fkey" FOREIGN KEY ("estabelecimentoId") REFERENCES "estabelecimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimento_cnae" ADD CONSTRAINT "estabelecimento_cnae_cnaeId_fkey" FOREIGN KEY ("cnaeId") REFERENCES "cnae"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
