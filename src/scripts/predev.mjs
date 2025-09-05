import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function ensureDotEnvExists() {
  const projectRoot = process.cwd();
  const envPath = path.join(projectRoot, ".env");
  const envExamplePath = path.join(projectRoot, ".env.example");

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log("Created .env from .env.example");
    } else {
      console.warn(".env not found and .env.example is missing. Skipping creation.");
    }
  }
}

function ensureNodeModulesInstalled() {
  const projectRoot = process.cwd();
  const nodeModulesPath = path.join(projectRoot, "node_modules");

  if (!fs.existsSync(nodeModulesPath)) {
    console.log("node_modules not found. Installing dependencies with pnpm...");
    try {
      execSync("pnpm install --frozen-lockfile", { stdio: "inherit" });
    } catch {
      console.warn(
        "Failed to install dependencies with pnpm. Please run 'pnpm install' manually."
      );
    }
  }
}

function startPostgresWithDockerCompose() {
  const commandsToTry = ["docker compose up -d postgres", "docker-compose up -d postgres"];

  for (const command of commandsToTry) {
    try {
      console.log(`Ensuring Postgres is running using: ${command}`);
      execSync(command, { stdio: "inherit" });
      return;
    } catch {
      // Try next command option
    }
  }

  console.warn(
    "Could not start Postgres via Docker Compose. Make sure Docker is installed and running."
  );
}

function main() {
  ensureDotEnvExists();
  ensureNodeModulesInstalled();
  startPostgresWithDockerCompose();
}

main();


