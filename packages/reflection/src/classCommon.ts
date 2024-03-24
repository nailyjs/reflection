import * as t from "@babel/types";

export abstract class ClassCommonOperation {
  protected getClassPropertyOrMethodName(
    method: t.ClassMethod | t.ClassProperty,
  ): t.StringLiteral | t.NumericLiteral | t.BigIntLiteral | t.Identifier {
    if (t.isIdentifier(method.key)) return t.stringLiteral(method.key.name);
    if (t.isStringLiteral(method.key)) return t.stringLiteral(method.key.value);
    if (t.isNumericLiteral(method.key)) return t.numericLiteral(method.key.value);
    if (t.isBigIntLiteral(method.key)) return t.bigIntLiteral(method.key.value);
    return t.identifier("undefined");
  }

  protected getClassPropertyOrMethodAccessibility(method: t.ClassMethod | t.ClassProperty): t.StringLiteral {
    if (method.accessibility) return t.stringLiteral(method.accessibility);
    return t.stringLiteral("public");
  }

  protected getClassPropertyOrMethodStatic(method: t.ClassMethod | t.ClassProperty): t.BooleanLiteral {
    if (method.static) return t.booleanLiteral(method.static);
    return t.booleanLiteral(false);
  }
}
