/**
 * @title Documentation Generator for FHEVM Examples
 * @description
 * This script automatically generates GitBook-compatible Markdown documentation
 * from TSDoc comments in test files. It extracts:
 * - Chapter tags for organization
 * - Test descriptions and examples
 * - Anti-patterns and best practices
 * - Code snippets and usage examples
 */

import * as fs from "fs";
import * as path from "path";

interface DocSection {
  title: string;
  chapter: string[];
  description: string;
  examples: string[];
  antipatterns: string[];
  tests: TestCase[];
}

interface TestCase {
  name: string;
  description: string;
  code?: string;
}

/**
 * Extract documentation from test file
 */
function extractDocs(filePath: string): DocSection[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const sections: DocSection[] = [];
  let currentSection: DocSection | null = null;

  // Split by describe blocks
  const lines = content.split("\n");
  let inComment = false;
  let commentBuffer: string[] = [];
  let currentTest: TestCase | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect start of TSDoc comment
    if (line.includes("/**")) {
      inComment = true;
      commentBuffer = [];
      continue;
    }

    // Collect comment lines
    if (inComment) {
      if (line.includes("*/")) {
        inComment = false;
        // Process collected comment
        const docText = commentBuffer.join("\n");

        // Check if this is a main section (has @title)
        if (docText.includes("@title")) {
          if (currentSection) {
            sections.push(currentSection);
          }

          currentSection = {
            title: extractTag(docText, "@title"),
            chapter: extractChapters(docText),
            description: extractDescription(docText),
            examples: extractExamples(docText),
            antipatterns: extractAntipatterns(docText),
            tests: [],
          };
        }
        // Check if this is a test case
        else if (docText.includes("@test") && currentSection) {
          currentTest = {
            name: extractTag(docText, "@test"),
            description: extractDescription(docText),
          };

          if (currentTest.name) {
            currentSection.tests.push(currentTest);
          }
        }

        commentBuffer = [];
      } else {
        commentBuffer.push(line.replace(/^\s*\*\s?/, ""));
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

function extractTag(text: string, tag: string): string {
  const regex = new RegExp(`${tag}\\s+(.+)`, "m");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function extractChapters(text: string): string[] {
  const chapters: string[] = [];
  const regex = /@chapter\s+(.+)/gm;
  let match;

  while ((match = regex.exec(text)) !== null) {
    chapters.push(match[1].trim());
  }

  return chapters;
}

function extractDescription(text: string): string {
  const lines = text.split("\n");
  const descStart = lines.findIndex((l) => l.includes("@description"));

  if (descStart === -1) {
    // Return text before first @ tag
    const beforeTags = lines.filter((l) => !l.includes("@"));
    return beforeTags.join("\n").trim();
  }

  const descLines: string[] = [];
  for (let i = descStart + 1; i < lines.length; i++) {
    if (lines[i].startsWith("@")) break;
    descLines.push(lines[i]);
  }

  return descLines.join("\n").trim();
}

function extractExamples(text: string): string[] {
  const examples: string[] = [];
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("@example")) {
      const exampleLines: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith("@")) break;
        exampleLines.push(lines[j]);
      }
      examples.push(exampleLines.join("\n").trim());
    }
  }

  return examples;
}

function extractAntipatterns(text: string): string[] {
  const antipatterns: string[] = [];
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("@antipattern")) {
      const patternLines: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith("@")) break;
        patternLines.push(lines[j]);
      }
      antipatterns.push(patternLines.join("\n").trim());
    }
  }

  return antipatterns;
}

/**
 * Generate Markdown documentation
 */
function generateMarkdown(sections: DocSection[]): string {
  let markdown = "";

  // Main title
  if (sections.length > 0) {
    markdown += `# ${sections[0].title}\n\n`;
    markdown += sections[0].description + "\n\n";

    if (sections[0].chapter.length > 0) {
      markdown += `**Chapters**: ${sections[0].chapter.join(", ")}\n\n`;
    }

    if (sections[0].examples.length > 0) {
      markdown += `## Overview\n\n`;
      sections[0].examples.forEach((example) => {
        markdown += example + "\n\n";
      });
    }

    if (sections[0].antipatterns.length > 0) {
      markdown += `## Common Pitfalls\n\n`;
      sections[0].antipatterns.forEach((pattern) => {
        markdown += pattern + "\n\n";
      });
    }
  }

  // Test sections
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    markdown += `## ${section.title}\n\n`;
    markdown += section.description + "\n\n";

    if (section.chapter.length > 0) {
      markdown += `**Concepts**: ${section.chapter.join(", ")}\n\n`;
    }

    if (section.examples.length > 0) {
      section.examples.forEach((example) => {
        markdown += `### Example\n\n${example}\n\n`;
      });
    }

    if (section.antipatterns.length > 0) {
      markdown += `### Anti-patterns\n\n`;
      section.antipatterns.forEach((pattern) => {
        markdown += pattern + "\n\n";
      });
    }

    if (section.tests.length > 0) {
      markdown += `### Test Cases\n\n`;
      section.tests.forEach((test) => {
        markdown += `#### ${test.name}\n\n`;
        markdown += test.description + "\n\n";
      });
    }
  }

  return markdown;
}

/**
 * Generate GitBook SUMMARY.md
 */
function generateSummary(projectName: string): string {
  return `# Summary

* [Introduction](README.md)
* [Getting Started](docs/getting-started.md)
* [Contract Overview](docs/contract-overview.md)
* [Test Documentation](docs/test-documentation.md)
* [FHEVM Concepts](docs/fhevm-concepts.md)
  * [Encryption](docs/encryption.md)
  * [Access Control](docs/access-control.md)
  * [User Decryption](docs/user-decryption.md)
  * [Public Decryption](docs/public-decryption.md)
* [API Reference](docs/api-reference.md)
* [Examples](docs/examples.md)
* [Best Practices](docs/best-practices.md)
* [Common Pitfalls](docs/common-pitfalls.md)
`;
}

/**
 * Main execution
 */
async function main() {
  console.log("Generating documentation from test files...\n");

  const testDir = path.join(__dirname, "..", "test");
  const docsDir = path.join(__dirname, "..", "docs");

  // Create docs directory if it doesn't exist
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Find all test files
  const testFiles = fs
    .readdirSync(testDir)
    .filter((file) => file.endsWith(".test.ts"));

  console.log(`Found ${testFiles.length} test file(s)\n`);

  // Process each test file
  for (const testFile of testFiles) {
    const testPath = path.join(testDir, testFile);
    console.log(`Processing: ${testFile}`);

    const sections = extractDocs(testPath);
    const markdown = generateMarkdown(sections);

    // Write documentation
    const docFileName = testFile.replace(".test.ts", "-documentation.md");
    const docPath = path.join(docsDir, docFileName);

    fs.writeFileSync(docPath, markdown);
    console.log(`  Generated: ${docFileName}`);
  }

  // Generate SUMMARY.md for GitBook
  const summaryPath = path.join(docsDir, "SUMMARY.md");
  fs.writeFileSync(summaryPath, generateSummary("PrivateIncomeVerification"));
  console.log("\nGenerated: SUMMARY.md");

  // Copy README to docs
  const readmePath = path.join(__dirname, "..", "README.md");
  if (fs.existsSync(readmePath)) {
    const docsReadmePath = path.join(docsDir, "README.md");
    fs.copyFileSync(readmePath, docsReadmePath);
    console.log("Copied: README.md");
  }

  console.log("\n✅ Documentation generation complete!");
  console.log(`📁 Documentation available in: ${docsDir}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error generating documentation:", error);
    process.exit(1);
  });
