declare global {
  namespace Reflect {
    function metadata(k: string | symbol, v: unknown): any;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!Symbol.metadata) Symbol.metadata = Symbol("metadata");

Reflect.metadata = (k: string | symbol, v: unknown) => {
  return (target: Function | undefined, ctx: DecoratorContext) => {
    if (k === "design:naily:method:type" && typeof v === "object") {
      if (!ctx.metadata["design:naily:method:type"]) ctx.metadata["design:naily:method:type"] = {};
      for (const key in v) {
        ctx.metadata["design:naily:method:type"][key] = v[key];
      }
      return;
    }
    ctx.metadata[k] = v;
  };
};

export {};
