import { stdin as input, stdout as output } from "node:process";
import { getPayload } from "payload";
import readline from "readline/promises";
import config from "../payload.config";

type Credentials = {
  email: string;
  password: string;
};

function parseArgs(): Partial<Credentials> {
  const args = process.argv.slice(2);
  const emailArg = args.find((a) => a.startsWith("--email="));
  const passwordArg = args.find((a) => a.startsWith("--password="));

  const email = emailArg?.split("=")[1] ?? process.env.ADMIN_EMAIL ?? undefined;
  const password = passwordArg?.split("=")[1] ?? process.env.ADMIN_PASSWORD ?? undefined;

  return { email, password };
}

async function promptCredentials(partial: Partial<Credentials>): Promise<Credentials> {
  const rl = readline.createInterface({ input, output });

  const email = partial.email ?? (await rl.question("Admin email: "))?.trim();
  const password = partial.password ?? (await rl.question("Admin password: "))?.trim();

  await rl.close();

  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  if (!email.includes("@")) throw new Error("Email must be valid");

  return { email, password };
}

async function createOrUpdateAdmin({ email, password }: Credentials) {
  const payload = await getPayload({ config });

  payload.logger.info("Creating or updating admin user...");

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    const user = existing.docs[0];
    await payload.update({
      collection: "users",
      id: user.id,
      data: { password, role: "admin" },
    });
    payload.logger.info(`Updated existing user ${email} as admin.`);
  } else {
    await payload.create({
      collection: "users",
      data: { email, password, role: "admin" },
    });
    payload.logger.info(`Created admin user ${email}.`);
  }
}

async function run() {
  try {
    const partial = parseArgs();
    const creds = await promptCredentials(partial);
    await createOrUpdateAdmin(creds);
    process.exit(0);
  } catch (err) {
    console.error("Failed to create or update admin user:");
    console.error(err);
    process.exit(1);
  }
}

run();
