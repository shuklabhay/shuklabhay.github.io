import Ajv from "ajv";
import fs from "fs";
import path from "path";

const ajv = new Ajv({ allErrors: true });

const pairs: [string, string][] = [
  ["activities", "activities"],
  ["awards", "awards"],
  ["contact", "contact"],
  ["education", "education"],
  ["projects", "projects"],
  ["skills", "skills"],
];

let hasError = false;

for (const [name, dataName] of pairs) {
  const schemaPath = path.resolve("schemas", `${name}.schema.json`);
  const dataPath = path.resolve("public", "sitedata", `${dataName}.json`);

  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    console.error(`❌ Validation failed for ${dataName}.json`);
    console.error(validate.errors);
    hasError = true;
  } else {
    console.log(`✅ ${dataName}.json is valid.`);
  }
}

if (hasError) {
  process.exit(1);
}
