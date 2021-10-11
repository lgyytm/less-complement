import replaceCommand from "./commands/replace-command";

export default class Commands {
  constructor() {
    this.init();
  }
  init() {
    replaceCommand();
  }
}
