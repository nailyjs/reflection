import { NodePath, PluginObj } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";
import { TypeAnnotationOperation } from "./classes/typeAnnotation";
import { IBabelPluginOptions } from "./typings";
import { ClassPathOperation } from "./classes/classOperation";

function addValue(key: string, value: t.Expression, nodePath: NodePath<t.ClassMethod | t.ClassProperty>, opts: IBabelPluginOptions) {
  if (key === "design:abstract" && opts.disableDesignAbstract) return;
  if (key === "design:super" && opts.disableDesignSuper) return;
  if (key === "design:typeParameters" && opts.disableDesignTypeParameters) return;
  if (key === "design:superTypeParameters" && opts.disableDesignSuperTypeParameters) return;
  if (key === "design:extraReturnType" && opts.disableDesignExtraReturnType) return;
  if (key === "design:access" && opts.disableDesignAccess) return;
  if (key === "design:accessibility" && opts.disableDesignAccessibility) return;
  if (key === "design:async" && opts.disableDesignAsync) return;
  if (key === "design:static" && opts.disableDesignStatic) return;
  if (key === "design:optional" && opts.disableDesignOptional) return;
  if (key === "design:generator" && opts.disableDesignGenerator) return;
  if (key === "design:override" && opts.disableDesignOverride) return;
  if (key === "design:kind" && opts.disableDesignKind) return;
  if (key === "design:defaultValue" && opts.disableDesignDefaultValue) return;
  if (key === "design:readonly" && opts.disableDesignReadonly) return;

  if (!nodePath.node.decorators) nodePath.node.decorators = [];
  // prettier-ignore
  nodePath.unshiftContainer("decorators", t.decorator(
    t.callExpression(
      t.identifier("Reflect.metadata"),
      [
        t.stringLiteral(key),
        value
      ]
    )
  ))
}

export default declare<IBabelPluginOptions>((api, options): PluginObj => {
  return {
    name: "naily-typescript-reflection",
    visitor: {
      Program(path) {
        path.traverse({
          ClassDeclaration(classPath) {
            if (!classPath.node.decorators) return;
            const operation = new ClassPathOperation(classPath);
            if (!options.disableDesignAbstract) operation.addAbstract();
            if (!options.disableDesignSuper && classPath.node.superClass) operation.addSuperMetadata();
            if (!options.disableDesignTypeParameters && classPath.node.typeParameters) operation.addTypeParameters();
            if (!options.disableDesignSuperTypeParameters && classPath.node.superTypeParameters) operation.addSuperTypeParameters();

            path.traverse({
              ClassMethod(classMethodPath) {
                if (!classMethodPath) return;
                if (!classMethodPath.node) return;
                if (!classMethodPath.node.decorators) return;
                if (!options.disableDesignExtraReturnType && classMethodPath.node.returnType && classMethodPath.node.returnType.type !== "Noop") {
                  // prettier-ignore
                  classMethodPath.unshiftContainer("decorators", t.decorator(
                    t.callExpression(
                      t.identifier("Reflect.metadata"),
                      [
                        t.stringLiteral("design:extraReturnType"),
                        new TypeAnnotationOperation(classPath).getTypeAnnotationDetail(classMethodPath.node.returnType.typeAnnotation)
                      ]
                    )
                  ))
                }

                addValue("design:abstract", t.booleanLiteral(classMethodPath.node.abstract || false), classMethodPath, options);
                addValue("design:access", t.stringLiteral(classMethodPath.node.access || "public"), classMethodPath, options);
                addValue("design:accessibility", t.stringLiteral(classMethodPath.node.accessibility || "public"), classMethodPath, options);
                addValue("design:async", t.booleanLiteral(classMethodPath.node.async || false), classMethodPath, options);
                addValue("design:static", t.booleanLiteral(classMethodPath.node.static || false), classMethodPath, options);
                addValue("design:optional", t.booleanLiteral(classMethodPath.node.optional || false), classMethodPath, options);
                addValue("design:generator", t.booleanLiteral(classMethodPath.node.generator || false), classMethodPath, options);
                addValue("design:override", t.booleanLiteral(classMethodPath.node.override || false), classMethodPath, options);
                addValue("design:kind", t.stringLiteral(classMethodPath.node.kind), classMethodPath, options);
              },
              ClassProperty(classPropertyPath) {
                if (!classPropertyPath) return;
                if (!classPropertyPath.node) return;

                addValue("design:abstract", t.booleanLiteral(classPropertyPath.node.abstract || false), classPropertyPath, options);
                addValue("design:accessibility", t.stringLiteral(classPropertyPath.node.accessibility || "public"), classPropertyPath, options);
                addValue("design:static", t.booleanLiteral(classPropertyPath.node.static || false), classPropertyPath, options);
                addValue("design:optional", t.booleanLiteral(classPropertyPath.node.optional || false), classPropertyPath, options);
                addValue("design:defaultValue", classPropertyPath.node.value || t.identifier("undefined"), classPropertyPath, options);
                addValue("design:readonly", t.booleanLiteral(classPropertyPath.node.readonly || false), classPropertyPath, options);
                addValue("design:override", t.booleanLiteral(classPropertyPath.node.override || false), classPropertyPath, options);
                if (classPropertyPath.node.typeAnnotation && !t.isNoop(classPropertyPath.node.typeAnnotation)) {
                  addValue(
                    "design:typeAnnotation",
                    new TypeAnnotationOperation(classPath).getTypeAnnotationDetail(classPropertyPath.node.typeAnnotation.typeAnnotation),
                    classPropertyPath,
                    options,
                  );
                }
              },
            });
          },
        });
      },
    },
  };
});
