-- CreateTable
CREATE TABLE "natureza_juridica" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "natureza_juridica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "porte_empresa" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "porte_empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pais" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipio" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cnae" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cnae_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "situacao_cadastral" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "situacao_cadastral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motivo_situacao_cadastral" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motivo_situacao_cadastral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identificador_matriz_filial" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identificador_matriz_filial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualificacao_socio" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qualificacao_socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identificador_socio" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identificador_socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresa" (
    "id" SERIAL NOT NULL,
    "cnpjBasico" INTEGER NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "naturezaJuridicaId" INTEGER NOT NULL,
    "qualificacaoResponsavel" TEXT,
    "capitalSocial" BIGINT,
    "porteEmpresaId" INTEGER,
    "enteFederativoResponsavel" TEXT,
    "situacaoEspecial" TEXT,
    "dataSituacaoEspecial" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estabelecimento" (
    "id" SERIAL NOT NULL,
    "cnpjBasico" INTEGER NOT NULL,
    "cnpjOrdem" INTEGER NOT NULL,
    "cnpjDv" INTEGER NOT NULL,
    "identificadorMatrizFilialId" INTEGER NOT NULL,
    "nomeFantasia" TEXT,
    "situacaoCadastralId" INTEGER NOT NULL,
    "dataSituacaoCadastral" TIMESTAMP(3),
    "motivoSituacaoCadastralId" INTEGER,
    "nomeCidadeExterior" TEXT,
    "paisId" INTEGER,
    "dataInicioAtividade" TIMESTAMP(3),
    "cnaePrincipal" INTEGER,
    "cnaeSecundaria" TEXT,
    "tipoLogradouro" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "uf" TEXT,
    "municipioId" INTEGER,
    "dddPrimario" INTEGER,
    "telefonePrimario" TEXT,
    "dddSecundario" INTEGER,
    "telefoneSecundario" TEXT,
    "dddFax" INTEGER,
    "fax" TEXT,
    "email" TEXT,
    "situacaoEspecial" TEXT,
    "dataSituacaoEspecial" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estabelecimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dados_simples" (
    "id" SERIAL NOT NULL,
    "cnpjBasico" INTEGER NOT NULL,
    "opcaoSimples" BOOLEAN,
    "dataOpcaoSimples" TIMESTAMP(3),
    "dataExclusaoSimples" TIMESTAMP(3),
    "opcaoMei" BOOLEAN,
    "dataOpcaoMei" TIMESTAMP(3),
    "dataExclusaoMei" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dados_simples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socio" (
    "id" SERIAL NOT NULL,
    "cnpjBasico" INTEGER NOT NULL,
    "identificadorSocioId" INTEGER NOT NULL,
    "nomeSocio" TEXT NOT NULL,
    "cnpjCpfSocio" TEXT,
    "qualificacaoSocioId" INTEGER NOT NULL,
    "dataEntradaSociedade" TIMESTAMP(3),
    "paisId" INTEGER,
    "representanteLegalCpf" TEXT,
    "nomeRepresentanteLegal" TEXT,
    "qualificacaoRepresentanteLegalId" INTEGER,
    "faixaEtaria" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "natureza_juridica_codigo_key" ON "natureza_juridica"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "porte_empresa_codigo_key" ON "porte_empresa"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "pais_codigo_key" ON "pais"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "municipio_codigo_key" ON "municipio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "cnae_codigo_key" ON "cnae"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "situacao_cadastral_codigo_key" ON "situacao_cadastral"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "motivo_situacao_cadastral_codigo_key" ON "motivo_situacao_cadastral"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "identificador_matriz_filial_codigo_key" ON "identificador_matriz_filial"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "qualificacao_socio_codigo_key" ON "qualificacao_socio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "identificador_socio_codigo_key" ON "identificador_socio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_cnpjBasico_key" ON "empresa"("cnpjBasico");

-- CreateIndex
CREATE UNIQUE INDEX "estabelecimento_cnpjBasico_cnpjOrdem_cnpjDv_key" ON "estabelecimento"("cnpjBasico", "cnpjOrdem", "cnpjDv");

-- CreateIndex
CREATE UNIQUE INDEX "dados_simples_cnpjBasico_key" ON "dados_simples"("cnpjBasico");

-- CreateIndex
CREATE UNIQUE INDEX "socio_cnpjBasico_cnpjCpfSocio_key" ON "socio"("cnpjBasico", "cnpjCpfSocio");

-- AddForeignKey
ALTER TABLE "empresa" ADD CONSTRAINT "empresa_naturezaJuridicaId_fkey" FOREIGN KEY ("naturezaJuridicaId") REFERENCES "natureza_juridica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresa" ADD CONSTRAINT "empresa_porteEmpresaId_fkey" FOREIGN KEY ("porteEmpresaId") REFERENCES "porte_empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimento" ADD CONSTRAINT "estabelecimento_cnpjBasico_fkey" FOREIGN KEY ("cnpjBasico") REFERENCES "empresa"("cnpjBasico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimento" ADD CONSTRAINT "estabelecimento_identificadorMatrizFilialId_fkey" FOREIGN KEY ("identificadorMatrizFilialId") REFERENCES "identificador_matriz_filial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimento" ADD CONSTRAINT "estabelecimento_situacaoCadastralId_fkey" FOREIGN KEY ("situacaoCadastralId") REFERENCES "situacao_cadastral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimento" ADD CONSTRAINT "estabelecimento_motivoSituacaoCadastralId_fkey" FOREIGN KEY ("motivoSituacaoCadastralId") REFERENCES "motivo_situacao_cadastral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimento" ADD CONSTRAINT "estabelecimento_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estabelecimento" ADD CONSTRAINT "estabelecimento_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "municipio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dados_simples" ADD CONSTRAINT "dados_simples_cnpjBasico_fkey" FOREIGN KEY ("cnpjBasico") REFERENCES "empresa"("cnpjBasico") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socio" ADD CONSTRAINT "socio_cnpjBasico_fkey" FOREIGN KEY ("cnpjBasico") REFERENCES "empresa"("cnpjBasico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socio" ADD CONSTRAINT "socio_identificadorSocioId_fkey" FOREIGN KEY ("identificadorSocioId") REFERENCES "identificador_socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socio" ADD CONSTRAINT "socio_qualificacaoSocioId_fkey" FOREIGN KEY ("qualificacaoSocioId") REFERENCES "qualificacao_socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socio" ADD CONSTRAINT "socio_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socio" ADD CONSTRAINT "socio_qualificacaoRepresentanteLegalId_fkey" FOREIGN KEY ("qualificacaoRepresentanteLegalId") REFERENCES "qualificacao_socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
