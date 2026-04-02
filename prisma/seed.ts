import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Seeding Porte Empresa
  const portes = await Promise.all([
    prisma.porteEmpresa.upsert({
      where: { codigo: 0 },
      update: {},
      create: { codigo: 0, descricao: 'Não Informado' },
    }),
    prisma.porteEmpresa.upsert({
      where: { codigo: 1 },
      update: {},
      create: { codigo: 1, descricao: 'Micro Empresa' },
    }),
    prisma.porteEmpresa.upsert({
      where: { codigo: 3 },
      update: {},
      create: { codigo: 3, descricao: 'Empresa de Pequeno Porte' },
    }),
    prisma.porteEmpresa.upsert({
      where: { codigo: 5 },
      update: {},
      create: { codigo: 5, descricao: 'Demais' },
    }),
  ]);
  console.log(`✓ ${portes.length} registros de Porte Empresa criados`);

  // Seeding Identificador Matriz/Filial
  const identificadores = await Promise.all([
    prisma.identificadorMatrizFilial.upsert({
      where: { codigo: 1 },
      update: {},
      create: { codigo: 1, descricao: 'Matriz' },
    }),
    prisma.identificadorMatrizFilial.upsert({
      where: { codigo: 2 },
      update: {},
      create: { codigo: 2, descricao: 'Filial' },
    }),
  ]);
  console.log(`✓ ${identificadores.length} registros de Identificador Matriz/Filial criados`);

  // Seeding Situacao Cadastral
  const situacoes = await Promise.all([
    prisma.situacaoCadastral.upsert({
      where: { codigo: 1 },
      update: {},
      create: { codigo: 1, descricao: 'Nula' },
    }),
    prisma.situacaoCadastral.upsert({
      where: { codigo: 2 },
      update: {},
      create: { codigo: 2, descricao: 'Ativa' },
    }),
    prisma.situacaoCadastral.upsert({
      where: { codigo: 3 },
      update: {},
      create: { codigo: 3, descricao: 'Suspensa' },
    }),
    prisma.situacaoCadastral.upsert({
      where: { codigo: 4 },
      update: {},
      create: { codigo: 4, descricao: 'Inapta' },
    }),
    prisma.situacaoCadastral.upsert({
      where: { codigo: 8 },
      update: {},
      create: { codigo: 8, descricao: 'Baixada' },
    }),
  ]);
  console.log(`✓ ${situacoes.length} registros de Situação Cadastral criados`);

  // Seeding Identificador Sócio
  const identificadorSocios = await Promise.all([
    prisma.identificadorSocio.upsert({
      where: { codigo: 1 },
      update: {},
      create: { codigo: 1, descricao: 'Pessoa Jurídica' },
    }),
    prisma.identificadorSocio.upsert({
      where: { codigo: 2 },
      update: {},
      create: { codigo: 2, descricao: 'Pessoa Física' },
    }),
    prisma.identificadorSocio.upsert({
      where: { codigo: 3 },
      update: {},
      create: { codigo: 3, descricao: 'Estrangeiro' },
    }),
  ]);
  console.log(`✓ ${identificadorSocios.length} registros de Identificador Sócio criados`);

  // Seeding Qualificação Sócio (exemplos básicos)
  const qualificacoes = await Promise.all([
    prisma.qualificacaoSocio.upsert({
      where: { codigo: 1 },
      update: {},
      create: { codigo: 1, descricao: 'Gerente' },
    }),
    prisma.qualificacaoSocio.upsert({
      where: { codigo: 2 },
      update: {},
      create: { codigo: 2, descricao: 'Sócio' },
    }),
    prisma.qualificacaoSocio.upsert({
      where: { codigo: 3 },
      update: {},
      create: { codigo: 3, descricao: 'Diretor' },
    }),
    prisma.qualificacaoSocio.upsert({
      where: { codigo: 5 },
      update: {},
      create: { codigo: 5, descricao: 'Conselheiro' },
    }),
    prisma.qualificacaoSocio.upsert({
      where: { codigo: 10 },
      update: {},
      create: { codigo: 10, descricao: 'Presidente' },
    }),
  ]);
  console.log(`✓ ${qualificacoes.length} registros de Qualificação Sócio criados`);

  // Seeding Natureza Jurídica (exemplos básicos)
  const naturezas = await Promise.all([
    prisma.naturaJuridica.upsert({
      where: { codigo: 2011 },
      update: {},
      create: { codigo: 2011, descricao: 'Serviço público federal' },
    }),
    prisma.naturaJuridica.upsert({
      where: { codigo: 2062 },
      update: {},
      create: { codigo: 2062, descricao: 'Empresa estatal' },
    }),
    prisma.naturaJuridica.upsert({
      where: { codigo: 2070 },
      update: {},
      create: { codigo: 2070, descricao: 'Sociedade anônima de capital aberto' },
    }),
    prisma.naturaJuridica.upsert({
      where: { codigo: 2088 },
      update: {},
      create: { codigo: 2088, descricao: 'Sociedade anônima de capital fechado' },
    }),
    prisma.naturaJuridica.upsert({
      where: { codigo: 2096 },
      update: {},
      create: { codigo: 2096, descricao: 'Sociedade limitada' },
    }),
    prisma.naturaJuridica.upsert({
      where: { codigo: 2100 },
      update: {},
      create: { codigo: 2100, descricao: 'Sociedade em nome coletivo' },
    }),
  ]);
  console.log(`✓ ${naturezas.length} registros de Natureza Jurídica criados`);

  // Seeding País (exemplos básicos)
  const paises = await Promise.all([
    prisma.pais.upsert({
      where: { codigo: 1058 },
      update: {},
      create: { codigo: 1058, descricao: 'Brasil' },
    }),
    prisma.pais.upsert({
      where: { codigo: 1007 },
      update: {},
      create: { codigo: 1007, descricao: 'Angola' },
    }),
    prisma.pais.upsert({
      where: { codigo: 1015 },
      update: {},
      create: { codigo: 1015, descricao: 'Austrália' },
    }),
  ]);
  console.log(`✓ ${paises.length} registros de País criados`);

  // Seeding Municípios (exemplos básicos)
  const municipios = await Promise.all([
    prisma.municipio.upsert({
      where: { codigo: 3500105 },
      update: {},
      create: { codigo: 3500105, descricao: 'São Paulo - SP' },
    }),
    prisma.municipio.upsert({
      where: { codigo: 3304557 },
      update: {},
      create: { codigo: 3304557, descricao: 'Rio de Janeiro - RJ' },
    }),
    prisma.municipio.upsert({
      where: { codigo: 3106200 },
      update: {},
      create: { codigo: 3106200, descricao: 'Belo Horizonte - MG' },
    }),
  ]);
  console.log(`✓ ${municipios.length} registros de Município criados`);

  // Seeding CNAE (exemplos básicos)
  const cnaes = await Promise.all([
    prisma.cnae.upsert({
      where: { codigo: 1011901 },
      update: {},
      create: { codigo: 1011901, descricao: 'Extração de minério de ferro' },
    }),
    prisma.cnae.upsert({
      where: { codigo: 4711301 },
      update: {},
      create: { codigo: 4711301, descricao: 'Comércio varejista de tecidos' },
    }),
    prisma.cnae.upsert({
      where: { codigo: 6201501 },
      update: {},
      create: { codigo: 6201501, descricao: 'Desenvolvimento de software sob encomenda' },
    }),
  ]);
  console.log(`✓ ${cnaes.length} registros de CNAE criados`);

  console.log('\n✅ Seed concluído com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro ao fazer seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
