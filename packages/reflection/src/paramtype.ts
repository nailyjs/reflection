import * as t from "@babel/types";
import { TypeAnnotationOperation } from "./typeAnnotation";

export function getParamtypes(param: t.Identifier | t.RestElement | t.TSParameterProperty | t.Pattern, id: string): t.ObjectExpression | t.Noop {
  if (t.isIdentifier(param)) {
    if (t.isNoop(param.typeAnnotation)) return t.noop();
    const typeAnnotation = new TypeAnnotationOperation(id).getTypeAnnotation(param.typeAnnotation.typeAnnotation);
    if (typeAnnotation.type === "Noop") return t.noop();
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral("param")),
      t.objectProperty(t.identifier("paramName"), t.stringLiteral(param.name)),
      t.objectProperty(t.identifier("typeAnnotation"), typeAnnotation),
    ]);
  }

  if (t.isAssignmentPattern(param)) {
    if (t.isNoop(param.left)) return t.noop();
    if (t.isNoop(param.right)) return t.noop();
    if (!t.isIdentifier(param.left)) return t.noop();
    if (t.isNoop(param.left.typeAnnotation)) return t.noop();
    const typeAnnotation = new TypeAnnotationOperation(id).getTypeAnnotation(param.left.typeAnnotation.typeAnnotation);
    if (t.isNoop(typeAnnotation)) return t.noop();
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral("param")),
      t.objectProperty(t.identifier("paramName"), t.stringLiteral((param.left as t.Identifier).name)),
      t.objectProperty(t.identifier("value"), param.right),
      t.objectProperty(t.identifier("typeAnnotation"), typeAnnotation),
    ]);
  }

  if (t.isTSParameterProperty(param)) return this.getTSParameterProperty(param);
  return t.noop();
}
