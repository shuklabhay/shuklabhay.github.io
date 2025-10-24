import Ajv from "ajv";
import fs from "fs";
import path from "path";

const ajv = new Ajv();

const schemasDir = path.join(process.cwd(), "schemas");
const dataDir = path.join(process.cwd(), "public/sitedata");

const schemaFiles = [
  { schema: "activities.schema.json", data: "experience.json" },
  { schema: "awards.schema.json", data: "awards.json" },
  { schema: "contact.schema.json", data: "contact.json" },
  { schema: "education.schema.json", data: "education.json" },
  { schema: "projects.schema.json", data: "projects.json" },
  { schema: "ghdata.schema.json", data: "ghdata.json" },
];

let hasErrors = false;

schemaFiles.forEach(({ schema, data }) => {
  const schemaPath = path.join(schemasDir, schema);
  const dataPath = path.join(dataDir, data);

  const schemaContent = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  const dataContent = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const validate = ajv.compile(schemaContent);
  const valid = validate(dataContent);

  if (!valid) {
    console.error(`Validation failed for ${data}:`);
    console.error(validate.errors);
    hasErrors = true;
  } else {
    console.log(`✓ ${data} is valid`);
  }
});

if (hasErrors) {
  process.exit(1);
}

console.log("\nAll JSON files are valid!");
