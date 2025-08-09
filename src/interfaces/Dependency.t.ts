import { Containers } from "@/kernel";

export type DependencyLoader = <T extends Containers, K extends keyof T>(
  name: K,
) => T[K];

export interface RequiresDependency {
  setDepdencyLoader(loader: DependencyLoader): void;
}
