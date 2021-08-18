import {YeomanGenerator} from "../../../building-blocks/YeomanGenerator";
import {componentOptionsConfig} from "../../../common/cli-options";
import {defaultPipeline} from "../../../building-blocks/pipelines/defaultPipeline";
import {getAnswersFromPrompt, allQuestions, TableWithFiltersAnswers } from "./answers";
import path from "path";
import {TableWithFiltersTemplateModel, deriveTableWithFiltersTemplateModel} from "./template-model";
import {writeTableWithFilters} from "./write";
import {ComponentOptions} from "../../../building-blocks/stages/options/pieces/component";

export class ReactTableWithFiltersGenerator extends YeomanGenerator {
  constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
  }

  async generate() {
    await defaultPipeline<ComponentOptions, TableWithFiltersAnswers, TableWithFiltersTemplateModel>(
      {
        templateDir: path.join(__dirname, 'template'),
        questions: allQuestions,
        stages: {
          getAnswersFromPrompt,
          deriveTemplateModel: deriveTableWithFiltersTemplateModel,
          write: writeTableWithFilters,
        }
      },
      this
    );
  }
}

const description = 'Read-only table of entities with filterable columns.';

export {
  ReactTableWithFiltersGenerator as generator,
  componentOptionsConfig as options,
  allQuestions as params,
  description,
}