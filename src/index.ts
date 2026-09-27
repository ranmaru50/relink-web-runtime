// src/index.ts
export { ARRuntime, DefaultResourceNetworkPolicy, RuntimeCapability, RuntimeDocument } from "./runtime/ARRuntime";
export {
  ARRuntimeError,
  CapabilityError,
  ContractError,
  ContractResolutionError,
  HTTPSDowngradeError,
  HTTPResponseError,
  InterfaceError,
  ManifestError,
  ManifestFetchError,
  ManifestParseError,
  ManifestValidationError,
  NetworkPolicyError,
  ParseError,
  RepresentationError,
  TransportError,
  ValidationError,
} from "./domain/errors";

export type { InputValues, InvocationResult, InvokeOptions, NetworkPolicy } from "./application/invocation";
export type { ARRuntimeOptions, ResourceNetworkPolicy } from "./runtime/ARRuntime";
export { EmptySemanticRegistry, InMemorySemanticRegistry } from "./ports/semantic";
export { evaluateProfileDocument } from "./ports/semantic";
export type { CapabilityContract, ProfileCapabilityRequirement, ProfileDefinition, ProfileIdentifierRequirement, ProfileInterfaceRequirement, ProfilePropertyRequirement, SemanticRegistry } from "./ports/semantic";
export { InMemoryExtensionRegistry } from "./ports/extension";
export type { ExtensionProcessor, ExtensionRegistry, ExtensionSlot, ExtensionValidationResult } from "./ports/extension";
export { evaluateCapability, evaluateProfile, resolveContract, validateProjection } from "./application/evaluation";
export type { ProfileConformanceState, ProfileEvaluation, ProfileResolutionState } from "./application/evaluation";
export type {
  ARDocument,
  ARDocumentFormat,
  AvailabilityState,
  Capability,
  CapabilityEvaluation,
  CapabilityErrorDefinition,
  CapabilityLocalId,
  ContractResolutionState,
  CoreDataType,
  ForeignMetadataAttribute,
  HTTPApiRealization,
  HTTPInterfaceDefinition,
  HTTPOperationMapping,
  Identifier,
  InputDefinition,
  InterfaceDefinition,
  InterfaceExtension,
  InterfaceUse,
  InvocationDefinition,
  LegacyHTTPInterfaceDefinition,
  OpaqueExtensionAttribute,
  OpaqueExtensionElement,
  OutputDefinition,
  Property,
  ProfileClaim,
  ProjectionValidationState,
  RepresentationDefinition,
  RequirementDefinition,
  RequirementEvaluationState,
  ResultDefinition,
  RouteEvaluation,
  SemanticCapabilityIdentifier,
  Subject,
  SupportState,
} from "./domain/model";
export type { HTTPInvoker, HTTPResponse, ResourceFetcher, ResourceFetchOptions, ResourceFetchResult, XMLParser } from "./ports/runtime";
