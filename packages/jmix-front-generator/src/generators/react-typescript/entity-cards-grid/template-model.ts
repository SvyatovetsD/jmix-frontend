import {Entity, ProjectModel, View, EntityAttribute} from "../../../common/model/cuba-model";
import {CommonTemplateModel} from "../../../building-blocks/stages/template-model/pieces/common";
import {Answers, CardsInRowOption} from "./answers";
import {Options} from "./options";
import {elementNameToClass, normalizeRelativePath, unCapitalizeFirst} from "../../../common/utils";
import {stringIdAnswersToModel} from '../common/base-entity-screen-generator';
import {getDisplayedAttributes, ScreenType} from "../common/entity";
import {YeomanGenerator} from "../../../building-blocks/YeomanGenerator";


export type TemplateModel = CommonTemplateModel & {
  nameLiteral: string;
  entity: Entity,
  view: View,
  cardsInRow: number,
  attributes: EntityAttribute[],
  stringIdName?: string
}

const mapperCardsInRowOptionToNumber: Record<CardsInRowOption, number> = {
  "2 columns": 2,
  "3 columns": 3,
  "4 columns": 4
}

export async function deriveTemplateModel(
  answers: Answers, projectModel: ProjectModel, gen: YeomanGenerator, options: Options
): Promise<TemplateModel> {

  const className = elementNameToClass(answers.componentName);
  const relDirShift = normalizeRelativePath(options.dirShift);
  const nameLiteral = unCapitalizeFirst(className);

  const displayedAttributes = getDisplayedAttributes(
    answers.entityView.allProperties, 
    answers.entity, 
    projectModel, 
    ScreenType.BROWSER
  ); 

  const { stringIdName, listAttributes: attributes } = stringIdAnswersToModel(
    answers,
    projectModel,
    answers.entity,
    displayedAttributes
  );

  return {
    componentName: answers.componentName,
    className,
    nameLiteral,
    relDirShift,
    entity: answers.entity,
    view: answers.entityView,
    cardsInRow: mapperCardsInRowOptionToNumber[answers.cardsInRow],
    attributes,
    stringIdName
  }
}