'use strict';

var require$$0 = require('obsidian');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

var main = {};

Object.defineProperty(main, '__esModule', { value: true });

var obsidian = require$$0__default["default"];

const DEFAULT_DAILY_NOTE_FORMAT = "YYYY-MM-DD";
const DEFAULT_WEEKLY_NOTE_FORMAT = "gggg-[W]ww";
const DEFAULT_MONTHLY_NOTE_FORMAT = "YYYY-MM";
const DEFAULT_QUARTERLY_NOTE_FORMAT = "YYYY-[Q]Q";
const DEFAULT_YEARLY_NOTE_FORMAT = "YYYY";

function shouldUsePeriodicNotesSettings(periodicity) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = window.app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.[periodicity]?.enabled;
}
/**
 * Read the user settings for the `daily-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getDailyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { internalPlugins, plugins } = window.app;
        if (shouldUsePeriodicNotesSettings("daily")) {
            const { format, folder, template } = plugins.getPlugin("periodic-notes")?.settings?.daily || {};
            return {
                format: format || DEFAULT_DAILY_NOTE_FORMAT,
                folder: folder?.trim() || "",
                template: template?.trim() || "",
            };
        }
        const { folder, format, template } = internalPlugins.getPluginById("daily-notes")?.instance?.options || {};
        return {
            format: format || DEFAULT_DAILY_NOTE_FORMAT,
            folder: folder?.trim() || "",
            template: template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom daily note settings found!", err);
    }
}
/**
 * Read the user settings for the `weekly-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getWeeklyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pluginManager = window.app.plugins;
        const calendarSettings = pluginManager.getPlugin("calendar")?.options;
        const periodicNotesSettings = pluginManager.getPlugin("periodic-notes")?.settings?.weekly;
        if (shouldUsePeriodicNotesSettings("weekly")) {
            return {
                format: periodicNotesSettings.format || DEFAULT_WEEKLY_NOTE_FORMAT,
                folder: periodicNotesSettings.folder?.trim() || "",
                template: periodicNotesSettings.template?.trim() || "",
            };
        }
        const settings = calendarSettings || {};
        return {
            format: settings.weeklyNoteFormat || DEFAULT_WEEKLY_NOTE_FORMAT,
            folder: settings.weeklyNoteFolder?.trim() || "",
            template: settings.weeklyNoteTemplate?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom weekly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getMonthlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("monthly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.monthly) ||
            {};
        return {
            format: settings.format || DEFAULT_MONTHLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom monthly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getQuarterlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("quarterly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.quarterly) ||
            {};
        return {
            format: settings.format || DEFAULT_QUARTERLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom quarterly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getYearlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("yearly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.yearly) ||
            {};
        return {
            format: settings.format || DEFAULT_YEARLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom yearly note settings found!", err);
    }
}

// Credit: @creationix/path.js
function join(...partSegments) {
    // Split the inputs into a list of path commands.
    let parts = [];
    for (let i = 0, l = partSegments.length; i < l; i++) {
        parts = parts.concat(partSegments[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    const newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
        const part = parts[i];
        // Remove leading and trailing slashes
        // Also remove "." segments
        if (!part || part === ".")
            continue;
        // Push new path segments.
        else
            newParts.push(part);
    }
    // Preserve the initial slash if there was one.
    if (parts[0] === "")
        newParts.unshift("");
    // Turn back into a single string path.
    return newParts.join("/");
}
function basename(fullPath) {
    let base = fullPath.substring(fullPath.lastIndexOf("/") + 1);
    if (base.lastIndexOf(".") != -1)
        base = base.substring(0, base.lastIndexOf("."));
    return base;
}
async function ensureFolderExists(path) {
    const dirs = path.replace(/\\/g, "/").split("/");
    dirs.pop(); // remove basename
    if (dirs.length) {
        const dir = join(...dirs);
        if (!window.app.vault.getAbstractFileByPath(dir)) {
            await window.app.vault.createFolder(dir);
        }
    }
}
async function getNotePath(directory, filename) {
    if (!filename.endsWith(".md")) {
        filename += ".md";
    }
    const path = obsidian.normalizePath(join(directory, filename));
    await ensureFolderExists(path);
    return path;
}
async function getTemplateInfo(template) {
    const { metadataCache, vault } = window.app;
    const templatePath = obsidian.normalizePath(template);
    if (templatePath === "/") {
        return Promise.resolve(["", null]);
    }
    try {
        const templateFile = metadataCache.getFirstLinkpathDest(templatePath, "");
        const contents = await vault.cachedRead(templateFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IFoldInfo = window.app.foldManager.load(templateFile);
        return [contents, IFoldInfo];
    }
    catch (err) {
        console.error(`Failed to read the daily note template '${templatePath}'`, err);
        new obsidian.Notice("Failed to read the daily note template");
        return ["", null];
    }
}

/**
 * dateUID is a way of weekly identifying daily/weekly/monthly notes.
 * They are prefixed with the granularity to avoid ambiguity.
 */
function getDateUID(date, granularity = "day") {
    const ts = date.clone().startOf(granularity).format();
    return `${granularity}-${ts}`;
}
function removeEscapedCharacters(format) {
    return format.replace(/\[[^\]]*\]/g, ""); // remove everything within brackets
}
/**
 * XXX: When parsing dates that contain both week numbers and months,
 * Moment choses to ignore the week numbers. For the week dateUID, we
 * want the opposite behavior. Strip the MMM from the format to patch.
 */
function isFormatAmbiguous(format, granularity) {
    if (granularity === "week") {
        const cleanFormat = removeEscapedCharacters(format);
        return (/w{1,2}/i.test(cleanFormat) &&
            (/M{1,4}/.test(cleanFormat) || /D{1,4}/.test(cleanFormat)));
    }
    return false;
}
function getDateFromFile(file, granularity) {
    return getDateFromFilename(file.basename, granularity);
}
function getDateFromPath(path, granularity) {
    return getDateFromFilename(basename(path), granularity);
}
function getDateFromFilename(filename, granularity) {
    const getSettings = {
        day: getDailyNoteSettings,
        week: getWeeklyNoteSettings,
        month: getMonthlyNoteSettings,
        quarter: getQuarterlyNoteSettings,
        year: getYearlyNoteSettings,
    };
    const format = getSettings[granularity]().format.split("/").pop();
    const noteDate = window.moment(filename, format, true);
    if (!noteDate.isValid()) {
        return null;
    }
    if (isFormatAmbiguous(format, granularity)) {
        if (granularity === "week") {
            const cleanFormat = removeEscapedCharacters(format);
            if (/w{1,2}/i.test(cleanFormat)) {
                return window.moment(filename, 
                // If format contains week, remove day & month formatting
                format.replace(/M{1,4}/g, "").replace(/D{1,4}/g, ""), false);
            }
        }
    }
    return noteDate;
}

class DailyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createDailyNote(date) {
    const app = window.app;
    const { vault } = app;
    const moment = window.moment;
    const { template, format, folder } = getDailyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename)
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format))
            .replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format)));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian.Notice("Unable to create new file.");
    }
}
function getDailyNote(date, dailyNotes) {
    return dailyNotes[getDateUID(date, "day")] ?? null;
}
function getAllDailyNotes() {
    /**
     * Find all daily notes in the daily note folder
     */
    const { vault } = window.app;
    const { folder } = getDailyNoteSettings();
    const dailyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
    if (!dailyNotesFolder) {
        throw new DailyNotesFolderMissingError("Failed to find daily notes folder");
    }
    const dailyNotes = {};
    obsidian.Vault.recurseChildren(dailyNotesFolder, (note) => {
        if (note instanceof obsidian.TFile) {
            const date = getDateFromFile(note, "day");
            if (date) {
                const dateString = getDateUID(date, "day");
                dailyNotes[dateString] = note;
            }
        }
    });
    return dailyNotes;
}

class WeeklyNotesFolderMissingError extends Error {
}
function getDaysOfWeek() {
    const { moment } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let weekStart = moment.localeData()._week.dow;
    const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    while (weekStart) {
        daysOfWeek.push(daysOfWeek.shift());
        weekStart--;
    }
    return daysOfWeek;
}
function getDayOfWeekNumericalValue(dayOfWeekName) {
    return getDaysOfWeek().indexOf(dayOfWeekName.toLowerCase());
}
async function createWeeklyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getWeeklyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*title\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*:(.*?)}}/gi, (_, dayOfWeek, momentFormat) => {
            const day = getDayOfWeekNumericalValue(dayOfWeek);
            return date.weekday(day).format(momentFormat.trim());
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian.Notice("Unable to create new file.");
    }
}
function getWeeklyNote(date, weeklyNotes) {
    return weeklyNotes[getDateUID(date, "week")] ?? null;
}
function getAllWeeklyNotes() {
    const weeklyNotes = {};
    if (!appHasWeeklyNotesPluginLoaded()) {
        return weeklyNotes;
    }
    const { vault } = window.app;
    const { folder } = getWeeklyNoteSettings();
    const weeklyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
    if (!weeklyNotesFolder) {
        throw new WeeklyNotesFolderMissingError("Failed to find weekly notes folder");
    }
    obsidian.Vault.recurseChildren(weeklyNotesFolder, (note) => {
        if (note instanceof obsidian.TFile) {
            const date = getDateFromFile(note, "week");
            if (date) {
                const dateString = getDateUID(date, "week");
                weeklyNotes[dateString] = note;
            }
        }
    });
    return weeklyNotes;
}

class MonthlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createMonthlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getMonthlyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian.Notice("Unable to create new file.");
    }
}
function getMonthlyNote(date, monthlyNotes) {
    return monthlyNotes[getDateUID(date, "month")] ?? null;
}
function getAllMonthlyNotes() {
    const monthlyNotes = {};
    if (!appHasMonthlyNotesPluginLoaded()) {
        return monthlyNotes;
    }
    const { vault } = window.app;
    const { folder } = getMonthlyNoteSettings();
    const monthlyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
    if (!monthlyNotesFolder) {
        throw new MonthlyNotesFolderMissingError("Failed to find monthly notes folder");
    }
    obsidian.Vault.recurseChildren(monthlyNotesFolder, (note) => {
        if (note instanceof obsidian.TFile) {
            const date = getDateFromFile(note, "month");
            if (date) {
                const dateString = getDateUID(date, "month");
                monthlyNotes[dateString] = note;
            }
        }
    });
    return monthlyNotes;
}

class QuarterlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createQuarterlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getQuarterlyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian.Notice("Unable to create new file.");
    }
}
function getQuarterlyNote(date, quarterly) {
    return quarterly[getDateUID(date, "quarter")] ?? null;
}
function getAllQuarterlyNotes() {
    const quarterly = {};
    if (!appHasQuarterlyNotesPluginLoaded()) {
        return quarterly;
    }
    const { vault } = window.app;
    const { folder } = getQuarterlyNoteSettings();
    const quarterlyFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
    if (!quarterlyFolder) {
        throw new QuarterlyNotesFolderMissingError("Failed to find quarterly notes folder");
    }
    obsidian.Vault.recurseChildren(quarterlyFolder, (note) => {
        if (note instanceof obsidian.TFile) {
            const date = getDateFromFile(note, "quarter");
            if (date) {
                const dateString = getDateUID(date, "quarter");
                quarterly[dateString] = note;
            }
        }
    });
    return quarterly;
}

class YearlyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createYearlyNote(date) {
    const { vault } = window.app;
    const { template, format, folder } = getYearlyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = window.moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian.Notice("Unable to create new file.");
    }
}
function getYearlyNote(date, yearlyNotes) {
    return yearlyNotes[getDateUID(date, "year")] ?? null;
}
function getAllYearlyNotes() {
    const yearlyNotes = {};
    if (!appHasYearlyNotesPluginLoaded()) {
        return yearlyNotes;
    }
    const { vault } = window.app;
    const { folder } = getYearlyNoteSettings();
    const yearlyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
    if (!yearlyNotesFolder) {
        throw new YearlyNotesFolderMissingError("Failed to find yearly notes folder");
    }
    obsidian.Vault.recurseChildren(yearlyNotesFolder, (note) => {
        if (note instanceof obsidian.TFile) {
            const date = getDateFromFile(note, "year");
            if (date) {
                const dateString = getDateUID(date, "year");
                yearlyNotes[dateString] = note;
            }
        }
    });
    return yearlyNotes;
}

function appHasDailyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dailyNotesPlugin = app.internalPlugins.plugins["daily-notes"];
    if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.daily?.enabled;
}
/**
 * XXX: "Weekly Notes" live in either the Calendar plugin or the periodic-notes plugin.
 * Check both until the weekly notes feature is removed from the Calendar plugin.
 */
function appHasWeeklyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (app.plugins.getPlugin("calendar")) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.weekly?.enabled;
}
function appHasMonthlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.monthly?.enabled;
}
function appHasQuarterlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.quarterly?.enabled;
}
function appHasYearlyNotesPluginLoaded() {
    const { app } = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.yearly?.enabled;
}
function getPeriodicNoteSettings(granularity) {
    const getSettings = {
        day: getDailyNoteSettings,
        week: getWeeklyNoteSettings,
        month: getMonthlyNoteSettings,
        quarter: getQuarterlyNoteSettings,
        year: getYearlyNoteSettings,
    }[granularity];
    return getSettings();
}
function createPeriodicNote(granularity, date) {
    const createFn = {
        day: createDailyNote,
        month: createMonthlyNote,
        week: createWeeklyNote,
    };
    return createFn[granularity](date);
}

main.DEFAULT_DAILY_NOTE_FORMAT = DEFAULT_DAILY_NOTE_FORMAT;
main.DEFAULT_MONTHLY_NOTE_FORMAT = DEFAULT_MONTHLY_NOTE_FORMAT;
main.DEFAULT_QUARTERLY_NOTE_FORMAT = DEFAULT_QUARTERLY_NOTE_FORMAT;
main.DEFAULT_WEEKLY_NOTE_FORMAT = DEFAULT_WEEKLY_NOTE_FORMAT;
main.DEFAULT_YEARLY_NOTE_FORMAT = DEFAULT_YEARLY_NOTE_FORMAT;
main.appHasDailyNotesPluginLoaded = appHasDailyNotesPluginLoaded;
main.appHasMonthlyNotesPluginLoaded = appHasMonthlyNotesPluginLoaded;
main.appHasQuarterlyNotesPluginLoaded = appHasQuarterlyNotesPluginLoaded;
main.appHasWeeklyNotesPluginLoaded = appHasWeeklyNotesPluginLoaded;
main.appHasYearlyNotesPluginLoaded = appHasYearlyNotesPluginLoaded;
main.createDailyNote = createDailyNote;
main.createMonthlyNote = createMonthlyNote;
main.createPeriodicNote = createPeriodicNote;
main.createQuarterlyNote = createQuarterlyNote;
main.createWeeklyNote = createWeeklyNote;
main.createYearlyNote = createYearlyNote;
var getAllDailyNotes_1 = main.getAllDailyNotes = getAllDailyNotes;
main.getAllMonthlyNotes = getAllMonthlyNotes;
main.getAllQuarterlyNotes = getAllQuarterlyNotes;
main.getAllWeeklyNotes = getAllWeeklyNotes;
main.getAllYearlyNotes = getAllYearlyNotes;
var getDailyNote_1 = main.getDailyNote = getDailyNote;
var getDailyNoteSettings_1 = main.getDailyNoteSettings = getDailyNoteSettings;
main.getDateFromFile = getDateFromFile;
main.getDateFromPath = getDateFromPath;
main.getDateUID = getDateUID;
main.getMonthlyNote = getMonthlyNote;
main.getMonthlyNoteSettings = getMonthlyNoteSettings;
main.getPeriodicNoteSettings = getPeriodicNoteSettings;
main.getQuarterlyNote = getQuarterlyNote;
main.getQuarterlyNoteSettings = getQuarterlyNoteSettings;
main.getTemplateInfo = getTemplateInfo;
main.getWeeklyNote = getWeeklyNote;
main.getWeeklyNoteSettings = getWeeklyNoteSettings;
main.getYearlyNote = getYearlyNote;
main.getYearlyNoteSettings = getYearlyNoteSettings;

class UndoModal extends require$$0.Modal {
  constructor(plugin) {
    super(plugin.app);
    this.plugin = plugin;
  }

  async parseDay(day) {
    const { file, oldContent } = day;
    let currentContent = await this.plugin.app.vault.read(file);

    const oldContentLineCount = oldContent.split('\n').length;
    const currentContentLineCount = currentContent.split('\n').length;
    const diff = Math.abs(oldContentLineCount - currentContentLineCount);

    let s = '';
    if (oldContentLineCount > currentContentLineCount) {
      s = `- ${file.name}: add ${diff} line${diff.length > 1 ? 's':''}.`;
    } else if (oldContentLineCount < currentContentLineCount) {
      s = `- ${file.name}: remove ${diff} line${diff.length > 1 ? 's':''}.`;
    } else {
      if (oldContent == currentContent) {
        s = `- ${file.name}: will not be modified.`;
      } else {
        s = `- ${file.name}: will be modified to its previous state, with the same number of lines (but different content).`;
      }
    }

    return s
  }

  async confirmUndo(undoHistoryInstance) {
    await this.plugin.app.vault.modify(undoHistoryInstance.today.file, undoHistoryInstance.today.oldContent);
    if (undoHistoryInstance.previousDay.file) {
      await this.plugin.app.vault.modify(undoHistoryInstance.previousDay.file, undoHistoryInstance.previousDay.oldContent);
    }
    this.plugin.undoHistory = [];
  }

  async onOpen() {
    let { contentEl, plugin } = this;
    contentEl.createEl('h3', { text: 'Undo last rollover' });
    contentEl.createEl('div', { text: 'A single rollover command can be undone, which will load the state of the two files modified (or 1 if the delete option is toggled off) before the rollover first occured. Any text you may have added from those file(s) during that time may be deleted.' });
    contentEl.createEl('div', { text: 'Note that rollover actions can only be undone for up to 2 minutes after the command occured, and will be removed from history if the app closes.' });
    contentEl.createEl('h4', { text: 'Changes made with undo:' });

    const undoHistoryInstance = plugin.undoHistory[0];
    let modTextArray = [await this.parseDay(undoHistoryInstance.today)];
    if (undoHistoryInstance.previousDay.file) {
      modTextArray.push(await this.parseDay(undoHistoryInstance.previousDay));
    }
    modTextArray.forEach(txt => {
      contentEl.createEl('div', { text: txt });
    });

    new require$$0.Setting(contentEl)
      .addButton(button => button
        .setButtonText('Confirm Undo')
        .onClick(async (e) => {
          this.close();
          await this.confirmUndo(undoHistoryInstance);
        })
      );
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

class RolloverSettingTab extends require$$0.PluginSettingTab {
  constructor (app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async getTemplateHeadings () {
    const { template } = getDailyNoteSettings_1();
    if (!template) return []

    let file = this.app.vault.getAbstractFileByPath(template);
    if (file == null) {
      file = this.app.vault.getAbstractFileByPath(template + '.md');
    }

    const templateContents = await this.app.vault.cachedRead(file);
    const allHeadings = Array.from(templateContents.matchAll(/#{1,} .*/g)).map(
      ([heading]) => heading
    );
    return allHeadings
  }

  async display () {
    const templateHeadings = await this.getTemplateHeadings();

    this.containerEl.empty();
    const headingDoc = `
    Which heading from your template should the todos go under. 
    ~~>_<~~ 1. 
    set -> '## todo'(recommended): 
    you will get all the todo under '## todo' till the next '##' tag like '## boring' 
    ~~>_<~~ 2. 
    Set -> none: 
    all the todos will be add to the end of today's diary
    `;
    const delDesc = `
    Once todos are found, they are added to Today's Daily Note. 
    If successful, they are deleted from Yesterday's Daily note. 
    Enabling this is destructive and may result in lost data. 
    Keeping this disabled will simply duplicate them from yesterday's note and place them in the appropriate section. 
    Note that currently, duplicate todos will be deleted regardless of what heading they are in, and which heading you choose from above.
    `;
    new require$$0.Setting(this.containerEl)
      .setName('Template heading')
      .setDesc(headingDoc)
      .addDropdown(dropdown =>
        dropdown
          .addOptions({
            ...templateHeadings.reduce((acc, heading) => {
              acc[heading] = heading;
              return acc
            }, {}),
            none: 'None'
          })
          .setValue(this.plugin?.settings.templateHeading)
          .onChange(value => {
            this.plugin.settings.templateHeading = value;
            this.plugin.saveSettings();
          })
      );

    new require$$0.Setting(this.containerEl)
      .setName('Delete todos from previous day')
      .setDesc(delDesc)
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.deleteOnComplete || false)
          .onChange(value => {
            this.plugin.settings.deleteOnComplete = value;
            this.plugin.saveSettings();
          })
      );

    new require$$0.Setting(this.containerEl)
      .setName('Remove empty todos in rollover')
      .setDesc(
        `If you have empty todos, they will not be rolled over to the next day.`
      )
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.removeEmptyTodos || false)
          .onChange(value => {
            this.plugin.settings.removeEmptyTodos = value;
            this.plugin.saveSettings();
          })
      );

    // 是否选择 加上去年今日
    //
    new require$$0.Setting(this.containerEl)
      .setName('Today in history')
      .setDesc(`Display today in history in the end of the file`)
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.displayTodayInHistory || false)
          .onChange(value => {
            this.plugin.settings.displayTodayInHistory = value;
            this.plugin.saveSettings();
          })
      );

    // 指定header
    new require$$0.Setting(this.containerEl)
      .setName('Custom today in history')
      .setDesc('Used for the header of history  (default ## Today in history)')
      .addText(text =>
        text
          .setPlaceholder(`start with #`)
          .setValue(
            this.plugin.settings.todayHistoryHeader || '## Today in history'
          )
          .onChange(value => {
            this.plugin.settings.todayHistoryHeader = value;
            this.plugin.saveSettings();
          })
      );

    // 去年今日是否需要直接显示
    //
    new require$$0.Setting(this.containerEl)
      .setName('History Content')
      .setDesc(`Display today in history content.`)
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.historyShowDirect || false)
          .onChange(value => {
            this.plugin.settings.historyShowDirect = value;
            this.plugin.saveSettings();
          })
      );

    // 去年今日的 数量 默认1
    //
    new require$$0.Setting(this.containerEl)
      .setName('History Count')
      .setDesc(`years you want to display in today in history section.`)
      .addDropdown(dropdown =>
        dropdown
          .addOptions({
            1: '1 year',
            2: '2 years',
            3: '3 years',
            4: '4 years',
            5: '5 years'
          })
          .setValue(this.plugin?.settings.todayHistoryCount || 1)
          .onChange(value => {
            this.plugin.settings.todayHistoryCount = value;
            this.plugin.saveSettings();
          })
      );
  }
}

const MAX_TIME_SINCE_CREATION = 5000;

class DailyTodoProPlugin extends require$$0.Plugin {
  async loadSettings () {
    const DEFAULT_SETTINGS = {
      templateHeading: 'none',
      deleteOnComplete: false,
      removeEmptyTodos: false,
      displayTodayInHistory: false,
      todayHistoryHeader: '## Today in history',
      historyShowDirect: false,
      todayHistoryCount: '1'
    };
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings () {
    await this.saveData(this.settings);
  }

  isDailyNotesEnabled () {
    const dailyNotesPlugin = this.app.internalPlugins.plugins['daily-notes'];
    const dailyNotesEnabled = dailyNotesPlugin && dailyNotesPlugin.enabled;

    const periodicNotesPlugin = this.app.plugins.getPlugin('periodic-notes');
    const periodicNotesEnabled =
      periodicNotesPlugin && periodicNotesPlugin.settings?.daily?.enabled;

    return dailyNotesEnabled || periodicNotesEnabled
  }

  // shuffle (array) {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     let j = Math.floor(Math.random() * (i + 1))
  //     ;[array[i], array[j]] = [array[j], array[i]]
  //   }
  // }

  getLastDailyNote (random = false) {
    const { folder, format } = getDailyNoteSettings_1();

    // get all notes in directory that aren't null
    // and filter name by date
    const dailyNoteFiles = this.app.vault
      .getMarkdownFiles()
      .filter(file => file.path.startsWith(folder))
      .filter(file => file.basename != null)
      .filter(file =>
        require$$0.moment(file.basename, format).isSameOrBefore(require$$0.moment(), 'day')
      )
      .sort(
        (a, b) =>
          require$$0.moment(b.basename, format).valueOf() -
          require$$0.moment(a.basename, format).valueOf()
      );

    if (random !== false) {
      dailyNoteFiles.shift();
      dailyNoteFiles.shuffle();
    }

    return dailyNoteFiles[1]
  }

  async getAllUnfinishedTodos (file, templateHeading) {
    // get unfinished todos from yesterday, if exist
    const contents = await this.app.vault.cachedRead(file);

    /**
     * 1. 找到所有heading
     * 2. 找到所有todo
     * 3. 筛选heading 和 下一个同级heading之间的todo
     * 4.
     */
    const listItems = this.app.metadataCache.getFileCache(file)?.listItems;
    let noTaskUndo = true;

    if (listItems) {
      for (const key in listItems) {
        if (Object.hasOwnProperty.call(listItems, key)) {
          const element = listItems[key];
          // console.log(element.task)
          if (listItems[key].task == ' ') {
            noTaskUndo = false;
            break
          }
          element.task == ' ' && taskUndoCount++;
        }
      }
    }

    if (noTaskUndo) {
      return []
    }

    // for (element = listItems[index]) element.task something
    // todo: task?: ' ' | 'x' | '?';, deal diffrently (requirements from forum)
    /**
     * means:
     *
     * ?   =  dones yesterday
     * x   =  dones today
     * ''  =  todo today
     *
     * today from yesterday:
     *
     * ?  -> none
     * x  -> ?
     * '' -> ''
     *
     * choose del in setting: in yesterday
     *
     * '' -> none
     *
     */

    let unfinishedTodosRegex = /\t*[-+*]\s\[\s\].*/g;
    let my_todo = [];

    if (templateHeading !== 'none') {
      const templateHeadingLength = templateHeading.match(/#{1,}/)[0].length;
      unfinishedTodosRegex = new RegExp(
        '\\t*(([-+*]\\s\\[\\s\\])|(#{' +
          String(templateHeadingLength) +
          ',})) .*',
        'g'
      );
      // console.log(unfinishedTodosRegex)
      const my_headerIdentify = '#'.repeat(templateHeadingLength) + ' ';
      let header_count = 0;
      let my_todo_start_now = false;

      let todos_yesterday = Array.from(
        contents.matchAll(unfinishedTodosRegex),
        m => m[0]
      );

      for (let i = 0; i < todos_yesterday.length; i++) {
        // 1. 筛选 等于templateHeading才开始循环
        if (todos_yesterday[i].startsWith(templateHeading)) {
          my_todo_start_now = true;
          continue
        }
        if (my_todo_start_now) {
          if (todos_yesterday[i].startsWith(my_headerIdentify)) {
            if (header_count > 0) {
              break
            }
            header_count++;
          } else {
            if (todos_yesterday[i].startsWith('#')) {
              if (i > 0 && todos_yesterday[i - 1].endsWith('\n')) {
                todos_yesterday[i] = todos_yesterday[i] + '\n';
              } else {
                todos_yesterday[i] = '\n' + todos_yesterday[i] + '\n';
              }
            }
            my_todo.push(todos_yesterday[i]);
          }
        }
      }
    } else {
      my_todo = Array.from(contents.matchAll(unfinishedTodosRegex), m => m[0]);
    }

    return my_todo
  }

  async rollover (file = undefined) {
    /*** First we check if the file created is actually a valid daily note ***/
    const { folder, format } = getDailyNoteSettings_1();
    let ignoreCreationTime = false;

    // Rollover can be called, but we need to get the daily file
    if (file == undefined) {
      const allDailyNotes = getAllDailyNotes_1();
      file = getDailyNote_1(require$$0.moment(), allDailyNotes);
      ignoreCreationTime = true;
    }
    if (!file) return

    // is a daily note
    if (!file.path.startsWith(folder)) return

    // is today's daily note
    const today = new Date();
    const todayFormatted = require$$0.moment(today).format(format);
    if (todayFormatted !== file.basename) return

    // was just created
    if (
      today.getTime() - file.stat.ctime > MAX_TIME_SINCE_CREATION &&
      !ignoreCreationTime
    )
      return

    /*** Next, if it is a valid daily note, but we don't have daily notes enabled, we must alert the user ***/
    if (!this.isDailyNotesEnabled()) {
      new require$$0.Notice(
        'RolloverTodosPlugin unable to rollover unfinished todos: Please enable Daily Notes, or Periodic Notes (with daily notes enabled).',
        10000
      );
    } else {
      const {
        templateHeading,
        deleteOnComplete,
        removeEmptyTodos,
        displayTodayInHistory,
        todayHistoryHeader,
        historyShowDirect,
        todayHistoryCount
      } = this.settings;

      // check if there is a daily note from yesterday
      const lastDailyNote = this.getLastDailyNote();
      if (lastDailyNote == null) return

      // TODO: Rollover to subheadings (optional)
      // this.sortHeadersIntoHeirarchy(lastDailyNote)

      // get unfinished todos from yesterday, if exist
      let todos_yesterday = await this.getAllUnfinishedTodos(
        lastDailyNote,
        templateHeading
      );
      if (todos_yesterday.length == 0) {
        console.log(
          `rollover-daily-todos: 0 todos found in ${lastDailyNote.basename}.md`
        );
        return
      }

      // setup undo history
      let undoHistoryInstance = {
        previousDay: {
          file: undefined,
          oldContent: ''
        },
        today: {
          file: undefined,
          oldContent: ''
        }
      };

      // Potentially filter todos from yesterday for today
      let todosAdded = 0;
      let emptiesToNotAddToTomorrow = 0;
      let todos_today = !removeEmptyTodos ? todos_yesterday : [];
      if (removeEmptyTodos) {
        todos_yesterday.forEach((line, i) => {
          const trimmedLine = (line || '').trim();
          if (trimmedLine != '- [ ]' && trimmedLine != '- [  ]') {
            todos_today.push(line);
            todosAdded++;
          } else {
            emptiesToNotAddToTomorrow++;
          }
        });
      } else {
        todosAdded = todos_yesterday.length;
      }

      // get today's content and modify it
      let templateHeadingNotFoundMessage = '';
      const templateHeadingSelected = templateHeading !== 'none';

      if (todos_today.length > 0) {
        let dailyNoteContent = await this.app.vault.read(file);
        undoHistoryInstance.today = {
          file: file,
          oldContent: `${dailyNoteContent}`
        };
        let todos_todayString = `\n${todos_today.join('\n')}`;

        // '\n' + [[20210403]] + '\n'

        // If template heading is selected, try to rollover to template heading
        if (templateHeadingSelected) {
          const contentAddedToHeading = dailyNoteContent.replace(
            templateHeading,
            `${templateHeading}${todos_todayString}`
          );
          if (contentAddedToHeading == dailyNoteContent) {
            templateHeadingNotFoundMessage = `Rollover couldn't find '${templateHeading}' in today's daily not. Rolling todos to end of file.`;
          } else {
            dailyNoteContent = contentAddedToHeading;
          }
        }

        // Rollover to bottom of file if no heading found in file, or no heading selected
        if (
          !templateHeadingSelected ||
          templateHeadingNotFoundMessage.length > 0
        ) {
          dailyNoteContent += todos_todayString;
        }

        // 是否选择去年今日

        // 如果选择去年今日

        /**
         * 1. 显示几年？
         * 2. 默认显示1年
         * 3. 最多显示5年
         * 4. 显示双链还是反链
         * 5. 标题自定义
         */
        if (displayTodayInHistory) {
          let lastYearToday = [todayHistoryHeader + '\n'];

          const [year, month, day] = require$$0.moment()
            .format('YYYY-MM-DD')
            .split('-');

          // 显示双链还是反链
          let historyBeginWith = `- [[`;
          if (historyShowDirect) {
            historyBeginWith = `- ![[`;
          }

          for (let i = 1; i <= todayHistoryCount; i++) {
            // if (historyShowDirect) {
            lastYearToday.push(
              `${historyBeginWith}${year - i}-${month}-${day}]]`
            );
            // }
          }

          const lastYearToday_String = `\n${lastYearToday.join('\n')}`;

          dailyNoteContent += lastYearToday_String;
          dailyNoteContent += '\n';
        }
        // return

        // 最终执行 更改文件
        await this.app.vault.modify(file, dailyNoteContent);
      }

      // if deleteOnComplete, get yesterday's content and modify it
      if (deleteOnComplete) {
        let lastDailyNoteContent = await this.app.vault.cachedRead(
          lastDailyNote
        );
        undoHistoryInstance.previousDay = {
          file: lastDailyNote,
          oldContent: `${lastDailyNoteContent}`
        };
        let lines = lastDailyNoteContent.split('\n');

        for (let i = lines.length; i >= 0; i--) {
          if (todos_yesterday.includes(lines[i])) {
            lines.splice(i, 1);
          }
        }

        let modifiedContent = lines.join('\n');

        let modifiedContentLines = modifiedContent.split('\n');

        for (let i = modifiedContentLines.length; i >= 0; i--) {
          if (
            i > 0 &&
            modifiedContentLines[i] == '' &&
            modifiedContentLines[i - 1] == ''
          ) {
            modifiedContentLines.splice(i, 1);
          }
        }

        modifiedContent = modifiedContentLines.join('\n');

        await this.app.vault.modify(lastDailyNote, modifiedContent);
      }

      // Let user know rollover has been successful with X todos
      const todosAddedString =
        todosAdded == 0
          ? ''
          : `- ${todosAdded} todo${todosAdded > 1 ? 's' : ''} rolled over.`;
      const emptiesToNotAddToTomorrowString =
        emptiesToNotAddToTomorrow == 0
          ? ''
          : deleteOnComplete
          ? `- ${emptiesToNotAddToTomorrow} empty todo${
              emptiesToNotAddToTomorrow > 1 ? 's' : ''
            } removed.`
          : '';
      const part1 =
        templateHeadingNotFoundMessage.length > 0
          ? `${templateHeadingNotFoundMessage}`
          : '';
      const part2 = `${todosAddedString}${
        todosAddedString.length > 0 ? ' ' : ''
      }`;
      const part3 = `${emptiesToNotAddToTomorrowString}${
        emptiesToNotAddToTomorrowString.length > 0 ? ' ' : ''
      }`;

      let allParts = [part1, part2, part3];
      let nonBlankLines = [];
      allParts.forEach(part => {
        if (part.length > 0) {
          nonBlankLines.push(part);
        }
      });

      const message = nonBlankLines.join('\n');
      if (message.length > 0) {
        new require$$0.Notice(message, 4000 + message.length * 3);
      }
      this.undoHistoryTime = new Date();
      this.undoHistory = [undoHistoryInstance];
    }
  }

  async onload () {
    await this.loadSettings();
    this.undoHistory = [];
    this.undoHistoryTime = new Date();

    this.addSettingTab(new RolloverSettingTab(this.app, this));

    // can not find how to trigger event after load the template
    // so close this feature now
    // this.registerEvent(
    //   this.app.vault.on('create', async file => {
    //     this.rollover(file)
    //   })
    // )

    this.addCommand({
      id: 'obsidian-daily-todo-pro-rollover',
      name: 'Rollover Todos Now',
      callback: () => this.rollover()
    });

    this.addCommand({
      id: 'obsidian-daily-todo-pro-random',
      name: 'Lucky Note',
      callback: () => {
        // const activeFile = this.createSelectedFileStore();
        const existingFile = this.getLastDailyNote(1);
        if (!existingFile) {
          console.log(`Something wrong with Lucky Note.`);
          return
        }
        this.app.workspace.getUnpinnedLeaf().openFile(existingFile);
      }
    });

    this.addCommand({
      id: 'obsidian-daily-todo-pro-undo',
      name: 'Undo last rollover',
      checkCallback: checking => {
        // no history, don't allow undo
        if (this.undoHistory.length > 0) {
          const now = require$$0.moment();
          const lastUse = require$$0.moment(this.undoHistoryTime);
          const diff = now.diff(lastUse, 'seconds');
          // 5+ mins since use: don't allow undo
          if (diff > 5 * 60) {
            return false
          }
          if (!checking) {
            new UndoModal(this).open();
          }
          return true
        }
        return false
      }
    });
  }
}

module.exports = DailyTodoProPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL29ic2lkaWFuLWRhaWx5LW5vdGVzLWludGVyZmFjZS9kaXN0L21haW4uanMiLCJzcmMvdWkvVW5kb01vZGFsLmpzIiwic3JjL3VpL1JvbGxvdmVyU2V0dGluZ1RhYi5qcyIsInNyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsicmVxdWlyZSQkMCIsIk1vZGFsIiwiU2V0dGluZyIsIlBsdWdpblNldHRpbmdUYWIiLCJnZXREYWlseU5vdGVTZXR0aW5ncyIsIlBsdWdpbiIsIm1vbWVudCIsImdldEFsbERhaWx5Tm90ZXMiLCJnZXREYWlseU5vdGUiLCJOb3RpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RDtBQUNBLElBQUksUUFBUSxHQUFHQSw4QkFBbUIsQ0FBQztBQUNuQztBQUNBLE1BQU0seUJBQXlCLEdBQUcsWUFBWSxDQUFDO0FBQy9DLE1BQU0sMEJBQTBCLEdBQUcsWUFBWSxDQUFDO0FBQ2hELE1BQU0sMkJBQTJCLEdBQUcsU0FBUyxDQUFDO0FBQzlDLE1BQU0sNkJBQTZCLEdBQUcsV0FBVyxDQUFDO0FBQ2xELE1BQU0sMEJBQTBCLEdBQUcsTUFBTSxDQUFDO0FBQzFDO0FBQ0EsU0FBUyw4QkFBOEIsQ0FBQyxXQUFXLEVBQUU7QUFDckQ7QUFDQSxJQUFJLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3pFLElBQUksT0FBTyxhQUFhLElBQUksYUFBYSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsRUFBRSxPQUFPLENBQUM7QUFDM0UsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxvQkFBb0IsR0FBRztBQUNo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
