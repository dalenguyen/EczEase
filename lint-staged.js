#!/usr/bin/env node

// This script runs 'nx affected:lint --fix' without passing file paths
// to lint only the affected projects instead of the entire webapp

const { execSync } = require("child_process");

try {
  // Run the NX affected lint command without passing specific files
  console.log("Running nx affected:lint --fix...");
  execSync("npx nx affected:lint --fix", { stdio: "inherit" });

  // Add any files modified by linting back to the staging area
  console.log("Adding fixed files back to staging area...");
  execSync("git add .", { stdio: "inherit" });

  process.exit(0);
} catch (error) {
  console.error("Error running nx affected:lint:", error.message);
  process.exit(1);
}
