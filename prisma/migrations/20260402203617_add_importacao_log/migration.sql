-- CreateEnum
CREATE TYPE "ImportacaoStatus" AS ENUM ('PENDENTE', 'IMPORTANDO', 'SUCESSO', 'ERRO');

-- CreateTable
CREATE TABLE "importacao_log" (
    "id" SERIAL NOT NULL,
    "arquivo" TEXT NOT NULL,
    "pasta" TEXT NOT NULL,
    "tabela" TEXT NOT NULL,
    "status" "ImportacaoStatus" NOT NULL,
    "totalRegistros" INTEGER,
    "erroMensagem" TEXT,
    "iniciadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizadoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "importacao_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "importacao_log_arquivo_pasta_key" ON "importacao_log"("arquivo", "pasta");
