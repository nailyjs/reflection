import * as t from "@babel/types";
import { ClassCommonOperation } from "./classCommon";

export class ClassPropertyOperation extends ClassCommonOperation {
  getClassPropertyReadonly(property: t.ClassProperty): t.BooleanLiteral {
    if (property.readonly) return t.booleanLiteral(property.readonly);
    return t.booleanLiteral(false);
  }

  getClassProperty(property: t.ClassProperty): t.ObjectExpression {
    const objExpression = t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(property.type)),
      t.objectProperty(t.identifier("name"), super.getClassPropertyOrMethodName(property)),
      t.objectProperty(t.identifier("readonly"), this.getClassPropertyReadonly(property)),
      t.objectProperty(t.identifier("static"), super.getClassPropertyOrMethodStatic(property)),
      t.objectProperty(t.identifier("accessibility"), super.getClassPropertyOrMethodAccessibility(property)),
    ]);
    return objExpression;
  }
}
