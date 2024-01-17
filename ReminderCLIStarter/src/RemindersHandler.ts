import Logger from "./util/ReminderLogger";
import Reminder from './Reminder';
import FuzzySearch from 'fuzzy-search';


/**
 * A grouping of reminders based on tag (case-insensitive)
 */
export interface RemindersGroupingByTag {
    [tag: string]: Reminder[];
}

/**
 * @class RemindersHandler
 * @description Represents a handler that manages a list of reminders
 */
export default class RemindersHandler {
    private _reminders: Reminder[];

    /**
     * Creates a new RemindersHandler instance with no reminders.
     */
    constructor() {
        this._reminders = [];
    }

    /**
     * Returns the list of reminders added so far.
     */
    public get reminders(): Reminder[] {
        if (!this._reminders) {
            throw new Error ("You have no reminders")
        }
        return this._reminders;
    }

    /**
     * Creates a new reminder and adds it to list of reminders.
     * @param description - The full description of reminder
     * @param tag - The keyword used to help categorize reminder
     */
    public addReminder(description: string, tag: string): void {
        const newReminder = new Reminder(description, tag)
        this._reminders.push(newReminder);
    }

    /**
     * Returns the reminder at specified index.
     * @throws ReminderError if specified index is not valid
     * @param index - The index of the reminder
     */
    public getReminder(index: number): Reminder {
        if (!this._reminders[index]) {
            throw new Error("Reminder with this index does not exist.")
        }
        return this._reminders[index]
    }

    /**
     * Returns true if specified index is valid, false otherwise.
     * @param index - The position of the reminder in list of reminders
     */
        public isIndexValid(index: number): boolean {
        if (this.size() === 0) return false;
        if (index < 0 || index + 1 > this.size()) return false;
        return true;
    }

    /**
     * Returns the number of reminders added so far.
     */
    public size(): number {
        return this._reminders.length;
    }

    /**
     * Modifies the description of the reminder at a specified index.
     * Silently ignores call if index is not valid.
     * @param index - The index of the reminder
     * @param description - The full description of reminder
     * @param tag - The keyword used to help categorize reminder
     */
    public modifyReminder(index: number, description: string): void {
        const reminderToMod = this._reminders[index - 1]
        reminderToMod.description = description;
    }

    /**
     * Toggle the completion status of the reminder at specified index.
     * Silently ignores call if index is not valid.
     * @param index - The index of the reminder
     */
    public toggleCompletion(index: number): void {
        const reminderToMod = this._reminders[index - 1]
        reminderToMod.toggleCompletion();
    }

    /**
     * Returns a list of reminders that match the keyword
     * All reminders with tags that match the search keyword exactly will be returned first.
     * If none exist, then all reminders with descriptions that match the search keyword (even partially)
     * are returned.
     * @param keyword - Text to search for in description and tag
     */
    public search(keyword: string): Reminder[] {
        let tagSearchResults = this.searchTags(keyword)
        if (tagSearchResults.length === 0) {
            tagSearchResults = this.searchDescriptions(keyword)
        }
        return tagSearchResults
    }

    /**
     * Returns a grouping of the reminders based on tag (case-insensitive).
     */
    public groupByTag(): RemindersGroupingByTag {
        const groupings: RemindersGroupingByTag = {};
        this._reminders.forEach((r) => {
            const filterTag = r.tag.toLowerCase()
            if (Object.keys(groupings).includes(filterTag)) {
                groupings[r.tag].push(r)
            } else {
                groupings[r.tag] = [r];
            }           
        })       
        return groupings;
    }

    /**
     * Returns a list of reminders with tags that match the keyword exactly.
     * @param keyword - Text to search for in description and tag
     */
    private searchTags(keyword: string): Reminder[] {
        return this._reminders.filter((t) => t.tag === keyword)
    }

    /**
     * Returns a list of reminders with descriptions that match the keyword.
     * @param keyword - Text to search for in description and tag
     */
    private searchDescriptions(keyword: string): Reminder[] {
        const descriptionSearchResults = this._reminders.map((t) => t.description)
        const descriptionSearcher = new FuzzySearch(descriptionSearchResults);
        const result = descriptionSearcher.search(keyword);
        return this._reminders.filter((t) => result.includes(t.description));
    }
}
