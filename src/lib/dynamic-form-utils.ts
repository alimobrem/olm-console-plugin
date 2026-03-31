/**
 * Dynamic form utilities.
 * Migrated from @console/shared/src/components/dynamic-form/utils.
 */
import type { UiSchema } from '@rjsf/core';
import { getSchemaType } from '@rjsf/core/dist/cjs/utils';
import * as Immutable from 'immutable';
import type { JSONSchema7 } from 'json-schema';
import * as _ from 'lodash';
import type { DynamicFormSchemaError } from './dynamic-form-types';
import { JSONSchemaType } from './dynamic-form-types';

const UNSUPPORTED_SCHEMA_PROPERTIES = ['allOf', 'anyOf', 'oneOf'];

const THOUSAND = 10 ** 3;
const MILLION = 10 ** 6;
const BILLION = 10 ** 9;

// Transform a path string to a JSON schema path array
export const stringPathToUISchemaPath = (path: string): string[] =>
  (_.toPath(path) ?? []).map((subPath) => {
    return /^\d+$/.test(subPath) ? 'items' : subPath;
  });

export const getSchemaErrors = (schema: JSONSchema7): DynamicFormSchemaError[] => {
  return [
    ...(_.isEmpty(schema)
      ? [
          {
            title: 'Empty Schema',
            message: 'Schema is empty.',
          },
        ]
      : []),
    ..._.map(
      _.intersection(_.keys(schema), UNSUPPORTED_SCHEMA_PROPERTIES),
      (unsupportedProperty) => ({
        title: 'Unsupported Property',
        message: `Cannot generate form fields for JSON schema with ${unsupportedProperty} property.`,
      }),
    ),
  ];
};

// Determine if a schema will produce no form fields.
export const hasNoFields = (jsonSchema: JSONSchema7 = {}, uiSchema: UiSchema = {}): boolean => {
  if (getSchemaErrors(jsonSchema).length > 0) {
    return true;
  }

  const type = getSchemaType(jsonSchema) ?? '';
  const noUIFieldOrWidget = !uiSchema?.['ui:field'] && !uiSchema?.['ui:widget'];
  switch (type) {
    case JSONSchemaType.array:
      return noUIFieldOrWidget && hasNoFields(jsonSchema.items as JSONSchema7, uiSchema?.items);
    case JSONSchemaType.object:
      return (
        noUIFieldOrWidget &&
        _.every(jsonSchema?.properties, (property, propertyName) =>
          hasNoFields(property as JSONSchema7, uiSchema?.[propertyName]),
        )
      );
    case JSONSchemaType.boolean:
    case JSONSchemaType.integer:
    case JSONSchemaType.number:
    case JSONSchemaType.string:
      return false;
    default:
      return noUIFieldOrWidget;
  }
};

// Recursively find the minimum ui:sortOrder property found within this uiSchema or it's children.
const getUISortOrder = (uiSchema: UiSchema, fallback: number): number => {
  return Number(
    uiSchema?.['ui:sortOrder'] ??
      _.min(
        _.keys(uiSchema).map((key) => {
          return !key.includes(':') && _.isObject(uiSchema?.[key])
            ? getUISortOrder(uiSchema?.[key], fallback)
            : fallback;
        }),
      ) ??
      fallback,
  );
};

// Return an array of dependency control field names that exist within uiSchema at the specified path.
const getControlFieldsAtPath = (uiSchema: UiSchema, path: string[]): string[] => {
  if (!_.isObject(uiSchema)) {
    return [];
  }
  const { 'ui:dependency': dependency } = uiSchema;
  const dependencyMatchesPath =
    dependency && _.isEqual(dependency.controlFieldPath.slice(0, -1), path ?? []);
  return [
    ...(dependencyMatchesPath ? [dependency.controlFieldName] : []),
    ..._.flatMap(uiSchema, (childUISchema) => getControlFieldsAtPath(childUISchema, path)),
  ];
};

const getJSONSchemaPropertySortWeight = (
  property: string,
  jsonSchema: JSONSchema7,
  uiSchema: UiSchema,
  currentPath?: string[],
): number => {
  const isRequired = (jsonSchema?.required ?? []).includes(property);
  const propertyUISchema = uiSchema?.[property];

  const controlFields = getControlFieldsAtPath(propertyUISchema, currentPath);

  const isControlField = _.some(uiSchema, ({ 'ui:dependency': siblingDependency }) =>
    _.isEqual(siblingDependency?.controlFieldPath, [...(currentPath ?? []), property]),
  );

  const uiSortOrder = getUISortOrder(propertyUISchema, _.keys(jsonSchema?.properties).length);

  const controlFieldOffset = isControlField ? uiSortOrder * THOUSAND : 0;

  const offset = controlFieldOffset + uiSortOrder;

  if (controlFields?.length) {
    return (
      Math.max(
        ...controlFields.map((controlField) =>
          getJSONSchemaPropertySortWeight(controlField, jsonSchema, uiSchema, currentPath),
        ),
      ) + offset
    );
  }

  return (
    (!isRequired && !propertyUISchema && !controlFieldOffset ? Infinity : 0) -
    (isRequired ? BILLION : 0) -
    (propertyUISchema ? MILLION : 0) +
    offset
  );
};

// Given a JSONSchema and associated uiSchema, create the appropriate ui schema order property.
export const getJSONSchemaOrder = (
  jsonSchema: JSONSchema7,
  uiSchema: UiSchema,
  currentPath?: string[],
) => {
  const type = getSchemaType(jsonSchema ?? {});
  const handleArray = () => {
    const descendantOrder = getJSONSchemaOrder(jsonSchema?.items as JSONSchema7, uiSchema?.items, [
      ...(currentPath ?? []),
      'items',
    ]);
    return !_.isEmpty(descendantOrder) ? { items: descendantOrder } : {};
  };

  const handleObject = () => {
    const propertyNames = _.keys(jsonSchema?.properties ?? {});
    if (_.isEmpty(propertyNames)) {
      return {};
    }

    const uiOrder = Immutable.Set(propertyNames)
      .sortBy((property) =>
        getJSONSchemaPropertySortWeight(property, jsonSchema, uiSchema, currentPath ?? []),
      )
      .toJS();

    return {
      ...(uiOrder.length > 1 && { 'ui:order': uiOrder }),
      ..._.reduce(
        jsonSchema?.properties ?? {},
        (orderAccumulator, propertySchema, propertyName) => {
          const descendantOrder = getJSONSchemaOrder(
            propertySchema as JSONSchema7,
            uiSchema?.[propertyName],
            [...(currentPath ?? []), propertyName],
          );
          if (_.isEmpty(descendantOrder)) {
            return orderAccumulator;
          }
          return {
            ...orderAccumulator,
            [propertyName]: descendantOrder,
          };
        },
        {},
      ),
    };
  };

  switch (type) {
    case JSONSchemaType.array:
      return handleArray();
    case JSONSchemaType.object:
      return handleObject();
    default:
      return {};
  }
};

// Returns true if a value is not nil and is empty
const definedAndEmpty = (value) => !_.isNil(value) && _.isEmpty(value);

// Helper function for prune
const pruneRecursive = (current: any, sample: any): any => {
  const valueIsEmpty = (value, key) =>
    _.isNil(value) ||
    _.isNaN(value) ||
    (_.isString(value) && _.isEmpty(value)) ||
    (_.isObject(value) && _.isEmpty(pruneRecursive(value, sample?.[key])));

  const shouldPrune = (value, key) => valueIsEmpty(value, key) && !definedAndEmpty(sample?.[key]);

  _.forOwn(current, (value, key) => {
    if (shouldPrune(value, key)) {
      delete current[key];
    }
  });

  if (_.isArray(current)) {
    _.pull(current, undefined);
  }

  return current;
};

// Deeply remove all empty, NaN, null, or undefined values from an object or array.
export const prune = (obj: any, sample?: any): any => {
  return pruneRecursive(_.cloneDeep(obj), sample);
};
