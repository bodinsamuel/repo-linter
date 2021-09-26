import type { Options, RuleInterface } from './rule';

export type Ruleset = Record<string, Options<any>>;
export type Rulesets = Record<string, Ruleset>;
export type Rules = Record<string, { def: RuleInterface<any, any> }>;
