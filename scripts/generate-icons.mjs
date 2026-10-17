import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const script = path.join(root, "scripts", "generate-icons.py");
const result = spawnSync("python", [script], { stdio: "inherit", cwd: root });
process.exit(result.status ?? 1);
