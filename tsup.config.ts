/// <reference types="node" />
import { defineConfig } from "tsup";
import { exec } from "child_process";
import fs from "fs";

export default defineConfig((options) => {
  const isWatch = !!options.watch;

  console.log(
    isWatch
      ? "🟢 Dev mode detected — will sync via Yalc and expose src/."
      : "⚪ Prod mode detected — clean build for publish."
  );

  try {
    const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
    const newFiles = isWatch
      ? ["dist", "src", "src/util", "src/component", "src/effects"]
      : ["dist"];
    pkg.files = newFiles;
    fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
    console.log(`📦 Updated package.json files → [${newFiles.join(", ")}]`);
  } catch (e) {
    console.warn("⚠️ Could not update package.json files field:", e);
  }

  return {
    entry: {
      index: "src/index.ts",
      component: "src/component/index.ts",
      util: "src/util/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    minify: !isWatch,
    clean: true,
    esbuildOptions(options) {
      options.jsx = "automatic";
      options.jsxImportSource = "react";
      options.loader = {
        '.svg': 'text'
      };
    },
    external: ["react", "react-dom"],
    tsconfig: "tsconfig.build.json",
    onSuccess: isWatch
      ? async () => {
          await new Promise<void>((resolve) => {
            exec("npx yalc push --changed", (err, stdout, stderr) => {
              if (err) console.error("❌ Yalc push failed:", stderr);
              else console.log("📦 Yalc updated successfully:\n" + stdout);
              resolve();
            });
          });
        }
      : undefined,
  };
});
