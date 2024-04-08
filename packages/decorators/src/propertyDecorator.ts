export interface ClassDecoratorBuilderContext<Target = unknown> {
  buildStage3?(target: Target | undefined, ctx: ClassMemberDecoratorContext): void;
  buildLegacy?(target: Object, propertyKey: string | symbol, methodDecoratorDescriptor: TypedPropertyDescriptor<unknown>): void;
}

export class PropertyDecoratorBuilder<Target> {
  constructor(private readonly buildCtx: ClassDecoratorBuilderContext<Target>) {}

  public build<Ctx extends ClassMemberDecoratorContext, TypedMethod extends TypedPropertyDescriptor<unknown>>() {
    return (target: Target, ctxOrPropertyKey?: Ctx | string | symbol, methodDecoratorDescriptor?: TypedMethod) => {
      if (ctxOrPropertyKey && typeof ctxOrPropertyKey === "object") {
        if (this.buildCtx.buildStage3) this.buildCtx.buildStage3(target, ctxOrPropertyKey as Ctx);
      } else if (ctxOrPropertyKey && typeof ctxOrPropertyKey !== "object") {
        if (this.buildCtx.buildLegacy) this.buildCtx.buildLegacy(target, ctxOrPropertyKey as string | symbol, methodDecoratorDescriptor);
      }
    };
  }
}
