export interface Type<T = unknown> extends Function {
  new (...args: any[]): T;
}

export type NailyLegacyClassDecorator<Target extends Type = Type> = (target: Target) => Target | void;
export type NailyStage3ClassDecorator<Target extends Type = Type> = (target: Target, ctx: ClassDecoratorContext) => Target | void;
export type NailyClassDecorator<Target extends Type> = NailyLegacyClassDecorator<Target> | NailyStage3ClassDecorator<Target>;

export interface ClassDecoratorBuilderContext<Target = unknown> {
  build(target: Target, ctx?: ClassDecoratorContext | undefined): void;
}

export class ClassDecoratorBuilder<Target = Type> {
  constructor(private readonly buildCtx: ClassDecoratorBuilderContext<Target>) {}

  public build() {
    return (target: Target, ctx?: ClassDecoratorContext) => {
      if (!ctx || typeof ctx !== "object") {
        return this.buildCtx.build(target);
      } else {
        return this.buildCtx.build(target, ctx);
      }
    };
  }
}
