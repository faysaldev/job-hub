# JobHub Phase 6 changed files

This is a changed-files-only overlay for the already installed Phase 1–5 project.
Extract at the repository root, preserving the `front-end/` and `backends/` parent folders.

Files added/modified: 36
Deleted files: NONE

| Change | Relative path | SHA-256 |
|---|---|---|
| ADDED | `backends/PHASE6_API_CONTRACTS.md` | `a23c52a8d017fd87e3e070d8c610610515a97f1fabaf1f6bf05452d307082cab` |
| ADDED | `backends/PHASE6_CROSS_PHASE_AUDIT.md` | `da1fc04e92ae66b851e85be54a9ff52981a031a38756a54eaf07af928d763aa0` |
| ADDED | `backends/PHASE6_RELEASE.md` | `7a51d0caf2dc081cabf805bb3c7a116171137f2b474480944c65490b5d394f32` |
| MODIFIED | `backends/package.json` | `4490b98f9f78dff08b935ba0f8afb09c66579aaacfc423a171e5b4eb2eaf44e7` |
| MODIFIED | `backends/scripts/phase1-static-security-check.cjs` | `751f24733adc51d2cdedc00f56ea94ca3378884400bf6b54efacd9a5a3ff7a78` |
| MODIFIED | `backends/scripts/phase3-static-check.cjs` | `774572046c1e11b67c9f97b90d2277dabb2e6e73375c1c88ce12e2b1de9c23f3` |
| ADDED | `backends/scripts/phase6-backup.cjs` | `d7e9a0076d0ab348bcfd8b6416edb7103dbaa05f7ab5aff5054fc241068731b6` |
| ADDED | `backends/scripts/phase6-indexes.cjs` | `bd16af85f820b449bb0f87259ffe0a7ce438aef651e45e179cf513c7e18e25b7` |
| ADDED | `backends/scripts/phase6-performance.cjs` | `d6c35df7e2ee2c60987e17094a213e630e47a78a8afc9b7ad7e9ab572b559053` |
| ADDED | `backends/scripts/phase6-regression.cjs` | `52fad8213487ed11431baa55a37b685f6b8a3a36b1e1b61d93ae24871e03a59a` |
| ADDED | `backends/scripts/phase6-restore-drill.cjs` | `48d034b9713a959b5c8f080d5b77000977448aebffb32a1f76c503fb447f4154` |
| ADDED | `backends/scripts/phase6-source-audit.cjs` | `9ae99a40974ba754b26e906ecbb7019933b5dfbe98f5583b192885eb7c187c90` |
| MODIFIED | `backends/src/domains/Applications/application.services.ts` | `25b75e317a3d1e4e7a6dc229134f03abd004175c2a89bf8bb89588aa6b27166a` |
| MODIFIED | `backends/src/domains/Asset/asset.services.ts` | `e0b716c8b00557a5e81fc8207aed9baf397d352c0e78013f541c086f41d1d957` |
| MODIFIED | `backends/src/domains/Auth/auth.service.ts` | `f5787518410453db1ecd19ba71a7da778a9c9c072770032cbd9d8367d39594ca` |
| MODIFIED | `backends/src/domains/Auth/auth.token.services.ts` | `54ed339cd8537907ba4b37621c27f251c49958053b7b7d9154d18d84a334f66c` |
| MODIFIED | `backends/src/domains/Company/company.workspace.ts` | `b614366d394ca094b5871ce346892dd27c243a64182f79ecd9bd570c8b32754b` |
| MODIFIED | `backends/src/domains/Generals/contact.model.ts` | `0ae6893747532e0e3e4af605ddc24d081840192b0b375b7fb89677e946adde9c` |
| MODIFIED | `backends/src/domains/Generals/general.services.ts` | `6dff499db3bcff096fadf412b86b457f488ec9e3eaea394fc1b4d7a7b72dbb4e` |
| MODIFIED | `backends/src/domains/Generals/general.validation.ts` | `6a9f15aedbbab2ef732459232629258ba3ccd79adf894bbe3712d7f489a90674` |
| MODIFIED | `backends/src/domains/Jobs/job.model.ts` | `c9bbff3a80a20abc0955df622f85653117ce28ed5ac94d17f9911431733866f3` |
| MODIFIED | `backends/src/domains/Jobs/job.services.ts` | `d655f422696a1a5a5253653d038c511cca46eca58db2299f756c132bcd525b60` |
| ADDED | `backends/src/domains/Operations/operations.audit.model.ts` | `57844d2d9cf3ce538c96d725e8bd3845c004192f92756d8a99c7c33df3c58ac1` |
| ADDED | `backends/src/domains/Operations/operations.controller.ts` | `f38a073582b82b634553b3ef4327e46d0d0cebaee33c56e252529b220a0a9e98` |
| ADDED | `backends/src/domains/Operations/operations.report.model.ts` | `f8420a51466f6ed9fac4213f6cdfc9ea788ab2c3bfec66657032b869537aca05` |
| ADDED | `backends/src/domains/Operations/operations.route.ts` | `f6bd0154dd838d393572a050d3fd062c09f0aa888d2376cd82655aa8cd2eb0a8` |
| ADDED | `backends/src/domains/Operations/operations.services.ts` | `93960fc149662160d4b206e17c5cfaf0f6021d4494c49cb8636d1562bbe48136` |
| ADDED | `backends/src/domains/Operations/operations.validation.ts` | `5c65264813c06824c81aa4f1657b78e1623014f8c57724f474d4361992603bb1` |
| MODIFIED | `backends/src/domains/Seeker/seeker.services.ts` | `73c2fc142ae4a053792fe8ed1ffc8c38ef4428942178707343b0935601b2a247` |
| MODIFIED | `backends/src/domains/User/user.model.ts` | `c1d808f2f7477f464dd07a05382a28136ff48a421b5ddad6562d005a964d72de` |
| MODIFIED | `backends/src/middlewares/logger.middleware.ts` | `258025d1ef089d3ea7c716e7a2e6aaa110243bc759e2a9ae2eeae499193823c0` |
| MODIFIED | `backends/src/routes/index.ts` | `4813add0dc8e613c75378ce792e82b2d50ee2ac884fc1cf2ec6ab7589ea28328` |
| MODIFIED | `backends/src/server.ts` | `8e32b17ae5a4afddc397119ab8bcba0f8cee29c53231140512dcba343fc036a9` |
| ADDED | `backends/tests/phase6-staging.test.cjs` | `596bda29d6dc4445cb48132082dafd01aeb75c97de5a0dd0609a4c59538a196e` |
| ADDED | `backends/tests/phase6-static.test.cjs` | `c2f4723ceb1d15f2b702ebd7c8e710d84b0b4ceb60f4455ff603d071ed068695` |
| ADDED | `backends/tests/phase6-validation.test.cjs` | `feb012bf90e8fbf14abfa69fd01bc4a330110c727e44f857ddf2ddeb2ef34e2b` |

## Verification
- Phase 1/3/4/5 and Phase 6 source-level security regression assertions: passed.
- TypeScript/TSX parser check: 344 files parsed, 902 local import references checked, 0 unresolved.
- Phase 6 backend runtime validation unit tests, TypeScript builds and browser E2E: not executable here without project dependencies.
- MongoDB, Stripe, Cloudflare R2 and Redis staging acceptance: not performed here; do not deploy until completed.

## Installation
Read `backends/PHASE6_RELEASE.md` and `backends/PHASE6_CROSS_PHASE_AUDIT.md` after applying both ZIPs.
New frontend Playwright dependencies require regenerating and committing the frontend pnpm lockfile.
The previous phases may already need a backend lockfile refresh before frozen CI installation.
No pre-existing code file should be deleted for this phase.
