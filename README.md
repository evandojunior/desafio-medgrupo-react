# Desafio Técnico – MedGrupo (React Native / Expo)

Aplicativo mobile multiplataforma para cadastro e gestão de **escolas** e suas **turmas**.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge)

---

## Versões utilizadas

| Ferramenta       | Versão           |
|------------------|------------------|
| Node.js          | 20.x             |
| Expo SDK         | ~55.0.8          |
| React            | 19.2.0           |
| React Native     | 0.83.2           |
| Expo Router      | ~55.0.7          |
| TypeScript       | ~5.9.2           |
| NativeWind       | ^5.0.0-preview.2 |
| Zustand          | ^5.0.3           |
| MirageJS         | ^0.1.47          |

---

## Arquitetura

```
desafio-medgrupo-react/
├── __tests__/                           # Tests folder
├── app/
│   ├── _layout.tsx                      # Root layout + Providers
│   ├── index.tsx                        # Redirect para /schools
│   ├── (tabs)/
│   │   ├── _layout.tsx                  # Layout das tabs
│   │   ├── index.tsx                    # Tab: Lista de Escolas
│   │   ├── classes.tsx                  # Tab: Lista de Turmas
│   │   └── about.tsx                    # Tab: Sobre
│   └── schools/
│       ├── index.tsx                    # Lista de escolas
│       ├── new.tsx                      # Formulário nova escola
│       └── [id]/
│           ├── index.tsx                # Detalhe da escola + turmas
│           ├── edit.tsx                 # Editar escola
│           └── classes/
│               ├── new.tsx              # Nova turma
│               └── [classId]/
│                   └── edit.tsx         # Editar turma
└── src/
    ├── adapters/                        # Transformação de respostas da API
    │   ├── school.adapter.ts
    │   └── class.adapter.ts
    ├── components/
    │   ├── SchoolCard/                  # Componente de Card da Escola
    │   ├── ClassCard/                   # Componente de Card da Turma
    │   ├── SearchBar/                   # Componente de Barra de Busca
    │   ├── EmptyState/                  # Componente de Estado Vazio
    │   └── ui/                          # Componentes base (Gluestack)
    ├── features/                        # Módulos de UI por domínio
    │   ├── About/
    │   │   ├── index.tsx                # Tela Sobre
    │   │   └── style.ts
    │   ├── School/
    │   │   ├── SchoolList/              # Listagem de escolas
    │   │   ├── SchoolDetail/            # Detalhe da escola + turmas
    │   │   ├── NewSchool/               # Formulário nova escola
    │   │   └── EditSchool/              # Formulário editar escola
    │   └── Class/
    │       ├── ClassList/               # Listagem de turmas
    │       ├── NewClass/                # Formulário nova turma
    │       └── EditClass/               # Formulário editar turma
    ├── hooks/
    │   ├── useSchools.ts
    │   ├── useClasses.ts
    │   └── useToast.ts
    ├── repositories/
    │   ├── ISchoolRepository.ts         # Interface do repositório
    │   ├── IClassRepository.ts          # Interface do repositório
    │   ├── SchoolRepository.ts
    │   └── ClassRepository.ts
    ├── services/
    │   ├── api.ts                       # Instância Axios configurada
    │   └── mock/server.ts               # MirageJS mock server
    ├── store/
    │   └── index.ts                     # Zustand: SchoolSlice + ClassSlice
    ├── styles/                          # Estilos compartilhados
    │   ├── form.ts
    ├── types/index.ts                   # School, Class, ClassShift, inputs
    └── utils/                           # Funções utilitárias
        ├── currency.ts
        ├── navigation.ts
        └── shadow.ts
```

---

## Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/evandojunior/desafio-medgrupo-react.git
cd desafio-medgrupo-react

# 2. Instale as dependências
npm install

# 3. Inicie o app
npx expo start
```

> Pressione `a` para Android, `i` para iOS ou `w` para Web.

---

## Rodando no emulador Android (apenas WSL2)

> ⚠️ Esta seção é **exclusiva para quem roda o projeto dentro do WSL2** no Windows.

```bash
npm run start-wsl
# No menu do Expo, pressione 'a' para abrir no emulador Android
```

---
## Mock de back-end (MirageJS)

O MirageJS é inicializado automaticamente em `app/_layout.tsx`. O banco começa **vazio** — os dados são criados pelo usuário e persistidos via AsyncStorage entre sessões.

### Endpoints simulados

| Método   | Endpoint                              | Descrição                      |
|----------|---------------------------------------|--------------------------------|
| `GET`    | `/api/schools`                        | Lista todas as escolas         |
| `POST`   | `/api/schools`                        | Cria nova escola               |
| `GET`    | `/api/schools/:id`                    | Detalhe de uma escola          |
| `PATCH`  | `/api/schools/:id`                    | Atualiza escola                |
| `DELETE` | `/api/schools/:id`                    | Remove escola + suas turmas    |
| `GET`    | `/api/schools/:schoolId/classes`      | Lista turmas da escola         |
| `POST`   | `/api/schools/:schoolId/classes`      | Cria turma na escola           |
| `PATCH`  | `/api/classes/:id`                    | Atualiza turma                 |
| `DELETE` | `/api/classes/:id`                    | Remove turma                   |

---

## Entidades

| Entidade | Campos |
|----------|--------|
| **School** | `id`, `name`, `address`, `classesCount`, `createdAt` |
| **Class** | `id`, `schoolId`, `name`, `shift` (`Manhã`/`Tarde`/`Noite`), `academicYear`, `createdAt` |

---

## Funcionalidades implementadas

- [x] CRUD completo de escolas (nome + endereço)
- [x] CRUD completo de turmas (nome, turno, ano letivo)
- [x] Lista de escolas com busca por nome/endereço
- [x] Tela de detalhe da escola com lista de turmas e busca
- [x] Badge colorido por turno (Manhã=azul, Tarde=âmbar, Noite=índigo)
- [x] Diálogo de confirmação assíncrono para exclusão (cascata escola→turmas)
- [x] Estados de loading e empty state contextual
- [x] Persistência de dados via AsyncStorage (MirageJS + Zustand)
- [x] Arquitetura limpa: Repository → Adapter → Store → Hook → Screen
- [x] TypeScript estritamente tipado em todos os contratos

---

## Funcionalidades Extra

- Lista de Turmas de Todas as Escolas + Filtros avançados por Escola, Turno.
- Página Sobre com informações do projeto e do desenvolvedor.

---

## Decisões técnicas

### Repository + Adapter Pattern
Cada entidade tem seu repositório (`SchoolRepository`, `ClassRepository`) responsável pelas chamadas HTTP, e seu adapter (`schoolAdapter`, `classAdapter`) para transformar respostas brutas em objetos de domínio tipados.

### Zustand v5
Estado global em slices separados (`SchoolSlice`, `ClassSlice`) dentro de um único store. Persistência zerada (`partialize: () => ({})`) pois o mock server já usa AsyncStorage.

### MirageJS — banco vazio
Os dados são salvos no AsyncStorage e restaurados ao reiniciar o app.

### Expo Router v55
Navegação baseada em arquivos com rotas aninhadas para o padrão escola→turma. O app abre direto na lista de escolas.
