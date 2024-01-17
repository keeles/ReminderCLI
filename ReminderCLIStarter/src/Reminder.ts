/**
 * @class Reminder
 * @description Represents a reminder for a given task
 */
export default class Reminder {
    
    private _description!: string
    private _tag!: string
    private _isCompleted!: boolean

  /**
   * Creates a new Reminder instance.
   * @param description - The full description of reminder
   * @param tag - The keyword used to help categorize reminder
   */
  constructor(description: string, tag: string) {
    this._description = description
    this._tag = tag;
    this._isCompleted = false;
  }

  /**
   * Returns the description of this reminder.
   */
  public get description(): string {
    return this._description;
  }

  /**
   * Sets the description of this reminder.
   * @param description - The full description of reminder.
   */
  public set description(description: string) {
    if (!description) {
      throw new Error("Description cannot be empty")
    }
    this._description = description;
  }

  /**
   * Returns the tag associated with this reminder.
   */
  public get tag(): string {
    return this._tag;
  }

  /**
   * Sets the tag associated with this reminder.
   * @param tag - The keyword used to help categorize this reminder
   */
  public set tag(tag: string) {
    if(!tag) {
      throw new Error("Tag cannot be empty")
    }
    this._tag = tag;
  }

  /**
   * Returns true if reminder is completed, false otherwise.
   */
  public get isCompleted(): boolean {
    return this._isCompleted
  }

  /**
   * Toggles reminder completion status true ⬅ ➡ false.
   */
  public toggleCompletion(): void {
    if (!this._isCompleted) {
      this._isCompleted = true
    } else {
      this._isCompleted = false
    }   
  }
}
