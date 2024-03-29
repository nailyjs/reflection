import * as t from "@babel/types";
import { TypeReferenceOperation } from "./typeReference";
import { LiteralTypeOperation } from "./literalOperation";
import { NodePath } from "@babel/core";

export class TypeAnnotationOperation {
  constructor(private readonly classDeclaration: NodePath<t.ClassDeclaration>) {}

  private getTSArrayType(typeNode: t.TSArrayType): t.StringLiteral | t.ObjectExpression {
    const elementType = this.getTypeAnnotationDetail(typeNode.elementType);
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("arrayItem"), elementType),
    ]);
  }

  private getTSTupleType(typeNode: t.TSTupleType): t.StringLiteral | t.ObjectExpression {
    const items = typeNode.elementTypes.map((type) => {
      if (t.isTSNamedTupleMember(type)) return this.getTypeAnnotationDetail(type.elementType);
      return this.getTypeAnnotationDetail(type);
    });
    if (items.some((item) => t.isStringLiteral(item))) return t.stringLiteral(typeNode.type);
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("tupleItems"), t.arrayExpression(items as t.ObjectExpression[])),
    ]);
  }

  private getTSParenthesizedType(typeNode: t.TSParenthesizedType): t.StringLiteral | t.ObjectExpression {
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("parenthesizedItem"), this.getTypeAnnotationDetail(typeNode.typeAnnotation)),
    ]);
  }

  private getTSUnionType(typeNode: t.TSUnionType): t.StringLiteral | t.ObjectExpression {
    const items = typeNode.types.map((type): t.StringLiteral | t.ObjectExpression => this.getTypeAnnotationDetail(type));
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("unionItems"), t.arrayExpression(items)),
    ]);
  }

  private getTSIntersectionType(typeNode: t.TSIntersectionType): t.ObjectExpression {
    const items = typeNode.types.map((type): t.StringLiteral | t.ObjectExpression => {
      const detail = this.getTypeAnnotationDetail(type);
      if (t.isStringLiteral(detail)) return detail;
      return detail;
    });
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("intersectionItems"), t.arrayExpression(items)),
    ]);
  }

  public getTypeAnnotationDetail(typeNode: t.FlowType | t.TSType): t.StringLiteral | t.ObjectExpression {
    if (!typeNode) return undefined;
    // 数组类型
    if (t.isTSArrayType(typeNode)) return this.getTSArrayType(typeNode);
    // 元组类型
    if (t.isTSTupleType(typeNode)) return this.getTSTupleType(typeNode);
    // 括号类型
    if (t.isTSParenthesizedType(typeNode)) return this.getTSParenthesizedType(typeNode);
    // 联合类型
    if (t.isTSUnionType(typeNode)) return this.getTSUnionType(typeNode);
    // 交叉类型
    if (t.isTSIntersectionType(typeNode)) return this.getTSIntersectionType(typeNode);
    // 泛型
    if (t.isTSTypeReference(typeNode)) return new TypeReferenceOperation(this.classDeclaration).getTypeReferenceDetail(typeNode);
    // 字面量类型
    if (t.isTSLiteralType(typeNode)) return new LiteralTypeOperation().getLiteralTypeDetail(typeNode);
    // 其他类型
    return t.stringLiteral(typeNode.type);
  }
}
