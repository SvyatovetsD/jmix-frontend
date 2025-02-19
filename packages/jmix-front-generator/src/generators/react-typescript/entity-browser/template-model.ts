import {EntityAttribute, ProjectModel} from "../../../common/model/cuba-model";
import {YeomanGenerator} from "../../../building-blocks/YeomanGenerator";
import {
  deriveEntityCommon,
  CommonTemplateModel,
} from "../../../building-blocks/stages/template-model/pieces/common";
import {
  deriveEntity,
  EntityWithPath
} from "../../../building-blocks/stages/template-model/pieces/entity";
import {templateUtilities, UtilTemplateModel} from "../../../building-blocks/stages/template-model/pieces/util";
import {EntityBrowserAnswers, BrowserTypes} from "./answers";
import {ComponentOptions} from "../../../building-blocks/stages/options/pieces/component";
import { ScreenType } from "../common/entity";
import { getDisplayedAttributesFromQuery } from "../../../building-blocks/stages/template-model/pieces/getDisplayedAttributesFromQuery";
import { deriveRelations, RelationsTemplateModel } from "../../../building-blocks/stages/template-model/pieces/deriveRelations";

export type EntityBrowserTemplateModel =
  CommonTemplateModel
  & UtilTemplateModel
  & RelationsTemplateModel
  & {
  browserType: BrowserTypes;
  query: string;
  attributes: EntityAttribute[];
  entity: EntityWithPath;
  stringIdName?: string;
};

export const deriveBrowserTemplateModel = async (
  answers: EntityBrowserAnswers, projectModel: ProjectModel, gen: YeomanGenerator, options: ComponentOptions
): Promise<EntityBrowserTemplateModel> => {
  const attributes = getDisplayedAttributesFromQuery({
    entity: answers.entity,
    query: answers.query,
    screenType: ScreenType.BROWSER,
  }, projectModel);

  return {
    query: answers.query,
    browserType: answers.browserType,
    attributes,
    ...deriveEntity(answers, projectModel),
    ...deriveEntityCommon(options, answers),
    ...deriveRelations(projectModel, attributes),
    // ...deriveStringIdAnswers(answers, projectModel, listAttributes, editAttributes), // TODO A different implementation is needed for GraphQL
    ...templateUtilities
  }
};
