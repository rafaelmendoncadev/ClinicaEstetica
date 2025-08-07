# Plano: Migração de PostgreSQL para SQLite

## Análise do Estado Atual
- **Banco atual**: PostgreSQL configurado no Prisma
- **Schema**: Complexo com 13 models, 4 enums e relacionamentos
- **Configuração**: Output path configurado para Linux (precisa ajuste)
- **Arquivo .env**: Não encontrado (DATABASE_URL não localizada)

## Passos da Migração

### 1. **Atualizar Prisma Schema**
- Alterar `provider = "postgresql"` para `provider = "sqlite"`
- Remover `binaryTargets` específicos do Linux
- Ajustar output path para Windows
- Adaptar tipos específicos do PostgreSQL:
  - `@db.Text` → remover (SQLite aceita Text por padrão)
  - `@db.Decimal(10, 2)` → manter (suportado pelo Prisma)

### 2. **Criar/Configurar Arquivo de Ambiente**
- Criar `.env` ou `.env.local` 
- Definir `DATABASE_URL="file:./dev.db"`
- Adicionar outras variáveis de ambiente necessárias

### 3. **Executar Migração**
- `npx prisma migrate reset` (se há dados existentes)
- `npx prisma migrate dev --name init-sqlite`
- `npx prisma generate`

### 4. **Executar Seed (se existir)**
- Verificar e executar `npm run prisma:seed` ou script equivalente
- Popular banco com dados iniciais

### 5. **Testes e Validação**
- Executar testes de TypeScript: `npx tsc --noEmit`
- Verificar se os tipos Prisma foram gerados corretamente
- Testar conexão com banco

## Arquivos a Modificar
- `prisma/schema.prisma` - Configuração principal
- `.env` ou `.env.local` - Variáveis de ambiente (criar se não existir)
- Possíveis ajustes em queries específicas do PostgreSQL

## Vantagens do SQLite
- **Simplicidade**: Arquivo único, sem servidor
- **Desenvolvimento**: Ideal para desenvolvimento local
- **Portabilidade**: Fácil backup e compartilhamento
- **Performance**: Excelente para aplicações pequenas/médias

## Considerações
- SQLite não suporta alguns recursos avançados do PostgreSQL
- Para produção, avaliar se SQLite atende aos requisitos de concorrência
- Backup mais simples (arquivo único)

Confirma a execução desta migração?