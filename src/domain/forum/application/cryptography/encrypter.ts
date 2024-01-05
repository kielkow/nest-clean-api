export abstract class Encrypter {
  abstract encrypt(value: string): Promise<string>

  abstract decrypt(value: string): Promise<string>
}
