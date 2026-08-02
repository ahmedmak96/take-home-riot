export abstract class SigningAlgorithm {
  abstract sign(canonicalString: string): string;
  abstract verify(canonicalString: string, signature: string): boolean;
}
