export abstract class Encrypter {
  abstract encrypt(value: Record<string, unknown>): Promise<string>

  abstract decrypt(value: string): Promise<Record<string, unknown>>
}
