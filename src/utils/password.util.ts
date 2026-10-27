import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const DUMMY_HASH = bcrypt.hashSync("terrano-dummy-password", SALT_ROUNDS);

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return bcrypt.compare(password, storedHash);
}

// Spends the same CPU time as a real check so unknown users are not distinguishable by timing.
export async function verifyDummyPassword(password: string): Promise<void> {
    await bcrypt.compare(password, DUMMY_HASH);
}
