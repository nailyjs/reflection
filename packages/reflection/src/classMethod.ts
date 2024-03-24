import * as t from "@babel/types";
import { getParamtypes } from "./paramtype";
import { ClassCommonOperation } from "./classCommon";
import { TypeAnnotationOperation } from "./typeAnnotation";

export class ClassMethodOperation extends ClassCommonOperation {
  constructor(private readonly id: string) {
    super();
  }

  getClassMethodAccess(method: t.ClassMethod): t.StringLiteral {
    if (method.access) return t.stringLiteral(method.access);
    return t.stringLiteral("public");
  }

  private getClassMethodAsync(method: t.ClassMethod): t.BooleanLiteral {
    if (method.async) return t.booleanLiteral(method.async);
    return t.booleanLiteral(false);
  }

  private getClassMethodGenerator(method: t.ClassMethod): t.BooleanLiteral {
    if (method.generator) return t.booleanLiteral(method.generator);
    return t.booleanLiteral(false);
  }

  private getClassMethodAbstract(method: t.ClassMethod): t.BooleanLiteral {
    if (method.abstract) return t.booleanLiteral(method.abstract);
    return t.booleanLiteral(false);
  }

  private getClassMethodOptional(method: t.ClassMethod): t.BooleanLiteral {
    if (method.optional) return t.booleanLiteral(method.optional);
    return t.booleanLiteral(false);
  }

  /** @todo */
  private getTSParameterProperty(param: t.TSParameterProperty): t.ObjectExpression {
    if (t.isIdentifier(param.parameter)) {
      return t.objectExpression([
        t.objectProperty(t.identifier("type"), t.stringLiteral(param.type)),
        t.objectProperty(t.identifier("name"), param.parameter),
      ]);
    } else if (t.isAssignmentPattern(param.parameter)) {
      return t.objectExpression([
        t.objectProperty(t.identifier("type"), t.stringLiteral(param.type)),
        t.objectProperty(t.identifier("name"), param.parameter.left),
        t.objectProperty(t.identifier("value"), param.parameter.right),
      ]);
    }
  }

  public getClassMethod(method: t.ClassMethod): t.ObjectExpression {
    const objExpression = t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(method.type)),
      t.objectProperty(t.identifier("name"), super.getClassPropertyOrMethodName(method)),
      t.objectProperty(t.identifier("accessibility"), super.getClassPropertyOrMethodAccessibility(method)),
      t.objectProperty(t.identifier("access"), this.getClassMethodAccess(method)),
      t.objectProperty(t.identifier("async"), this.getClassMethodAsync(method)),
      t.objectProperty(t.identifier("static"), super.getClassPropertyOrMethodStatic(method)),
      t.objectProperty(t.identifier("generator"), this.getClassMethodGenerator(method)),
      t.objectProperty(t.identifier("abstract"), this.getClassMethodAbstract(method)),
      t.objectProperty(t.identifier("optional"), this.getClassMethodOptional(method)),
    ]);

    const paramtypes = method.params.map((param) => getParamtypes(param, this.id));
    if (paramtypes.some((param) => !t.isNoop(param))) {
      objExpression.properties.push(t.objectProperty(t.identifier("params"), t.arrayExpression(paramtypes as t.ObjectExpression[])));
    }

    if (method.returnType && !t.isNoop(method.returnType)) {
      const returnType = new TypeAnnotationOperation(this.id).getTypeAnnotation(method.returnType.typeAnnotation);
      if (!t.isNoop(returnType)) objExpression.properties.push(t.objectProperty(t.identifier("returnType"), returnType));
    }

    return objExpression;
  }
}
