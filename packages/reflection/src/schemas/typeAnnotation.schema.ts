import { TSType, FlowType } from "@babel/types";
import { ReflectionReferenceObject } from "./typeReference.schema";

export interface ReflectionArrayObject {
  name: "TSArrayType";
  /**
   * The array item's type.
   *
   * @author Zero <gczgroup@qq.com>
   * @date 2024/03/29
   * @type {ReflectionObject}
   * @memberof ReflectionArrayObject
   */
  arrayItem: ReflectionObject;
}

export interface ReflectionTupleObject {
  name: "TSTupleType";
  /**
   * The tuple items' type. The order of the items is the same as the order of the tuple.
   *
   * @author Zero <gczgroup@qq.com>
   * @date 2024/03/29
   * @type {ReflectionObject[]}
   * @memberof ReflectionTupleObject
   */
  tupleItems: ReflectionObject[];
}

export interface ReflectionParenthesizedObject {
  name: "TSParenthesizedType";
  /**
   * The parenthesized item's type. The type is wrapped in parentheses.
   *
   * @author Zero <gczgroup@qq.com>
   * @date 2024/03/29
   * @type {ReflectionObject}
   * @memberof ReflectionParenthesizedObject
   */
  parenthesizedItem: ReflectionObject;
}

export interface ReflectionUnionObject {
  name: "TSUnionType";
  /**
   * The union items' type. The union items are separated by `|`.
   *
   * @author Zero <gczgroup@qq.com>
   * @date 2024/03/29
   * @type {ReflectionObject[]}
   * @memberof ReflectionUnionObject
   */
  unionItems: ReflectionObject[];
}

export interface ReflectionIntersectionObject {
  name: "TSIntersectionType";
  /**
   * The intersection items' type. The intersection items are separated by `&`.
   *
   * @author Zero <gczgroup@qq.com>
   * @date 2024/03/29
   * @type {ReflectionObject[]}
   * @memberof ReflectionIntersectionObject
   */
  intersectionItems: ReflectionObject[];
}

export interface ReflectionTypeLiteralObject {
  name: "TSTypeLiteral";
  /**
   * The type literal members
   *
   * @author Zero <gczgroup@qq.com>
   * @date 2024/03/29
   * @type {ReflectionObject[]}
   * @memberof ReflectionTypeLiteralObject
   */
  members: ReflectionObject[];
}

export type AnalysedTypeAnnotationName = AnalysedTypeAnnotation["name"];
export type UnAnalysedTypeAnnotationName = (TSType | FlowType)["type"];
export type AnalysedTypeAnnotation =
  | ReflectionArrayObject
  | ReflectionTupleObject
  | ReflectionParenthesizedObject
  | ReflectionUnionObject
  | ReflectionIntersectionObject
  | ReflectionTypeLiteralObject
  | ReflectionReferenceObject;
export type UnAnalysedTypeAnnotation = Exclude<UnAnalysedTypeAnnotationName, AnalysedTypeAnnotationName>;
export type ReflectionObject = UnAnalysedTypeAnnotation | AnalysedTypeAnnotation;
