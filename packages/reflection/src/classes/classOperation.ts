import { NodePath } from "@babel/core";
import * as t from "@babel/types";
import { TypeAnnotationOperation } from "./typeAnnotation";

export class ClassPathOperation {
  constructor(private readonly classPath: NodePath<t.ClassDeclaration>) {}

  public addAbstract() {
    // prettier-ignore
    this.classPath.unshiftContainer("decorators", t.decorator(
      t.callExpression(
        t.identifier("Reflect.metadata"),
        [t.stringLiteral("design:abstract"), t.booleanLiteral(this.classPath.node.abstract || false)]
      )
    ))
  }

  public addSuperMetadata() {
    // prettier-ignore
    this.classPath.unshiftContainer("decorators", t.decorator(
      t.callExpression(
        t.identifier("Reflect.metadata"),
        [t.stringLiteral("design:super"), this.classPath.node.superClass]
      )
    ))
  }

  public addTypeParameters() {
    if (this.classPath.node.typeParameters.type === "Noop") return;
    // prettier-ignore
    this.classPath.unshiftContainer("decorators", t.decorator(
      t.callExpression(
        t.identifier("Reflect.metadata"),
        [
          t.stringLiteral("design:typeParameters"),
          t.arrayExpression(
            this.classPath.node.typeParameters.params.map((param: t.TSTypeParameter | t.TypeParameter) => {
              return t.objectExpression([
                t.objectProperty(t.identifier("name"), t.stringLiteral(param.name)),
                t.objectProperty(t.identifier("default"), t.stringLiteral(param.default.type)),
              ])
            })
          )
        ]
      )
    ))
  }

  public addSuperTypeParameters() {
    // prettier-ignore
    this.classPath.unshiftContainer("decorators", t.decorator(
      t.callExpression(
        t.identifier("Reflect.metadata"),
        [
          t.stringLiteral("design:superTypeParameters"),
          t.arrayExpression(
            this.classPath.node.superTypeParameters.params.map((param: t.TSType | t.FlowType) => {
              return new TypeAnnotationOperation(this.classPath).getTypeAnnotationDetail(param)
            })
          )
        ]
      )
    ))
  }
}
