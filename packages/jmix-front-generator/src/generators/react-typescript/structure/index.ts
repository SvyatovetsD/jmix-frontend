import {ComponentOptions, componentOptionsConfig} from "../../../common/cli-options";
import path from "path";
import {defaultPipeline} from "../../../building-blocks/pipelines/defaultPipeline";
import {allQuestions, Answers} from "./answers";
import {Options} from "./options";
import {TemplateModel, deriveTemplateModel} from "./template-model";
import {write} from "./write";
import {YeomanGenerator} from "../../../building-blocks/YeomanGenerator";
import { defaultGetAnswersFromPrompt } from "../../../building-blocks/stages/answers/defaultGetAnswersFromPrompt";

export class ReactComponentGenerator extends YeomanGenerator {
  constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
  }

  async generate() {
    await defaultPipeline<Options, Answers, TemplateModel>({
      templateDir: path.join(__dirname, 'template'),
      questions: allQuestions,
      stages: { 
        getAnswersFromPrompt: defaultGetAnswersFromPrompt,
        deriveTemplateModel,
        write
      }
    }, this);
  }
}

const description = 'A set of templates with a prepared skeleton for splitting the screen into sections';

export {
  ReactComponentGenerator as generator,
  componentOptionsConfig as options,
  allQuestions as params,
  description
};
