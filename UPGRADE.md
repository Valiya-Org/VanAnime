# VanAnime 依赖全量升级与兼容性改造说明

> 本文档记录一次跨大版本的依赖全量升级（含 Node 运行时要求），供团队其他成员参考。
> 升级完成后项目可正常 `build` / `test` / `lint`，安全审计漏洞从 **172 个降到 4 个**。

---

## 1. 结论速览

| 项目 | 升级前 | 升级后 |
| --- | --- | --- |
| Node.js（engines） | `>=22.14.0` | `>=22.23.4 <24 \|\| >=24.22.1 <26 \|\| >=26.12.1` |
| NestJS | 11.x | **12.x（ESM-only）** |
| Prisma | 6.7 | **7.10.1（必须用 Driver Adapter）** |
| webtorrent | 2.5.19 | **3.0.21** |
| TypeScript | 5.8 | **6.0.3（不能升 7）** |
| ESLint / Jest | 9 / 29 | **10 / 30** |
| axios / lodash | 1.8.4 / 4.17.21 | **1.20.0 / 4.18.1** |
| npm audit 漏洞 | 172（12 critical） | **4（全部为未维护的 `ip`）** |

验证结果：`npm run build` 通过、`npm test-ci` 530/530 通过、`eslint` 无错误、运行时连库冒烟通过。

---

## 2. Node.js 运行时要求（重要）

### 为什么必须升级 Node
2026-10-21 爆发 **eMudhra 中间 CA 私钥失陷**事件：Node.js 内置的 CA 信任库包含被攻破的 eMudhra 中间 CA，攻击者可伪造 `registry.npmjs.org` 等域名证书实施中间人攻击，进而投毒依赖。Node.js 官方在 2026-10-21 安全版中移除了这些 CA。

**必须使用以下或更高版本：**

| 版本线 | 最低版本 |
| --- | --- |
| 22.x（LTS） | **v22.23.4** |
| 24.x（LTS） | **v24.22.1** |
| 26.x（Current） | **v26.12.1** |

### 仓库里的约束
- `package.json` → `engines.node`：`>=22.23.4 <24 || >=24.22.1 <26 || >=26.12.1`
- `.nvmrc`：`24.22.1`（开发 / CI 基线）
- `.github/workflows/lint.yaml`：`node-version: '24.22.1'`

> 开发机若低于上述版本，`npm install` 会报 `EBADENGINE`，且仍处于证书中间人风险中，请先升级 Node。
>
> **注意**：`engines` 允许 Node 22.23.4+ 运行应用，但 **Jest 30 的 `require(esm)` 需要 Node >= 24.9**（见 §4.3）；在 Node 22.x 上跑单测会报 `ERR_REQUIRE_ESM`。因此开发 / CI 统一使用 `24.22.1`。

---

## 3. 依赖升级清单

### 3.1 生产依赖（dependencies）

| 包 | 升级前 | 升级后 |
| --- | --- | --- |
| @nestjs/axios | ^4.0.0 | ^12.0.1 |
| @nestjs/cache-manager | ^3.0.0 | ^12.0.1 |
| @nestjs/common | ^11.0.1 | ^12.2.0 |
| @nestjs/config | ^4.0.1 | ^12.0.1 |
| @nestjs/core | ^11.0.1 | ^12.2.0 |
| @nestjs/platform-express | ^11.0.1 | ^12.2.0 |
| @nestjs/swagger | ^11.0.6 | ^12.0.3 |
| @prisma/client | ^6.7.0 | ^7.10.1 |
| @prisma/adapter-better-sqlite3 | — | **^7.10.1（新增）** |
| @types/lodash | ^4.17.20 | ^4.17.27 |
| animegarden | ^0.5.1 | ^0.5.2 |
| axios | ^1.8.4 | ^1.20.0 |
| class-validator | ^0.14.1 | ^0.15.1 |
| fuse.js | ^7.1.0 | ^7.5.0 |
| lodash | ^4.17.21 | ^4.18.1 |
| webtorrent | ^2.5.19 | ^3.0.21 |
| winston | ^3.17.0 | ^3.19.0 |

### 3.2 开发依赖（devDependencies）

| 包 | 升级前 | 升级后 |
| --- | --- | --- |
| @eslint/eslintrc | ^3.2.0 | ^3.3.7 |
| @eslint/js | ^9.18.0 | ^10.0.1 |
| @nestjs/cli | ^11.0.0 | ^12.0.10 |
| @nestjs/schematics | ^11.0.0 | ^12.0.10 |
| @nestjs/testing | ^11.1.5 | ^12.2.0 |
| @swc/cli | ^0.6.0 | ^0.8.1 |
| @swc/core | ^1.10.7 | ^1.16.20 |
| @types/express | ^5.0.0 | ^5.0.6 |
| @types/jest | ^29.5.14 | ^30.0.0 |
| @types/node | ^22.10.7 | ^22.20.5 |
| @types/supertest | ^6.0.2 | ^7.2.1 |
| @types/webtorrent | ^0.110.0 | ^3.0.0 |
| cross-env | — | **^10.1.0（新增）** |
| eslint | ^9.18.0 | ^10.13.0 |
| eslint-config-prettier | ^10.0.1 | ^10.1.8 |
| eslint-plugin-prettier | ^5.2.2 | ^5.5.7 |
| globals | ^15.14.0 | ^17.13.0 |
| jest | ^29.7.0 | ^30.5.2 |
| prettier | ^3.4.2 | ^3.9.10 |
| prisma | ^6.7.0 | ^7.10.1 |
| supertest | ^7.0.0 | ^7.3.1 |
| ts-jest | ^29.2.5 | ^29.4.15 |
| ts-loader | ^9.5.2 | ^9.6.2 |
| typescript | ^5.7.3 | **^6.0.3** |
| typescript-eslint | ^8.20.0 | ^8.72.0 |

### 3.3 版本覆盖（overrides）

```json
"overrides": {
  "node-datachannel": "0.33.4"
}
```

**原因**：webtorrent 3 依赖 `webtorrent → simple-peer → webrtc-polyfill → node-datachannel@0.32.3`，后者在 Windows/Node 24 上源码编译失败（缺 cmake / Python）。`node-datachannel@0.33.4` 改为以 npm 包形式分发预编译产物，无安装期原生编译，规避该问题。

---

## 4. 破坏性变更与兼容性改动

### 4.1 TypeScript 固定在 6.0.3（不能升 7）

**原因**：TypeScript 7 是原生（Go）编译器，以下工具链尚不兼容：
- `ts-jest` 要求 `typescript >=4.3 <7`
- `typescript-eslint` 要求 `typescript >=4.8.4 <6.1.0`

因此 **6.0.3 是当前工具链可用的最高版本**。升级 TypeScript 大版本前，务必先确认上述两个包已支持。

### 4.2 Prisma 7：必须改用 Driver Adapter

Prisma 7 移除 Rust 查询引擎，改为 **Driver Adapter + WASM 查询编译器**，且 `datasource` 中不再允许写 `url`。

改动：
1. **`prisma/schema.prisma`**：删除 `datasource.url`，仅保留 `provider = "sqlite"`
2. **新增 `prisma.config.ts`**（项目根目录）：
   ```ts
   import { defineConfig } from 'prisma/config';
   export default defineConfig({
     schema: 'prisma/schema.prisma',
     migrations: { path: 'prisma/migrations' },
     datasource: { url: 'file:./src/files/database/vananimedb.sqlite' },
   });
   ```
3. **新增依赖** `@prisma/adapter-better-sqlite3`
4. **`src/libs/core/db/prisma.service.ts`**：构造 `PrismaClient` 时必须传入 adapter：
   ```ts
   import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
   const adapter = new PrismaBetterSqlite3({
     url: 'file:./src/files/database/vananimedb.sqlite',
   });
   super({ adapter });
   ```

> 生成器保留 legacy 的 `prisma-client-js`（Prisma 7 仍支持），因此 `import { PrismaClient } from '@prisma/client'` 不变。

### 4.3 NestJS 12 是 ESM-only → Jest 需要 Node >= 24.9

NestJS 12 的包 `"type": "module"`，Jest 的 CommonJS 运行时无法直接 `require`。

**关键约束**：Jest 30 只在 **Node >= 24.9** 时原生支持 `require(esm)`；Node 22.x 即使加了 `--experimental-vm-modules`，仍会报 `ERR_REQUIRE_ESM: Must use import to load ES Module`。因此开发 / CI 基线用 `24.22.1`（`.nvmrc` 与 workflow 已对齐）。

改动：
- 新增 `cross-env` 依赖（跨平台设置环境变量）
- `package.json` 所有 `test*` 脚本前缀 `cross-env NODE_OPTIONS=--experimental-vm-modules`
  ```json
  "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest",
  "test-ci": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --passWithNoTests --runInBand --coverage",
  ```

### 4.4 tsconfig 调整

- **`tsconfig.json`**
  - 新增 `"types": ["node", "jest"]`：TS6 不再自动包含 `@types/*` 全局声明（否则测试里 `describe`/`it`/`expect` 报 "Cannot find name"）。
  - 新增 `"exclude": ["node_modules", "dist", "prisma.config.ts"]`：`prisma.config.ts` 在根目录、不在 `rootDir: ./src` 下。
- **`tsconfig.build.json`**
  - `exclude` 增加 `"prisma.config.ts"`

### 4.5 TypeScript 6 严格属性初始化（已关闭该检查）

TS6 开始对「声明了但构造函数未赋值」的类属性报 `TS2564`，DTO 与服务字段因此集体报错。

**取舍：不采用 `!` 明确赋值断言，而是直接关闭该检查**（`tsconfig.json`）：

```json
"strictPropertyInitialization": false
```

**原因**：`!` 的语义是"我保证运行时一定有值"，它会**掩盖真实的 undefined 风险**。本项目 `qbittorrent.service.ts` 中 `QB_ENDPOINTS` 的赋值函数 `initQBConstants()` 原先在 `onModuleInit` 里是注释状态，若用 `QB_ENDPOINTS!` 恰好会把该潜在 bug 藏起来。

关闭后即恢复 TS 5 的行为（本项目从未开启 `strict: true`），无需在 8 个属性上加 `!`：

- `magnet.add.dto.ts`、`magnet.submit.dto.ts`、`query.search.dto.ts`
- `qbittorrent.service.ts` 的 `QB_ENDPOINTS`

> 代价：全局失去该项检查。若未来想恢复，需先确保所有类属性都在构造函数或声明处初始化，再打开 `strictPropertyInitialization`。

**配套的 qBittorrent 安全化处理**（该功能目前为未接入的半成品）：

- `QB_ENDPOINTS` 改为在**构造函数**中通过 `initQBConstants()` 初始化，不再依赖被注释的 `onModuleInit`；
- `submitNewTask` 开头增加配置校验：缺少 `QB_HOST` / `QB_USERNAME` / `QB_PASSWORD` 时抛出明确的 `QBNotConfiguredException`（503），而不是让 axios 报出难以理解的错误；
- 删除从未被读取的 `QB_STATES` 死代码。

### 4.6 axios `HttpStatusCode` 在 TS6 下不能再当类型用

`import { HttpStatusCode } from 'axios'` 的枚举在 TS6 中不再能直接作类型注解：

```ts
const a: HttpStatusCode = HttpStatusCode.Ok;   // ❌ TS2749: refers to a value...
```

**不要退化成 `number`**（会丢失「只允许合法状态码」的约束）。正确写法是用 `typeof` 取枚举值的联合：

```ts
export type HttpStatusCodeValue =
  (typeof HttpStatusCode)[keyof typeof HttpStatusCode];
```

- 该类型是枚举成员的联合，**会拒绝任意数字**（实测 `new ResponseBase(999, true)` 报 `TS2345`）；
- `HttpStatusCode.Ok`、`HttpStatusCode.InternalServerError` 等枚举值均可正常赋值。

改动位置：
- `src/libs/dto/response-base.dto.ts`（定义并导出 `HttpStatusCodeValue`）
- `src/modules/query/dto/query.bangumi-check.dto.ts`（引用该类型）
- `src/modules/query/dto/query.response.dto.ts`（引用该类型）

### 4.7 webtorrent 3 的类型 API 变化

`@types/webtorrent@3` 改为 `export default class WebTorrent`。构造时不能再把「模块命名空间类型」当构造函数：

- `src/libs/utils/magnet/torrent-transformer/torrent-transformer.service.ts`
  ```ts
  import type WebTorrent from 'webtorrent';
  // ...
  private readonly Webtorrent: typeof WebTorrent,
  ```

### 4.8 winston `format.printf` 类型签名变化

`format.printf` 回调参数需与 `TransformableInfo` 兼容（`timestamp` 等字段为可选/unknown）。改为让参数由上下文推断、内部再断言：

- `src/libs/core/log/log.service.ts`

### 4.9 ESLint 10 新规则触发的修复

- **`preserve-caught-error`**：重新抛出的错误需附 `cause`
  - `src/libs/sources/dmhy/dmhy.service.ts`：`throw new Error('...', { cause: error })`
- **`no-useless-assignment`**：`src/modules/query/query.service.ts` 中 `fetchCalenderAPI()` 被重复调用，删除了多余的一次赋值（顺带修复真实 bug）
- **`@typescript-eslint/no-unnecessary-type-assertion`**：移除多余断言（`extractor.ts`、`magnet.service.ts` 等）
- **prettier**：联合类型换行格式自动修复（`eslint --fix`）

### 4.10 构建产物清理

首次 `tsc` 因 `prisma.config.ts` 的 rootDir 报错仍会 emit 到根目录，产生 `prisma.config.js/.d.ts/.js.map` 残留，会干扰 Prisma 配置发现。已：
- 删除残留文件
- `.gitignore` 增加：
  ```
  /prisma.config.js
  /prisma.config.js.map
  /prisma.config.d.ts
  ```

---

## 5. 安装与运行（含排错）

### 5.1 标准流程

```bash
# 1. 确认 Node 版本
node -v    # 需 >=22.23.4 / >=24.22.1 / >=26.12.1

# 2. 安装依赖
npm install

# 3. 构建 / 测试 / 检查
npm run build
npm run test-ci
npm run lint:check
```

### 5.2 常见问题

**① `better-sqlite3` 预编译下载超时（GitHub 不可达）**

`better-sqlite3` 的安装脚本是 `prebuild-install || node-gyp rebuild --release`，默认从 GitHub Releases 下载预编译包；失败后回退源码编译，需要 Python + VS Build Tools。

若下载慢/失败，指向 npmmirror 镜像：

```powershell
$env:npm_config_better_sqlite3_binary_host = "https://registry.npmmirror.com/-/binary/better-sqlite3"
npm install
```

（镜像地址 `https://registry.npmmirror.com/-/binary/better-sqlite3`，按版本/Node ABI 存放预编译包。）

**② 冷安装卡在解析 `react-native`**

webtorrent 的传递依赖 `b4a` 带有可选依赖 `react-native-b4a → react-native`，npm 解析其超大 manifest 时可能长时间卡住。加 `--fetch-timeout` 让它快速跳过：

```bash
npm install --fetch-timeout=15000
```

**③ `npm ci` 后 `@prisma/client` 不完整**

个别环境下 `npm ci` 后 `node_modules/@prisma/client` 可能缺少 `package.json` / `.d.ts`，且 `node_modules/.prisma` 未生成，导致应用启动崩溃。优先使用 `npm install`；若用 `npm ci`，装完请检查：

```bash
ls node_modules/.prisma/client   # 应存在
```

**④ npm 的 `install-scripts not covered by allowScripts` 警告**

npm 11 的安全提示，不影响本项目（构建/测试/冒烟均已验证）。

---

## 6. 已知遗留问题

### `ip` 4 个 high 漏洞（无干净修复）

```
ip  *  —  GHSA-2p57-rm9w-gvfp（isPublic SSRF 分类缺陷）
链路：webtorrent → torrent-discovery → bittorrent-tracker → ip
```

- `ip` 已停止维护，**所有版本都受影响**；`npm audit fix --force` 的唯一"方案"是把 webtorrent 降回 0.7.3，不可接受。
- 实际风险很低：本项目仅用 webtorrent 解析磁力元数据，不走 tracker 连接；`ip` 只用于 tracker 的 IP 过滤。
- 若需彻底清零，只能给 `bittorrent-tracker` 打补丁或换成维护中的 fork，属独立工作项。

---

## 7. 本次改动文件清单

**配置**
- `package.json` / `package-lock.json`
- `tsconfig.json` / `tsconfig.build.json`
- `.nvmrc`（新增）
- `prisma/schema.prisma`
- `prisma.config.ts`（新增）
- `.gitignore`
- `.github/workflows/lint.yaml`

**源码**
- `src/libs/core/log/log.service.ts`
- `src/libs/core/db/prisma.service.ts`
- `src/libs/dto/response-base.dto.ts`
- `src/libs/utils/magnet/torrent-transformer/torrent-transformer.service.ts`
- `src/libs/utils/qbittorrent/qbittorrent.service.ts`
- `src/libs/sources/dmhy/dmhy.service.ts`
- `src/modules/query/query.service.ts`
- `src/modules/query/dto/query.bangumi-check.dto.ts`
- `src/modules/query/dto/query.response.dto.ts`
- `src/modules/query/dto/query.search.dto.ts`
- `src/modules/downloader/magnet/dto/magnet.add.dto.ts`
- `src/modules/downloader/magnet/dto/magnet.submit.dto.ts`
- `src/modules/downloader/magnet/magnet.service.ts`
- 以及 `eslint --fix` 自动格式化的 `src/libs/core/parser/*`、`src/libs/modal/parser/parsed-title.ts` 等

---

## 8. 验证记录

| 检查项 | 结果 |
| --- | --- |
| `npm run build`（nest build） | exit 0 |
| `npm run test-ci` | 8 suites / 530 tests 全通过 |
| `eslint src/**/*.ts` | 无错误 |
| `npm audit` | 172 → 4（仅 `ip`） |
| 运行时连库冒烟（PrismaClient + adapter，`SELECT 1`） | 通过 |
