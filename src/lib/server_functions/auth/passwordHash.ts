import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
	return await argon2.hash(password, {
		type: argon2.argon2id, // Recommended standard variant
		memoryCost: 65536, // 64 MB
		timeCost: 3, // 3 iterations
		parallelism: 4, // Match your CPU cores
	});
}

export async function verifyPassword(
	hash: string,
	plain: string,
): Promise<boolean> {
	return await argon2.verify(hash, plain);
}
