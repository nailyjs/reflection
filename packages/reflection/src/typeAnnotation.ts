import * as t from "@babel/types";
import { getParamtypes } from "./paramtype";
import { isInclude } from ".";

export function getTypeAnnotationTypeName(node: t.FlowType | t.TSType) {
  if (t.isFlowType(node)) return node.type;
  if (t.isTSType(node)) return node.type;
  return "undefined";
}

export class TSTypeReference {
  constructor(private readonly id: string) {}

  public getTSEntityName(node: t.TSEntityName): t.ObjectExpression {
    if (t.isIdentifier(node)) {
      return t.objectExpression([
        t.objectProperty(t.identifier("type"), t.stringLiteral(node.type)),
        t.objectProperty(t.identifier("name"), isInclude(node.name, this.id) ? t.identifier(node.name) : t.stringLiteral(node.name)),
      ]);
    } else if (t.isTSQualifiedName(node)) {
      return t.objectExpression([
        t.objectProperty(t.identifier("type"), t.stringLiteral(node.type)),
        t.objectProperty(t.identifier("left"), this.getTSEntityName(node.left)),
        t.objectProperty(t.identifier("right"), this.getTSEntityName(node.right)),
      ]);
    }
  }

  public getTSTypeReference(node: t.TSTypeReference): t.ObjectExpression {
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(node.type)),
      t.objectProperty(t.identifier("typeName"), this.getTSEntityName(node.typeName)),
      t.objectProperty(t.identifier("typeParams"), new TypeAnnotationOperation(this.id).getTSTypeParameterInstantiation(node.typeParameters)),
    ]);
  }
}

export class TypeAnnotationOperation {
  constructor(private readonly id: string) {}

  private getTSArrayType(typeNode: t.TSArrayType): t.Noop | t.ObjectExpression {
    const elementType = this.getTypeAnnotation(typeNode.elementType);
    if (elementType.type === "Noop") return elementType;
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("arrayItems"), elementType),
    ]);
  }

  private getTSTupleType(typeNode: t.TSTupleType): t.Noop | t.ObjectExpression {
    const items = typeNode.elementTypes.map((type) => {
      if (t.isTSNamedTupleMember(type)) return this.getTypeAnnotation(type.elementType);
      return this.getTypeAnnotation(type);
    });
    if (items.some((item) => t.isNoop(item))) return t.noop();
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("tupleItems"), t.arrayExpression(items as t.ObjectExpression[])),
    ]);
  }

  private getTSParenthesizedType(typeNode: t.TSParenthesizedType): t.Noop | t.ObjectExpression {
    return this.getTypeAnnotation(typeNode.typeAnnotation);
  }

  private getTSUnionType(typeNode: t.TSUnionType): t.ObjectExpression {
    const items = typeNode.types
      .map((type): t.Noop | t.ObjectExpression => {
        const detail = this.getTypeAnnotation(type);
        if (t.isNoop(detail)) return t.noop();
        return detail;
      })
      .filter((item) => !t.isNoop(item)) as t.ObjectExpression[];
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("unionItems"), t.arrayExpression(items)),
    ]);
  }

  private getTSIntersectionType(typeNode: t.TSIntersectionType): t.ObjectExpression {
    const items = typeNode.types
      .map((type): t.Noop | t.ObjectExpression => {
        const detail = this.getTypeAnnotation(type);
        if (t.isNoop(detail)) return t.noop();
        return detail;
      })
      .filter((item) => !t.isNoop(item)) as t.ObjectExpression[];
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("intersectionItems"), t.arrayExpression(items)),
    ]);
  }

  private getTSTypeReference(typeNode: t.TSTypeReference): t.ObjectExpression {
    return new TSTypeReference(this.id).getTSTypeReference(typeNode);
  }

  private getTSFunctionType(typeNode: t.TSFunctionType): t.Noop | t.ObjectExpression {
    const returntype = this.getTypeAnnotation(typeNode.typeAnnotation.typeAnnotation);
    if (t.isNoop(returntype)) return t.noop();
    const paramtypes = typeNode.parameters.map((param) => getParamtypes(param, this.id));
    if (paramtypes.some((param) => t.isNoop(param))) return t.noop();
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("params"), t.arrayExpression(paramtypes as t.ObjectExpression[])),
      t.objectProperty(t.identifier("returnType"), returntype),
    ]);
  }

  private getTSTypeQuery(typeNode: t.TSTypeQuery): t.ObjectExpression {
    const typeAnnotation = new TSTypeReference(this.id).getTSEntityName(typeNode.exprName as t.TSEntityName);
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("exprName"), typeAnnotation),
    ]);
  }

  public getTypeAnnotation(typeNode: t.FlowType | t.TSType): t.Noop | t.ObjectExpression {
    // 未知类型
    if (!typeNode) return t.noop();
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
    // 函数类型
    if (t.isTSFunctionType(typeNode)) return this.getTSFunctionType(typeNode);
    // 泛型引用类型
    if (t.isTSTypeReference(typeNode)) return this.getTSTypeReference(typeNode);
    // TypeQuery类型
    if (t.isTSTypeQuery(typeNode) && t.isTSEntityName(typeNode.exprName)) return this.getTSTypeQuery(typeNode);
    // 其他类型
    return t.objectExpression([t.objectProperty(t.identifier("type"), t.stringLiteral(typeNode.type))]);
  }

  public getTSTypeParameterInstantiation(typeNode: t.TSTypeParameterInstantiation): t.ObjectExpression {
    if (!typeNode) return t.objectExpression([]);
    // 分析泛型参数
    const params = typeNode.params.map((param) => this.getTypeAnnotation(param)).filter((param) => !t.isNoop(param)) as t.ObjectExpression[];

    // 返回泛型参数
    return t.objectExpression([
      t.objectProperty(t.identifier("type"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("typeParams"), t.arrayExpression(params)),
    ]);
  }
}
