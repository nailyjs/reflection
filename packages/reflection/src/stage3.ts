// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Symbol.metadata = Symbol("metadata");

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Reflect.metadata = (k: string | symbol | number, v: unknown) => {
  return <T extends Function>(_target: undefined | T, ctx: DecoratorContext) => {
    if (ctx.kind !== "class") {
      if (!ctx.metadata["design:properties"]) ctx.metadata["design:properties"] = {};
      if (!ctx.metadata["design:properties"][ctx.name]) ctx.metadata["design:properties"][ctx.name] = {};
      ctx.metadata["design:properties"][ctx.name][k] = v;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.metadata[k] = v;
  };
};

export {};
