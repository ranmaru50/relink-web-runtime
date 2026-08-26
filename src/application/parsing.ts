// src/application/parsing.ts
import type { CapabilityErrorDefinition, InputDefinition, OutputDefinition, ProfileClaim, RepresentationDefinition, RequirementDefinition } from "../domain/model";

/** XML Adapter が返す、URL 未解決の中間構造です。 */
export interface ParsedInterface { readonly type: string; readonly method?: string; readonly endpoint?: string; readonly encoding?: string; readonly authentication?: { readonly type: string; readonly scope?: string }; }
export interface ParsedCapability { readonly id?: string; readonly type?: string; readonly inputs: readonly InputDefinition[]; readonly outputs: readonly OutputDefinition[]; readonly representations: readonly RepresentationDefinition[]; readonly errors: readonly CapabilityErrorDefinition[]; readonly requirements: readonly RequirementDefinition[]; readonly interfaces: readonly ParsedInterface[]; readonly hasResult: boolean; }
export interface ParsedARDocument { readonly namespace: string | null; readonly rootName: string; readonly version: string | null; readonly category?: string; readonly profileClaims: readonly ProfileClaim[]; readonly capabilities: readonly ParsedCapability[]; }
