import * as t from "@babel/types";

export class LiteralTypeOperation {
  private getNumericLiteralType(typeNode: t.NumericLiteral): t.ObjectExpression {
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("value"), t.numericLiteral(typeNode.value)),
    ]);
  }

  private getStringLiteralType(typeNode: t.StringLiteral): t.ObjectExpression {
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("value"), t.stringLiteral(typeNode.value)),
    ]);
  }

  private getBooleanLiteralType(typeNode: t.BooleanLiteral): t.ObjectExpression {
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("value"), t.booleanLiteral(typeNode.value)),
    ]);
  }

  private getBigIntLiteralType(typeNode: t.BigIntLiteral): t.ObjectExpression {
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("value"), t.bigIntLiteral(typeNode.value)),
    ]);
  }

  private getTemplateLiteralType(typeNode: t.TemplateLiteral): t.ObjectExpression {
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("value"), t.stringLiteral(typeNode.quasis[0].value.raw)),
    ]);
  }

  private getUnaryExpressionType(typeNode: t.UnaryExpression): t.ObjectExpression {
    return t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("operator"), t.stringLiteral(typeNode.operator)),
      t.objectProperty(t.identifier("argument"), typeNode.argument),
    ]);
  }

  public getLiteralTypeDetail(typeNode: t.TSLiteralType): t.ObjectExpression {
    if (t.isNumericLiteral(typeNode.literal)) return this.getNumericLiteralType(typeNode.literal);
    if (t.isStringLiteral(typeNode.literal)) return this.getStringLiteralType(typeNode.literal);
    if (t.isBooleanLiteral(typeNode.literal)) return this.getBooleanLiteralType(typeNode.literal);
    if (t.isBigIntLiteral(typeNode.literal)) return this.getBigIntLiteralType(typeNode.literal);
    if (t.isTemplateLiteral(typeNode.literal)) return this.getTemplateLiteralType(typeNode.literal);
    if (t.isUnaryExpression(typeNode.literal)) return this.getUnaryExpressionType(typeNode.literal);
    return t.objectExpression([t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type))]);
  }
}
