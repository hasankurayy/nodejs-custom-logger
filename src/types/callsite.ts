// CallSite interface for stack trace manipulation
export interface CallSite {
  getThis(): unknown;
  getTypeName(): string | null;
  getFunctionName(): string | null;
  getMethodName(): string | null;
  getFileName(): string | null;
  getLineNumber(): number | null;
  getColumnNumber(): number | null;
  getEvalOrigin(): string | undefined;
  isToplevel(): boolean;
  isEval(): boolean;
  isNative(): boolean;
  isConstructor(): boolean;
}

export type PrepareStackTrace = (err: Error, stackTraces: CallSite[]) => any;