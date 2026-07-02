// ==UserScript==
// @name         Chat Clipper  (Arousr · OnlyFans · Fansly)
// @namespace    https://github.com/damoscodehub/chat-clipper
// @version      1.4.6
// @description  Per-message copy buttons, selective copy, and chat-export in Arousr, OnlyFans, and Fansly
// @author       damoscodehub
// @grant        GM_addStyle
// @match        https://chat.arousr.com/*
// @match        https://onlyfans.com/my/chats/*
// @match        https://fansly.com/messages/*
// @match        https://loyalfans.com/*
// @match        https://*.loyalfans.com/*
// @updateURL    https://raw.githubusercontent.com/damoscodehub/chat-clipper/main/chat-clipper.user.js
// @downloadURL  https://raw.githubusercontent.com/damoscodehub/chat-clipper/main/chat-clipper.user.js
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  let ADAPTER; // resolved by detectPlatform() before first use

  /* ── SVG icons ──────────────────────────────────────────────────────── */

  const SVG_MSG_COPY =
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
         fill="none" stroke="white" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <rect x="8" y="8" width="12" height="12" rx="2"/>
      <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"/>
    </svg>`;

  const SVG_NAMED_COPY =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke="white" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <rect x="8" y="8" width="12" height="12" rx="2"/>
      <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"/>
    </svg>`;

  const SVG_DICE =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="white" stroke-width="2"/>
      <rect x="4" y="4" width="12" height="12" rx="2" fill="white"/>
      <circle cx="7"  cy="7"  r="1.3" fill="#1e1e1e"/>
      <circle cx="13" cy="7"  r="1.3" fill="#1e1e1e"/>
      <circle cx="10" cy="10" r="1.3" fill="#1e1e1e"/>
      <circle cx="7"  cy="13" r="1.3" fill="#1e1e1e"/>
      <circle cx="13" cy="13" r="1.3" fill="#1e1e1e"/>
    </svg>`;

  const SVG_WAVE =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
      <path fill="white" d="M168,30.99268A8.00009,8.00009,0,0,1,176,23h.00781A60.21143,60.21143,0,0,1,227.9541,53.00439a8.00044,8.00044,0,1,1-13.85742,8A44.16357,44.16357,0,0,0,175.99219,39,8,8,0,0,1,168,30.99268Zm60.99512,139.772A88.01088,88.01088,0,0,1,67.7832,191.98828l-42-72.74609A27.991,27.991,0,0,1,47.77832,77.33807L44.4248,71.5293A28.00473,28.00473,0,0,1,87.44922,36.74976a27.99212,27.99212,0,0,1,48.11328.63549l17.34326,30.04a28.01379,28.01379,0,0,1,47.29834,1.92243l19.999,34.64062A87.41865,87.41865,0,0,1,228.99512,170.76465Zm-22.64746-58.77637-20-34.64062A12.00012,12.00012,0,1,0,165.5625,89.34717l10,17.3208a7.98085,7.98085,0,0,1,.36475.7121c.08007.17706.1455.35723.21191.53735.02393.0647.05322.12756.0752.19281.0747.22082.13574.44385.19043.66772.00634.02771.01611.05469.02294.08252.05323.23029.09327.4618.126.69373.00342.02508.00977.04974.01318.07489.02881.22156.04444.44342.05469.66522.00147.03882.00733.07733.00879.11621.00635.20417-.00049.40753-.00976.61078-.00245.05823,0,.11633-.00391.17456-.0127.19092-.03858.38007-.06494.56922-.00977.06988-.01319.14013-.0249.2099-.0376.227-.08838.45141-.145.67419-.00782.02972-.01172.05994-.01954.0896-.0083.0304-.0205.05914-.0288.08942-.062.22088-.13038.44-.21094.655-.02246.05945-.05127.11567-.07471.17444-.07422.18415-.1499.36774-.2373.54621-.02149.0429-.04688.083-.06885.12548-.09815.19062-.19971.37934-.31348.5622-.01318.02112-.02832.04053-.0415.06152-.12647.19947-.25977.3949-.4043.5835l-.01758.02087q-.22925.29737-.48779.575l-.01611.01586c-.17188.18268-.352.35907-.543.52668-.03125.0274-.06592.051-.09766.07788-.166.1416-.33545.28088-.51562.41009a7.96868,7.96868,0,0,1-.66992.43329,32.00043,32.00043,0,0,0-11.71387,43.71289,7.99959,7.99959,0,1,1-13.85547,8,48.025,48.025,0,0,1,10.9707-60.998L151.707,97.34766l-.00244-.0044L121.707,45.38574a12.00023,12.00023,0,1,0-20.78515,12l25.999,45.03369a8,8,0,0,1-13.85645,8l-26-45.03369-.01562-.02826L79.06543,51.5293A12.00012,12.00012,0,0,0,58.28027,63.52881l15.99707,27.7077.00293.00519,22,38.106A7.95946,7.95946,0,0,1,92.47852,140.706c-.08643.03675-.17334.06806-.26026.10157q-.33105.12771-.66748.22454c-.08935.02564-.17773.05225-.26758.07465a7.93311,7.93311,0,0,1-.84131.16473c-.0249.00342-.0498.00989-.0747.01307a7.94421,7.94421,0,0,1-.93018.05963c-.02539.00024-.05127.00494-.07666.00494-.05273,0-.10449-.00915-.15723-.01019q-.364-.00723-.72412-.04675c-.08593-.00953-.17138-.01832-.25683-.03058a8.05171,8.05171,0,0,1-.85449-.16712c-.01954-.00506-.03956-.00769-.05909-.01288a8.05256,8.05256,0,0,1-.88867-.29571c-.07471-.0293-.14648-.06305-.22021-.09454q-.33106-.14174-.64844-.313c-.07617-.041-.15186-.08075-.22705-.12421a8.0088,8.0088,0,0,1-.76807-.50262l-.01758-.012a8.00346,8.00346,0,0,1-.72412-.62359c-.06006-.05823-.11767-.12-.17627-.1803q-.25928-.26541-.4956-.5578c-.05469-.06781-.11035-.134-.16309-.204a8.01625,8.01625,0,0,1-.55566-.82623l-22-38.10547a11.99994,11.99994,0,0,0-20.78418,12.00049l42,72.7456a72.00015,72.00015,0,0,0,124.708-72ZM85.65234,233.42871a103.08083,103.08083,0,0,1-30.72461-33.438,7.99959,7.99959,0,1,0-13.85546,8,118.949,118.949,0,0,0,35.46289,38.58643,8.00007,8.00007,0,1,0,9.11718-13.14844Z"/>
    </svg>`;

  const SVG_DESELECT =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke="white" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 2"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
    </svg>`;

  const SVG_CHECK_SM =
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
         fill="none" stroke="white" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round">
      <polyline points="4 12 9 17 20 7"/>
    </svg>`;

  const SVG_CHECK_LG =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke="white" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round">
      <polyline points="4 12 9 17 20 7"/>
    </svg>`;

  /* ── Styles ─────────────────────────────────────────────────────────── */

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Per-message copy button */
    .ac-msg-btn {
      padding: 0; border: none; background: none; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      width: 20px; height: 20px;
      opacity: 0; transition: opacity .18s ease; flex-shrink: 0;
      vertical-align: middle; position: relative; z-index: 2;
      transform: translateZ(0); contain: layout style;
    }
    .ac-msg-btn:hover { opacity: 1 !important; }

    /* Per-message checkbox */
    .ac-msg-cb {
      -webkit-appearance: none; appearance: none;
      width: 16px; height: 16px;
      min-width: 16px; max-width: 16px;
      min-height: 16px; max-height: 16px;
      padding: 0 !important; margin: 0;
      box-sizing: border-box; flex: none;
      cursor: pointer;
      opacity: 0; transition: opacity .18s ease;
      position: relative; z-index: 2;
      transform: translateZ(0); contain: layout style;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.5);
      border-radius: 2px;
    }
    .ac-msg-cb:hover { border-color: rgba(255,255,255,0.8); }
    .ac-msg-cb:checked {
      background: #9b59b6 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M13 3.5L6.5 11 3 7.5' fill='none' stroke='%23fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/12px no-repeat;
      border-color: #9b59b6;
    }
    .ac-msg-cb:checked:hover {
      background: #9b59b6 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M13 3.5L6.5 11 3 7.5' fill='none' stroke='%23fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/12px no-repeat;
      border-color: #9b59b6;
    }
    .ac-msg-cb:checked, .ac-msg-cb:hover { opacity: 1 !important; }
    body.ac-selecting .ac-msg-cb { opacity: 0.6; }

    /* Range-select buttons (▲ ▼) */
    .ac-sel-group { display: inline-flex; align-items: center; gap: 1px; flex-shrink: 0; transform: translateZ(0); }
    .ac-range-btn {
      background: none; border: none; cursor: pointer; font-size: 8px;
      line-height: 1; padding: 1px 3px; opacity: 0; color: #aaa;
      transition: opacity .15s ease; flex-shrink: 0;
      transform: translateZ(0); contain: layout style;
    }
    .ac-range-btn:hover { opacity: 1 !important; color: #fff; }
    body.ac-selecting .ac-range-btn { opacity: 0.5; }

    /* Header copy buttons */
    .ac-head-btn {
      background: rgba(0,0,0,0.541); border-radius: 50%; width: 36px; height: 36px;
      padding: 0; border: none; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background .18s ease; flex-shrink: 0;
    }
    .ac-head-btn:hover { background: rgba(0,0,0,0.78); }

    /* Deselect button hidden until selecting */
    .ac-deselect-btn { display: none; }
    body.ac-selecting .ac-deselect-btn { display: flex; }

    /* Shared inline rows */
    .ac-extra-row { display: inline-flex; align-items: center; gap: 4px; }
    .ac-extra-host:hover .ac-msg-btn { opacity: 0.5; }

    /* ── Arousr ─────────────────────────────────────────────────────── */
    .chat-status { display: inline-flex !important; align-items: center !important; gap: 4px !important; }
    .ac-status-row { display: flex; flex-direction: row; align-items: center; gap: 4px; }
    .ac-status-row > .chatOutMsgTime { order: 0 !important; }
    .ac-sys-footer { display: inline-flex; align-items: center; gap: 4px; }
    .system_msg_container { display: flex !important; flex-direction: column; align-items: flex-start; }
    .ar_incoming_msg_box:hover .ac-msg-btn,
    .ar_outgoing_msg_box:hover  .ac-msg-btn { opacity: 0.5; }
    .ar_incoming_msg_box:hover .ac-msg-cb,
    .ar_outgoing_msg_box:hover  .ac-msg-cb,
    .system_msg_container:hover .ac-msg-cb { opacity: 0.6; }
    .ar_incoming_msg_box:hover .ac-range-btn,
    .ar_outgoing_msg_box:hover  .ac-range-btn,
    .system_msg_container:hover .ac-range-btn { opacity: 0.4; }
    .ar_incoming_msg_box.ac-selected,
    .ar_outgoing_msg_box.ac-selected,
    .system_msg_container.ac-selected { background: rgba(155,89,182,0.12); border-radius: 8px; }

    /* ── OnlyFans ───────────────────────────────────────────────────── */
    .b-chat__message > .b-chat__message__time {
      display: inline-flex !important; align-items: center !important;
      gap: 4px !important; flex-wrap: nowrap;
    }
    .b-chat__item-message:hover .ac-msg-btn   { opacity: 0.5; }
    .b-chat__item-message:hover .ac-msg-cb    { opacity: 0.6; }
    .b-chat__item-message:hover .ac-range-btn { opacity: 0.4; }
    .b-chat__item-message.ac-selected { background: rgba(155,89,182,0.12); border-radius: 8px; }
    .b-chat__header__search-btn .b-chat__subheader__col_text {
      display: none;
    }
    .b-chat__subheader {
      padding-right: 10px !important;
    }

    /* ── Fansly ─────────────────────────────────────────────────────── */
    .ac-fansly-bar { display: flex; align-items: center; gap: 6px; width: 100%; }
    .ac-fansly-bar.ac-my-msg { justify-content: flex-end; }
    .ac-fansly-btn-row { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; }
    app-group-message.message:hover .ac-msg-btn   { opacity: 0.5; }
    app-group-message.message:hover .ac-msg-cb    { opacity: 0.6; }
    app-group-message.message:hover .ac-range-btn { opacity: 0.4; }
    app-group-message.message.ac-selected { background: rgba(155,89,182,0.12); border-radius: 8px; }

    /* ── Loyalfans ──────────────────────────────────────────────────── */
    app-message .message-footer {
      display: inline-flex !important;
      align-items: center;
      flex-direction: row !important;
      gap: 6px !important;
    }
    app-message:not(.own) .message-footer {
      justify-content: flex-start !important;
    }
    .ac-lf-row {
      display: inline-flex; align-items: center; gap: 4px;
      flex-shrink: 0; transform: translateZ(0);
    }
    app-message:hover .ac-msg-btn   { opacity: 0.5; }
    app-message:hover .ac-msg-cb    { opacity: 0.6; }
    app-message:hover .ac-range-btn { opacity: 0.4; }
    app-message.ac-selected { background: rgba(155,89,182,0.12); border-radius: 8px; }

    /* Loyalfans header: override site grid -> flex so 4 buttons don't wrap */
    .window-actions-left {
      display: flex !important;
      align-items: center;
      gap: 6px;
      flex-wrap: nowrap;
    }
    .window-actions-left .ac-head-btn {
      width: 28px; height: 28px; flex-shrink: 0;
    }
    .window-actions-left .ac-head-btn svg {
      width: 18px; height: 18px;
    }
  `;
  document.head.appendChild(styleEl);

  /* ── Shared config ─────────────────────────────────────────────────── */

  const GREETING_TEXT = 'Hi there! How are you? What\'s your name, or what do you like to be called if you\'d rather not share your real name?';

  /* ── Helpers ──────────────────────────────────────────────────────── */

  function formatWithDatetime(who, datetime) {
    if (datetime) {
      return `[${who.slice(1, -1)}; datetime=${datetime}]`;
    }
    return who;
  }

  // Parse a time string to Unix-ms; time-only strings ("11:17 AM") or
  // date+time strings without a year ("Jun 29, 11:46 PM") can silently
  // produce year 2001 in V8, so we reject unreasonable years.
  function parseTimeOrDefault(str) {
    function yearOk(d) {
      const y = d.getFullYear();
      const cy = new Date().getFullYear();
      return y >= cy - 10 && y <= cy + 5;
    }
    const ms = Date.parse(str);
    if (!isNaN(ms) && yearOk(new Date(ms))) return ms;
    const year = new Date().getFullYear();
    const withYear = str.replace(/^(\w+\s+\d+),\s*/, `$1, ${year} `);
    if (withYear !== str) {
      const ms2 = Date.parse(withYear);
      if (!isNaN(ms2)) return ms2;
    }
    // Last resort: extract time only and use today's full date
    const now = new Date();
    const datePart = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const m = str.match(/\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?/);
    if (m) {
      const ms3 = Date.parse(`${datePart} ${m[0]}`);
      if (!isNaN(ms3)) return ms3;
    }
    return null;
  }

  function normalizeDateStamp(str) {
    const now = new Date();
    if (/^today/i.test(str)) return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (/^yesterday/i.test(str)) {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    // If a 4-digit year is already present, parse with the same reasonability guard
    if (/\b\d{4}\b/.test(str)) {
      const ms = Date.parse(str);
      if (!isNaN(ms)) {
        const d = new Date(ms);
        const cy = now.getFullYear();
        if (d.getFullYear() >= cy - 10 && d.getFullYear() <= cy + 5) {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }
    }
    // Strip day-of-week prefix and insert current year
    const clean = str.replace(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s*/i, '');
    const withYear = clean.replace(/^(\w+\s+\d+),\s*/, `$1, ${now.getFullYear()} `);
    if (withYear !== clean) {
      const ms = Date.parse(withYear);
      if (!isNaN(ms)) return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return str;
  }

  /* ── NARRATOR config (Arousr) ────────────────────────────────────────
   *
   * Templates support {user} and {ai} placeholders.
   * SYSTEM rules: match text inside .system_msg_container; first match wins.
   * MEDIA rules:  detected from DOM when no .messageText exists.
   * ─────────────────────────────────────────────────────────────────── */

  const NARRATOR = {
    system: [
      {
        match: /successfully purchased the media/i,
        out:   '{user} has successfully purchased the media.',
      },
      {
        match: /you shared a paid media with the customer/i,
        out: (text, userName, aiName) => {
          const credits = (text.match(/(\d[\d\s]*)\s*credits/i) || [])[1]?.trim() || '?';
          return `${aiName} shared a paid media with the customer, which cost ${credits} credits, and will be notified as soon as ${userName} completes the purchase.`;
        },
      },
      {
        match: /tipp?ed|sent a tip/i,
        out:   '{user} sent a tip.',
      },
    ],
    media: {
      userImage: '{user} sent an image.',
      userVideo: '{user} sent a video.',
      aiImage:   '{ai} sent an image.',
      aiVideo:   '{ai} sent a video.',
    },
  };

  /* ── NARRATOR helpers (Arousr only) ─────────────────────────────────── */

  function fillTemplate(tpl, userName, aiName) {
    return tpl.replace(/\{user\}/g, userName).replace(/\{ai\}/g, aiName);
  }

  function narratorMediaLine(node, userName, aiName) {
    const isOut = node.classList.contains('ar_outgoing_msg_box');
    if (node.querySelector('img.validImage')) {
      return `[NARRATOR]: ${fillTemplate(isOut ? NARRATOR.media.userImage : NARRATOR.media.aiImage, userName, aiName)}`;
    }
    if (node.querySelector('.bluredImgBox iframe') || node.querySelector('video')) {
      return `[NARRATOR]: ${fillTemplate(isOut ? NARRATOR.media.userVideo : NARRATOR.media.aiVideo, userName, aiName)}`;
    }
    if (node.querySelector('.bluredImgBox object, .media_chat_image_purchased')) {
      return `[NARRATOR]: ${fillTemplate(isOut ? NARRATOR.media.userImage : NARRATOR.media.aiImage, userName, aiName)}`;
    }
    return null;
  }

  function narratorSystemLine(node, userName, aiName) {
    const text = (node.querySelector('.messageText')?.textContent || '').trim();
    for (const rule of NARRATOR.system) {
      if (rule.match.test(text)) {
        const body = typeof rule.out === 'function'
          ? rule.out(text, userName, aiName)
          : fillTemplate(rule.out, userName, aiName);
        return `[NARRATOR]: ${body}`;
      }
    }
    return null;
  }

  /* ── Platform adapters ──────────────────────────────────────────────
   *
   * Each adapter exposes:
   *   name              'arousr' | 'onlyfans' | 'fansly'
   *   getUserName()     partner display name
   *   getAiName()       creator/AI display name
   *   getAllChatNodes()  ordered array of all message nodes (for full copy)
   *   buildChatLine(node, userName, aiName, dateOf) -> string | null
   *   getMsgDatetime(node, dateOf?) -> number | null   Unix-ms timestamp
   *   selectedSelector  CSS selector for .ac-selected nodes
   *   deselectSelector  CSS selector for .closest() on deselect
   *   getHeaderBar()    action bar element or null
   *   getHeaderRef(bar) element to insertBefore in bar (null = append)
   *   getTextarea()     message textarea or null
   *   copyables         array of copyable-element config entries (see scan())
   * ─────────────────────────────────────────────────────────────────── */

  function makeArousrAdapter() {
    const NAME_SELECTORS = [
      '.ar_head_details h4', '.ar_head_details .name', '.ar_head_details span',
      '.ar-chat-head h4', '.ar-chat-head .name', '.chat-head-name',
      '[class*="chat-head"] h4', '[class*="customer"] h4',
    ];
    return {
      name: 'arousr',
      getUserName() {
        for (const sel of NAME_SELECTORS) {
          const el = document.querySelector(sel);
          if (el) { const t = el.textContent.trim(); if (t && t.length < 60) return t; }
        }
        return 'User';
      },
      getAiName() { return 'Lilith'; },
      getAllChatNodes() {
        return Array.from(document.querySelectorAll(
          '.ar_incoming_msg_box, .ar_outgoing_msg_box, .system_msg_container'
        ));
      },
      getMsgDatetime(node, dateOf) {
        if (node.classList.contains('system_msg_container')) return null;
        const isIn   = node.classList.contains('ar_incoming_msg_box');
        const sel    = isIn ? '.chatInMsgTime' : '.sysMsgTime, .chatOutMsgTime';
        const timeEl = node.querySelector(sel);
        const time   = timeEl?.textContent?.trim() || '';
        if (!time) return null;
        const dateLabel = dateOf?.get(node) || '';
        const dateStr   = dateLabel ? `${dateLabel} ${time}` : time;
        return parseTimeOrDefault(dateStr);
      },
      buildChatLine(node, userName, aiName, dateOf) {
        if (node.classList.contains('system_msg_container')) {
          return narratorSystemLine(node, userName, aiName);
        }
        const isIn   = node.classList.contains('ar_incoming_msg_box');
        const textEl = node.querySelector('.messageText');
        const t      = (textEl?.innerText || textEl?.textContent || '').trim();
        if (t) {
          const who  = isIn ? `[${aiName}]` : `[${userName}]`;
          const dt   = this.getMsgDatetime(node, dateOf);
          return `${formatWithDatetime(who, dt)}: ${t}`;
        }
        return narratorMediaLine(node, userName, aiName);
      },
      selectedSelector: '.ar_incoming_msg_box.ac-selected, .ar_outgoing_msg_box.ac-selected, .system_msg_container.ac-selected',
      deselectSelector: '.ar_incoming_msg_box, .ar_outgoing_msg_box, .system_msg_container',
      getHeaderBar()    { return document.querySelector('.ar-chat-head-right-action'); },
      getHeaderRef(bar) {
        const fav = bar.querySelector('.fav-icon-wrap-call-chat');
        if (!fav) return null;
        let ref = fav;
        while (ref.parentElement !== bar) { ref = ref.parentElement; if (!ref) return null; }
        return ref;
      },
      getTextarea() { return document.querySelector('.type_msg textarea.write_msg'); },
      copyables: [
        {
          selector:   '.ar_incoming_msg_box',
          doneAttr:   'data-ac-done',
          selectable: true,
          getText(node) {
            const textEl = node.querySelector('.messageText');
            const t = (textEl?.innerText || textEl?.textContent || '').trim();
            return t || narratorMediaLine(node, ADAPTER.getUserName(), 'Lilith');
          },
          inject(node, btn, cb) {
            const statusEl = node.querySelector('.chat-status');
            if (!statusEl) return;
            const creditEl = node.querySelector('.creditValueClass');
            if (creditEl) {
              if (!statusEl.contains(creditEl)) statusEl.appendChild(creditEl);
              creditEl.style.setProperty('position', 'static', 'important');
              creditEl.style.setProperty('bottom',   'auto',   'important');
              creditEl.style.setProperty('top',      'auto',   'important');
              creditEl.style.setProperty('left',     'auto',   'important');
              creditEl.style.setProperty('right',    'auto',   'important');
              creditEl.style.setProperty('width',    'auto',   'important');
              creditEl.style.setProperty('transform','none',   'important');
              creditEl.insertAdjacentElement('afterend', btn);
              if (cb) btn.insertAdjacentElement('afterend', cb);
            } else {
              statusEl.appendChild(btn);
              if (cb) statusEl.appendChild(cb);
            }
          },
        },
        {
          selector:   '.ar_outgoing_msg_box',
          doneAttr:   'data-ac-done',
          selectable: true,
          getText(node) {
            const textEl = node.querySelector('.messageText');
            const t = (textEl?.innerText || textEl?.textContent || '').trim();
            return t || narratorMediaLine(node, ADAPTER.getUserName(), 'Lilith');
          },
          inject(node, btn, cb) {
            const sentMsg  = node.querySelector('.sent_msg');
            const timeEl   = node.querySelector('.chatOutMsgTime');
            const statusEl = node.querySelector('.chat-status');
            const textEl   = node.querySelector('.messageText');
            if (sentMsg && timeEl && statusEl && textEl) {
              const row = document.createElement('div');
              row.className = 'ac-status-row';
              sentMsg.appendChild(row);
              row.appendChild(timeEl);
              row.appendChild(statusEl);
              row.appendChild(btn);
              if (cb) row.appendChild(cb);
            } else {
              const target = statusEl || node;
              target.classList.add('ac-extra-host');
              const row = document.createElement('span');
              row.className = 'ac-extra-row';
              row.appendChild(btn);
              if (cb) row.appendChild(cb);
              target.appendChild(row);
            }
          },
        },
        {
          selector:   '.system_msg_container',
          doneAttr:   'data-ac-sys-done',
          selectable: true,
          getText(node)     { return narratorSystemLine(node, ADAPTER.getUserName(), 'Lilith'); },
          getCopyText(node) { return (node.querySelector('.messageText')?.textContent || '').trim() || null; },
          inject(node, btn, cb) {
            node.classList.add('ac-extra-host');
            const timeEl = node.querySelector('.sysMsgTime');
            const footer = document.createElement('div');
            footer.className = 'ac-sys-footer';
            if (timeEl) footer.appendChild(timeEl);
            footer.appendChild(btn);
            if (cb) footer.appendChild(cb);
            node.appendChild(footer);
          },
        },
      ],
    };
  }

  /* -----------------------------------------------------------------
   * OnlyFans adapter
   * TODO: received-media selectors (no examples in saved HTML snapshot)
   * TODO: purchase/tip system messages (none observed in snapshot)
   * TODO: wave btn — message input may be contenteditable; falls back to clipboard
   * ----------------------------------------------------------------- */
  function makeOnlyFansAdapter() {
    // Operate on individual .b-chat__message bubbles, not the outer .b-chat__item-message
    // wrapper, because OF groups consecutive same-sender messages into one wrapper with
    // multiple bubbles — querySelector on the wrapper would only ever find the first one.
    const MSG_SEL = '.b-chat__item-message .b-chat__message:not(.b-chat__message__system)';

    function getMsgText(msgEl) {
      // For reply messages, skip the quoted text inside .b-chat__replied-message
      const replied = msgEl.querySelector('.b-chat__replied-message');
      if (replied) {
        const wrapper = msgEl.querySelector('.b-chat__replied-message ~ [at-attr="message_text"]');
        if (!wrapper) return '';
        const ps = wrapper.querySelectorAll('p');
        if (ps.length) return Array.from(ps).map(p => p.innerText || p.textContent || '').join('\n').trim();
        return wrapper.innerText?.trim() || '';
      }
      const ps = msgEl.querySelectorAll('.b-chat__message__text-holder p, [at-attr="message_text"] p');
      if (ps.length) return Array.from(ps).map(p => p.innerText || p.textContent || '').join('\n').trim();
      const holder = msgEl.querySelector('.b-chat__message__text-holder');
      if (holder) return holder.innerText?.trim() || '';
      return '';
    }
    function hasMedia(msgEl) {
      return msgEl.classList.contains('m-has-media')
          || !!msgEl.querySelector('.b-chat__message__media-wrapper, .b-chat__message__files-wrapper');
    }
    function isOut(msgEl) { return msgEl.classList.contains('m-from-me'); }
    function getMediaText(msgEl) {
      const who  = isOut(msgEl) ? ADAPTER.getAiName() : ADAPTER.getUserName();
      const type = msgEl.classList.contains('m-photo') ? 'an image'
                 : msgEl.classList.contains('m-video') ? 'a video'
                 : 'media';
      return `${who} sent ${type}.`;
    }

    return {
      name: 'onlyfans',
      getUserName() {
        return document.querySelector(
          '.b-chat__header__title .g-user-name, .b-chat__header .g-user-name'
        )?.textContent?.trim() || 'User';
      },
      getAiName() { return 'Me'; },
      getAllChatNodes() {
        return Array.from(document.querySelectorAll(MSG_SEL));
      },
      getMsgDatetime(msgEl, dateOf) {
        const group = msgEl.closest('.b-chat__item-message');
        // Try current message, sibling walk, then any message in the same group
        // (OnlyFans clusters messages sent within minutes, showing the time
        // element only on the last message of the cluster).
        let timeEl = msgEl.querySelector('.b-chat__message__time');
        if (!timeEl) {
          let sib = msgEl.nextElementSibling;
          while (sib && !sib.classList.contains('b-chat__message__time')) {
            sib = sib.nextElementSibling;
          }
          timeEl = sib;
        }
        if (!timeEl && group) {
          timeEl = group.querySelector('.b-chat__message__time');
        }
        // Use span[title] to skip our injected .ac-sel-group span
        const timeSpan = timeEl?.querySelector('span[title]');
        const time     = timeSpan?.textContent?.trim();
        if (!time) return null;
        // Pre-scan date via dateOf (Arousr-style)
        const dateLabel = dateOf?.get(msgEl) || '';
        if (dateLabel) {
          return parseTimeOrDefault(`${dateLabel} ${time}`);
        }
        // Fallback: date from system timeline inside .b-chat__item-message
        let dateStr = time;
        if (group) {
          const sysTime = group.querySelector('.b-chat__messages__time span[title]');
          if (sysTime) {
            const title = sysTime.getAttribute('title'); // "Jun 15, 12:00 am"
            const dateOnly = title?.split(',')[0]?.trim(); // "Jun 15"
            if (dateOnly) dateStr = `${dateOnly} ${time}`;
          }
        }
        return parseTimeOrDefault(dateStr);
      },
      buildChatLine(msgEl, userName, aiName, dateOf) {
        const t    = getMsgText(msgEl);
        const out  = isOut(msgEl);
        const who  = out ? `[${aiName}]` : `[${userName}]`;
        const name = out ? aiName : userName;
        const dt   = this.getMsgDatetime(msgEl, dateOf);
        const lines = [];

        // Reply context
        const replied = msgEl.querySelector('.b-chat__replied-message');
        if (replied) {
          const quotedAuthor = replied.querySelector('.b-username')?.textContent?.trim() || '?';
          const quotedTextEl = replied.querySelector('.b-chat__message__text-holder');
          let quotedText = quotedTextEl?.textContent?.trim() || '';
          quotedText = quotedText.replace(/^["\u201C\u201D\s]+|["\u201C\u201D\s]+$/g, '').trim();
          if (quotedText) {
            lines.push(`${formatWithDatetime('[NARRATOR]', dt)}: ${name} replies to the message of ${quotedAuthor} where they said "${quotedText}"`);
          } else {
            lines.push(`${formatWithDatetime('[NARRATOR]', dt)}: ${name} replies to the message of ${quotedAuthor}`);
          }
        }

        if (hasMedia(msgEl)) {
          const type = msgEl.classList.contains('m-photo') ? 'an image'
                     : msgEl.classList.contains('m-video') ? 'a video' : 'media';
          lines.push(`[NARRATOR]: ${name} sent ${type}.`);
        }
        if (t) lines.push(`${formatWithDatetime(who, dt)}: ${t}`);
        return lines.length ? lines.join('\n') : null;
      },
      selectedSelector: `${MSG_SEL.replace(':not(.b-chat__message__system)', '')}.ac-selected`,
      deselectSelector: MSG_SEL,
      getHeaderBar()    { return document.querySelector('.b-chat__subheader'); },
      getHeaderRef(bar) { return bar.firstElementChild || null; },
      getTextarea() {
        return document.querySelector(
          '.b-chat__message-input textarea, [at-attr="message_input"] textarea, .b-text-editor'
        );
      },
      copyables: [
        {
          selector:   MSG_SEL,
          doneAttr:   'data-ac-done',
          selectable: true,
          getText(msgEl) {
            const t = getMsgText(msgEl);
            if (t) return t;                        // text-only or mixed (inject handles image)
            if (hasMedia(msgEl)) return getMediaText(msgEl);  // media-only
            return null;
          },
          inject(msgEl, btn, cb) {
            const isMixed = !!(getMsgText(msgEl) && hasMedia(msgEl));

            // For mixed messages add a separate image button after the media wrapper
            if (isMixed) {
              const mediaWrapper = msgEl.querySelector('.b-chat__message__media-wrapper');
              if (mediaWrapper) {
                const imgBtn = makeCopyBtn(() => getMediaText(msgEl));
                const imgCb  = makeCheckbox(msgEl);
                const row    = document.createElement('div');
                const justify = isOut(msgEl) ? 'flex-end' : 'flex-start';
                row.style.cssText = `display:flex;width:100%;justify-content:${justify};gap:4px;padding:2px 4px;`;
                row.appendChild(imgBtn);
                row.appendChild(imgCb);
                mediaWrapper.after(row);
              }
            }

            // Text button (or sole media button) goes in the time element
            // Use the last .b-chat__message__time to skip the one inside .b-chat__replied-message
            const timeEls = msgEl.querySelectorAll('.b-chat__message__time');
            const timeEl = timeEls.length ? timeEls[timeEls.length - 1] : null;
            if (timeEl) {
              if (isOut(msgEl)) {
                // Own messages: button + checkbox before timestamp
                if (cb) timeEl.insertBefore(cb, timeEl.firstChild);
                timeEl.insertBefore(btn, timeEl.firstChild);
              } else {
                timeEl.appendChild(btn);
                if (cb) timeEl.appendChild(cb);
              }
            } else {
              msgEl.appendChild(btn);
              if (cb) msgEl.appendChild(cb);
            }
          },
        },
      ],
    };
  }

  /* -----------------------------------------------------------------
   * Fansly adapter
   * TODO: per-message timestamps — .message-time is per group, not per bubble
   * TODO: locked/purchased content selectors (none observed in snapshot)
   * TODO: wave btn — Angular input selector unknown; falls back to clipboard
   * ----------------------------------------------------------------- */
  function makeFanslyAdapter() {
    // Returns the .message-text-wrapper that is a DIRECT child of the OUTER
    // .message-reply-wrapper, skipping the nested one inside a quoted reply bubble.
    function getOwnTextWrapper(node) {
      const outerRW = Array.from(node.children)
        .find(el => el.classList.contains('message-reply-wrapper'));
      if (!outerRW) return null;
      return Array.from(outerRW.children)
        .find(el => el.classList.contains('message-text-wrapper')) || null;
    }

    // Text of the actual message, not any quoted snippet.
    function getOwnText(node) {
      const tw  = getOwnTextWrapper(node);
      const src = tw || node;
      return (src.querySelector('.message-text')?.innerText || '').trim() || null;
    }

    // Returns the nested quoted-message element for reply messages, or null.
    function getQuotedMessage(node) {
      const outerRW = Array.from(node.children)
        .find(el => el.classList.contains('message-reply-wrapper'));
      return outerRW?.querySelector('app-group-message.message-reply') || null;
    }

    // Probe app-tip for tip content, handling potential Angular shadow DOM.
    function getTipInfo(node) {
      const tipEl = node.querySelector('app-tip');
      if (!tipEl) return null;
      const root  = tipEl.shadowRoot || tipEl;
      const name  = root.querySelector('.display-name')?.textContent?.trim()
                 || node.querySelector('app-account-username .display-name')?.textContent?.trim()
                 || ADAPTER.getUserName();
      const amt   = root.querySelector('app-balance-display')?.textContent?.trim()
                 || tipEl.querySelector?.('app-balance-display')?.textContent?.trim()
                 || '?';
      return { name, amt };
    }

    // Plain-text copy label for a media embed (no [NARRATOR] prefix — that's for buildChatLine).
    function getImageCopyText(node) {
      const isOut   = node.classList.contains('my-message');
      const isVideo = !!node.querySelector('video, .video-element');
      const who     = isOut ? ADAPTER.getAiName() : ADAPTER.getUserName();
      return `${who} sent ${isVideo ? 'a video' : 'an image'}.`;
    }

    // Shared helpers for building injected bar elements.
    function makeFBar(isOut) {
      const d = document.createElement('div');
      d.className = 'ac-fansly-bar' + (isOut ? ' ac-my-msg' : '');
      return d;
    }
    function makeFBtnRow(btn, cb) {
      const s = document.createElement('span');
      s.className = 'ac-fansly-btn-row';
      s.appendChild(btn);
      if (cb) s.appendChild(cb);
      return s;
    }

    // After layout, align button bar's inner edge with the message bubble edge + 10 px inward.
    // Uses getBoundingClientRect so nesting depth of bar doesn't matter.
    function alignBar(bar, node, isOut) {
      requestAnimationFrame(() => {
        // Visual bubble: prefer a non-embed .message; fall back to .message.embed for media-only.
        const bubble = node.querySelector('.message:not(.embed)')
                    || node.querySelector('.message.embed');
        if (!bubble) return;
        const barRect = bar.getBoundingClientRect();
        const bubRect = bubble.getBoundingClientRect();
        if (!barRect.width) return; // not yet painted
        if (isOut) {
          // How far the bar's right edge overshoots the bubble's right edge, plus 10 px gap.
          const excess = (barRect.right - bubRect.right) + 10;
          if (excess > 0) bar.style.paddingRight = excess + 'px';
        } else {
          // How far the bubble's left edge is from the bar's left edge, plus 10 px gap.
          const excess = (bubRect.left - barRect.left) + 10;
          if (excess > 0) bar.style.paddingLeft = excess + 'px';
        }
      });
    }

    // Place a bar (and optionally absorb tap-backs alongside it).
    function placeBar(bar, btnRow, container, tapBacks, hasReactions) {
      if (hasReactions) {
        tapBacks.parentElement.insertBefore(bar, tapBacks);
        bar.appendChild(tapBacks);
        bar.appendChild(btnRow);
      } else {
        bar.appendChild(btnRow);
        container.appendChild(bar);
      }
    }

    return {
      name: 'fansly',
      getUserName() {
        return document.querySelector(
          '.message-content-header-contact .display-name'
        )?.textContent?.trim() || 'User';
      },
      getAiName() {
        // Try to read the logged-in creator's display name from the account nav area.
        return document.querySelector(
          '.my-account .display-name, app-account-icon .display-name, ' +
          '.account-nav .display-name, .nav-account .display-name'
        )?.textContent?.trim() || 'Me';
      },
      getAllChatNodes() {
        return Array.from(document.querySelectorAll('app-group-message.message'));
      },
      getMsgDatetime(node) {
        // Try: sibling → parent's next sibling → collection → inside node
        let sib = node.nextElementSibling;
        while (sib && !sib.classList.contains('timestamp')) sib = sib.nextElementSibling;
        let timeEl = sib;
        // Fansly: timestamp is a sibling of the parent flex-col, not of app-group-message
        if (!timeEl && node.parentElement) {
          sib = node.parentElement.nextElementSibling;
          while (sib && !sib.classList.contains('timestamp')) sib = sib.nextElementSibling;
          timeEl = sib;
        }
        if (!timeEl) timeEl = node.closest('app-group-message-collection')?.querySelector('.timestamp');
        if (!timeEl) timeEl = node.querySelector('time, [class*=time]');
        const timeSpan = timeEl?.classList?.contains('margin-right-text') ? timeEl : timeEl?.querySelector('.margin-right-text');
        const time     = timeSpan?.textContent?.trim();
        if (!time) return null;
        return parseTimeOrDefault(time);
      },
      buildChatLine(node, userName, aiName) {
        const isOut = node.classList.contains('my-message');
        const who   = isOut ? `[${aiName}]` : `[${userName}]`;
        const dt    = this.getMsgDatetime(node);

        // Tip received from fan
        const tip = getTipInfo(node);
        if (tip) return `[NARRATOR]: ${tip.name} sent a ${tip.amt} tip.`;

        const ownText = getOwnText(node);
        const hasEmbed = !!node.querySelector('.message.embed');
        const lines = [];

        if (ownText) {
          // Reply context
          const quoted = getQuotedMessage(node);
          if (quoted) {
            const quotedText   = (quoted.querySelector('.message-text')?.textContent || '').trim();
            const quotedAuthor = quoted.querySelector('.reply-footer .display-name')?.textContent?.trim() || '?';
            lines.push(`${formatWithDatetime('[NARRATOR]', dt)}: ${isOut ? aiName : userName} replies to the message of ${quotedAuthor} where they said "${quotedText}"`);
          }
          lines.push(`${formatWithDatetime(who, dt)}: ${ownText}`);
        }

        // Image / video — appears whether or not there is also text (mixed messages)
        if (hasEmbed) {
          const isVideo = !!node.querySelector('video, .video-element');
          lines.push(`[NARRATOR]: ${isOut ? aiName : userName} sent ${isVideo ? 'a video' : 'an image'}.`);
        }

        return lines.length ? lines.join('\n') : null;
      },
      selectedSelector: 'app-group-message.message.ac-selected',
      deselectSelector: 'app-group-message.message',
      getHeaderBar() {
        const el = document.querySelector('.feed-item-actions.more-dropdown, [appxddropdown].more-dropdown');
        return el ? el.parentElement : null;
      },
      getHeaderRef(bar) {
        return bar.querySelector('.feed-item-actions, [appxddropdown]') || null;
      },
      getTextarea() {
        return document.querySelector(
          'app-message-send-area textarea, textarea.message-input, .message-input-container textarea'
        );
      },
      copyables: [
        {
          selector:   'app-group-message.message',
          doneAttr:   'data-ac-done',
          selectable: true,
          getText(node) {
            // Tip (detect via app-tip element, handles shadow DOM)
            const tip = getTipInfo(node);
            if (tip) return `${tip.name} sent a ${tip.amt} tip.`;
            // Text takes priority; inject() will add a separate image button when both coexist.
            const ownText = getOwnText(node);
            if (ownText) return ownText;
            // Image / video only
            if (node.querySelector('.message.embed')) return getImageCopyText(node);
            return null;
          },
          inject(node, btn, cb) {
            const isOut = node.classList.contains('my-message');

            // Find the correct container: the .message-text-wrapper that is a DIRECT child
            // of the outer .message-reply-wrapper (not the one inside the quoted bubble).
            // Media/tip messages have no .message-text-wrapper; fall back to outerRW.
            const outerRW = Array.from(node.children)
              .find(el => el.classList.contains('message-reply-wrapper'));
            const textWrapper = outerRW
              ? Array.from(outerRW.children).find(el => el.classList.contains('message-text-wrapper'))
              : null;
            const container = textWrapper || outerRW || node;

            const tapBacks     = Array.from(container.children)
              .find(el => el.classList?.contains('tap-backs'));
            const hasReactions = tapBacks && !!tapBacks.querySelector('.liked-type');

            const ownText  = getOwnText(node);
            const embedEl  = node.querySelector('.message.embed');
            const isMixed  = !!(ownText && embedEl);

            if (isMixed) {
              // Mixed message: image bar immediately after the embed element,
              // text bar immediately after the text element's parent (.message).
              const imgBtn = makeCopyBtn(() => getImageCopyText(node));
              const imgCb  = makeCheckbox(node);
              const imgBar = makeFBar(isOut);
              imgBar.appendChild(makeFBtnRow(imgBtn, imgCb));
              embedEl.after(imgBar);
              alignBar(imgBar, node, isOut);

              const textEl     = container.querySelector('.message-text');
              const textAnchor = textEl ? textEl.parentElement : null; // the .message element
              const textBar    = makeFBar(isOut);
              textBar.appendChild(makeFBtnRow(btn, cb));
              if (textAnchor) textAnchor.after(textBar);
              else container.appendChild(textBar);
              alignBar(textBar, node, isOut);
            } else {
              // Single content — text, image-only, or tip
              const primaryBar = makeFBar(isOut);
              placeBar(primaryBar, makeFBtnRow(btn, cb), container, tapBacks, hasReactions);
              alignBar(primaryBar, node, isOut);
            }
          },
        },
      ],
    };
  }

  /* -----------------------------------------------------------------
   * Loyalfans adapter
   * TODO: media messages (no examples in saved HTML snapshot)
   * TODO: tips/purchases (not observed in snapshot)
   * ----------------------------------------------------------------- */
  function makeLoyalfansAdapter() {
    const MSG_SEL = 'app-message';

    function getMsgText(node) {
      const textEl = node.querySelector('._message');
      if (textEl) return textEl.innerText?.trim() || '';
      return '';
    }

    function isOut(node) { return node.classList.contains('own'); }

    function getReplyPreview(node) {
      return node.querySelector('app-reply-preview');
    }

    return {
      name: 'loyalfans',
      getUserName() {
        const el = document.querySelector('.window-title.user-display-name');
        if (el) {
          const clone = el.cloneNode(true);
          const handle = clone.querySelector('.user-handle');
          if (handle) handle.remove();
          return clone.textContent?.trim() || 'User';
        }
        return 'User';
      },
      getAiName() { return 'Me'; },
      getAllChatNodes() {
        return Array.from(document.querySelectorAll(MSG_SEL));
      },
      getMsgDatetime(node, dateOf) {
        const timeEl = node.querySelector('.message-text time');
        const time   = timeEl?.textContent?.trim();
        if (!time) return null;
        const clean = time.replace(/[✓✗\s]+$/g, '').trim();
        const dateLabel = dateOf?.get(node) || '';
        if (dateLabel) return parseTimeOrDefault(`${dateLabel} ${clean}`);
        return parseTimeOrDefault(clean);
      },
      buildChatLine(node, userName, aiName, dateOf) {
        const t    = getMsgText(node);
        const out  = isOut(node);
        const who  = out ? `[${aiName}]` : `[${userName}]`;
        const name = out ? aiName : userName;
        const dt   = this.getMsgDatetime(node, dateOf);
        const lines = [];

        const reply = getReplyPreview(node);
        if (reply) {
          const quotedAuthor = reply.querySelector('.sender-name')?.textContent?.trim() || '?';
          const quotedText   = reply.querySelector('.text.has-text')?.textContent?.trim() || '';
          if (quotedText) {
            lines.push(`${formatWithDatetime('[NARRATOR]', dt)}: ${name} replies to the message of ${quotedAuthor} where they said "${quotedText}"`);
          } else {
            lines.push(`${formatWithDatetime('[NARRATOR]', dt)}: ${name} replies to the message of ${quotedAuthor}`);
          }
        }

        if (t) lines.push(`${formatWithDatetime(who, dt)}: ${t}`);
        return lines.length ? lines.join('\n') : null;
      },
      selectedSelector: `${MSG_SEL}.ac-selected`,
      deselectSelector: MSG_SEL,
      getHeaderBar() {
        return document.querySelector('.window-actions-left');
      },
      getHeaderRef() {
        return null; // append at end, after user-name + follower
      },
      getTextarea() {
        return document.querySelector('textarea#message-input');
      },
      copyables: [
        {
          selector:   MSG_SEL,
          doneAttr:   'data-ac-done',
          selectable: true,
          getText(node) {
            return getMsgText(node) || null;
          },
          inject(node, btn, cb) {
            const footer = node.querySelector('.message-footer');
            if (footer) {
              const row = document.createElement('span');
              row.className = 'ac-lf-row';
              row.appendChild(btn);
              if (cb) row.appendChild(cb);
              // Own messages (right-aligned): buttons before timestamp
              // Other messages (left-aligned):  buttons after timestamp
              if (node.classList.contains('own')) {
                footer.insertBefore(row, footer.firstChild);
              } else {
                footer.appendChild(row);
              }
            } else {
              const textArea = node.querySelector('.message-text');
              if (textArea) { textArea.appendChild(btn); if (cb) textArea.appendChild(cb); }
              else          { node.appendChild(btn);  if (cb) node.appendChild(cb); }
            }
          },
        },
      ],
    };
  }

  function detectPlatform() {
    const h = location.hostname;
    if (h.includes('onlyfans.com')) return makeOnlyFansAdapter();
    if (h.includes('fansly.com'))   return makeFanslyAdapter();
    if (h.includes('loyalfans.com') || h.includes('loyalfans')) return makeLoyalfansAdapter();
    return makeArousrAdapter();
  }

  /* ── Clipboard helper ───────────────────────────────────────────────── */

  function execCommandCopy(text) {
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:0;left:0;width:2px;height:2px;opacity:0;pointer-events:none;';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('execCommand copy failed'));
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function toClipboard(text) {
    if (typeof GM_setClipboard !== 'undefined') {
      try { GM_setClipboard(text); return Promise.resolve(); } catch (_) {}
    }
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text).catch(() => execCommandCopy(text));
    }
    return execCommandCopy(text);
  }

  /* ── Version overlay (hidden — uncomment addVersionBadge() in init() to show) ── */

  GM_addStyle(`.ac-version-badge{position:fixed;bottom:8px;right:8px;z-index:99999;background:rgba(0,0,0,.7);color:#0f0;font:bold 12px/1 monospace;padding:3px 7px;border-radius:4px;pointer-events:none;}`);

  function addVersionBadge() {
    const el = document.createElement('div');
    el.className = 'ac-version-badge';
    el.textContent = GM_info.script.version;
    document.body.appendChild(el);
  }

  function flash(btn, checkSvg) {
    const saved = btn.innerHTML;
    const prevOpacity = btn.style.opacity;
    btn.innerHTML = checkSvg;
    btn.style.opacity = '1';
    setTimeout(() => {
      btn.innerHTML = saved;
      btn.style.opacity = prevOpacity;
    }, 900);
  }

  /* ── Selection state ───────────────────────────────────────────────── */

  function getSelectedBoxes() {
    return Array.from(document.querySelectorAll(ADAPTER.selectedSelector));
  }

  function updateSelectionMode() {
    document.body.classList.toggle('ac-selecting', !!document.querySelector('.ac-msg-cb:checked'));
  }

  /* ── Unified copy-button engine ────────────────────────────────────── */

  function makeCopyBtn(getText) {
    const btn = document.createElement('button');
    btn.className = 'ac-msg-btn';
    btn.title = 'Copy message';
    btn.innerHTML = SVG_MSG_COPY;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = getText();
      if (text) toClipboard(text).then(() => flash(btn, SVG_CHECK_SM)).catch(() => {});
    });
    return btn;
  }

  function makeRangeBtn(dir, node) {
    const btn = document.createElement('button');
    btn.className = 'ac-range-btn';
    btn.textContent = dir === 'up' ? '▲' : '▼';
    btn.title = dir === 'up'
      ? 'Toggle selection: this message and all above'
      : 'Toggle selection: this message and all below';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      // Collect all processed selectable nodes in DOM order.
      const all = Array.from(document.querySelectorAll(ADAPTER.deselectSelector))
        .filter(n => n.hasAttribute('data-ac-done') || n.hasAttribute('data-ac-sys-done'));
      const idx = all.indexOf(node);
      if (idx < 0) return;
      const range    = dir === 'up' ? all.slice(0, idx + 1) : all.slice(idx);
      const toSelect = !node.classList.contains('ac-selected');
      range.forEach(n => {
        n.classList.toggle('ac-selected', toSelect);
        const chk = n.querySelector('input.ac-msg-cb');
        if (chk) chk.checked = toSelect;
      });
      updateSelectionMode();
    });
    return btn;
  }

  function makeCheckbox(node) {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'ac-msg-cb';
    cb.title = 'Select message';
    cb.addEventListener('change', () => {
      node.classList.toggle('ac-selected', cb.checked);
      updateSelectionMode();
    });
    // Wrap checkbox with ▲ / ▼ range-select buttons
    const grp = document.createElement('span');
    grp.className = 'ac-sel-group';
    grp.appendChild(makeRangeBtn('up',   node));
    grp.appendChild(cb);
    grp.appendChild(makeRangeBtn('down', node));
    return grp;
  }

  function scan() {
    for (const entry of ADAPTER.copyables) {
      // Virtual-scroll reuse: a node that was processed before may have had its subtree
      // rebuilt by the SPA (removing our injected buttons). Clear the done marker so the
      // node is reprocessed on this scan pass.
      // Scope to entry.selector so we don't accidentally clear markers set by other
      // parts of the script (e.g. the header bar's data-ac-done).
      document.querySelectorAll(`${entry.selector}[${entry.doneAttr}]`).forEach(node => {
        if (!node.querySelector('.ac-msg-btn')) node.removeAttribute(entry.doneAttr);
      });

      document.querySelectorAll(`${entry.selector}:not([${entry.doneAttr}])`).forEach(node => {
        node.setAttribute(entry.doneAttr, '1');
        const text = entry.getText(node);
        if (!text) return;
        const getClip = entry.getCopyText ? () => entry.getCopyText(node) : () => entry.getText(node);
        const btn = makeCopyBtn(getClip);
        const cb  = entry.selectable ? makeCheckbox(node) : null;
        entry.inject(node, btn, cb);
      });
    }
  }

  /* ── Chat text builder ──────────────────────────────────────────────── */

  function buildChat(realNames, nodes) {
    const userName = realNames ? ADAPTER.getUserName() : 'USER';
    const aiName   = realNames ? ADAPTER.getAiName()   : 'AI';
    const allNodes = nodes || ADAPTER.getAllChatNodes();
    if (!allNodes.length) return '';

    // Datetime pre-scan (Arousr / OnlyFans)
    const dateOf = new Map();
    if (ADAPTER.name === 'arousr') {
      const all = document.querySelectorAll('.infinite-scroll-component');
      const root = all.length > 1 ? all[1] : all[0];
      if (root) {
        let curDate = '';
        const els = root.querySelectorAll('.dateTimeStampChat, .ar_incoming_msg_box, .ar_outgoing_msg_box');
        for (const el of els) {
          if (el.classList.contains('dateTimeStampChat')) {
            const t = el.textContent.trim();
            if (t) curDate = normalizeDateStamp(t);
          } else {
            dateOf.set(el, curDate);
          }
        }
      }
    } else if (ADAPTER.name === 'onlyfans') {
      const items = [];
      document.querySelectorAll('.b-chat__message__system.m-timeline').forEach(el => items.push({el, kind: 'date'}));
      document.querySelectorAll('.b-chat__messages__time').forEach(el => {
        if (!el.closest('.b-chat__message__system.m-timeline')) items.push({el, kind: 'date'});
      });
      document.querySelectorAll('.b-chat__item-message .b-chat__message:not(.b-chat__message__system)').forEach(el => items.push({el, kind: 'msg'}));
      items.sort((a, b) => a.el === b.el ? 0 : (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
      let curDate = '';
      for (const {el, kind} of items) {
        if (kind === 'date') {
          const span = el.querySelector('span[title]');
          const title = span?.getAttribute('title') || '';
          if (title) {
            const text = span.textContent.trim();
            const abbrYear = text.match(/'(\d{2})$/);
            const dateInput = abbrYear ? `${title.split(',')[0].trim()}, ${2000 + parseInt(abbrYear[1])}` : title;
            curDate = normalizeDateStamp(dateInput);
          }
        } else {
          dateOf.set(el, curDate);
        }
      }
    } else if (ADAPTER.name === 'loyalfans') {
      const items = [];
      document.querySelectorAll('.message-date').forEach(el => items.push({el, kind: 'date'}));
      document.querySelectorAll('app-message').forEach(el => items.push({el, kind: 'msg'}));
      items.sort((a, b) => a.el === b.el ? 0 : (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
      let curDate = '';
      for (const {el, kind} of items) {
        if (kind === 'date') {
          const t = el.textContent.trim();
          if (t) curDate = normalizeDateStamp(t);
        } else {
          dateOf.set(el, curDate);
        }
      }
    }

    const lines = allNodes
      .map(node => ADAPTER.buildChatLine(node, userName, aiName, dateOf))
      .filter(Boolean);

    // First-message datetime for the opening NARRATOR line (dice mode only)
    let firstDt = null;
    if (!nodes && allNodes.length) {
      const firstMsg = ADAPTER.name === 'arousr'
        ? allNodes.find(n => !n.classList.contains('system_msg_container'))
        : allNodes[0];
      if (firstMsg) firstDt = ADAPTER.getMsgDatetime?.(firstMsg, dateOf) ?? null;
    }

    // In dice mode, swap USER/AI inside NARRATOR content only — headers stay [USER]/[AI].
    if (!realNames) {
      const header = !nodes ? `${formatWithDatetime('[NARRATOR]', firstDt)}: {{user}} and {{char}} started a virtual chat in ${location.href}\n` : '';
      const body   = lines.map(line =>
        line.replace(/\bUSER\b/g, '{{user}}').replace(/\bAI\b/g, '{{char}}')
            .replace(/\[{{user}}/g, '[USER').replace(/\[{{char}}/g, '[AI')
      ).join('\n');
      return `${header}${body}`;
    }
    return lines.join('\n');
  }

  /* ── Header copy button injection ──────────────────────────────────── */

  function addHeaderButtons() {
    const bar = ADAPTER.getHeaderBar();
    if (!bar || bar.dataset.acDone) return;
    const ref = ADAPTER.getHeaderRef(bar);

    const deselectBtn = document.createElement('button');
    deselectBtn.className = 'ac-head-btn ac-deselect-btn';
    deselectBtn.title = 'Clear selection';
    deselectBtn.innerHTML = SVG_DESELECT;
    deselectBtn.addEventListener('click', () => {
      document.querySelectorAll('.ac-msg-cb:checked').forEach(cb => {
        cb.checked = false;
        cb.closest(ADAPTER.deselectSelector)?.classList.remove('ac-selected');
      });
      updateSelectionMode();
      flash(deselectBtn, SVG_CHECK_LG);
    });

    const waveBtn = document.createElement('button');
    waveBtn.className = 'ac-head-btn';
    waveBtn.title = 'Insert greeting message';
    waveBtn.innerHTML = SVG_WAVE;
    waveBtn.addEventListener('click', () => {
      const input = ADAPTER.getTextarea();
      if (input) {
        try {
          if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
            const setter = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype, 'value'
            ).set;
            setter.call(input, GREETING_TEXT);
            input.dispatchEvent(new Event('input', { bubbles: true }));
          } else if (input.isContentEditable) {
            input.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
            document.execCommand('insertText', false, GREETING_TEXT);
          }
          input.focus();
        } catch (_) {
          toClipboard(GREETING_TEXT);
        }
      } else {
        toClipboard(GREETING_TEXT);
      }
    });

    const namedBtn = document.createElement('button');
    namedBtn.className = 'ac-head-btn';
    namedBtn.title = 'Copy full chat  --  [UserName] / [AI name] / [NARRATOR]';
    namedBtn.innerHTML = SVG_NAMED_COPY;
    namedBtn.addEventListener('click', () => {
      const sel = getSelectedBoxes();
      toClipboard(buildChat(true, sel.length ? sel : null))
        .then(() => flash(namedBtn, SVG_CHECK_LG)).catch(() => {});
    });

    const diceBtn = document.createElement('button');
    diceBtn.className = 'ac-head-btn';
    diceBtn.title = 'Copy full chat  --  [USER] / [AI] / [NARRATOR]';
    diceBtn.innerHTML = SVG_DICE;
    diceBtn.addEventListener('click', () => {
      const sel = getSelectedBoxes();
      toClipboard(buildChat(false, sel.length ? sel : null))
        .then(() => flash(diceBtn, SVG_CHECK_LG)).catch(() => {});
    });
    // Left-to-right order: [deselect] [dice] [named] [wave] ...existing buttons...
    if (ref) {
      if (ADAPTER.name === 'onlyfans') {
        // Wrap buttons in a group so the whole block is right-aligned;
        // deselect appears as the first element without pushing Gallery/Find
        const grp = document.createElement('div');
        grp.style.cssText = 'display:flex;align-items:center;gap:6px;margin-left:auto;';
        grp.appendChild(deselectBtn);
        grp.appendChild(diceBtn);
        grp.appendChild(namedBtn);
        grp.appendChild(waveBtn);
        bar.insertBefore(grp, ref);
      } else {
        bar.insertBefore(waveBtn,     ref);
        bar.insertBefore(namedBtn,    waveBtn);
        bar.insertBefore(diceBtn,     namedBtn);
        bar.insertBefore(deselectBtn, diceBtn);
      }
    } else {
      if (ADAPTER.name === 'loyalfans') {
        // Push header buttons to the far right of the bar
        const grp = document.createElement('div');
        grp.style.cssText = 'display:flex;align-items:center;gap:6px;margin-left:auto;';
        grp.appendChild(deselectBtn);
        grp.appendChild(diceBtn);
        grp.appendChild(namedBtn);
        grp.appendChild(waveBtn);
        bar.appendChild(grp);
      } else {
        bar.appendChild(deselectBtn);
        bar.appendChild(diceBtn);
        bar.appendChild(namedBtn);
        bar.appendChild(waveBtn);
      }
    }

    bar.dataset.acDone = '1';
  }

  /* ── Boot -- resolve adapter before any observer callbacks fire ─────── */

  ADAPTER = detectPlatform();

  /* ── MutationObserver (SPA re-renders & new messages) ──────────────── */

  let rafPending = false;
  new MutationObserver(() => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      scan();
      const bar = ADAPTER.getHeaderBar();
      if (bar && !bar.dataset.acDone) addHeaderButtons();
    });
  }).observe(document.body, { childList: true, subtree: true });

  /* ── Init ───────────────────────────────────────────────────────────── */

  function init() {
    // addVersionBadge();  // uncomment to show version overlay
    scan();
    addHeaderButtons();
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 700);
  } else {
    window.addEventListener('load', () => setTimeout(init, 700));
  }

})();
