import readlineSync from "readline-sync";
import Logger from "./util/ReminderLogger";
import RemindersHandler from "./RemindersHandler";

/**
 * @class ReminderApp
 * @description Represents the class that handles the overall logic of the app
 */
export default class ReminderApp {
  private _remindersHandler: RemindersHandler;

  /**
   * Creates a new instance of the reminder application.
   */
  constructor() {
    this._remindersHandler = new RemindersHandler();
  }

  /**
   * Starts application and continually prompts user to choose from one of six menu items.
   */
  public start(): void {
    let exitFlag = false;
    for (;;) {
      const item: string = ReminderApp.handleMenuSelection();
      switch (item) {
        case "1":
          this.handleShowReminders();
          break;

        case "2":
          this.handleSearchReminders();
          break;

        case "3":
          this.handleAddReminder();
          break;

        case "4":
          this.handleModifyReminders();
          break;

        case "5":
          this.handleToggleCompletion();
          break;

        default:
          exitFlag = true;
          break;
      }
      if (exitFlag) break;
    }
    Logger.log("\n  ❌  Exited application\n");
  }

  /**
   * Interfaces with user to toggle completion status of a specific reminder.
   */
  private handleToggleCompletion(): void {
    if (!this._remindersHandler.size()) {
      Logger.log('\n  ⚠️  You have no reminders')
    } else {
      Logger.logReminders(this._remindersHandler.reminders)
      const taskToToggle = +this.getUserChoice("index of task", true)
      this._remindersHandler.toggleCompletion(taskToToggle)
      Logger.log('\n  🏁   Reminder Completion Toggled')
    }
  }

  /**
   * Interfaces with user to modify a specific reminder.
   */
  private handleModifyReminders(): void {
    if (!this._remindersHandler.size()) {
      Logger.log('\n  ⚠️  You have no reminders')
    } else {
      Logger.logReminders(this._remindersHandler.reminders)
      const taskIndexToModify = +this.getUserChoice("index of task", true)
      const taskDescriptionToModify = this.getUserChoice("new description of task", false)
      this._remindersHandler.modifyReminder(taskIndexToModify, taskDescriptionToModify)

      if (ReminderApp.checkUserToggleChoice()) {
        this._remindersHandler.toggleCompletion(taskIndexToModify)
      }

      Logger.log('\n  🏁   Reminder Modified')
    }
  }

  /**
   * Interfaces with user to add a reminder.
   */
  private handleAddReminder(): void {
    const userChoice = this.getUserChoice("new reminder", false)
    const userTag = this.getUserChoice("tag for your reminder", false)
    this._remindersHandler.addReminder(userChoice, userTag)
    Logger.log('\n  🏁  Reminder Added');
  }

  /**
   * Finds and logs all reminders with a tag that matches the keyword exactly.
   * If none exists, then all reminders with descriptions that match the search keyword (even partially)
   * are logged instead.
   */
  private handleSearchReminders(): void {
    if (!this._remindersHandler.size()) {
      Logger.log('\n  ⚠️  You have no reminders')
    } else {
      const searchKeyword = this.getUserChoice("keyword to search for", false)
      const searchResults = this._remindersHandler.search(searchKeyword)
      Logger.logSearchResults(searchResults)
    }
  }

  /**
   * Logs any existing reminders to console, grouped by tags.
   */
  private handleShowReminders(): void {
    if (!this._remindersHandler.size()) {
      Logger.log('\n  ⚠️  You have no reminders')
    } else {
      Logger.logGroupedReminders(this._remindersHandler.groupByTag())
    }
  }

  /**
   * Returns verified user input based on Main Menu item selected.
   * @param question - Text that describes what to ask the user
   * @param isIndexRequired - True if user chooses to either modify or toggle reminder, otherwise false
   */
  private getUserChoice(question: string, isIndexRequired: boolean): string {
    let userChoice: string;
    for (;;) {
      userChoice = readlineSync.question(`\nEnter a ${question} here: `, {
        limit: (input: string) => {
          return this.validateInput(input, isIndexRequired);
        },
        limitMessage: "",
      });
      const userDecision: string = this.checkUserChoice(question, userChoice);
      if (userDecision === "n") Logger.log("\n  🔄  Please try typing it again");
      else break;
    }
    return userChoice;
  }

  /**
   * Verifies user input and returns 'y' if input is accepted by user, otherwise 'n'.
   * @param question - Portion of question to prompt with, based on Main Menu item selected
   * @param userChoice - Text that user enters
   */
  private checkUserChoice(question: string, userChoice: string): string {
    return readlineSync
      .question(`You entered ${question}: '${userChoice}', is it correct? y/n: `, {
        limit: /^[YNyn]{1}$/,
        limitMessage: "\n  🚨  Invalid input: Please enter either y/n.\n",
      })
      .toLowerCase();
  }

  /**
   * Returns true if the user wishes to toggle the complete status of a reminder, otherwise false.
   */
  private static checkUserToggleChoice(): boolean {
    const toggleAnswer: string = readlineSync.question(`\nDo you wish to toggle the completed status? y/n: `, {
      limit: /^[YNyn]{1}$/,
      limitMessage: "\n  🚨  Invalid input: Please enter either y/n.\n",
    });

    if (toggleAnswer.toLowerCase() === "y") return true;
    return false;
  }

  /**
   * Validates if user's input is valid for the selected menu item.
   * @param input - The text the user enters
   * @param isIndexRequired - True if user chooses to either modify or toggle reminder, otherwise false
   */
  private validateInput(input: string, isIndexRequired: boolean): boolean {
    if (!input) {
      Logger.log(`\n  🚨  Input cannot be blank: Please try again.\n`);
      return false;
    }
    if (isIndexRequired) {
      if (ReminderApp.matches(/^\d+$/, input)) {
        const index: number = Number(input) - 1;
        if (this._remindersHandler.isIndexValid(index)) return true;
        Logger.log(`\n  🚨  Input must be number from the list of reminders: Please try again.\n`);
        return false;
      }
      Logger.log(`\n  🚨  Input must be positive number from the list of reminders: Please try again.\n`);
      return false;
    }
    return true;
  }

  /**
   * Returns true if text matches the RegExp pattern, otherwise false.
   * @param regex - Pattern used to match text
   * @param str - Text to match
   */
  private static matches(regex: RegExp, str: string): boolean {
    return regex.test(str);
  }

  /**
   * Returns the menu item number that the user selects.
   * Keeps prompting user until item is valid (between 1 and 6 inclusive).
   */
  private static getMenuItem(): string {
    const item: string = readlineSync.question("Choose a [Number] followed by [Enter]: ", {
      limit: ["1", "2", "3", "4", "5", "6"],
      limitMessage: "\n  🚨  Sorry, input is not a valid menu item.\n",
    });
    return item;
  }

  /**
   * Prompts user to return to Main Menu.
   */
  private static handleMenuSelection(): string {
    readlineSync.question("\nHit [Enter] key to see main menu: ", { hideEchoBack: true, mask: "" });
    Logger.logMenu();
    return ReminderApp.getMenuItem();
  }
}
