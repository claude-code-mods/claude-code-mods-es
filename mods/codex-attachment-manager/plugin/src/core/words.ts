// Purpose: the text for the model (v0.11: moved here from rewrite.ts unchanged, docs/v0.11/plan.md): placeholders,
// notes, labels, lists, and the words of the fetch tool, in Chinese and English. Every platform and request format
// uses the same words; where a platform needs its own (Claude's notes after a message, Codex's compaction note), the
// function says so. The history of each wording is in the comments next to it.
// v0.1 — placeholders say the image was seen when it appeared and is left out now by the user's choice, so the model
// keeps trusting what it said about it (user report 2026-09-25).
// v0.1-14 — in the user's language (Codex's interface language, language.ts): the Chinese wording is the one tested on
// 2026-09-25; the English one says the same and is checked by the same self-test (v01-placeholder-selftest.ts --lang en).
// v0.1-24 — how to ask for an image back is spelled out, for every GPT-6 model (self-tests with CAM_TEST_MODEL).
// v0.1-25 — once anything is left out, each image still sent carries its id, and the note says a checked image is back
// in its old place: GPT-6 Luna looked for it in the newest message and said it could not see it (user 2026-09-28).
// v0.3 — automatic selection (user 2026-10-06): images from earlier turns that are not pinned are left out, in their own
// wording, and the model fetches what it needs with cam_view_image (whose words are here too, as text for the model).
// A copy it fetched is sent in that turn only. Drafts of this wording were tried on the three GPT-6 models in Chinese
// and English before it was built (spike/src/auto-fetch-selftest.ts).
// v0.8 (docs/v0.8/plan.md) — the model writes a feature line for each new image and notes the user's ratings, as record
// lines in its replies (notes.ts); a placeholder carries them, so the model still tells the images apart after a
// compaction. For that a feature line note goes before the turn of the first image, and every image sent says its id,
// also the ones new in this turn. The second line of a placeholder is shorter, offsetting the added text.
// Input: what is known of an image (Described), the language. Output: strings.

import { FETCHED_STATE, type ImageKind } from "./images.ts";
import type { Lang } from "./lang.ts";
import type { Notes, Rating } from "./notes.ts";

// notes (v0.8): what the model noted about the image, shown in its placeholder. awaiting (v0.10): an image of an
// interrupted turn sent once more for its feature line (thread-index.ts, awaitingLine); its label says so.
export type Described = { id: string; name: string | null; label: string | null; kind: ImageKind; turn: number | null; width: number | null; height: number | null; notes?: Notes; awaiting?: boolean };

type FetchWords = { title: string; description: string; ids: string; missing: (id: string) => string; unavailable: (id: string) => string; off: string };
type Words = {
  kind: Record<ImageKind, string>; unnamed: string; turn: (n: number) => string; thisTurn: string; newImage: string;
  // v0.10: the source in a compact line (compactLine), shorter.
  kindShort: Record<ImageKind, string>; sameShort: (id: string) => string;
  omitted: string; notRepeated: string; included: string; separator: string;
  // v0.10: the label of an image sent once more for its feature line (Described.awaiting).
  includedAwaiting: string;
  heading: (id: string, label: string | null, state: string, fields: string[]) => string;
  plain: (id: string) => string; duplicate: (id: string, where: string) => string; note: string;
  autoPlain: (id: string) => string; autoNote: string; copy: (id: string) => string; fetch: FetchWords;
  // v0.4, Claude Code only (anthropic-messages/rewrite.ts): what the note adds about tool results, and the short note that follows
  // each message holding omitted images, naming them.
  toolNote: string; here: (list: string) => string; hereAuto: (list: string) => string; listItem: (id: string, name: string | null, kind: string) => string;
  // v0.5, Claude Code only: after a compaction summary, the images from before it, which of them are not sent this
  // time, and how to get one back. v0.10: how many and their ids, no longer listed; those not sent are one line each
  // in a list after the summary (compactHeader, compactLine).
  compacted: (count: number, range: string, missing: number, auto: boolean) => string;
  compactHeader: (count: number) => string;
  // v0.10, Codex: the images its compaction did not keep, put back after it: how many, how many sent as originals.
  codexCompacted: (count: number, resent: number, auto: boolean) => string;
  // v0.8: how to write feature lines and note ratings; the placeholder's line with them; how long each may be shown.
  featureNote: string; notes: (line: string | null, ratings: Rating[]) => string;
};

// The image sits in the history, so the model concludes it never saw it and takes back what it said about it (user
// report 2026-09-25). Saying otherwise inside the placeholder did not help: it is user content, which the model does
// not take as proof. So the explanation goes once into a developer message, before the turn where the first omitted
// image appeared, and each placeholder only points to it.
const WORDS: Record<Lang, Words> = {
  en: {
    kind: { upload: "uploaded by the user", view: "viewed with a tool", generated: "generated image", tool: "image from a tool result" },
    kindShort: { upload: "upload", view: "viewed", generated: "generated", tool: "tool" },
    sameShort: (id) => `same as ${id}`,
    unnamed: "unnamed",
    turn: (n) => `turn ${n}`,
    thisTurn: "this turn",
    newImage: "(new image)",
    omitted: "omitted",
    notRepeated: "not repeated",
    included: "included",
    includedAwaiting: "included, no feature line yet",
    separator: ", ",
    heading: (id, label, state, fields) => `[Image ${id}${label ? ` (${label})` : ""} ${state} | ${fields.join(" | ")}]`,
    plain: (id) => `To see it again, write "need ${id}" in your reply.`,
    duplicate: (id, where) => `This image is identical to ${id} (${where}), which is included in this request as usual; refer to that one.`,
    note: [
      "Context management note (from the context asset manager the user installed): to save context, the user unchecked some images in this task. Further on in the conversation, where those images were, there is now placeholder text such as \"[Image IMG-xxx omitted…]\"; each image still included is marked \"[Image IMG-xxx included…]\", with the original image right after it.",
      "These images really existed in the turn where they appeared, and you received and looked at them then; what you said about them before, and the judgments you based on it, were made looking at the original images and remain valid. Do not treat your earlier answers as guesses or mistakes because you cannot see the images now, and do not take them back or apologize.",
      "If asked whether you can see an omitted image now, say truthfully that you cannot see it now (the user left it out), and that your earlier descriptions remain valid. Since you cannot see it now, do not add details you did not mention before. If you need to look at an image again, write exactly \"need IMG-xxx\" in your reply (for several: \"need IMG-002, IMG-003\"): the tool finds the images you want by these words. Once the user checks an image again, its original is back in its old place in the conversation: the placeholder there becomes \"[Image IMG-xxx included…]\" followed by the original image. It does not come in the user's new message, so do not ask the user to upload or attach it again. Do not read these images yourself with tools.",
      "An image marked \"[Image IMG-xxx included…]\" is in front of you now, even if it was omitted before or is one you asked for: when asked about it, look at it and answer from it, and do not say you cannot see it.",
    ].join("\n"),
    autoPlain: (id) => `For the original, call cam_view_image with "${id}".`,
    autoNote: [
      "Context management note (from the context asset manager the user installed): this task has automatic image selection on. To save context, images from earlier turns are no longer included in requests by default: further on in the conversation, where those images were, there is now placeholder text such as \"[Image IMG-xxx omitted…]\". Images new in this turn are included as usual, and so are the images the user pinned, marked \"[Image IMG-xxx included…]\" with the original image right after it.",
      "These images really existed in the turn where they appeared, and you received and looked at them then; what you said about them before, and the judgments you based on it, were made looking at the original images and remain valid. Do not treat your earlier answers as guesses or mistakes because you cannot see the images now, and do not take them back or apologize.",
      "When an answer needs an omitted image and what you said about it before is not enough, call the cam_view_image tool with its id (several ids at once if you need several); the original comes back in that tool result, marked \"[Image IMG-xxx fetched original…]\", and you answer from it. When what you said before is enough, do not call it. Do not guess or add visual details you cannot see now; do not ask the user to upload images again, and do not read the files of omitted images with other tools. Images the user newly asks you to look at are not affected: look at them as usual.",
      "An image you get with cam_view_image is included only in this turn; from the next turn on it is a placeholder again. Call the tool again if you need it later. An image marked \"included\" or \"fetched original\" is in front of you now: when asked about it, look at it and answer from it, and do not say you cannot see it.",
    ].join("\n"),
    copy: (id) => `[Original of ${id}: fetched by the model with cam_view_image, included only in that turn, now omitted]`,
    toolNote: "The same holds for images in tool results: the tool call returned the original image at the time and you saw it; a placeholder inside a tool result was put there later, it is not what the tool returned.",
    here: (list) => `Context management note: in the message above, ${list} were original images at the time, and you looked at them then; what you said about them and the judgments you based on it remain valid, so do not take them back or call them guesses or made up. The placeholder text there was put in only for this request; it is not what was there at the time. You cannot see them now: if asked, say so truthfully (the user left them out), and do not add details you did not mention before. When a question can only be answered by looking at one of them, do not just say you cannot answer; write a line "need IMG-xxx" in your reply (with its number; list each one needed): that line is how the user learns which image to check again, and once they do, the original comes back in its place and you can answer from it.`,
    hereAuto: (list) => `Context management note: in the message above, ${list} were original images at the time, and you looked at them then; what you said about them and the judgments you based on it remain valid, so do not take them back or call them guesses or made up. The placeholder text there was put in only for this request (automatic image selection); it is not what was there at the time. When what you said before is not enough, fetch the original with cam_view_image; do not add details you did not mention before.`,
    listItem: (id, name, kind) => `${id} (${[name, kind].filter(Boolean).join(", ")})`,
    compacted: (count, range, missing, auto) => [
      `${missing === 0 ? "Context management note (from the context asset manager the user installed): " : "Context management note: "}in the message above, the conversation before the summary had ${count} images (${range}). Compacting the conversation took them out of context; this tool put them back right after the summary: the ones the user ${auto ? "pinned" : "checked to send"} are marked "[Image IMG-xxx included…]" with the original image right after it. They are in front of you now: when asked about one, look at it and answer from it, and do not say you cannot see it.${missing === 0 ? ` This holds even for an image omitted before${auto ? "" : " or one you asked for"}: an image the user ${auto ? "pins" : "checks again"} comes back there, not in the user's new message, so do not ask for it to be attached again.` : ""} This tool rebuilds this part for every request: in the requests where an image was left out, it was not here; it shows up before your earlier replies now only because it was put back for this request. So if you said before that you could not see an image, that was true then, not a mistake; do not correct it.`,
      ...(missing === 0 ? [] : [
        `${missing < count ? "The other" : "These"} ${missing} are not included as originals this time (${auto ? "automatic image selection is on, so images from earlier turns are left out by default" : "the user unchecked them"}, to save context): they are in the list after the summary, one line each, with the id, name, and the features and ratings you noted; the list was put there only for this request. You saw their originals: in the conversation before the compaction, and some also after it. What you said about them and the judgments you based on it, in the summary or in your later replies, were made looking at the original images and remain valid; do not take them back or call them guesses or made up. ${auto ? "You cannot see them now, so do not add details you did not mention before." : "You cannot see them now: if asked, say so truthfully (the user left them out), and do not add details you did not mention before."}`,
        auto
          ? "When what you said before is not enough, call the cam_view_image tool with the id to fetch the original; do not ask the user to upload it again."
          : "When a question can only be answered by looking at one of them, do not just say you cannot answer; write a line \"need IMG-xxx\" in your reply (with its number; list each one needed): that line is how the user learns which image to check again, and once they do, the original comes back in its place and you can answer from it. Do not ask the user to upload or provide it again.",
      ]),
    ].join("\n"),
    compactHeader: (count) => `[Images from before the compaction, the ${count} not included as originals this time: id | name | source | turn | features and ratings]`,
    codexCompacted: (count, resent, auto) => [
      `Context management note (from the context asset manager the user installed): this task's conversation was compacted. The compaction did not keep ${count} images that tools viewed, generated or returned in earlier turns; this tool put them back here.`,
      resent ? `Of them, the ${resent} the user ${auto ? "pinned" : "checked to send"} follow with their originals, each marked "[Image IMG-xxx included…]": they are in front of you now; when asked about one, look at it and answer from it, and do not say you cannot see it.` : null,
      count > resent ? `${resent ? "The other" : "These"} ${count - resent} are not included as originals this time (${auto ? "automatic image selection is on, so images from earlier turns are left out by default" : "the user unchecked them"}, to save context): they are in the list below, one line each, with the id, name, and the features and ratings you noted.` : null,
      "These images really existed in the turn where they appeared, and you looked at them then; what you said about them, and the judgments you based on it, were made looking at the original images and remain valid; do not take them back or call them guesses or made up. Do not add details you did not mention before about images you cannot see now.",
      count > resent
        ? auto
          ? "When an answer needs an image from the list and what you said about it before is not enough, call the cam_view_image tool with its id (several ids at once if you need several); the original comes back in that tool result. Do not ask the user to upload images again, and do not read the files of the listed images with other tools. Images the user newly asks you to look at are not affected: look at them as usual."
          : "When a question can only be answered by looking at an image from the list, write a line \"need IMG-xxx\" in your reply (with its number; list each one needed): once the user checks it again, the original comes back here. Do not ask the user to upload it again."
        : null,
    ].filter((line) => line !== null).join("\n"),
    fetch: {
      title: "View omitted images",
      description: "View the originals of one or more omitted images in this task. Omitted images appear in the conversation as \"[Image IMG-xxx omitted…]\". Call it only when an answer needs to look at an image and what you said about it before is not enough; the originals are included only in this turn.",
      ids: "Ids of the images to view, e.g. [\"IMG-004\"]; pass several at once if you need several.",
      missing: (id) => `This task has no ${id}.`,
      unavailable: (id) => `The original of ${id} could not be read.`,
      off: "Automatic image selection is off in this task: omitted images come back only when the user checks them. If you need one, write \"need IMG-xxx\" in your reply.",
    },
    featureNote: [
      "Feature line note (from the context asset manager the user installed): every image in this task has an ID, written in the \"[Image IMG-xxx …]\" line before it. The user installed this tool so that you can still tell the images apart later, also after the conversation is compacted, and remember what the user said about each. So begin the last reply of every turn (not what you say between tool calls) with one feature line for each image that is new in this turn, then a blank line, then your reply, in this form:",
      "[//]: # (cam IMG-015 place | visible features)",
      "- First the place, then what can be seen (shot size, subject, angle, light, colors, composition), about 15 words at most, for example \"[//]: # (cam IMG-015 street | close-up, facing the camera, rainy night, neon reflections)\".",
      "- The place is where the picture is set, specific enough to tell it apart, such as \"study\", \"outside the café\" or \"subway platform\"; for a close-up that doesn't show it, write what you know. No scene numbers, versions or what the image is for (first frame, sketch, check); time of day and weather go in the features.",
      "- An image of several places (a storyboard, a contact sheet) gets \"several places\"; one set nowhere gets what it is: character, object, document, web page.",
      "- For a place you named before, reuse that name.",
      "- Only what can be seen; no judgments such as \"beautiful\" or \"looks like someone\". One line per image, written once and never changed. Write one for the images the user uploaded, the ones you generated or viewed, and those in tool results; not for images you fetched with cam_view_image or images without an ID.",
      "- An image marked \"[Image IMG-xxx included, no feature line yet…]\" is from an earlier turn that was interrupted before you wrote its line; it is included once more in this turn: write its line too.",
      "- If a feature line you wrote turns out wrong (for example, the user points it out), write the whole line again in the same form, starting with \"corrected:\", for example \"[//]: # (cam IMG-005 corrected: character | front close-up, scar on the left eyebrow)\"; it replaces the old one.",
      "- When the user rates an image, even turns later, first make sure which one it is, then note the user's own words in a line of about 8 words at most, for example \"[//]: # (cam IMG-003 rated: too dark)\". The rating is the user's own view: note it even if you see it differently. If you are not sure which image it is, do not note it; you may ask the user which one they mean, without mentioning the noting. When the user only rates images and asks for nothing, a short reply to what they said is enough; do not explain what you noted or which image you matched it to.",
      "- Put these lines before your reply with a blank line after them, one image per line, and no parentheses inside them. In a turn with no new image and no rating, write none of these lines. These lines are for this tool only; the user does not see them on screen. Answer as usual and do not mention these lines; when the user rates an image, do not acknowledge the noting either, such as \"noted\", \"I'll keep that in mind\" or \"I'll refer to this later\".",
      "- Images left out later carry your feature line and the ratings you noted in their placeholders, also after a compaction. Check them when you pick an image; when unsure, get the original back first (the \"Context management note\" says how) or ask the user which one.",
    ].join("\n"),
    notes: (line, ratings) => [
      line ? `Features: ${line}` : null,
      ratings.length ? `rated: ${ratings.map((rating) => `"${rating.text}"${rating.turn !== null ? ` (turn ${rating.turn})` : ""}`).join(", ")}` : null,
    ].filter((part) => part !== null).join("; "),
  },
};

// The Chinese note, tested on 2026-09-25; v0.1-24 (2026-09-28) spells out how to ask for an image back (" IMG-xxx",
// several at once, no re-uploading), after GPT-6 Luna asked the user to "reattach" images instead; v0.1-25 says where a
// checked image comes back (its old place, marked ""), after Luna looked for it in the newest message instead.
export const OMISSION_NOTE = WORDS.zh.note;
export const omissionNote = (lang: Lang) => WORDS[lang].note;

function heading(words: Words, image: Described, state: string): string {
  const fields = [image.name ?? words.unnamed, words.kind[image.kind]];
  if (image.turn !== null) fields.push(words.turn(image.turn));
  if (image.width && image.height) fields.push(`${image.width}×${image.height}`);
  return words.heading(image.id, image.label, state, fields);
}

// v0.8: a feature line or rating longer than the note allows is cut after the last punctuation mark (or space) that
// still fits, with "…"; the model is asked to keep them short, and the panel searches the full text. v0.10: the caps
// count width, whatever the language setting: a CJK character 10, any other 3, so a cap of 30 fits 30 Chinese
// characters or 100 Latin ones (an English feature line in a Chinese task was cut to its place before, and lines that
// differed only after it read the same).
const CLIP_AT = /[，。；、！？,.;!?｜|：:\s]/u;
const WIDE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}　-〿＀-￯]/u;
// A rating keeps as much as a feature line: they are the user's own words, and only a few per session (a long replay
// lost half of one at 15, 2026-10-31).
const CAPS = { line: 30, rating: 30 };
export function clip(text: string, max: number): string {
  const chars = [...text.trim()];
  let width = 0;
  const end = chars.findIndex((char) => (width += WIDE.test(char) ? 10 : 3) > max * 10);
  if (end < 0) return chars.join("");
  let cut = end;
  for (let i = end - 1; i > 0; i--) if (CLIP_AT.test(chars[i])) { cut = i; break; }
  return `${chars.slice(0, cut).join("").trimEnd()}…`;
}

// v0.8: the line under a placeholder's heading: the model's feature line and the latest three ratings it noted, with
// their turns; null when it noted nothing (e.g. an image from before v0.8).
function notesLine(words: Words, image: Described): string | null {
  const { line = null, ratings = [] } = image.notes ?? {};
  if (!line && !ratings.length) return null;
  return words.notes(line ? clip(line, CAPS.line) : null, ratings.slice(-3).map((rating) => ({ ...rating, text: clip(rating.text, CAPS.rating) })));
}

export function plainPlaceholder(image: Described, lang: Lang = "zh"): string {
  const words = WORDS[lang];
  return [heading(words, image, words.omitted), notesLine(words, image), words.plain(image.id)].filter((line) => line !== null).join("\n");
}

export function duplicatePlaceholder(image: Described, same: Described, lang: Lang = "zh"): string {
  const words = WORDS[lang];
  const where = [same.name, same.turn !== null ? words.turn(same.turn) : words.thisTurn].filter(Boolean).join(words.separator);
  return `${heading(words, image, words.notRepeated)}\n${words.duplicate(same.id, where)}`;
}

// Put right before an image that is still sent, so the model can tell which id it is: Codex's own labels ("[Image #2]")
// start again in every message.
export function includedLabel(image: Described, lang: Lang = "zh"): string {
  return heading(WORDS[lang], image, image.awaiting ? WORDS[lang].includedAwaiting : WORDS[lang].included);
}

// v0.3: automatic selection.
export const autoNote = (lang: Lang) => WORDS[lang].autoNote;
export const fetchWords = (lang: Lang): FetchWords => WORDS[lang].fetch;
// v0.4: the same words for a Claude Code request (anthropic-messages/rewrite.ts).
export const copyNote = (id: string, lang: Lang) => WORDS[lang].copy(id);
export const newImageWord = (lang: Lang) => WORDS[lang].newImage;

// v0.4, Claude Code only: the note also speaks of tool results, and a short note follows each message holding omitted
// images, naming them. Codex's words stay as they are.
export const claudeNote = (lang: Lang, auto = false) => `${auto ? WORDS[lang].autoNote : WORDS[lang].note}\n${WORDS[lang].toolNote}`;
export function hereNote(images: Described[], lang: Lang = "zh", auto = false): string {
  const words = WORDS[lang];
  const list = images.map((image) => words.listItem(image.id, image.name, words.kind[image.kind])).join(words.separator);
  return auto ? words.hereAuto(list) : words.here(list);
}

// v0.5, Claude Code only: the note after the message holding a compaction summary, listing the images from before it
// and naming the ones not sent this time. Their placeholders are the first in the request, so the full note comes
// first, as it does after the first message holding placeholders (anthropic-messages/rewrite.ts).
// v0.10: the images are no longer listed in the note, only counted with their ids (the ones before the latest
// compaction are the first ids); those not sent are in the list after the summary (compactList).
export function compactedNote(images: Described[], sent: Set<string>, lang: Lang = "zh", auto = false): string {
  const words = WORDS[lang];
  const missing = images.filter((image) => !sent.has(image.id)).length;
  const range = images.length > 1 ? `${images[0].id} to ${images[images.length - 1].id}` : images[0]?.id ?? "";
  const own = words.compacted(images.length, range, missing, auto);
  return missing ? `${claudeNote(lang, auto)}\n${own}` : own;
}

// v0.10: an image put back after a compaction without its original, in one line: id, name, source, turn, and what
// the model noted (as in a placeholder). A placeholder apiece repeated the same words for every image; a session with
// 127 images before its compaction took about 1.7–2.0 tokens per request that way, about 0.7–0.9 as lines
// (docs/v0.10/plan.md). `same`: the id of an earlier line with the same picture (sent again), named instead of its
// features.
export function compactLine(image: Described, lang: Lang = "zh", same: string | null = null): string {
  const words = WORDS[lang];
  const fields = [image.id, image.name ?? "-", words.kindShort[image.kind], image.turn !== null ? words.turn(image.turn) : "-"];
  const { line = null, ratings = [] } = image.notes ?? {};
  if (same) fields.push(words.sameShort(same));
  else if (line) fields.push(clip(line, CAPS.line));
  if (ratings.length) fields.push(words.notes(null, ratings.slice(-3).map((rating) => ({ ...rating, text: clip(rating.text, CAPS.rating) }))));
  return fields.join(lang === "zh" ? "｜" : " | ");
}

// The images carry what the indexes know of their content (thread-index.ts, IndexedImage): the same digest or pixels
// is the same picture.
type Listed = Described & { contentId?: string; pixelSha256?: string | null };
export function compactList(images: Listed[], lang: Lang = "zh"): string {
  const sameAs = (image: Listed, at: number) => images.slice(0, at).find((other) => (image.contentId !== undefined && other.contentId === image.contentId) || (image.pixelSha256 && other.pixelSha256 === image.pixelSha256))?.id ?? null;
  return [WORDS[lang].compactHeader(images.length), ...images.map((image, at) => compactLine(image, lang, sameAs(image, at)))].join("\n");
}

// v0.10, Codex: the note before the images its compaction did not keep (addCodexCompacted).
export const codexCompactedNote = (count: number, resent: number, auto: boolean, lang: Lang) => WORDS[lang].codexCompacted(count, resent, auto);

export function autoPlaceholder(image: Described, lang: Lang = "zh"): string {
  const words = WORDS[lang];
  return [heading(words, image, words.omitted), notesLine(words, image), words.autoPlain(image.id)].filter((line) => line !== null).join("\n");
}

// v0.8: the feature line note, for a task's own requests (not a side chat's or a subagent's).
export const featureNote = (lang: Lang) => WORDS[lang].featureNote;

// The line cam_view_image puts before each image it returns. Without Codex's own label ("[Image #3]"), which numbers
// images within their message and means nothing here: GPT-6 Luna once read it as the digit asked about.
export function fetchedLabel(image: Described, lang: Lang = "zh"): string {
  return heading(WORDS[lang], { ...image, label: null }, FETCHED_STATE[lang]);
}
