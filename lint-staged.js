#!/usr/bin/env node

// This script runs 'nx lint webapp --fix' without passing file paths
// to avoid the issue with how NX handles the --fix flag

const { execSync } = require("child_process");

try {
  // Run the NX lint command without passing specific files
  console.log("Running nx lint webapp --fix...");
  execSync("npx nx lint webapp --fix", { stdio: "inherit" });

  // Add any files modified by linting back to the staging area
  console.log("Adding fixed files back to staging area...");
  execSync("git add .", { stdio: "inherit" });

  process.exit(0);
} catch (error) {
  console.error("Error running nx lint:", error.message);
  process.exit(1);
}
