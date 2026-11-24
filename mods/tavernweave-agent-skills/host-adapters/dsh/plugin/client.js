/**
 * Mano divina · \u6d4f\u89c8\u5668\u534a\u4fa7\uff081.1.0\uff09
 *
 * \u90e8\u4ef6\u5168\u90e8\u6302\u5728 DSH \u5df2\u58f0\u660e\u7684\u5e2d\u4f4d\u4e0a\uff1a
 *   - shell.overlay                         \uff1aSkill \u8f6e\u76d8\uff08\u7f29\u7565\u6001\uff09+ \u5b8c\u6574\u6d6e\u7a97
 *       \u8f6e\u76d8\u6446\u5728\u5de6\u4fa7\u680f\u548c\u5bf9\u8bdd\u680f\u4e4b\u95f4\u7684\u7a7a\u767d\u91cc\uff0c\u53ea\u9732\u51fa\u4e00\u4e2a\u5de8\u5927\u5706\u76d8\u7684\u4e00\u6bb5\u5f27\uff1b\u5361\u7247\u6cbf\u5f27\u7ebf\u6392\u5e03\uff0c
 *       \u6eda\u8f6e / \u65b9\u5411\u952e / \u4e0a\u4e0b\u62d6\u52a8\u65cb\u8f6c\uff0c\u6280\u80fd\u4e4b\u540e\u7684\u4e0b\u4e00\u8f6e\u662fFunciones\u3002\u8c03\u7528\u4e2d\u7684 Skill \u9ad8\u4eae\u5e76\u8f6c\u5230\u4e2d\u95f4\u3002
 *       \u7a7a\u767d\u4e0d\u591f\u5bbd\u65f6\u6574\u4e2a\u8f6e\u76d8\u4e0d\u663e\u793a\uff0c\u4e0d\u538b\u5bf9\u8bdd\u3002\u51e0\u4f55\u6cbf\u7528\u6c99\u76d2 v22.1 \u5b9a\u7a3f\u3002
 *       \u5b8c\u6574\u6d6e\u7a97\u53ef\u62d6\u52a8\u3001\u53ef\u7f29\u653e\u3001\u4e0d\u5168\u5c4f\uff0c\u8bb0\u4f4f\u4f4d\u7f6e\u3001\u5c3a\u5bf8\u548c\u4e0a\u6b21\u9875\u7b7e\uff1b\u6536\u8d77\u540e\u56de\u5230\u8f6e\u76d8\u3002
 *   - conversation.session.header.utilities \uff1a\u4f1a\u8bdd\u5934\u7684Mano divina\u6309\u94ae\uff08\u5bbf\u4e3b\u539f\u751f Button + Tooltip\uff09\uff0cActivado\u5408\u5b8c\u6574\u6d6e\u7a97
 *       \u65c1\u8fb9\u8fd8Sí\u4e00\u4e2a\u8f6e\u76d8ActivadoDesactivado\uff1a\u663e\u793a/\u9690\u85cf\u5de6\u4fa7\u7684 Skill \u8f6e\u76d8\uff0c\u72b6\u6001\u5b58\u672c\u673a\uff1b\u65e7\u5b58\u50a8\u6ca1Sí\u8fd9\u4e2a\u5b57\u6bb5\u65f6\u6309\u663e\u793a\u5904\u7406
 *   - conversation.input.dock               \uff1a\u8f93\u5165\u680f\u4e0a\u65b9\u7684 Soul \u5c0f\u6d6e\u7a97\uff0c\u53f3\u5bf9\u9f50\uff0c\u4e0d\u5360Diseño
 *
 * \u6570\u636e\u90fd\u6765\u81ea\u771f\u5b9e\u5bbf\u4e3b\uff1a
 *   - Skill \u76ee\u5f55\uff1actx.remote.skills.list({ sessionId })\uff0c\u968f\u4f1a\u8bdd\u9884\u8bbe\u53d8\u5316
 *   - \u8c03\u7528\u72b6\u6001\u4e0e\u6b21\u6570\uff1a\u5c4f\u5e55\u4e0a\u4f1a\u8bdd\u7684\u4e8b\u4ef6\u6d41\u3002Llamada del modelo = tool/call(name=skill)\uff1bManual /\u540d\u5b57 = user/message(source.kind=skill-invocation)
 *     “\u8c03\u7528\u4e2d”\u6307\u8fd9\u6b21\u8c03\u7528\u6240\u5728\u7684\u8f6e\u6b21\u8fd8\u6ca1\u7ed3\u675f\uff08turn/start … turn/end\uff09
 *   - Soul\uff1a\u53d1\u9001 `/activate-tavernweave-soul <TW \u6307\u4ee4\u77ed\u8bed>`\uff1bActual\u6a21\u5f0f\u4ece\u672c\u4f1a\u8bdd\u6700\u8fd1\u4e00\u6761 Soul \u6307\u4ee4\u63a8\u65ad
 *   - \u4e16\u754c\u4e66\uff1actx.remote.directoryPicker.pick() \u9009\u76ee\u5f55\uff1bPOST /godhand/worldbook/{select,read,save,versions}
 *     \u8bfb\u5199\u771f\u5b9e .json\uff0cGuardar\u524d\u7531\u5bbf\u4e3b\u5907\u4efd\uff1b\u9875\u9762\u53ea\u663e\u793a\u771f\u5b9e\u54cd\u5e94\uff0c\u8bfb/\u5199\u5931\u8d25\u76f4\u63a5\u663e\u793a code / message\u3002
 *   - \u4e16\u754c\u4e66\uff1actx.remote.directoryPicker.pick() \u9009\u76ee\u5f55\uff1bPOST /godhand/worldbook/{select,read,save,versions}
 *     \u8bfb\u5199\u771f\u5b9e .json\uff0cGuardar\u524d\u7531\u5bbf\u4e3b\u5907\u4efd\uff1b\u9875\u9762\u53ea\u663e\u793a\u771f\u5b9e\u54cd\u5e94\uff0c\u8bfb/\u5199\u5931\u8d25\u76f4\u63a5\u663e\u793a code / message\u3002
 *   - \u6301\u4e45\u5de5\u4f5c\u533a\uff1aGET/POST /godhand/workspace \u8bb0\u4f4f\u9879\u76ee/\u7248\u672c/Archivo de tarjeta/\u4e16\u754c\u4e66/MVU \u9009\u62e9\uff1b
 *     /godhand/project/scan \u9012\u5f52\u8fd4\u56de\u7248\u672c relative\uff0c\u81ea\u52a8Más reciente\u4f1a\u8df3\u8fc7\u6ca1Sí\u5361\u7684\u6700\u9ad8\u7248\u672c\uff1b
 *     /godhand/card/{list,read} \u5217\u51fa\u7248\u672c\u76ee\u5f55\u548cArchivo de tarjetaSolo lectura\u5143\u4fe1\u606f\u3002
 *     \u7ba1\u7406\u6d6e\u5c42\u53ef\u6dfb\u52a0/\u5220\u9664/\u5207\u6362\u9879\u76ee\u3001\u5207\u7248\u672c\u3001\u9009\u5361\u3001\u81ea\u52a8Más reciente\uff1b\u53ea\u5728\u5b8c\u6574\u6d6e\u7a97\u6253Activado\u65f6\u8f6e\u8be2\u3002
 *   - \u5361\u5185\u5185\u5bb9\uff1a\u9009\u4e2d PNG/JSON \u5361\u540e POST /godhand/card/inspect\uff0cSolo lectura\u63a5\u4e0a\u5361\u5185\u4e16\u754c\u4e66\u548c\u811a\u672c\u5143\u4fe1\u606f\uff1b
 *     \u4e0d\u6267\u884c\u5361\u5185 JS\uff0c\u4e0d\u5199Archivo de tarjeta/workspace\u3002
 *   - \u8d44\u6599\u5e93\uff1a\u5b8c\u6574\u6d6e\u7a97“\u524d\u7aef\u8bbe\u8ba1\uff06\u52a8\u6548\u6570\u636e\u5e93”\u9875\u7b7e\u76f4\u63a5\u663e\u793a TW Library \u79bb\u7ebf\u6311\u9009\u9875 #design\uff1b
 *     openLibrary \u906e\u7f69\u4fdd\u7559\u7ed9\u7a0b\u5e8f\u5316\u5165\u53e3\u3002
 */
(() => {
  'use strict';

  const PLUGIN_ID = 'liarmttt-tavernweave-dsh';
  const UI_KEY = 'godhand.ui.v2';
  const SOUL_SKILL = 'activate-tavernweave-soul';
  const SKILL_MIME = 'application/x-godhand-skill';
  const EDGE = 8;
  const FULL_MIN = { w: 440, h: 340 };
  // \uff08 v22.1 \uff09\uff1a 52 /  36 \uff0c 28%\uff0c 9°\u3002
  // \u3001\uff08 4°\uff09\uff0c\u3002
  const WHEEL = {
    topPad: 52, bottomPad: 36, gapRatio: 0.28, minGap: 14, minSlots: 3, maxSlots: 14,
    theta: 9, minTheta: 4, cardMax: 210, cardSoft: 120, cardMin: 104, left: 12, right: 6,
    minW: 132, minH: 300, ease: 0.24,
    // \uff08Activado\uff09\uff0c“Arrastra al campo para insertar”
    compactBelow: 180,
  };

  const TABS = [
    { id: 'skills', label: 'Skill' },
    { id: 'worldbook', label: '\u4e16\u754c\u4e66' },
    { id: 'library', label: '\u524d\u7aef\u8bbe\u8ba1\uff06\u52a8\u6548\u6570\u636e\u5e93' },
  ];
  // “”\uff1aFunciones\uff0cActivado
  const FEATURES = [
    { tab: 'worldbook', name: '\u4e16\u754c\u4e66', desc: '\u8bfb\u5199\u672c\u673a\u4e16\u754c\u4e66 JSON · \u771f\u5b9e\u6587\u4ef6' },
  ];
  // \uff1a TW  23 Skill\uff0cFunciones\uff0c Skill
  //\uff08Actual DSH  office / diagnose-windows-sandbox-acl\uff09\u3002
  // TW  TavernWeave 2.2.0  skills/ \uff1bTW  Skill \u3002
  const TW_SKILLS = new Set([
    'activate-tavernweave-soul', 'build-work-library', 'code-quality-workflow',
    'consult-tavernweave-library', 'orchestrate-project-blueprint', 'reflect-on-vibe-code-growth',
    'rewrite-natural-prose', 'rolecard-workshop-ops', 'shadcn-tailwind-ui',
    'sillytavern-api-reference', 'sillytavern-card-components', 'sillytavern-card-pipeline',
    'sillytavern-component-update', 'sillytavern-database-rolecards', 'sillytavern-embedded-ui',
    'sillytavern-extension-dev', 'sillytavern-media-live2d-runtime', 'sillytavern-render-regex-pipeline',
    'sillytavern-rolecard-performance', 'sillytavern-rolecard-security', 'sillytavern-runtime-debug',
    'tavern-card-builder', 'worldbook-design-and-writing',
  ]);
  // Skill \u3001\u3002
  // tag \uff0c\uff1bshort \uff1bdetail \u3002
  // \uff0c\uff1b\u3002
  const SKILL_META = Object.freeze({
    'activate-tavernweave-soul': {
      tag: '\u4eba\u683c\u6a21\u5f0f',
      short: 'Activado\u542f\u3001\u5207\u6362\u6216Cerrar\u56db\u79cd Soul \u6a21\u5f0f',
      detail: '\u628a Soul \u4f5c\u4e3aActual\u4efb\u52a1\u7684\u8bed\u6c14\u548c\u6559\u5b66\u53e0\u52a0\u5c42Activado\u542f\u3001\u5207\u6362\u6216Cerrar\uff1a\u963f\u77b3\u504f\u6e29\u548c\u5f15\u5bfc\uff0cMTTT.sir \u504f\u4e25\u683c\u62f7\u6253\uff0c\u7075\u9b42\u6740\u624b\u504f\u76f4\u63a5\u7684\u524d\u7aef\u5ba1\u67e5\uff0c\u4e09\u5e2d\u8054\u5e2d\u7528\u4e8esí \u8fb9\u754c\u7684\u8111\u66b4\u3002\u53ea\u6539\u8868\u8fbe\u548c\u5ba1\u67e5\u955c\u5934\uff0c\u4e0d\u6269\u5927\u6587\u4ef6\u3001\u7f51\u7edc\u3001\u4ed8\u8d39\u6216\u53d1\u5e03\u6743\u9650\u3002',
    },
    'build-work-library': {
      tag: '\u8d44\u6599\u5e93',
      short: '\u6574\u7406\u539f\u4f5c\u3001\u540c\u4eba\u4e0e\u7f51\u56fe\u8d44\u6599',
      detail: '\u4ece\u5c0f\u8bf4\u3001\u672c\u5730\u6750\u6599\u3001\u7f51\u9875\u548c\u56fe\u7247\u5efa\u7acb\u4f5c\u54c1\u8d44\u6599\u5e93\uff1a\u533a\u5206\u539f\u4f5c\u3001\u540c\u4eba\u3001\u6539\u7f16\u3001\u5267\u900f\u9636\u6bb5\u548c\u6765\u6e90\uff0c\u652f\u6301\u4eba\u5de5\u7f16\u8f91Entradas\uff0c\u5bfc\u51fa Markdown\u3001JSONL \u548c\u53ef\u9009 SQLite\u3002\u9002\u5408\u4e8c\u521b\u524d\u6536\u96c6\u8bbe\u5b9a\u3001\u6574\u7406\u540c\u4eba\u8d44\u6599\uff0c\u6216\u7ed9\u540e\u7eed\u5199\u5361\u7559\u4e0b\u53ef\u67e5\u7684\u6765\u6e90\u94fe\u3002',
    },
    'code-quality-workflow': {
      tag: '\u8d28\u91cf\u5ba1\u67e5',
      short: '\u5168\u91cf/\u67b6\u6784\u5ba1\u67e5\u4e0e\u6700\u5c0f\u4fee\u590d',
      detail: '\u5bf9\u8f6f\u4ef6\u3001\u89d2\u8272\u5361\u6216\u6df7\u5408Proyectos\u505a\u5168\u91cf\u5ba1\u67e5\u6216\u67b6\u6784\u5ba1\u67e5\uff1a\u8bb0\u5f55\u8986\u76d6\u8303\u56f4\u3001\u4fdd\u7559\u6240sí \u53d1\u73b0\u3001\u6309\u95e8\u63a7\u505a\u6700\u5c0f\u4fee\u590d\u5e76\u56de\u5f52\u9a8c\u8bc1\u3002\u9002\u5408\u53d1\u5e03\u524d\u4f53\u68c0\u3001\u91cd\u6784\u524d\u8bc4\u4f30\uff0c\u6216\u9700\u8981\u628a“\u54ea\u91ccsí \u95ee\u9898\u3001\u8bc1\u636esí\u4ec0\u4e48\u3001\u4fee\u4e86\u4ec0\u4e48”\u8bb2\u6e05\u695a\u65f6\u3002',
    },
    'consult-tavernweave-library': {
      tag: '\u6307\u5357\u5e93',
      short: '\u6309\u9700\u67e5 TW \u6307\u5357\u4e0e\u8bbe\u8ba1\u8d44\u6599',
      detail: '\u628a TW \u5de5\u4f5c\u8def\u7531\u5230\u968f\u5305\u6307\u5357\u3001A0 \u5de5\u7a0b\u68c0\u67e5\u5355\u3001\u8bbe\u8ba1\u4e0e\u52a8\u6548\u76ee\u5f55\u3001\u6982\u5ff5/\u6765\u6e90\u53c2\u8003\u548c\u79bb\u7ebf\u6311\u9009\u9875\uff1b\u4e5f\u8d1f\u8d23\u5927\u767d\u8bdd\u5f15\u5bfc\u6321\u4f4d\u7684\u67e5\u8be2\u4e0e\u4fee\u6539\u3002\u9002\u5408\u5199\u6587\u4ef6\u524d\u67e5 A0\u3001\u505a\u524d\u7aef\u65f6\u627e\u8bbe\u8ba1\u53c2\u8003\uff0c\u6216\u786e\u8ba4\u67d0\u4e2a TW \u80fd\u529b\u8be5\u7531\u8c01\u8d1f\u8d23\u3002',
    },
    'orchestrate-project-blueprint': {
      tag: 'Proyectos\u84dd\u56fe',
      short: '\u613f\u671b → \u603b\u8bbe\u8ba1\u6848 / \u84dd\u56fe / NEXT',
      detail: '\u628a\u6a21\u7cca\u7684\u4ea7\u54c1\u3001\u89d2\u8272\u5361\u3001\u524d\u7aef\u6216 Vibe Code \u613f\u671b\u6536\u675f\u6210sí \u8fb9\u754c\u7684\u603b\u8bbe\u8ba1\u6848\u3001First Playable\u3001\u5206\u7ea7\u84dd\u56fe\u3001\u53ef\u7eed\u63a5\u7684 NEXT \u548c\u8bc1\u636e\u95e8\uff1b\u4e5f\u80fd\u751f\u6210Proyectos\u8fdb\u5ea6\u753b\u677f\u3001\u8bb0\u5f55\u53cd\u9988\u548c\u9632\u6b62\u957f\u4efb\u52a1\u9012\u5f52\u81a8\u80c0\u3002\u9002\u5408\u4ece\u96f6ActivadoProyectos\u3001\u63a5\u624b\u534a\u6210\u54c1\uff0c\u6216\u9700\u8981\u5148\u5b9a\u8303\u56f4\u548c\u9a8c\u6536\u518d\u52a8\u624b\u65f6\u3002',
    },
    'reflect-on-vibe-code-growth': {
      tag: '\u6210\u957f\u8bc4\u4f30',
      short: '\u91cd\u4f30 Vibe Code \u80fd\u529b\u5e76\u7559\u5c65\u5386',
      detail: '\u4eceActual\u5bbf\u4e3b\u5bf9\u8bdd\u3001\u5de5\u4f5c\u533a\u3001Proyectos\u72b6\u6001\u548c\u4ea4\u4ed8\u8bc1\u636e\u91cd\u65b0\u8bc4\u4f30\u5b8c\u6574\u7684 Vibe Code \u80fd\u529b\u7f51\u7edc\uff0c\u8f93\u51fa\u53ef\u72ec\u7acb\u590d\u5236\u7684\u6587\u5b57\u8bc4\u4f30\u8868\u548c\u4e03\u7ae0\u4ea4\u4e92\u62a5\u544a\uff1b\u53ea\u4e0e\u771f\u6b63\u53ef\u6bd4\u7684\u5386\u53f2\u7ef4\u5ea6Comparación\uff0c\u5e76\u53efGuardar\u8131\u654f\u7684\u8ffd\u52a0\u5f0f\u5c65\u5386\u3002\u9002\u5408\u9636\u6bb5\u6027\u590d\u76d8\u3001\u548c\u4e0a\u5c65\u5386\u6bd4\u8f83\uff0c\u6216\u53ea\u60f3\u770b\u6587\u5b57\u8bc4\u4f30\u65f6\u3002',
    },
    'rewrite-natural-prose': {
      tag: '\u6587\u672c\u7cbe\u4fee',
      short: '\u53bb AI \u5473\uff0c\u4fdd\u7559\u539f\u610f\u4e0eEstructura',
      detail: '\u53bb\u6389 AI \u5473\u3001\u516b\u80a1\u3001\u7a7a\u8bdd\u548c\u91cd\u590dEstructura\uff0c\u4fdd\u7559\u539f\u610f\u3001\u4e8b\u5b9e\u3001\u6280\u672f\u8bed\u6cd5\u4e0e\u5f15\u7528\uff1b\u652f\u6301\u5355\u4fee\u6539\u3001\u4efb\u52a1\u7ea7\u6301\u7eed\u6a21\u5f0f\u548c\u5206\u522b\u6388\u6743\u7684\u5de5\u4f5c\u533a/\u5ba2\u6237\u7aef\u6301\u4e45\u6a21\u5f0f\u3002\u9002\u5408\u89d2\u8272\u5361\u6b63\u6587\u3001\u5bf9\u8bdd\u3001\u6587\u6863\u3001\u8ba1\u5212\u548c\u62a5\u544a\u5199\u5f97\u50cf\u6a21\u677f\u65f6\u3002',
    },
    'rolecard-workshop-ops': {
      tag: '\u5de5\u574a\u8fd0\u7ef4',
      short: '\u89d2\u8272\u5361\u5de5\u574a\u53d1\u5e03\u94fe\u4e0e\u6743\u9650',
      detail: '\u9762\u5411\u7531\u9759\u6001\u76ee\u5f55\u3001\u5305\u7f51Desactivado\u3001\u5bf9\u8c61\u5b58\u50a8\u3001OAuth \u5f52\u5c5e\u3001\u5ba1\u6838\u6d41\u548c\u53cd\u5411\u4ee3\u7406\u7ec4\u6210\u7684\u89d2\u8272\u5361\u5de5\u574a\uff0c\u505a\u5065\u5eb7\u68c0\u67e5\u3001API \u5408\u540c\u5bf9\u9f50\u3001\u53d1\u5e03/\u66f4\u65b0/\u4e0b\u67b6\u6d41\u7a0b\u3001\u9690\u79c1\u5ba1\u67e5\u3001CORS \u4e0e\u56de\u8c03\u8bca\u65ad\u3001\u5bb9\u5668/\u4ee3\u7406\u89c4\u5212\u548c\u660e\u786e\u6388\u6743\u540e\u7684\u90e8\u7f72\u3002\u9ed8\u8ba4Solo lectura\uff1bno hay \u660e\u786e\u6388\u6743\u4e0d\u78b0\u751f\u4ea7\u3001\u51ed\u636e\u6216\u8bbf\u95ee\u6743\u3002',
    },
    'shadcn-tailwind-ui': {
      tag: '\u524d\u7aef UI',
      short: 'React / shadcn / Tailwind \u754c\u9762',
      detail: '\u6784\u5efa\u3001\u6539\u9020\u6216\u5ba1\u9605\u57fa\u4e8e React\u3001shadcn/ui\u3001Radix \u548c Tailwind \u7684\u53ef\u8bbf\u95ee\u754c\u9762\uff1a\u7ec4\u4ef6\u7ec4\u5408\u3001\u54cd\u5e94\u5f0fDiseño\u3001\u8bed\u4e49\u5316 token\u3001\u6df1\u6d45\u4e3b\u9898\u3001\u8868\u5355\u3001\u5bf9\u8bdd\u6846\u3001\u8868\u683c\u3001\u952e\u76d8\u4ea4\u4e92\u548c\u5b89\u5168\u914d\u7f6e\u3002\u9002\u5408 React/Vite/Next elementos\u76ee\u7684\u4ea7\u54c1\u754c\u9762\uff0c\u4e0d\u9002\u5408Lienzo\u827a\u672f\u3001\u6d77\u62a5\u6216\u975e React \u6846\u67b6\u3002',
    },
    'sillytavern-api-reference': {
      tag: 'API \u67e5\u8bc1',
      short: 'ST / \u52a9\u624b / MVU  versiones API',
      detail: '\u5728\u5b9e\u73b0\u6216\u5ba1\u67e5\u89d2\u8272\u5361\u81ea\u52a8\u5316\u524d\uff0c\u67e5\u8bc1 SillyTavern\u3001Tavern Helper / JS-Slash-Runner\u3001STScript\u3001\u5b8f\u3001\u63d0\u793a\u8bcd\u6ce8\u5165\u3001\u4e16\u754c\u4e66\u3001EJS\u3001MVU \u548c\u8fd0\u884c\u65f6\u5e93\u7684\u786e\u5207\u80fd\u529b\u4e0e versiones\u5dee\u5f02\u3002\u9002\u5408\u4e0d\u786e\u5b9a\u51fd\u6570\u7b7e\u540d\u3001\u4e8b\u4ef6\u8f7d\u8377\u3001\u659c\u6760\u547d\u4ee4\u8bed\u6cd5\u3001\u53d8\u91cf\u4f5c\u7528\u57df\u3001\u697c\u5c42\u64cd\u4f5c\u6216\u6269\u5c55\u80fd\u529b\u65f6\u3002',
    },
    'sillytavern-card-components': {
      tag: '\u62c6\u5361\u7ec4\u4ef6',
      short: '\u62c6\u5361\u3001\u7ec4\u4ef6\u5e93\u4e0e\u5f80\u8fd4\u4e00\u81f4\u6027',
      detail: '\u628a ST \u89d2\u8272\u5361\u4ece JSON \u6216 PNG \u5b89\u5168\u62c6\u6210\u53ef\u5ba1\u9605\u7ec4\u4ef6\uff0c\u8bbe\u8ba1\u6216\u7ef4\u62a4 registry \u9a71\u52a8\u7684\u7ec4\u4ef6\u5e93\u4e0e recipe\uff0c\u8ffd\u8e2a\u7ec4\u4ef6\u4f9d\u8d56\u548c\u51b2\u7a81\uff0c\u5e76\u505a\u6e90\u5361\u5230\u5236\u54c1\u7684\u5f80\u8fd4\u4e00\u81f4\u6027\u9a8c\u8bc1\u3002\u9002\u5408\u63a5\u624b\u522b\u4eba\u7684\u5361\u3001\u6a21\u5757\u5316\u7ef4\u62a4\uff0c\u6216\u628a\u6210\u719f versiones\u56de\u704c\u5171\u4eab\u7ec4\u4ef6\u5e93\u3002',
    },
    'sillytavern-card-pipeline': {
      tag: '\u5236\u5361\u6d41\u6c34\u7ebf',
      short: '\u7ec4\u88c5\u3001JSON/PNG \u4e0e\u53d1\u5e03\u95e8',
      detail: '\u6309Proyectos\u73b0sí \u5de5\u5177\u7f16\u6392\u89d2\u8272\u5361\u7684\u6570\u636e\u9a71\u52a8Activado\u53d1\u3001\u5b9e\u65f6\u7f16\u8f91\u3001\u6821\u9a8c\u3001JSON \u6253\u5305\u3001PNG \u8f7d\u8377\u5d4c\u5165\u3001\u4e16\u754c\u4e66 versiones\u540c\u6b65\u548c\u53d1\u5e03\u5ba1\u8ba1\uff1b\u6839\u636e\u6539\u52a8\u8303\u56f4\u9009\u62e9\u9a8c\u8bc1\uff0c\u5e76\u533a\u5206\u68c0\u67e5\u70b9\u4e0e\u516cActivado\u53d1\u5e03\u3002\u9002\u5408\u4eceActivado\u53d1\u5230\u4ea4\u4ed8\u7684\u6574\u6761\u5236\u5361\u6d41\u6c34\u7ebf\u3002',
    },
    'sillytavern-component-update': {
      tag: '\u7ec4\u4ef6\u66f4\u65b0',
      short: '\u53ea\u6539\u5c40\u90e8\u7ec4\u4ef6\uff0c\u660e\u786e\u4ea4\u4ed8\u8fb9\u754c',
      detail: '\u5f53\u53ea\u6539\u89d2\u8272\u5361\u5185\u7684\u6b63\u5219\u3001Tavern Helper \u811a\u672c/\u811a\u672c\u6587\u4ef6\u5939\u6216\u5c40\u90e8\u7ec4\u4ef6\u65f6\uff0c\u6784\u5efa\u5e76\u9a8c\u8bc1\u6700\u5c0f\u66f4\u65b0\uff0c\u5bfc\u51fa\u53ef\u5bfc\u5165\u7684\u7ec4\u4ef6 JSON\uff0c\u660e\u786e“\u53ea\u4ea4\u7ec4\u4ef6”\u8fd8sí“\u4ea4\u6574\u5361\u91cd\u5c01”\u3002\u9002\u5408\u5c0f\u8303\u56f4\u70ed\u4fee\uff0c\u907f\u514d\u9759\u9ed8\u91cd\u6253\u6574\u5f20\u5361\u3002',
    },
    'sillytavern-database-rolecards': {
      tag: '\u5361\u5185\u6570\u636e',
      short: '\u8868Estructura\u3001\u697c\u5c42\u5b58\u50a8\u4e0e\u8fc1\u79fb',
      detail: '\u8bbe\u8ba1\u5e76\u9a8c\u8bc1\u89d2\u8272\u5361\u91cc\u7684Estructura\u5316\u6570\u636e\uff1a\u8868 schema\u3001\u7a33\u5b9a\u8bb0\u5f55\u952e\u3001MVU \u6d88\u606f\u697c\u5c42\u5b58\u50a8\u3001\u5b57\u6bb5\u7ed1\u5b9a\u3001\u786e\u5b9a\u6027\u8fc1\u79fb\uff0c\u4ee5\u53caBarra de estado/\u63a7\u5236\u4e2d\u5fc3\u7b49\u6d88\u8d39\u8005\u3002\u9002\u5408\u5361Activado\u59cb\u50cf\u5c0f\u578b\u6570\u636e\u5e93\u5e94\u7528\uff0c\u6216\u9700\u8981\u8de8\u697c\u5c42\u7a33\u5b9a\u8bfb\u5199\u65f6\uff1b\u4e0d\u5f15\u5165\u5916\u90e8 SQL \u670d\u52a1\u3002',
    },
    'sillytavern-embedded-ui': {
      tag: '\u5361\u5185\u754c\u9762',
      short: 'Activado\u5c40\u9875\u3001Barra de estado\u4e0e\u63a7\u5236\u4e2d\u5fc3',
      detail: '\u8bbe\u8ba1\u3001\u5b9e\u73b0\u6216\u5ba1\u9605\u89d2\u8272\u5361\u5185\u7684\u6846\u67b6NoDesactivado\u754c\u9762\uff1a\u6d88\u606f\u5185\u5bb9\u9875\u3001Activado\u5c40\u9875\u3001MVU Barra de estado\u3001\u63a7\u5236\u4e2d\u5fc3\u3001\u62bd\u5c49\u548c\u5f39\u7a97\uff1b\u5904\u7406\u6d88\u606f\u5230\u9875\u9762\u7684\u534f\u8bae\u3001\u72b6\u6001\u5230\u663e\u793a\u7684\u6620\u5c04\u3001HTML/CSS/JS\u3001\u4ea4\u4e92\u72b6\u6001\u3001\u54cd\u5e94\u5f0f\u3001No\u969c\u788d\u3001\u5b89\u5168\u6e32\u67d3\u548c\u53ef\u9009\u524d\u7aef\u6c99\u76d2\u3002\u771f\u5b9e\u9152\u9986\u91cc\u7684\u884c\u4e3a\u9a8c\u6536\u4ea4\u7ed9 runtime-debug\u3002',
    },
    'sillytavern-extension-dev': {
      tag: 'ST \u6269\u5c55',
      short: '\u6269\u5c55\u811a\u624b\u67b6\u3001manifest \u4e0e\u751f\u547d\u5468\u671f',
      detail: '\u521b\u5efa\u6216\u68c0\u67e5\u6d4f\u89c8\u5668\u4fa7 SillyTavern UI \u6269\u5c55\uff1amanifest\u3001\u5165\u53e3\u6a21\u5757\u3001\u751f\u547d\u5468\u671f\u94a9\u5b50\u3001\u8bbe\u7f6e\u547d\u540d\u7a7a\u95f4\u3001\u80fd\u529b\u5408\u540c\u3001 versiones\u9884\u68c0\u548c\u5b89\u88c5\u5192\u70df\u8ba1\u5212\uff0c\u4e0d\u76f4\u63a5\u88c5\u8fdb\u771f\u5b9e\u9152\u9986\u3002\u9002\u5408\u4ece\u96f6\u505a\u6269\u5c55\u6216\u5ba1\u67e5sí \u6269\u5c55\u7684Estructura\u3002',
    },
    'sillytavern-media-live2d-runtime': {
      tag: '\u5a92\u4f53',
      short: '\u97f3\u9891\u3001\u56fe\u7247\u3001\u89c6\u9891\u4e0e Live2D',
      detail: '\u4e3a\u89d2\u8272\u5361\u89c4\u5212\u97f3\u9891\u3001\u56fe\u7247\u3001\u89c6\u9891\u3001muchos\u6a21\u6001\u548c Live2D \u8d44\u4ea7\uff1a\u6765\u6e90\u3001\u9884\u52a0\u8f7d\u3001\u7ed1\u5b9a\u3001\u80fd\u529b\u68c0\u6d4b\u3001fallback \u548c\u751f\u547d\u5468\u671f\u5408\u540c\uff0c\u5e76\u7ed9\u51fa\u771f\u5b9e\u5bbf\u4e3b\u9a8c\u6536\u8ba1\u5212\u3002\u9002\u5408\u9700\u8981\u5a92\u4f53\u6e05\u5355\u3001Tavern Helper \u97f3\u9891\u63a5\u7ebf\u6216\u786e\u5b9a\u6027\u9884\u52a0\u8f7d\u9884\u7b97\u65f6\u3002',
    },
    'sillytavern-render-regex-pipeline': {
      tag: '\u6b63\u5219\u6e32\u67d3',
      short: 'fixture \u9a8c\u8bc1\u6b63\u5219\u6e32\u67d3\u9636\u6bb5',
      detail: '\u7528\u786e\u5b9a\u6027 fixture \u9a8c\u8bc1 SillyTavern \u6b63\u5219\u884c\u4e3a\uff1a\u89c4\u5219\u4f4d\u7f6e\u3001\u663e\u793a/\u63d0\u793a\u8bcd\u6216\u5361\u5185\u539f\u59cb\u9636\u6bb5\u3001\u6df1\u5ea6\u3001Activado\u72b6\u6001\u548c\u5e03\u5c14\u6807\u5fd7\uff1b\u80fd\u5bf9\u6bd4\u5361\u5185\u6b63\u5219\u4e0e Tavern Helper Dialecto\uff0c\u590d\u73b0\u66ff\u6362\uff0c\u5e76\u89e3\u91ca\u67d0\u6761\u89c4\u5219\u5728\u54ea\u4e2a\u6e32\u67d3\u9636\u6bb5\u88ab\u63a5\u53d7\u6216\u8df3\u8fc7\u3002\u79bb\u7ebf runner \u4e0d\u7b49\u4e8e\u5df2\u5b89\u88c5\u9152\u9986\u5f15\u64ce\u7684\u8bc1\u636e\u3002',
    },
    'sillytavern-rolecard-performance': {
      tag: '\u6027\u80fd\u9884\u7b97',
      short: '\u5927\u5361\u4f53\u79ef\u3001\u63d0\u793a\u8bcd\u4e0e\u8fd0\u884c\u65f6\u9884\u7b97',
      detail: '\u7528\u786e\u5b9a\u6027\u7684\u5927\u5c0f\u3001\u63d0\u793a\u8bcd\u3001\u4e16\u754c\u4e66\u3001\u6b63\u5219\u3001\u52a9\u624b\u811a\u672c\u3001\u5d4c\u5165\u5a92\u4f53\u548c\u6355\u83b7\u5230\u7684\u8fd0\u884c\u65f6\u9884\u7b97\u6765\u6d4b\u91cf\u3001\u6bd4\u8f83\u548c\u95e8\u63a7\u5927\u89d2\u8272\u5361\uff1b\u7ed9\u51fa\u56de\u5f52\u57fa\u7ebf\u548c\u6700\u5c0f\u4f18\u5316\u65b9\u6848\uff0c\u4e0d\u9759\u9ed8\u5220\u6389\u5361\u7684\u884c\u4e3a\u3002\u9002\u5408\u53d1\u5e03\u524d\u6027\u80fd\u4f53\u68c0\u6216 versiones\u95f4\u56de\u5f52\u6bd4\u8f83\u3002',
    },
    'sillytavern-rolecard-security': {
      tag: '\u5b89\u5168\u5ba1\u67e5',
      short: '\u6ce8\u5165\u3001\u52a8\u6001\u6267\u884c\u4e0e\u8fdc\u7a0b\u52a0\u8f7d\u98ce\u9669',
      detail: '\u5bf9\u89d2\u8272\u5361 JSON\u3001\u5d4c\u5165 HTML\u3001\u6b63\u5219\u66ff\u6362\u3001Tavern Helper \u811a\u672c\u3001\u52a0\u8f7d\u5668\u548c\u76f8Desactivado\u6e90\u7801\u505aSolo lectura\u5b89\u5168\u5ba1\u67e5\uff1a\u6ce8\u5165\u3001\u52a8\u6001\u6267\u884c\u3001\u8fdc\u7a0b\u4ee3\u7801\u3001\u901a\u914d\u6d88\u606f\u3001\u51ed\u636e\u5f62\u72b6\u548c\u6743\u9650\u98ce\u9669\u3002\u9002\u5408\u5bfc\u5165\u524d/\u53d1\u5e03\u524d\u5b89\u5168\u95e8\uff0c\u6216\u4e0e\u5df2\u6279\u51c6\u57fa\u7ebf\u5bf9\u6bd4\uff1b\u4e0d\u6267\u884c\u53ef\u7591\u4ee3\u7801\u3001\u4e0d\u6cc4\u9732\u5bc6\u94a5\u3001\u4e0d\u81ea\u52a8\u6539\u3002',
    },
    'sillytavern-runtime-debug': {
      tag: '\u771f\u673a\u8c03\u8bd5',
      short: '\u771f\u5b9e\u9152\u9986\u590d\u73b0\u3001\u53d6\u8bc1\u4e0e\u9a8c\u6536',
      detail: '\u7528\u53ef\u7528\u7684\u6d4f\u89c8\u5668\u9a71\u52a8\u5728\u771f\u5b9e SillyTavern \u91cc\u590d\u73b0\u3001\u8bca\u65ad\u548c\u6536\u96c6\u6267\u884c\u8bc1\u636e\uff1a\u5bfc\u5165\u3001\u5fc5\u9700\u6b63\u5219/\u52a9\u624b\u811a\u672c\u3001\u5bbf\u4e3b\u6269\u5c55\u3001Git/CDN \u6216\u533a\u57df\u52a0\u8f7d\u5668\u3001MVU/Zod\u3001Activado\u5c40\u9875\u3001Barra de estado\u3001\u63a7\u5236\u4e2d\u5fc3\u3001iframe\u3001\u5b9e\u65f6\u91cd\u8f7d\u3001\u63a7\u5236\u53f0\u3001\u54cd\u5e94\u5f0f\u548c\u4ea4\u4e92\u3002\u9002\u5408\u9759\u6001\u9884\u89c8\u8bc1\u660e\u4e0d\u4e86\u7684\u884c\u4e3a\uff1b\u754c\u9762\u6e90\u7801\u6539\u52a8\u4ecd\u4ea4\u56de embedded-ui\u3002',
    },
    'tavern-card-builder': {
      tag: '\u5361\u521b\u4f5c',
      short: '\u6587\u672c / MVU / \u6df7\u5408\u5361\u521b\u4f5c',
      detail: '\u89c4\u5212\u5e76\u521b\u4f5c SillyTavern \u6587\u672c\u5361\u3001MVU Zod \u5361\u548c\u6df7\u5408\u5361\uff1a\u8bc6\u522b\u5361\u578b\u4e0e\u4f9d\u8d56\uff0c\u8bbe\u8ba1\u89d2\u8272\u3001\u73a9\u5bb6\u6863\u6848\u4e0e\u80fd\u52a8\u6027\u3001\u53ef\u9009\u89d2\u8272\u9636\u6bb5\u3001\u4e16\u754c\u4e66\u3001\u53d8\u91cf\u3001CoT\u3001Activado\u573a\u548c\u63d0\u793a\u8bcd\u8def\u7531\uff0c\u7ef4\u62a4\u521b\u4f5c\u6743\u5a01\u4e0e\u6750\u6599\u6765\u6e90\u94fe\u3002\u9002\u5408\u65b0\u5361\u3001\u63a5\u624b\u5361\u3001\u72ec\u7acb\u89d2\u8272\u63d0\u793a\u8bcd\u89c4\u5219\u3001Activado\u573a\u98ce\u683c\u8bca\u65ad\u548c\u5b57\u6bb5\u8ffd\u8e2a\uff1b\u72ec\u7acb\u4e16\u754c\u4e66\u3001\u6253\u5305\u3001\u7cbe\u786e API\u3001\u771f\u673a\u8c03\u8bd5\u548c\u5d4c\u5165 UI \u4ea4\u7ed9\u5bf9\u5e94\u4e13\u804c\u80fd\u529b\u3002',
    },
    'worldbook-design-and-writing': {
      tag: '\u4e16\u754c\u4e66',
      short: '\u89c4\u5212\u3001\u62c6\u5408\u3001\u5ba1\u9605\u4e0e\u7cbe\u4fee\u4e16\u754c\u4e66',
      detail: '\u72ec\u7acb\u4e8e\u6574\u5361\u521b\u4f5c\u6765\u89c4\u5212\u3001\u62c6\u5206\u3001\u5408\u5e76\u3001\u5ba1\u9605\u548c\u64b0\u5199 SillyTavern \u4e16\u754c\u4e66\uff1a\u573a\u666f\u4fe1\u606f\u9700\u6c42\u3001\u539f\u751f/\u6a21\u677f\u52a0\u8f7d\u3001Entradas\u6b63\u6587\u3001\u6761\u4ef6\u3001\u4f8b\u5916\u3001\u77e5\u8bc6\u8fb9\u754c\u548c\u914d\u5957\u914d\u7f6e\uff1b\u652f\u6301\u4fdd\u4e49\u6539\u5199\u548c\u539f\u751f/\u6a21\u677f/\u5c40\u90e8\u6df7\u5408\u9009\u62e9\u3002\u9002\u5408\u53ea\u8981\u4e16\u754c\u4e66\u3001\u6539\u5199Entradas\u6216\u6838\u5bf9\u52a0\u8f7d\u8fb9\u754c\u65f6\uff1b\u4eba\u7269\u8bbe\u8ba1\u3001\u7cbe\u786e API\u3001\u72b6\u6001\u5199\u5165\u3001\u771f\u673a\u9a8c\u6536\u548c\u6253\u5305\u4ecd\u5f52\u539f\u8d1f\u8d23\u4eba\u3002',
    },
    'diagnose-windows-sandbox-acl': {
      tag: '\u6c99\u7bb1\u8bca\u65ad',
      short: '\u4fee\u590d Windows \u6c99\u7bb1 ACL \u62d2\u7edd',
      detail: '\u8bca\u65ad Windows \u4e0b DSH \u6c99\u7bb1\u7684 ACL \u8bbf\u95ee\u62d2\u7edd\uff1a\u5de5\u4f5c\u533a\u5199\u5165\u6216\u5217\u76ee\u5f55error\uff0c\u6216\u666e\u901a\u53ef\u8bfb\u8def\u5f84\u8bfb\u4e0d\u4e86\u3002\u7528\u968f\u5305\u547d\u4ee4\u68c0\u67e5\u8def\u5f84\u548c\u6bcf\u4e00\u7ea7\u7236\u76ee\u5f55\uff0c\u5e76\u5728\u540c\u4e00\u8fd0\u884c\u91cc\u4fee\u590d\u5b83\u8bc1\u660e\u7684 ACL \u95ee\u9898\uff1b\u9884\u671f\u7684\u6c99\u7bb1\u62e6\u622a\u4e0d\u9700\u8981\u4fee\u3002',
    },
    'office': {
      tag: 'Office',
      short: '\u521b\u5efa\u3001\u68c0\u67e5\u6216\u8f6c\u6362 Office \u6587\u6863',
      detail: '\u521b\u5efa\u3001\u68c0\u67e5\u6216\u8f6c\u6362 Office \u6587\u6863\u3001\u8868\u683c\u3001\u6f14\u793a\u548c PDF\uff1b\u6309\u4efb\u52a1\u9009\u62e9\u5408\u9002\u7684\u529e\u516c\u5de5\u4f5c\u6d41\uff0c\u4e0d\u628a\u4e0d\u540c\u683c\u5f0f\u7684\u5904\u7406\u6df7\u5728\u4e00\u8d77\u3002\u9002\u5408\u8981\u751f\u6210\u6216\u6838\u5bf9\u529e\u516c\u6587\u4ef6\uff0c\u4f46\u4e0d\u786e\u5b9a\u8be5\u7528 Word\u3001Excel\u3001PPT \u8fd8sí PDF \u65f6\u3002',
    },
    'office-docx': {
      tag: 'Word',
      short: '\u521b\u5efa\u3001\u8bfb\u53d6\u3001\u7f16\u8f91 Word \u6587\u6863',
      detail: '\u521b\u5efa\u3001\u8bfb\u53d6\u3001\u7f16\u8f91\u5e76\u6821\u9a8c Word \u6587\u6863\uff08.docx\uff09\uff0c\u4fdd\u7559\u6807\u9898\u3001\u6bb5\u843d\u3001\u8868\u683c\u7b49Estructura\uff1b\u5b8c\u6210\u540e\u7528\u6821\u9a8c\u6b65\u9aa4\u68c0\u67e5\u6587\u4ef6\u80fd\u6253Activado\u3001\u5185\u5bb9\u6ca1\u4e22\u3002',
    },
    'office-export-pdf': {
      tag: 'PDF',
      short: '\u628a Office \u6587\u6863\u8f6c\u6362\u6210 PDF',
      detail: '\u628a Office \u6587\u6863\u8f6c\u6362\u6210\u4f60\u8981\u6c42\u7684 PDF\uff1b\u7528 LibreOffice Kit \u6e32\u67d3/\u5bfc\u51fa\uff0c\u5e76\u6838\u5bf9\u8f93\u51fa\u6587\u4ef6\u7684\u5206\u9875\u3001\u5b57\u4f53\u548c\u56fe\u7247\u3002',
    },
    'office-pptx': {
      tag: 'PPT',
      short: '\u521b\u5efa\u3001\u8bfb\u53d6\u3001\u7f16\u8f91 PowerPoint',
      detail: '\u521b\u5efa\u3001\u8bfb\u53d6\u3001\u7f16\u8f91\u5e76\u6821\u9a8c PowerPoint \u6f14\u793a\uff08.pptx\uff09\uff0c\u5305\u62ec\u7248\u5f0f\u3001\u6587\u5b57\u548c\u89c6\u89c9\u68c0\u67e5\uff1b\u9002\u5408\u505a\u6c47\u62a5\u3001\u63d0\u6848\u6216\u9700\u8981\u9010\u9875\u6838\u5bf9\u65f6\u3002',
    },
    'office-recalculate': {
      tag: '\u8868\u683c\u91cd\u7b97',
      short: '\u5237\u65b0\u516c\u5f0f\u7f13\u5b58\u5e76\u6821\u9a8c\u8ba1\u7b97\u503c',
      detail: '\u5237\u65b0\u7535\u5b50\u8868\u683c\u7684\u516c\u5f0f\u7f13\u5b58\uff0c\u5e76\u7528 LibreOffice Kit \u6821\u9a8c\u8ba1\u7b97\u540e\u7684\u503c\uff1b\u9002\u5408\u516c\u5f0f\u7ed3\u679c\u8fc7\u671f\u3001\u8de8\u8868\u5f15\u7528\u6216\u9700\u8981\u786e\u8ba4\u8ba1\u7b97\u7ed3\u679c\u65f6\u3002',
    },
    'office-render': {
      tag: '\u6587\u6863\u6e32\u67d3',
      short: '\u628a\u6587\u6863\u6e32\u67d3\u6210\u56fe\u7247\u68c0\u67e5\u7248\u5f0f',
      detail: '\u628a\u6587\u6863\u6e32\u67d3\u6210\u56fe\u7247\uff0c\u68c0\u67e5\u89c6\u89c9\u7248\u5f0f\uff1b\u9002\u5408\u4ea4\u4ed8\u524d\u786e\u8ba4\u771f\u5b9e\u6392\u7248\u3001\u5206\u9875\u3001\u5b57\u4f53\u548c\u6837\u5f0fsíno\u548c\u9884\u671f\u4e00\u81f4\u3002',
    },
    'office-xlsx': {
      tag: 'Excel',
      short: '\u8bfb\u53d6\u3001\u521b\u5efa\u3001\u7f16\u8f91 Excel \u5de5\u4f5c\u7c3f',
      detail: '\u8bfb\u53d6\u3001\u521b\u5efa\u3001\u7f16\u8f91\u5e76\u6821\u9a8c Excel \u5de5\u4f5c\u7c3f\u3001\u6570\u636e\u548c\u516c\u5f0f\uff08.xlsx\uff09\uff0c\u5305\u62ec\u5de5\u4f5c\u8868Estructura\u3001\u683c\u5f0f\u548c\u8ba1\u7b97\u68c0\u67e5\uff1b\u9002\u5408\u6570\u636e\u6574\u7406\u3001\u62a5\u8868\u548c\u516c\u5f0f\u6838\u5bf9\u3002',
    },
  });

  //  TW Soul \uff08skills/activate-tavernweave-soul/SKILL.md\uff09
  const SOULS = [
    { id: 'atong', name: '\u963f\u77b3', on: '\u963f\u77b3\u52a9yo\uff01', swap: '\u963f\u77b3\u63a5\u624b' },
    { id: 'mttt', name: 'MTTT.sir', on: 'MTTT.sir\uff0c\u62f7\u6253yo\uff01', swap: 'MTTT.sir \u4e0a\u8bfe' },
    { id: 'killer', name: '\u7075\u9b42\u6740\u624b', on: '\u7075\u9b42\u6740\u624b\uff01', swap: '\u7075\u9b42\u6740\u624b\u63a5\u624b' },
    { id: 'ensemble', name: '\u4e09\u5e2d\u8054\u5e2d', on: 'Soul \u4e09\u5e2d\u5c31\u4f4d', swap: '\u4e09\u5e2d\u63a5\u624b' },
  ];
  const SOUL_OFF = 'Soul \u5f52\u4f4d';
  //  resolve-soul-command.mjs \uff0cActual
  const SOUL_PHRASES = new Map(Object.entries({
    '\u963f\u77b3\u52a9yo': 'atong', 'mttt.sir,\u62f7\u6253yo': 'mttt', 'Activado\u542fsoul\u6a21\u5f0f': 'atong', '/soul on': 'atong',
    '/soul on atong': 'atong', '/soul on mttt-sir': 'mttt', '\u7075\u9b42\u6740\u624b': 'killer', 'Activado\u542f\u7075\u9b42\u6740\u624b\u6a21\u5f0f': 'killer',
    '\u5f3a\u5c3c·\u94f6\u624b,\u63a5\u7ba1': 'killer', '\u5f3a\u5c3c,\u9a82\u9192yo': 'killer', '\u542f\u52a8relic\u6545\u969c\u68c0\u6d4b': 'killer', '/soul on soul-killer': 'killer',
    '\u8111\u66b4\u6a21\u5f0f,soul\u8054\u5e2d': 'ensemble', '\u4e09\u4eba\u4e00\u8d77\u8111\u66b4': 'ensemble', 'soul\u4e09\u5e2d\u5c31\u4f4d': 'ensemble', '/soul on ensemble': 'ensemble',
    '\u963f\u77b3\u63a5\u624b': 'atong', 'mttt.sir\u4e0a\u8bfe': 'mttt', '/soul switch atong': 'atong', '/soul switch mttt-sir': 'mttt',
    '\u7075\u9b42\u6740\u624b\u63a5\u624b': 'killer', '\u5f3a\u5c3c\u63a5\u624b': 'killer', '/soul switch soul-killer': 'killer', '\u4e09\u5e2d\u63a5\u624b': 'ensemble',
    '/soul switch ensemble': 'ensemble', 'soul\u5f52\u4f4d': 'off', '\u963f\u77b3\u5f52\u4f4d': 'off', 'mttt.sir\u4e0b\u8bfe': 'off',
    '\u7ed3\u675fsoul\u6a21\u5f0f': 'off', '\u5f3a\u5c3c,\u4e0b\u7ebf': 'off', 'relic\u65adActivado': 'off', '/soul off': 'off',
  }));

  const G = (window.__GODHAND__ = { version: '1.1.0', loaded: false, applied: false, errors: [], wheel: { reason: 'init' } });
  const fail = (where, error) => {
    const msg = where + ': ' + (error && error.message ? error.message : String(error));
    G.errors.push(msg);
    try { console.warn('[godhand] ' + msg); } catch {}
  };

  /* ---------------- \u7eaf\u51fd\u6570 ---------------- */

  function normalizeSoul(input) {
    const n = String(input).normalize('NFKC').trim().replace(/[\uff01!\u3002.]$/u, '').replace(/[\uff0c\u3001]/gu, ',')
      .replace(/\s+/gu, ' ').replace(/\s*,\s*/gu, ',').toLowerCase();
    return n.startsWith('/') ? n : n.replace(/\s+/gu, '');
  }
  function soulFromText(text) {
    let t = String(text || '').trim();
    const prefix = '/' + SOUL_SKILL;
    if (t.startsWith(prefix)) t = t.slice(prefix.length).trim();
    if (!t || t.length > 40) return null;
    const n = normalizeSoul(t);
    if (SOUL_PHRASES.has(n)) return SOUL_PHRASES.get(n);
    if (/^(\u7075\u9b42\u6740\u624b|Activado\u542f\u7075\u9b42\u6740\u624b\u6a21\u5f0f),/u.test(n)) return 'killer';
    return null;
  }
  function textOf(content) {
    if (!Array.isArray(content)) return '';
    return content.map((c) => (c && c.type === 'text' && typeof c.text === 'string' ? c.text : '')).join('');
  }
  function skillArg(args) {
    if (args && typeof args === 'object') return typeof args.name === 'string' ? args.name : null;
    if (typeof args !== 'string') return null;
    try {
      const v = JSON.parse(args);
      if (v && typeof v.name === 'string') return v.name;
    } catch {}
    const m = /"name"\s*:\s*"([^"]+)"/u.exec(args);
    return m ? m[1] : null;
  }
  function newAcc() {
    return { seen: new Set(), calls: [], counts: Object.create(null), inUse: Object.create(null), openTurn: null, soul: 'off', presetChanged: false };
  }
  function addCall(acc, name, source, ev) {
    const key = ev.seq !== undefined ? ev.seq : ev.time + ':' + name;
    if (acc.seen.has(key)) return false;
    acc.seen.add(key);
    acc.calls.push({ name, source, seq: ev.seq, time: ev.time });
    acc.counts[name] = (acc.counts[name] || 0) + 1;
    if (acc.openTurn !== null) acc.inUse[name] = { since: ev.time };
    return true;
  }
  /** \u628a\u4e00\u6761\u4f1a\u8bdd\u4e8b\u4ef6\u6298\u53e0\u8fdb\u7d2f\u52a0\u5668\uff1b\u8fd4\u56de\u662f\u5426\u6539\u53d8\u4e86\u53ef\u89c1\u72b6\u6001\u3002 */
  function applyEntry(acc, entry) {
    const ev = entry && entry.event ? entry.event : entry;
    if (!ev || typeof ev.type !== 'string') return false;
    const data = ev.data || {};
    switch (ev.type) {
      case 'turn/start':
        acc.openTurn = data.turn !== undefined ? data.turn : true;
        acc.inUse = Object.create(null);
        return true;
      case 'turn/end':
        acc.openTurn = null;
        acc.inUse = Object.create(null);
        return true;
      case 'tool/call': {
        if (data.name !== 'skill') return false;
        const name = skillArg(data.arguments);
        return name ? addCall(acc, name, 'model', ev) : false;
      }
      case 'user/message': {
        const src = data.source || {};
        if (src.kind === 'skill-invocation' && typeof src.name === 'string') return addCall(acc, src.name, 'user', ev);
        if (src.kind === 'user') {
          const mode = soulFromText(textOf(data.content));
          if (mode) { acc.soul = mode; return true; }
        }
        return false;
      }
      case 'agent-preset/selected':
        acc.presetChanged = true;
        return true;
      default:
        return false;
    }
  }
  function ago(time, now) {
    if (!Number.isFinite(time)) return '';
    const s = Math.max(0, Math.round((now - time) / 1000));
    if (s < 45) return 'ahora mismo';
    const m = Math.round(s / 60);
    if (m < 60) return m + ' min hace';
    const hr = Math.round(m / 60);
    if (hr < 24) return hr + ' h hace';
    const d = new Date(time);
    return (d.getMonth() + 1) + ' mes ' + d.getDate() + ' día';
  }
  function clock(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  /** \u76f8\u90bb\u4e24\u4e2a\u69fd\u4f4d\u7684\u5361\u7247\u5916\u6846\u6700muchos\u91cd\u53e0muchos\u5c11\u50cf\u7d20\uff08\u8d1f\u6570\u8868\u793aSí\u95f4\u9699\uff09\u3002 */
  function slotOverlap(g) {
    const mid = (g.slots - 1) / 2;
    const half = (a) => (g.cardH * Math.cos(a) + g.cardW * Math.abs(Math.sin(a))) / 2;
    let worst = -Infinity;
    for (let k = 0; k < g.slots - 1; k++) worst = Math.max(worst, half((k - mid) * g.step) + half((k + 1 - mid) * g.step) - g.spacing);
    return worst;
  }
  /**
   * \u8f6e\u76d8\u51e0\u4f55\u3002W/H \u662f\u53ef\u7528\u7a7a\u767d\uff0ccardH \u662f\u91cf\u51fa\u6765\u7684\u5361\u7247\u9ad8\u5ea6\u3002
   * \u5361\u7247\u4e2d\u5fc3\u843d\u5728\u5706\u5fc3 (X0 - R, Cy)\u3001\u534a\u5f84 R \u7684\u5706\u4e0a\uff0c\u4e2d\u95f4\u69fd\u4f4d\u6700\u9760\u53f3\uff0c\u4e24\u7aef\u5404\u503e\u659c theta\u3002
   * \u8fd4\u56de null \u8868\u793a\u653e\u4e0d\u4e0b\u3002
   */
  function wheelGeometry(W, H, cardH) {
    if (!(W >= WHEEL.minW) || !(H >= WHEEL.minH) || !(cardH > 0)) return null;
    const deg = Math.PI / 180;
    const av = Math.max(120, H - WHEEL.topPad - WHEEL.bottomPad);
    const gap = Math.max(WHEEL.minGap, Math.round(cardH * WHEEL.gapRatio));
    const margins = WHEEL.left + WHEEL.right;
    const build = (slots) => {
      const spacing = slots > 1 ? (av - cardH) / (slots - 1) : 0;
      const halfSpan = spacing * (slots - 1) / 2;
      const shiftFor = (t) => halfSpan * Math.tan(t / 2);
      let theta = WHEEL.theta * deg;
      let cardW = Math.min(WHEEL.cardMax, W - margins - shiftFor(theta));
      if (cardW < WHEEL.cardSoft) {
        const room = W - margins - WHEEL.cardSoft;
        theta = Math.min(WHEEL.theta * deg, Math.max(WHEEL.minTheta * deg, 2 * Math.atan(Math.max(0, room) / Math.max(1, halfSpan))));
        cardW = Math.min(WHEEL.cardMax, W - margins - shiftFor(theta));
      }
      cardW = Math.floor(cardW);
      const shift = shiftFor(theta);
      const step = slots > 1 ? (2 * theta) / (slots - 1) : 0;
      const R = halfSpan > 0 ? halfSpan / Math.sin(theta) : 4000;
      const X0 = cardW / 2 + WHEEL.left + shift;
      return {
        slots, spacing, halfSpan, theta, step, R, X0, Cy: WHEEL.topPad + av / 2, cardW, cardH, shift, av,
        width: Math.min(W, Math.ceil(cardW + WHEEL.left + shift + WHEEL.right + 2)),
      };
    };
    let g = build(Math.max(WHEEL.minSlots, Math.min(WHEEL.maxSlots, Math.round(av / (cardH + gap)))));
    while (g.slots > WHEEL.minSlots && slotOverlap(g) > 20) g = build(g.slots - 1);
    return g.cardW >= WHEEL.cardMin && slotOverlap(g) <= 20 ? g : null;
  }
  /**
   * \u5706\u5fc3 (cx, cy)\u3001\u534a\u5f84 r \u7684\u5706\u5728\u8f6e\u76d8\u533a\u9ad8\u5ea6 h \u5185\u7684\u53f3\u4fa7\u5f27\u7ebf\uff08SVG \u8def\u5f84\uff09\u3002
   * \u4e0d\u7528\u8d85\u5927\u7684 CSS \u5706\u89d2\u8fb9\u6846\u753b\u5706\uff1a\u653e\u8fdb\u8f6e\u76d8\u540e\u5b83\u4f1a\u88ab\u753b\u6241\uff08\u5b9e\u6d4b\u6700\u5916\u4fa7\u504f 15px\uff09\uff0c\u865a\u7ebf\u5c31\u4e0d\u518d\u7a7f\u8fc7\u5361\u7247\u4e2d\u5fc3\u3002
   */
  function ringPath(cx, cy, r, h) {
    if (!(r > 0)) return '';
    const y1 = Math.max(cy - r + 0.5, -20);
    const y2 = Math.min(cy + r - 0.5, h + 20);
    if (y2 <= y1) return '';
    const x = (y) => cx + Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)));
    return 'M' + x(y1).toFixed(2) + ' ' + y1.toFixed(2) + 'A' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 0 1 ' + x(y2).toFixed(2) + ' ' + y2.toFixed(2);
  }
  G.lib = { applyEntry, newAcc, soulFromText, skillArg, wheelGeometry, slotOverlap, ringPath };

  /* ---------------- \u51e0\u4f55\uff08C13\uff1a\u660e\u786e\u50cf\u7d20\u5750\u6807\uff0c\u5939\u5728\u53ef\u89c6\u533a\u5185\uff09 ---------------- */

  function frameTop() {
    try {
      const cs = getComputedStyle(document.documentElement);
      for (const name of ['--dsh-frame-overlay-top', '--dsh-frame-top-clearance', '--dsh-frame-chrome-top']) {
        const v = parseFloat(cs.getPropertyValue(name));
        if (Number.isFinite(v) && v > 0) return v;
      }
    } catch {}
    return 0;
  }
  function viewport() {
    const top = frameTop();
    return { x: 0, y: top, w: window.innerWidth, h: Math.max(1, window.innerHeight - top) };
  }
  function clampFull(r) {
    const v = viewport();
    const availW = Math.max(1, v.w - EDGE * 2);
    const availH = Math.max(1, v.h - EDGE * 2);
    const w = Math.min(Math.max(r.w, Math.min(FULL_MIN.w, availW)), availW);
    const hh = Math.min(Math.max(r.h, Math.min(FULL_MIN.h, availH)), availH);
    const x = Math.min(Math.max(r.x, v.x + EDGE), v.x + v.w - w - EDGE);
    const y = Math.min(Math.max(r.y, v.y + EDGE), v.y + v.h - hh - EDGE);
    return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(hh) };
  }
  function defaultFull() {
    const v = viewport();
    const w = Math.min(760, v.w - 96);
    const hh = Math.min(560, v.h - 96);
    // Activado\uff0c
    let x = (v.w - w) / 2;
    const wheelRight = G.wheel.zoneRight;
    if (Number.isFinite(wheelRight) && wheelRight + 12 > x && wheelRight + 12 + w <= v.w - EDGE) x = wheelRight + 12;
    return clampFull({ x, y: v.y + (v.h - hh) / 2, w, h: hh });
  }
  function placeElement(el, r) {
    el.style.left = r.x + 'px';
    el.style.top = r.y + 'px';
    if (r.w !== undefined) el.style.width = r.w + 'px';
    if (r.h !== undefined) el.style.height = r.h + 'px';
  }
  /** \u7edf\u4e00\u7684\u62d6\u52a8/\u7f29\u653e\uff1apointer capture\uff0crAF \u66f4\u65b0\u6837\u5f0f\uff0c\u677e\u624b\u624d\u63d0\u4ea4Guardar\u3002 */
  function beginDrag(e, ref, compute, commit) {
    if (e.button !== 0) return;
    const handle = e.currentTarget;
    const isGrip = handle.classList.contains('gh2-grip');
    if (!isGrip && e.target.closest && e.target.closest('button, input, textarea, select, a, [role="tab"]')) return;
    const el = ref.current;
    if (!el) return;
    const sx = e.clientX;
    const sy = e.clientY;
    let next = null;
    let raf = 0;
    try { handle.setPointerCapture(e.pointerId); } catch {}
    el.classList.add('gh2-busy');
    e.preventDefault();
    const move = (ev) => {
      next = compute(ev.clientX - sx, ev.clientY - sy);
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (next) placeElement(el, next); });
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      if (raf) cancelAnimationFrame(raf);
      el.classList.remove('gh2-busy');
      if (next) { placeElement(el, next); commit(next); }
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  /* ---------------- \u672c\u673a\u8bb0\u5fc6\uff08\u53ea\u5b58\u754c\u9762\u72b6\u6001\uff09 ---------------- */

  function readUi() {
    try {
      const raw = JSON.parse(localStorage.getItem(UI_KEY) || 'null');
      if (!raw || raw.version !== 2) return null;
      const f = raw.full;
      const migratedTab = raw.tab === 'design' || raw.tab === 'motion' ? 'library' : raw.tab;
      return {
        // 0.2.0 “Desactivado”Cancelar\uff1a
        mode: raw.mode === 'full' ? 'full' : 'compact',
        tab: TABS.some((t) => t.id === migratedTab) ? migratedTab : 'skills',
        full: f && ['x', 'y', 'w', 'h'].every((k) => Number.isFinite(f[k])) ? f : null,
        wheel: Number.isFinite(raw.wheel) && raw.wheel >= 0 ? Math.floor(raw.wheel) : 0,
        // /\uff1aSí false \uff0cSí\u3002
        wheelOn: raw.wheelOn !== false,
      };
    } catch {
      return null;
    }
  }
  function writeUi(ui) {
    try {
      localStorage.setItem(UI_KEY, JSON.stringify({ version: 2, mode: ui.mode, tab: ui.tab, full: ui.full, wheel: ui.wheel, wheelOn: ui.wheelOn !== false }));
    } catch {}
  }

  /* ---------------- \u5171\u4eab\u72b6\u6001 ---------------- */

  function createStore(initial) {
    let state = initial;
    const listeners = new Set();
    return {
      get: () => state,
      set(patch) {
        const next = typeof patch === 'function' ? patch(state) : patch;
        if (!next) return;
        state = { ...state, ...next };
        for (const fn of [...listeners]) { try { fn(); } catch (error) { fail('listener', error); } }
      },
      subscribe(fn) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    };
  }
  const EMPTY_ACTIVITY = Object.freeze({
    ready: false, calls: [], counts: {}, inUse: {}, openTurn: null, soul: 'off', total: 0, hasMore: false, running: false,
  });

  /* ---------------- M5\uff1a\u8d44\u6599\u5e93 / \u771f\u5b9e\u4e16\u754c\u4e66\u72b6\u6001\u5207\u9762 ---------------- */

  const M5 = Object.freeze({
    libPage: '/godhand/library/assets/picker/index.html',
    libTitles: Object.freeze({ design: '\u8d44\u6599\u5e93 · \u8bbe\u8ba1\u7b5b\u9009\u9875', motion: '\u8d44\u6599\u5e93 · \u52a8\u6548\u7b5b\u9009\u9875' }),
    api: Object.freeze({
      select: '/godhand/worldbook/select',
      read: '/godhand/worldbook/read',
      save: '/godhand/worldbook/save',
      versions: '/godhand/worldbook/versions',
      mvuSelect: '/godhand/mvu/select',
      mvuInspect: '/godhand/mvu/inspect',
    }),
  });
  // \uff1a\u3001\u3001 JSON\u3001\u3001\u3002
  // raw \uff08Guardar\uff09 JSON\uff1bentries \u3002
  const EMPTY_WB = Object.freeze({
    root: '', rootInput: '',
    files: [], filesState: 'idle', folderError: '', picking: false,
    selectedPath: '', loadingFile: false, kind: '', entries: [], raw: null, openIndex: -1,
    dirty: false, saving: false, error: '', pendingUnknown: false,
    saveNotice: '', backup: '',
    versions: [], versionsError: '', versionsState: 'idle', versionsAt: 0,
  });
  function freshWb() { return { ...EMPTY_WB, files: [], entries: [], versions: [] }; }
  // Componentes MVU\uff1aSolo lectura\u3001\u3001\u3002 Zod \uff0cSí PASS/FAIL\u3002
  const EMPTY_MVU = Object.freeze({
    root: '', rootInput: '', files: [], filesState: 'idle', folderError: '', picking: false,
    selectedPath: '', loadingFile: false, file: null, meta: null, schema: null, reason: '',
    warnings: [], error: '', inspectedAt: 0,
  });
  function freshMvu() { return { ...EMPTY_MVU, files: [], warnings: [] }; }

  /* ---------------- M5\uff1a\u6301\u4e45\u5de5\u4f5c\u533a / elementos\u76ee / \u5361\u76ee\u5f55\u72b6\u6001 ---------------- */

  const WORKSPACE_KEY = 'godhand.workspace.v1';
  const WORKSPACE_ROUTES = Object.freeze({
    state: '/godhand/workspace',
    scan: '/godhand/project/scan',
    cardList: '/godhand/card/list',
    cardRead: '/godhand/card/read',
    cardInspect: '/godhand/card/inspect',
  });
  function workspaceString(value) { return typeof value === 'string' ? value : ''; }
  function normalizeProject(raw, index) {
    if (!raw || typeof raw !== 'object') return null;
    const root = workspaceString(raw.root);
    if (!root) return null;
    return {
      id: workspaceString(raw.id) || 'p-snapshot-' + index,
      root,
      label: workspaceString(raw.label) || basename(root),
      lastVersionDir: workspaceString(raw.lastVersionDir),
      lastCardPath: workspaceString(raw.lastCardPath),
      lastWorldbookRoot: workspaceString(raw.lastWorldbookRoot),
      lastWorldbookPath: workspaceString(raw.lastWorldbookPath),
      lastMvuRoot: workspaceString(raw.lastMvuRoot),
      lastMvuPath: workspaceString(raw.lastMvuPath),
      lastUsed: workspaceString(raw.lastUsed),
    };
  }
  function normalizeWorkspaceState(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const projects = (Array.isArray(source.projects) ? source.projects : []).map(normalizeProject).filter(Boolean);
    let activeProjectId = workspaceString(source.activeProjectId);
    if (!projects.some((project) => project.id === activeProjectId)) activeProjectId = projects.length ? projects[0].id : '';
    const fileState = (value) => ({ root: workspaceString(value && value.root), file: workspaceString(value && value.file) });
    return {
      version: Number(source.version) || 1,
      projects,
      activeProjectId,
      autoLatest: typeof source.autoLatest === 'boolean' ? source.autoLatest : true,
      worldbook: fileState(source.worldbook),
      mvu: fileState(source.mvu),
      ui: fileState(source.ui),
    };
  }
  function readWorkspaceSnapshot() {
    try {
      const raw = JSON.parse(localStorage.getItem(WORKSPACE_KEY) || 'null');
      return raw && typeof raw === 'object' ? normalizeWorkspaceState(raw) : null;
    } catch {
      return null;
    }
  }
  const EMPTY_WS = Object.freeze({
    loaded: false, hostAvailable: false, hostError: '', statePath: '', savedAt: '',
    projects: [], activeProjectId: '', autoLatest: true,
    rootInput: '', picking: false, addError: '',
    versions: [], versionsRoot: '', versionsLatest: '', scanBusy: false, scanError: '',
    cards: [], cardsRoot: '', cardsLatest: '', cardsBusy: false, cardError: '',
    cardMeta: {}, cardReadErrors: {}, activeCard: null,
    cardDetail: null, cardInspectBusy: false, cardInspectError: '',
    legacyFocus: 0, legacyTab: 'structure', varWork: null,
    managerOpen: false, busy: false, restoreNotice: '', cardMissing: '', newAvailable: null,
    persistError: '', restoring: false,
  });
  function freshWs() { return { ...EMPTY_WS, projects: [], versions: [], cards: [], cardMeta: {}, cardReadErrors: {} }; }
  const workspaceSnapshot = readWorkspaceSnapshot();
  // \uff1aopen \uff1bstatus  loading / ready / error\uff0c iframe\u3002
  const EMPTY_LIB = Object.freeze({ open: false, tab: 'design', title: '', status: 'idle', url: '', error: '' });
  function freshLib() { return { ...EMPTY_LIB }; }

  const store = createStore({
    ui: readUi() || { mode: 'compact', tab: 'skills', full: null, wheel: 0, wheelOn: true },
    sessionId: undefined,
    catalog: { sessionId: undefined, state: 'none', skills: [], error: '' },
    activity: EMPTY_ACTIVITY,
    wb: freshWb(),
    mvu: freshMvu(),
    ws: workspaceSnapshot ? {
      ...freshWs(),
      projects: workspaceSnapshot.projects,
      activeProjectId: workspaceSnapshot.activeProjectId,
      autoLatest: workspaceSnapshot.autoLatest,
    } : freshWs(),
    lib: freshLib(),
    toast: null,
    focus: null,
    drop: null,
  });
  function setUi(patch) {
    store.set((s) => ({ ui: { ...s.ui, ...patch } }));
    writeUi(store.get().ui);
  }
  function setWb(patch) { store.set((s) => ({ wb: { ...s.wb, ...patch } })); }
  function setMvu(patch) { store.set((s) => ({ mvu: { ...s.mvu, ...patch } })); }
  function setWs(patch) { store.set((s) => ({ ws: { ...s.ws, ...patch } })); }
  function setLib(patch) { store.set((s) => ({ lib: { ...s.lib, ...patch } })); }
  let toastSeq = 0;
  function toast(text) {
    const id = ++toastSeq;
    store.set({ toast: { id, text } });
    setTimeout(() => { const t = store.get().toast; if (t && t.id === id) store.set({ toast: null }); }, 2600);
  }

  /* ---------------- \u8ddf\u968f\u5c4f\u5e55\u4e0a\u7684\u4f1a\u8bdd ---------------- */

  let ctxRef = null;
  let tracked = null;
  const inputRegistry = new Map();

  function untrack() {
    if (!tracked) return;
    clearTimeout(tracked.retry);
    clearInterval(tracked.poll);
    for (const off of tracked.offs) { try { off(); } catch {} }
    tracked = null;
  }
  function track(sid) {
    if (tracked && tracked.sid === sid) return;
    untrack();
    store.set({
      sessionId: sid,
      activity: EMPTY_ACTIVITY,
      catalog: { sessionId: sid, state: sid ? 'loading' : 'none', skills: [], error: '' },
    });
    if (!sid) return;
    tracked = { sid, offs: [], retry: 0, poll: 0 };
    attach(sid, 0);
  }
  function bindingOf(sid) {
    try { return sid ? ctxRef.sessions.binding(sid) : undefined; } catch { return undefined; }
  }
  function isOpen(binding) {
    try { return binding.session.getSnapshot().openState === 'open'; } catch { return false; }
  }
  function attach(sid, attempt) {
    if (!tracked || tracked.sid !== sid) return;
    const binding = bindingOf(sid);
    const ready = binding && binding.eventSource && typeof binding.eventSource.subscribe === 'function' && binding.session;
    if (!ready || !isOpen(binding)) {
      if (attempt < 30) tracked.retry = setTimeout(() => attach(sid, attempt + 1), 400);
      else store.set({ catalog: { sessionId: sid, state: 'error', skills: [], error: 'No hay ninguna sesión abierta' } });
      return;
    }
    const es = binding.eventSource;
    const running = () => { try { return !!binding.session.getSnapshot().running; } catch { return false; } };
    let acc = newAcc();
    const publish = () => {
      if (!tracked || tracked.sid !== sid) return;
      const snap = es.getSnapshot();
      store.set({
        activity: {
          ready: true,
          calls: acc.calls.slice(-40),
          counts: { ...acc.counts },
          inUse: { ...acc.inUse },
          openTurn: acc.openTurn,
          soul: acc.soul,
          total: acc.calls.length,
          hasMore: !!(snap && snap.hasMore),
          running: running(),
        },
      });
    };
    const rescan = () => {
      acc = newAcc();
      const snap = es.getSnapshot();
      for (const entry of (snap && snap.entries) || []) applyEntry(acc, entry);
      acc.presetChanged = false;
      publish();
    };
    tracked.offs.push(es.subscribe(() => {
      const snap = es.getSnapshot();
      const change = snap && snap.change;
      if (change && change.kind === 'append') {
        let dirty = false;
        for (const entry of change.entries || []) dirty = applyEntry(acc, entry) || dirty;
        if (acc.presetChanged) { acc.presetChanged = false; loadCatalog(sid); }
        if (dirty) publish();
      } else {
        rescan();
      }
    }));
    rescan();
    let lastRunning = running();
    const onSession = () => { const r = running(); if (r !== lastRunning) { lastRunning = r; publish(); } };
    if (typeof binding.session.subscribe === 'function') tracked.offs.push(binding.session.subscribe(onSession));
    else tracked.poll = setInterval(onSession, 1000);
    loadCatalog(sid);
  }
  async function loadCatalog(sid) {
    store.set((s) => ({
      catalog: { sessionId: sid, state: 'loading', skills: s.catalog.sessionId === sid ? s.catalog.skills : [], error: '' },
    }));
    try {
      const result = await ctxRef.remote.skills.list({ sessionId: sid });
      if (store.get().sessionId !== sid) return;
      if (!result || !result.ok) {
        const e = result && result.error;
        throw new Error(e ? e.code + '\uff1a' + e.message : 'Error al leer');
      }
      const skills = ((result.value && result.value.skills) || []).map((k) => {
        const name = String(k.name);
        const meta = SKILL_META[name];
        return {
          name,
          description: String(k.description || ''),
          tag: meta ? meta.tag : 'Otros',
          zh: meta ? meta.short : '',
          detail: meta ? meta.detail : '',
          tw: TW_SKILLS.has(name),
        };
      });
      store.set({ catalog: { sessionId: sid, state: 'ready', skills, error: '' } });
    } catch (error) {
      if (store.get().sessionId !== sid) return;
      fail('catalog', error);
      store.set({ catalog: { sessionId: sid, state: 'error', skills: [], error: String(error && error.message || error) } });
    }
  }

  /* ---------------- \u52a8\u4f5c ---------------- */

  function composerEditable() {
    const els = [...document.querySelectorAll('[contenteditable="true"]')].filter((el) => {
      if (el.closest('.gh2-root')) return false;
      const r = el.getBoundingClientRect();
      return r.width > 40 && r.height > 8;
    });
    els.sort((a, b) => b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom);
    return els[0] || null;
  }
  /** \u8f93\u5165\u6846\u5916\u9762\u90a3\u5f20\u5706\u89d2\u5361\u7247\uff08\u62d6\u653e\u7684\u843d\u70b9\uff09\u3002 */
  function composerCard() {
    const ed = composerEditable();
    for (let el = ed, i = 0; el && el !== document.body && i < 10; el = el.parentElement, i++) {
      if (el.getBoundingClientRect().width >= 240 && parseFloat(getComputedStyle(el).borderTopLeftRadius) >= 12) return el;
    }
    return ed;
  }
  /** \u628a `/\u540d\u5b57 ` \u63d2\u5230Actual\u4f1a\u8bdd\u8f93\u5165\u6846\u7684\u5149\u6807\u5904\uff1b\u4e0d\u8986\u76d6\u5df2\u7ecf\u5199\u597d\u7684\u8349\u7a3f\u3002 */
  function insertSkill(name) {
    const sid = store.get().sessionId;
    const text = '/' + name + ' ';
    const actions = sid ? inputRegistry.get(sid) : undefined;
    if (actions && typeof actions.captureInsertion === 'function' && typeof actions.insertText === 'function') {
      try {
        if (actions.insertText(text, actions.captureInsertion()) !== false) {
          const el = composerEditable();
          if (el) { try { el.focus({ preventScroll: true }); } catch {} }
          toast('Insertado /' + name);
          return 'input-actions';
        }
      } catch (error) {
        fail('insert', error);
      }
    }
    const el = composerEditable();
    if (el) {
      el.focus();
      if (document.execCommand('insertText', false, text)) { toast('Insertado /' + name); return 'dom'; }
    }
    toast('no se encontró el campo de entrada');
    return null;
  }
  let focusSeq = 0;
  /** \u6253Activado\u5b8c\u6574\u6d6e\u7a97\u7684 Skill \u9875\u7b7e\uff0c\u5e76\u5c55Activado\u8fd9\u4e00\u9879\u3002 */
  function openSkill(name) {
    store.set({ focus: { name, seq: ++focusSeq } });
    setUi({ mode: 'full', tab: 'skills' });
  }
  function openTab(tab) {
    setUi({ mode: 'full', tab });
  }
  /** Ejecutar Skill\uff1a\u628a `/\u540d\u5b57` enviar a la sesión actual\uff0c\u548c\u7528\u6237\u5728\u8f93\u5165\u6846\u91cc\u6309\u56de\u8f66\u662f\u540c\u4e00\u6761\u8def\u5f84\u3002 */
  async function runSkill(name) {
    const s = store.get();
    const binding = bindingOf(s.sessionId);
    if (!binding) { toast('Abre primero una sesión'); return { ok: false, error: 'no-session' }; }
    if (s.activity.inUse[name]) return { ok: true, skipped: true };
    try {
      const result = await binding.session.prompt([{ type: 'text', text: '/' + name }], 'queue');
      if (result && result.ok === false) {
        const code = result.error && result.error.code;
        toast('Error al enviar' + (code ? '\uff1a' + code : ''));
        return { ok: false, error: code || 'failed' };
      }
      toast('Enviado /' + name);
      return { ok: true, name };
    } catch (error) {
      fail('run', error);
      toast('Error al enviar');
      return { ok: false, error: String(error && error.message || error) };
    }
  }
  /** Soul \u5207\u6362\uff1a\u53d1\u4e00\u6761 `/activate-tavernweave-soul <\u77ed\u8bed>`\uff0c\u7531 TW Soul \u81ea\u5df1\u89e3\u6790\u3002 */
  async function sendSoul(id) {
    const s = store.get();
    const binding = bindingOf(s.sessionId);
    if (!binding) { toast('Abre primero una sesión'); return { ok: false, error: 'no-session' }; }
    const current = s.activity.soul;
    let phrase;
    if (id === 'off') {
      if (current === 'off') return { ok: true, skipped: true };
      phrase = SOUL_OFF;
    } else {
      const soul = SOULS.find((x) => x.id === id);
      if (!soul || current === id) return { ok: true, skipped: true };
      phrase = current === 'off' ? soul.on : soul.swap;
    }
    try {
      const result = await binding.session.prompt([{ type: 'text', text: '/' + SOUL_SKILL + ' ' + phrase }], 'queue');
      if (result && result.ok === false) {
        const code = result.error && result.error.code;
        toast('Error al enviar' + (code ? '\uff1a' + code : ''));
        return { ok: false, error: code || 'failed' };
      }
      toast('Enviado: ' + phrase);
      return { ok: true, phrase };
    } catch (error) {
      fail('soul', error);
      toast('Error al enviar');
      return { ok: false, error: String(error && error.message || error) };
    }
  }

  /* ---------------- M5\uff1aTW \u8d44\u6599\u5e93\u906e\u7f69 ---------------- */

  let libSeq = 0;
  function errorText(error) { return error && error.message ? error.message : String(error); }
  function basename(path) {
    const text = String(path == null ? '' : path);
    const parts = text.split(/[\\/]/u);
    return parts[parts.length - 1] || text;
  }
  async function responseBody(res) {
    let text = '';
    try { text = await res.text(); } catch {}
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch {}
    return { text, data };
  }
  /** HTTP \u5931\u8d25\u7684\u7edf\u4e00\u6587\u6848\uff1a\u4f18\u5148\u7528\u5bbf\u4e3b JSON \u91cc\u7684 code / message\uff0c\u4e0d\u628a HTML \u5f53\u6210\u529f\u3002 */
  function failureText(res, text, data) {
    const code = data && typeof data.code === 'string' ? data.code : '';
    const message = data && typeof data.message === 'string' ? data.message : '';
    const clean = String(text || '').replace(/<[^>]*>/gu, ' ').replace(/\s+/gu, ' ').trim().slice(0, 180);
    const detail = [code, message].filter(Boolean).join('\uff1a') || clean || res.statusText || 'no hay \u54cd\u5e94\u4f53';
    return 'HTTP ' + res.status + ' · ' + detail;
  }
  /** \u540c\u6e90 POST JSON\uff1b\u53eaSí\u54cd\u5e94 ok === true \u624d\u5f53\u6210\u529f\uff0c\u5931\u8d25\u4fdd\u7559\u771f\u5b9e code / message\u3002 */
  async function postJson(url, body) {
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw new Error('\u8bf7\u6c42no hay \u53d1\u51fa\u53bb\uff1a' + errorText(error));
    }
    const { text, data } = await responseBody(res);
    if (!res.ok) throw new Error(failureText(res, text, data));
    if (!data || typeof data !== 'object') {
      throw new Error('HTTP ' + res.status + '  no devolvió JSON' + (text ? '\uff1a' + String(text).replace(/\s+/gu, ' ').slice(0, 120) : ''));
    }
    if (data.ok !== true) {
      const code = typeof data.code === 'string' ? data.code : 'failed';
      const message = typeof data.message === 'string' ? data.message : 'el host no devolvió ok=true';
      throw new Error(code + '\uff1a' + message);
    }
    return data;
  }
  /** Solo lectura GET JSON\uff1b\u548c POST \u4e00\u6837\u53ea\u63a5\u53d7 ok === true\u3002 */
  async function getJson(url) {
    let res;
    try {
      res = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });
    } catch (error) {
      throw new Error('\u8bf7\u6c42no hay \u53d1\u51fa\u53bb\uff1a' + errorText(error));
    }
    const { text, data } = await responseBody(res);
    if (!res.ok) throw new Error(failureText(res, text, data));
    if (!data || typeof data !== 'object') {
      throw new Error('HTTP ' + res.status + '  no devolvió JSON' + (text ? '\uff1a' + String(text).replace(/\s+/gu, ' ').slice(0, 120) : ''));
    }
    if (data.ok !== true) {
      const code = typeof data.code === 'string' ? data.code : 'failed';
      const message = typeof data.message === 'string' ? data.message : 'el host no devolvió ok=true';
      throw new Error(code + '\uff1a' + message);
    }
    return data;
  }
  /** \u6253Activado iframe \u524d\u5148\u786e\u8ba4\u8def\u7531\u771f\u7684\u8fd4\u56de\u4e86 TW \u6311\u9009\u9875\uff1b503/404/\u522b\u7684\u9759\u6001\u9875\u90fd\u5f53\u5931\u8d25\u3002 */
  async function probeLibrary() {
    let res;
    try {
      res = await fetch(M5.libPage, { method: 'GET', headers: { accept: 'text/html' } });
    } catch (error) {
      throw new Error('Falló la solicitud de ruta: ' + errorText(error));
    }
    if (!res.ok) {
      const { text, data } = await responseBody(res);
      throw new Error(failureText(res, text, data));
    }
    const html = await res.text();
    if (!/TavernWeave Library/u.test(html) && !/picker\.js/u.test(html)) {
      throw new Error('HTTP ' + res.status + ' \u8fd4\u56de\u7684\u4e0dsí TW \u6311\u9009\u9875\uff08\u8def\u7531\u53ef\u80fd\u6ca1\u6ce8\u518c\uff0c\u6216Coincidencia\u4e86\u522b\u7684\u9759\u6001\u9875\uff09');
    }
  }
  async function openLibrary(tab) {
    if (tab !== 'design' && tab !== 'motion') return { ok: false, error: 'unknown-library-tab' };
    if (store.get().ws.managerOpen) setWs({ managerOpen: false });
    const seq = ++libSeq;
    const url = M5.libPage + '#' + tab;
    setLib({ open: true, tab, title: M5.libTitles[tab], status: 'loading', url: '', error: '' });
    try {
      await probeLibrary();
      if (seq !== libSeq || !store.get().lib.open) return { ok: false, error: 'closed' };
      setLib({ status: 'ready', url });
      return { ok: true, url };
    } catch (error) {
      if (seq !== libSeq) return { ok: false, error: 'superseded' };
      setLib({ status: 'error', url: '', error: 'No se encontró la biblioteca: ' + errorText(error) });
      return { ok: false, error: errorText(error) };
    }
  }
  function closeLibrary() {
    libSeq += 1;
    setLib(freshLib());
  }

  /* ---------------- M5\uff1a\u4e16\u754c\u4e66\u771f\u5b9e\u6587\u4ef6\uff08select / read / save / versions\uff09 ---------------- */

  let wbSeq = 0;
  let saveSeq = 0;
  let verSeq = 0;
  let mvuSeq = 0;
  function parseKeys(text) {
    return String(text == null ? '' : text).split(/[,\uff0c]/u).map((s) => s.trim()).filter(Boolean);
  }
  function asStringList(value) {
    if (Array.isArray(value)) return value.filter((x) => typeof x === 'string' || typeof x === 'number').map((x) => String(x));
    if (typeof value === 'string') return parseKeys(value);
    return [];
  }
  function wbKind(raw) {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)
      && raw.entries && typeof raw.entries === 'object' && !Array.isArray(raw.entries)) return 'st-object';
    if (Array.isArray(raw)) return 'st-array';
    return 'unknown';
  }
  function normalizeWbEntry(source, slot, fallbackUid) {
    const e = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    const keys = asStringList(e.key !== undefined ? e.key : e.keys);
    return {
      slot: String(slot),
      uid: e.uid !== undefined && e.uid !== null ? e.uid : fallbackUid,
      comment: String(e.comment !== undefined ? e.comment : e.title !== undefined ? e.title : ''),
      content: String(e.content !== undefined ? e.content : e.body !== undefined ? e.body : ''),
      keys,
      keysText: keys.join(', '),
      secondary: asStringList(e.keysecondary !== undefined ? e.keysecondary : e.secondary),
    };
  }
  /** \u524d\u7aef\u5f52\u4e00\u5316\uff1ast-object \u53d6 json.entries \u5bf9\u8c61\uff0cst-array \u53d6\u6570\u7ec4\uff1b\u5176\u4ed6\u4e00\u5f8b unknown\u3002 */
  function normalizeWb(raw) {
    const kind = wbKind(raw);
    if (kind === 'st-object') {
      const entries = raw.entries;
      return {
        kind,
        entries: Object.keys(entries).map((slot) => normalizeWbEntry(entries[slot], slot, /^\d+$/u.test(slot) ? Number(slot) : undefined)),
      };
    }
    if (kind === 'st-array') return { kind, entries: raw.map((entry, index) => normalizeWbEntry(entry, index, index)) };
    return { kind, entries: [] };
  }
  // Entradas\uff08comment/title\u3001content/body\u3001key/keys…\uff09\uff0cSí ST \u3002
  const WB_WRITE_FIELDS = Object.freeze({
    comment: ['comment', 'title'],
    content: ['content', 'body'],
    key: ['key', 'keys'],
    keysecondary: ['keysecondary', 'secondary'],
  });
  function writeWbField(target, names, value) {
    const name = names.find((n) => Object.prototype.hasOwnProperty.call(target, n)) || names[0];
    target[name] = value;
  }
  function writeWbEntry(target, entry) {
    writeWbField(target, WB_WRITE_FIELDS.comment, String(entry.comment || ''));
    writeWbField(target, WB_WRITE_FIELDS.content, String(entry.content || ''));
    writeWbField(target, WB_WRITE_FIELDS.key, parseKeys(entry.keysText));
    writeWbField(target, WB_WRITE_FIELDS.keysecondary, asStringList(entry.secondary));
  }
  /** \u57fa\u4e8e\u539f raw Estructura\u56de\u5199\u7f16\u8f91\uff1b\u4fdd\u7559\u672a\u77e5\u5b57\u6bb5\uff0c\u4e0d\u91cd\u6392Entradas\u3002 */
  function buildWbSaveJson(wb) {
    if (!wb.raw || typeof wb.raw !== 'object') throw new Error('no hay \u53efGuardar\u7684 JSON\uff08\u6587\u4ef6\u6ca1\u8bfb\u5230\uff0c\u6216\u6839\u8282\u70b9\u4e0dsí\u5bf9\u8c61/\u6570\u7ec4\uff09');
    if (wb.kind !== 'st-object' && wb.kind !== 'st-array') return wb.raw;
    const clone = JSON.parse(JSON.stringify(wb.raw));
    if (wb.kind === 'st-array') {
      wb.entries.forEach((entry, index) => {
        const target = clone[index];
        if (target && typeof target === 'object' && !Array.isArray(target)) writeWbEntry(target, entry);
      });
    } else {
      wb.entries.forEach((entry) => {
        const target = clone.entries[entry.slot];
        if (target && typeof target === 'object' && !Array.isArray(target)) writeWbEntry(target, entry);
      });
    }
    return clone;
  }
  function formatSize(bytes) {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n < 0) return '';
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KiB';
    return (n / 1024 / 1024).toFixed(1) + ' MiB';
  }
  function formatMtime(value) {
    if (value === undefined || value === null || value === '') return '\u65f6\u95f4desconocido';
    let d;
    if (typeof value === 'number' || /^\d+$/u.test(String(value))) {
      const n = Number(value);
      d = new Date(n < 1e12 ? n * 1000 : n);
    } else {
      d = new Date(value);
    }
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString('zh-CN', { hour12: false });
  }
  function jsonPreview(value) {
    try {
      const text = JSON.stringify(value, null, 2);
      if (typeof text !== 'string') return String(value);
      return text.length > 20000 ? text.slice(0, 20000) + '\n…\uff08\u5df2\u622a\u65ad\uff0c\u539f\u59cb\u6587\u4ef6\u66f4\u5927\uff09' : text;
    } catch (error) {
      return 'No\u6cd5\u663e\u793a JSON\uff1a' + errorText(error);
    }
  }
  function updateWbEntry(index, patch) {
    const wb = store.get().wb;
    if (!(index >= 0) || index >= wb.entries.length) return;
    const entries = wb.entries.slice();
    entries[index] = { ...entries[index], ...patch };
    setWb({ entries, dirty: true, saveNotice: '', pendingUnknown: false });
  }
  /** \u7edf\u4e00\u8c03\u7528\u5bbf\u4e3b\u7684\u539f\u751f\u76ee\u5f55\u9009\u62e9\u5668\uff1bCancelar\u8fd4\u56de cancelled\uff0c\u670d\u52a1\u7f3a\u5931/\u5f02\u5e38\u4fdd\u7559\u771f\u5b9e\u539f\u56e0\u3002 */
  async function requestHostDirectory() {
    let rp;
    try { rp = ctxRef && ctxRef.remote ? ctxRef.remote.directoryPicker : undefined; } catch { rp = undefined; }
    if (!rp || typeof rp.pick !== 'function') return { ok: false, reason: 'unavailable' };
    let result;
    try {
      result = await rp.pick();
    } catch (error) {
      return { ok: false, reason: 'error', detail: errorText(error) };
    }
    if (!result || result.ok !== true) {
      const e = result && result.error;
      return { ok: false, reason: 'error', detail: e ? [e.code, e.message].filter(Boolean).join('\uff1a') : 'Error desconocido' };
    }
    const path = result.value;
    if (path === null || path === undefined) return { ok: true, cancelled: true };
    if (typeof path !== 'string' || !path.trim()) return { ok: false, reason: 'empty' };
    return { ok: true, path };
  }
  function directoryPickMessage(pick) {
    if (pick.reason === 'unavailable') return 'El host no ofrece el selector de directorios (remote.directoryPicker). Usa «o introduce una ruta» para abrir el directorio.';
    if (pick.reason === 'empty') return 'El selector devolvió una ruta vacía. Usa una ruta de directorio.';
    return 'Falló el selector de directorios: ' + (pick.detail || 'Error desconocido') + '\u3002\u8bf7\u6539\u7528\u76ee\u5f55\u8def\u5f84\u3002';
  }
  async function pickWorldbookRoot() {
    if (store.get().wb.picking) return { ok: false, error: 'busy' };
    setWb({ picking: true, folderError: '' });
    try {
      const pick = await requestHostDirectory();
      if (pick.cancelled) {
        toast('Selección de directorio cancelada');
        return { ok: true, cancelled: true };
      }
      if (!pick.ok) {
        setWb({ folderError: directoryPickMessage(pick) });
        return { ok: false, error: pick.detail || pick.reason };
      }
      setWb({ rootInput: pick.path });
      return await openWorldbookRoot(pick.path);
    } finally {
      if (store.get().wb.picking) setWb({ picking: false });
    }
  }
  async function openWorldbookRoot(input) {
    const root = String(input == null ? '' : input).trim();
    const current = store.get().wb;
    if (!root) {
      setWb({ folderError: 'Introduce primero la ruta absoluta del directorio de la worldbook.' });
      return { ok: false, error: 'empty-root' };
    }
    if (current.dirty && typeof window.confirm === 'function'
      && !window.confirm('Actual\u4e16\u754c\u4e66\u8fd8no se ha Guardar\u4fee\u6539\u3002\u5207\u6362\u76ee\u5f55\u4f1a\u4e22\u6389\u8fd9\u4e9b\u4fee\u6539\uff0c\u7ee7\u7eed\u5417\uff1f')) {
      return { ok: false, cancelled: true };
    }
    const seq = ++wbSeq;
    setWb({ ...freshWb(), rootInput: root, filesState: 'loading', picking: false });
    try {
      const data = await postJson(M5.api.select, { root });
      if (seq !== wbSeq) return { ok: false, error: 'superseded' };
      const files = (Array.isArray(data.files) ? data.files : []).map((file) => ({
        path: String(file && file.path ? file.path : ''),
        name: String(file && file.name ? file.name : basename(file && file.path)),
        size: Number(file && file.size),
        mtime: file && file.mtime !== undefined ? file.mtime : null,
      })).filter((file) => file.path);
      const shownRoot = typeof data.root === 'string' && data.root ? data.root : root;
      setWb({ root: shownRoot, files, filesState: 'ready', folderError: '', error: '' });
      clearRestoreNotice('\u4e16\u754c\u4e66');
      // \uff1b selectedMvuRoot\u3002
      const mvuSync = await openMvuRoot(shownRoot);
      patchActiveProject({ lastWorldbookRoot: shownRoot, lastMvuRoot: store.get().mvu.root || '' });
      scheduleWorkspaceSave();
      return { ok: true, root: shownRoot, files: files.length, mvuSync: mvuSync.ok };
    } catch (error) {
      if (seq !== wbSeq) return { ok: false, error: 'superseded' };
      setWb({ ...freshWb(), rootInput: root, filesState: 'error', folderError: errorText(error) });
      return { ok: false, error: errorText(error) };
    }
  }
  async function readWorldbookFile(path) {
    const target = String(path == null ? '' : path);
    if (!target) return { ok: false, error: 'empty-path' };
    const current = store.get().wb;
    if (current.dirty && typeof window.confirm === 'function'
      && !window.confirm('Actual\u6587\u4ef6\u8fd8no se ha Guardar\u4fee\u6539\u3002\u91cd\u65b0\u8bfb\u53d6\u4f1a\u4e22\u6389\u8fd9\u4e9b\u4fee\u6539\uff0c\u7ee7\u7eed\u5417\uff1f')) {
      return { ok: false, cancelled: true };
    }
    const seq = ++wbSeq;
    setWb({
      selectedPath: target, loadingFile: true, kind: '', entries: [], raw: null, openIndex: -1,
      dirty: false, error: '', saveNotice: '', backup: '', pendingUnknown: false,
      versions: [], versionsError: '', versionsState: 'idle', versionsAt: 0,
    });
    try {
      const data = await postJson(M5.api.read, { path: target });
      if (seq !== wbSeq) return { ok: false, error: 'superseded' };
      const raw = data.json === undefined ? null : data.json;
      const normalized = normalizeWb(raw);
      setWb({
        selectedPath: typeof data.path === 'string' && data.path ? data.path : target,
        loadingFile: false,
        kind: normalized.kind,
        raw,
        entries: normalized.entries,
        openIndex: normalized.entries.length ? 0 : -1,
        dirty: false,
        error: '',
      });
      const shownPath = store.get().wb.selectedPath;
      clearRestoreNotice('\u4e16\u754c\u4e66');
      patchActiveProject({ lastWorldbookRoot: store.get().wb.root, lastWorldbookPath: shownPath });
      scheduleWorkspaceSave();
      refreshWbVersions(shownPath);
      return { ok: true, kind: normalized.kind, entries: normalized.entries.length };
    } catch (error) {
      if (seq !== wbSeq) return { ok: false, error: 'superseded' };
      setWb({ loadingFile: false, kind: '', raw: null, entries: [], openIndex: -1, error: errorText(error) });
      return { ok: false, error: errorText(error) };
    }
  }
  async function refreshWbVersions(path) {
    const target = String(path == null ? '' : path);
    if (!target) return { ok: false, error: 'empty-path' };
    if (store.get().wb.selectedPath !== target) return { ok: false, error: 'stale-file' };
    const seq = ++verSeq;
    setWb({ versionsState: 'loading', versionsError: '' });
    try {
      const data = await postJson(M5.api.versions, { path: target });
      if (seq !== verSeq || store.get().wb.selectedPath !== target) return { ok: false, error: 'superseded' };
      const versions = (Array.isArray(data.versions) ? data.versions : []).map((version) => ({
        path: String(version && version.path ? version.path : ''),
        name: String(version && version.name ? version.name : basename(version && version.path)),
        size: Number(version && version.size),
        mtime: version && version.mtime !== undefined ? version.mtime : null,
      })).filter((version) => version.path);
      setWb({ versions, versionsState: 'ready', versionsError: '', versionsAt: Date.now() });
      return { ok: true, versions: versions.length };
    } catch (error) {
      if (seq !== verSeq) return { ok: false, error: 'superseded' };
      setWb({ versions: [], versionsState: 'error', versionsError: errorText(error), versionsAt: Date.now() });
      return { ok: false, error: errorText(error) };
    }
  }
  async function saveWorldbook() {
    const wb = store.get().wb;
    if (wb.saving) return { ok: false, error: 'busy' };
    if (!wb.selectedPath) return { ok: false, error: 'no-file' };
    if (wb.kind === 'unknown' && !wb.pendingUnknown) {
      setWb({ pendingUnknown: true, saveNotice: '', error: '' });
      return { ok: false, confirm: true };
    }
    let json;
    try {
      json = wb.kind === 'st-object' || wb.kind === 'st-array' ? buildWbSaveJson(wb) : wb.raw;
    } catch (error) {
      setWb({ error: 'No\u6cd5\u751f\u6210Guardar\u5185\u5bb9\uff1a' + errorText(error) });
      return { ok: false, error: errorText(error) };
    }
    if (json === null || json === undefined) {
      setWb({ error: 'no hay \u53efGuardar\u7684 JSON\uff08\u6587\u4ef6\u6ca1\u8bfb\u5230\uff0c\u6216\u6839\u8282\u70b9sí null\uff09\u3002' });
      return { ok: false, error: 'no-json' };
    }
    const seq = ++saveSeq;
    setWb({ saving: true, error: '', pendingUnknown: false });
    try {
      const data = await postJson(M5.api.save, { path: wb.selectedPath, json });
      if (seq !== saveSeq) return { ok: false, error: 'superseded' };
      const savedPath = typeof data.path === 'string' && data.path ? data.path : wb.selectedPath;
      const backup = typeof data.backup === 'string' ? data.backup : '';
      if (store.get().wb.selectedPath !== wb.selectedPath) {
        // GuardarArchivo: \uff0c\u3002
        setWb({ saving: false });
        toast('\u5df2Guardar\u4e0a\u4e00\u4e2a\u6587\u4ef6\uff1bActual\u6587\u4ef6no hay \u88ab\u8986\u76d6');
        return { ok: true, path: savedPath, backup, switched: true };
      }
      setWb({
        saving: false, dirty: false, raw: json, selectedPath: savedPath, backup,
        saveNotice: 'Guardado en disco: ' + savedPath + (backup ? '\uff1bcopia anterior: ' + backup : '\uff1bel host no devolvió la ruta de la copia'),
      });
      patchActiveProject({ lastWorldbookRoot: store.get().wb.root, lastWorldbookPath: savedPath });
      scheduleWorkspaceSave();
      refreshWbVersions(savedPath);
      toast('Worldbook guardada');
      return { ok: true, path: savedPath, backup };
    } catch (error) {
      if (seq !== saveSeq) return { ok: false, error: 'superseded' };
      if (store.get().wb.selectedPath !== wb.selectedPath) {
        setWb({ saving: false });
        toast('Falló el guardado del archivo anterior: ' + errorText(error));
        return { ok: false, error: errorText(error), switched: true };
      }
      setWb({ saving: false, error: errorText(error) });
      return { ok: false, error: errorText(error) };
    }
  }

  /* ---------------- M5\uff1aComponentes MVU\u76ee\u5f55 / Zod Schema \u9759\u6001\u89e3\u6790 ---------------- */

  function normalizeMvuFile(file) {
    return {
      path: String(file && file.path ? file.path : ''),
      name: String(file && file.name ? file.name : basename(file && file.path)),
      size: Number(file && file.size),
      mtime: file && file.mtime !== undefined ? file.mtime : null,
    };
  }
  function normalizeMvuSchema(schema) {
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return null;
    return {
      parser: typeof schema.parser === 'string' ? schema.parser : '',
      roots: Array.isArray(schema.roots) ? schema.roots : [],
      nodeCount: Number(schema.nodeCount) || 0,
      warnings: Array.isArray(schema.warnings) ? schema.warnings.map((warning) => String(warning)) : [],
    };
  }
  async function pickMvuRoot() {
    if (store.get().mvu.picking) return { ok: false, error: 'busy' };
    setMvu({ picking: true, folderError: '' });
    try {
      const pick = await requestHostDirectory();
      if (pick.cancelled) {
        toast('Selección de directorio cancelada');
        return { ok: true, cancelled: true };
      }
      if (!pick.ok) {
        setMvu({ folderError: directoryPickMessage(pick) });
        return { ok: false, error: pick.detail || pick.reason };
      }
      setMvu({ rootInput: pick.path });
      return await openMvuRoot(pick.path);
    } finally {
      if (store.get().mvu.picking) setMvu({ picking: false });
    }
  }
  async function openMvuRoot(input) {
    const root = String(input == null ? '' : input).trim();
    if (!root) {
      setMvu({ folderError: 'Introduce primero la ruta absoluta del directorio de componentes MVU.' });
      return { ok: false, error: 'empty-root' };
    }
    const seq = ++mvuSeq;
    setMvu({ ...freshMvu(), rootInput: root, filesState: 'loading', picking: false });
    try {
      const data = await postJson(M5.api.mvuSelect, { root });
      if (seq !== mvuSeq) return { ok: false, error: 'superseded' };
      const files = (Array.isArray(data.files) ? data.files : []).map(normalizeMvuFile).filter((file) => file.path);
      const shownRoot = typeof data.root === 'string' && data.root ? data.root : root;
      setMvu({ root: shownRoot, files, filesState: 'ready', folderError: '', error: '' });
      clearRestoreNotice('MVU');
      patchActiveProject({ lastMvuRoot: shownRoot });
      scheduleWorkspaceSave();
      return { ok: true, root: shownRoot, files: files.length };
    } catch (error) {
      if (seq !== mvuSeq) return { ok: false, error: 'superseded' };
      setMvu({ ...freshMvu(), rootInput: root, filesState: 'error', folderError: errorText(error) });
      return { ok: false, error: errorText(error) };
    }
  }
  async function inspectMvuFile(path) {
    const target = String(path == null ? '' : path);
    if (!target) return { ok: false, error: 'empty-path' };
    const seq = ++mvuSeq;
    setMvu({
      selectedPath: target, loadingFile: true, file: null, meta: null, schema: null,
      reason: '', warnings: [], error: '', inspectedAt: 0,
    });
    try {
      const data = await postJson(M5.api.mvuInspect, { path: target });
      if (seq !== mvuSeq) return { ok: false, error: 'superseded' };
      const file = data.file && typeof data.file === 'object' ? normalizeMvuFile(data.file) : null;
      const meta = data.meta && typeof data.meta === 'object' ? {
        type: data.meta.type,
        enabled: data.meta.enabled,
        name: data.meta.name,
        id: data.meta.id,
        contentLength: data.meta.contentLength,
      } : null;
      const schema = normalizeMvuSchema(data.schema);
      // Sí schema  warnings \uff08parse-error / no-zod-object\uff09\uff1bSí schema  schema.warnings\u3002
      const topWarnings = Array.isArray(data.warnings) ? data.warnings.map((warning) => String(warning)) : [];
      setMvu({
        loadingFile: false,
        selectedPath: file && file.path ? file.path : target,
        file,
        meta,
        schema,
        reason: !schema && typeof data.reason === 'string' ? data.reason : '',
        warnings: schema ? schema.warnings : topWarnings,
        error: '',
        inspectedAt: Date.now(),
      });
      clearRestoreNotice('MVU');
      patchActiveProject({ lastMvuRoot: store.get().mvu.root, lastMvuPath: store.get().mvu.selectedPath });
      scheduleWorkspaceSave();
      return { ok: true, schema: !!schema, reason: !schema && typeof data.reason === 'string' ? data.reason : '' };
    } catch (error) {
      if (seq !== mvuSeq) return { ok: false, error: 'superseded' };
      setMvu({ loadingFile: false, schema: null, reason: '', warnings: [], error: errorText(error) });
      return { ok: false, error: errorText(error) };
    }
  }

  /* ---------------- M5\uff1a\u5de5\u4f5c\u533a\u6301\u4e45\u5316 / elementos\u76ee\u7ba1\u7406 / \u5361\u76ee\u5f55 ---------------- */

  let wsLoadSeq = 0;
  let wsRefreshInFlight = false;
  let wsRestoring = false;
  let cardSeq = 0;
  let cardInspectSeq = 0;
  const AUTO_VERSION_CARD_LIMIT = 8;
  let wsSaveTimer = 0;
  let wsPersistSeq = 0;
  let wsNoticeKey = '';

  function projectById(id) { return store.get().ws.projects.find((project) => project.id === id) || null; }
  function activeProject() { return projectById(store.get().ws.activeProjectId); }
  function patchActiveProject(patch) {
    const ws = store.get().ws;
    if (!ws.activeProjectId) return;
    setWs({ projects: ws.projects.map((project) => (project.id === ws.activeProjectId ? { ...project, ...patch } : project)) });
  }
  function workspaceStateFromStore() {
    const s = store.get();
    const ws = s.ws;
    const now = new Date().toISOString();
    const projects = ws.projects.map((project) => {
      if (project.id !== ws.activeProjectId) return { ...project };
      return {
        ...project,
        lastVersionDir: ws.versionsRoot || project.lastVersionDir || '',
        lastCardPath: (ws.activeCard && ws.activeCard.file && ws.activeCard.file.path) || project.lastCardPath || '',
        lastWorldbookRoot: s.wb.root || project.lastWorldbookRoot || '',
        lastWorldbookPath: s.wb.selectedPath || project.lastWorldbookPath || '',
        lastMvuRoot: s.mvu.root || project.lastMvuRoot || '',
        lastMvuPath: s.mvu.selectedPath || project.lastMvuPath || '',
        lastUsed: now,
      };
    });
    return {
      version: 1,
      projects,
      activeProjectId: ws.activeProjectId,
      autoLatest: ws.autoLatest,
      worldbook: { root: s.wb.root || '', file: s.wb.selectedPath || '' },
      mvu: { root: s.mvu.root || '', file: s.mvu.selectedPath || '' },
      ui: { root: '', file: '' },
    };
  }
  function writeWorkspaceSnapshot(state) {
    try {
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify({ ...state, savedAt: new Date().toISOString() }));
    } catch {}
  }
  async function saveWorkspaceState(state) {
    const seq = ++wsPersistSeq;
    try {
      const data = await postJson(WORKSPACE_ROUTES.state, { state });
      if (seq !== wsPersistSeq) return { ok: true, stale: true };
      setWs({ savedAt: typeof data.savedAt === 'string' ? data.savedAt : new Date().toISOString(), persistError: '' });
      return { ok: true };
    } catch (error) {
      if (seq !== wsPersistSeq) return { ok: false, stale: true };
      setWs({ persistError: errorText(error) });
      return { ok: false, error: errorText(error) };
    }
  }
  function scheduleWorkspaceSave() {
    const state = workspaceStateFromStore();
    writeWorkspaceSnapshot(state);
    if (!store.get().ws.hostAvailable || wsRestoring) return;
    if (wsSaveTimer) clearTimeout(wsSaveTimer);
    wsSaveTimer = setTimeout(() => {
      wsSaveTimer = 0;
      saveWorkspaceState(state);
    }, 300);
  }
  function addRestoreNotice(text) {
    if (!text) return;
    const current = store.get().ws.restoreNotice;
    if (current.includes(text)) return;
    setWs({ restoreNotice: current ? current + '\n' + text : text });
  }
  function clearRestoreNotice(part) {
    const current = store.get().ws.restoreNotice;
    if (!current) return;
    const lines = current.split('\n');
    const kept = lines.filter((line) => !line.includes(part));
    if (kept.length !== lines.length) setWs({ restoreNotice: kept.join('\n') });
  }
  function normalizeVersion(value) {
    return {
      path: workspaceString(value && value.path),
      name: workspaceString(value && value.name) || basename(value && value.path),
      relative: workspaceString(value && value.relative),
      version: workspaceString(value && value.version),
      mtime: value && value.mtime !== undefined ? value.mtime : null,
    };
  }
  function normalizeCardFile(value) {
    return {
      path: workspaceString(value && value.path),
      name: workspaceString(value && value.name) || basename(value && value.path),
      size: Number(value && value.size),
      mtime: value && value.mtime !== undefined ? value.mtime : null,
      version: workspaceString(value && value.version),
    };
  }
  function normalizeCardRead(data) {
    const file = normalizeCardFile(data && data.file);
    const meta = data && data.meta && typeof data.meta === 'object' ? data.meta : {};
    return {
      kind: workspaceString(data && data.kind) || 'unknown',
      file,
      meta: {
        name: workspaceString(meta.name),
        spec: workspaceString(meta.spec),
        specVersion: workspaceString(meta.specVersion),
        characterName: workspaceString(meta.characterName),
        characterVersion: workspaceString(meta.characterVersion),
        creator: workspaceString(meta.creator),
        createDate: workspaceString(meta.createDate),
      },
      hasWorldbook: !!(data && data.hasWorldbook),
      worldbookEntryCount: Number(data && data.worldbookEntryCount) || 0,
      scriptCount: Number(data && data.scriptCount) || 0,
      regexCount: Number(data && data.regexCount) || 0,
    };
  }
  function splitCardKeys(value) {
    const source = Array.isArray(value) ? value : (typeof value === 'string' ? value.split(/[,\uff0c]/u) : []);
    return source.map((item) => workspaceString(item).trim()).filter(Boolean);
  }
  function normalizeCardWorldbookEntry(value, index) {
    const raw = value && typeof value === 'object' ? value : {};
    const keys = splitCardKeys(raw.keys).length ? splitCardKeys(raw.keys)
      : (typeof raw.key === 'string' ? splitCardKeys(raw.key) : []);
    const secondary = splitCardKeys(raw.secondary).length ? splitCardKeys(raw.secondary)
      : splitCardKeys(raw.keysecondary);
    return {
      key: workspaceString(raw.key) || keys.join(', '),
      uid: raw.uid !== undefined && raw.uid !== null ? raw.uid : index,
      comment: workspaceString(raw.comment) || workspaceString(raw.title),
      content: workspaceString(raw.content),
      keys,
      secondary,
    };
  }
  function normalizeCardScript(value, index) {
    const raw = value && typeof value === 'object' ? value : {};
    return {
      id: workspaceString(raw.id),
      name: workspaceString(raw.name) || workspaceString(raw.id) || ('Script ' + (index + 1)),
      type: workspaceString(raw.type) || 'script',
      enabled: raw.enabled === true,
      contentLength: Number(raw.contentLength) || 0,
      hasSchema: raw.hasSchema === true,
    };
  }
  /** card/inspect \u7684 legacyVars \u901a\u5e38\u5f62\u5982 { stat_data: {...} }\uff1b\u53ea\u53d6Valor inicial\u5bf9\u8c61\uff0c\u539f\u6837Solo lectura\u3002 */
  function normalizeCardLegacys(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const candidate = value.stat_data !== undefined ? value.stat_data
      : (value.statData !== undefined ? value.statData : value);
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null;
    return { statData: candidate };
  }
  /** /card/inspect Solo lectura\u8f7d\u8377\uff1a\u5361\u5185\u4e16\u754c\u4e66\u3001\u9759\u6001 Zod\u3001\u811a\u672c\u5143\u4fe1\u606f\uff1b\u4e0dGuardar\u6b63\u6587\u5230 workspace\u3002 */
  function normalizeCardInspect(data) {
    const base = normalizeCardRead(data);
    const wbRaw = data && data.worldbook && typeof data.worldbook === 'object' ? data.worldbook : {};
    const entries = (Array.isArray(wbRaw.entries) ? wbRaw.entries : []).map(normalizeCardWorldbookEntry);
    const worldbook = {
      name: workspaceString(wbRaw.name),
      count: Number.isFinite(Number(wbRaw.count)) && Number(wbRaw.count) >= 0 ? Number(wbRaw.count) : entries.length,
      entries,
    };
    let mvu = null;
    if (data && data.mvu && typeof data.mvu === 'object' && !Array.isArray(data.mvu)) {
      const source = data.mvu;
      const scriptRaw = source.script && typeof source.script === 'object' ? source.script : {};
      const schema = normalizeMvuSchema(source.schema);
      const schemaScriptRaw = source.schemaScript && typeof source.schemaScript === 'object' ? source.schemaScript : null;
      const ruleEntries = (Array.isArray(source.updateRuleEntries) ? source.updateRuleEntries : [])
        .map((entry, index) => {
          const raw = entry && typeof entry === 'object' ? entry : {};
          return {
            id: raw.id !== undefined && raw.id !== null ? String(raw.id) : 'rule-' + (index + 1),
            name: workspaceString(raw.name) || ('Reglas de actualización ' + (index + 1)),
            content: workspaceString(raw.content),
          };
        })
        .filter((entry) => entry.content);
      if (!ruleEntries.length && source.updateRules) {
        ruleEntries.push({ id: 'rule-1', name: 'Reglas de actualización', content: workspaceString(source.updateRules) });
      }
      const initVarRaw = source.initVar && typeof source.initVar === 'object' ? source.initVar : null;
      mvu = {
        script: normalizeCardScript(scriptRaw, 0),
        schema,
        schemaSource: workspaceString(source.schemaSource),
        schemaScript: schemaScriptRaw ? {
          id: workspaceString(schemaScriptRaw.id),
          name: workspaceString(schemaScriptRaw.name),
        } : null,
        updateRules: workspaceString(source.updateRules) || ruleEntries.map((entry) => entry.content).join('\n\n'),
        updateRuleEntries: ruleEntries,
        initVarSource: workspaceString(source.initVarSource),
        initVarName: workspaceString(source.initVarName),
        initVar: initVarRaw && typeof initVarRaw.kind === 'string' ? {
          kind: initVarRaw.kind,
          id: initVarRaw.id !== undefined && initVarRaw.id !== null ? String(initVarRaw.id) : '',
          name: workspaceString(initVarRaw.name),
        } : null,
        reason: workspaceString(source.reason),
        warnings: Array.isArray(source.warnings) ? source.warnings.map((warning) => String(warning)) : [],
      };
      mvu.script.hasSchema = !!schema;
    }
    const scripts = (Array.isArray(data && data.scripts) ? data.scripts : []).map(normalizeCardScript);
    return {
      ...base,
      hasWorldbook: entries.length > 0 || base.hasWorldbook,
      worldbookEntryCount: worldbook.count,
      scriptCount: scripts.length,
      worldbook,
      mvu,
      scripts,
      legacyVars: normalizeCardLegacys(data && data.legacyVars),
    };
  }
  async function scanProjectRoot(root) {
    const data = await postJson(WORKSPACE_ROUTES.scan, { root });
    const versions = (Array.isArray(data.versions) ? data.versions : []).map(normalizeVersion).filter((version) => version.path);
    const latest = typeof data.latest === 'string' && data.latest
      ? data.latest
      : (versions.length ? versions[0].path : workspaceString(data.root) || root);
    return { root: workspaceString(data.root) || root, versions, latest };
  }
  async function cardListRoot(root) {
    const data = await postJson(WORKSPACE_ROUTES.cardList, { root });
    const files = (Array.isArray(data.files) ? data.files : []).map(normalizeCardFile).filter((file) => file.path);
    return {
      root: workspaceString(data.root) || root,
      files,
      latest: typeof data.latest === 'string' && data.latest ? data.latest : (files.length ? files[0].path : ''),
    };
  }
  function isCardRead(info) {
    return !!info && (info.kind === 'card-png' || info.kind === 'card-json');
  }
  async function inspectCardDetail(root, path, options = {}) {
    const seq = ++cardInspectSeq;
    setWs({ cardDetail: null, cardInspectBusy: true, cardInspectError: '' });
    try {
      const data = await postJson(WORKSPACE_ROUTES.cardInspect, { root, path });
      if (seq !== cardInspectSeq) return { ok: false, error: 'superseded' };
      const detail = normalizeCardInspect(data);
      setWs({ cardDetail: detail, cardInspectBusy: false, cardInspectError: '' });
      return { ok: true, detail };
    } catch (error) {
      if (seq !== cardInspectSeq) return { ok: false, error: 'superseded' };
      const message = errorText(error);
      setWs({ cardDetail: null, cardInspectBusy: false, cardInspectError: message });
      if (!options.silent) toast('Error al leer el contenido de la tarjeta: ' + message);
      return { ok: false, error: message };
    }
  }
  async function selectCard(root, path, options = {}) {
    const target = workspaceString(path);
    if (!target) return { ok: false, error: 'empty-path' };
    let info = store.get().ws.cardMeta[target];
    if (!info) {
      try {
        info = normalizeCardRead(await postJson(WORKSPACE_ROUTES.cardRead, { root, path: target }));
      } catch (error) {
        setWs({
          cardError: errorText(error), activeCard: null, cardDetail: null,
          cardInspectBusy: false, cardInspectError: '',
        });
        if (!options.silent) toast('Archivo de tarjetaError al leer\uff1a' + errorText(error));
        return { ok: false, error: errorText(error) };
      }
    }
    if (!isCardRead(info)) {
      const message = 'Este archivo es ' + (info.kind || 'unknown') + ', no es una tarjeta de personaje; selecciona un archivo PNG/JSON de tarjeta.';
      setWs({ cardError: message });
      if (!options.silent) toast(message);
      return { ok: false, error: message };
    }
    setWs({ activeCard: info, cardError: '', cardMissing: '' });
    clearRestoreNotice('Archivo de tarjeta');
    patchActiveProject({ lastCardPath: target });
    scheduleWorkspaceSave();
    const inspected = await inspectCardDetail(root, target, { silent: !!options.silent });
    return {
      ok: true,
      card: info,
      detail: inspected.ok ? inspected.detail : null,
      inspectError: inspected.ok ? '' : inspected.error,
    };
  }
  async function loadCards(root, options = {}) {
    const seq = ++cardSeq;
    cardInspectSeq += 1;
    setWs({
      cardsBusy: true, cards: [], cardsRoot: root, cardsLatest: '', cardError: '',
      cardMeta: {}, cardReadErrors: {}, activeCard: null, cardMissing: '',
      cardDetail: null, cardInspectBusy: false, cardInspectError: '',
    });
    let list;
    try {
      list = await cardListRoot(root);
    } catch (error) {
      if (seq === cardSeq) setWs({ cardsBusy: false, cardError: errorText(error) });
      return { ok: false, error: errorText(error) };
    }
    if (seq !== cardSeq) return { ok: false, error: 'superseded' };
    setWs({ cards: list.files, cardsRoot: list.root, cardsLatest: '', cardsBusy: false, cardError: '' });
    const meta = {};
    const errors = {};
    for (const file of list.files) {
      try {
        meta[file.path] = normalizeCardRead(await postJson(WORKSPACE_ROUTES.cardRead, { root: list.root, path: file.path }));
      } catch (error) {
        errors[file.path] = errorText(error);
      }
      if (seq !== cardSeq) return { ok: false, error: 'superseded' };
      setWs({ cardMeta: { ...meta }, cardReadErrors: { ...errors } });
    }
    const cardFiles = list.files.filter((file) => isCardRead(meta[file.path]));
    const latestCard = cardFiles.length ? cardFiles[0].path : '';
    setWs({ cardsLatest: latestCard });
    const wanted = options.selectLatest
      ? latestCard
      : (options.preferredPath && cardFiles.some((file) => file.path === options.preferredPath) ? options.preferredPath : '');
    let activePath = '';
    if (wanted) {
      const selected = await selectCard(list.root, wanted, { auto: !!options.auto, silent: true });
      if (selected.ok) activePath = wanted;
    } else if (options.selectLatest) {
      setWs({ cardMissing: 'no hay \u8bc6\u522b\u5230 PNG/JSON Archivo de tarjeta\uff1b\u4e16\u754c\u4e66 JSON \u4e0d\u7b97\u5361\u3002' });
    } else if (options.preferredPath) {
      setWs({ cardMissing: 'El archivo de tarjeta anterior ya no está; vuelve a elegirlo: ' + options.preferredPath });
    }
    scheduleWorkspaceSave();
    return { ok: true, files: list.files, latest: latestCard, anyLatest: list.latest, activePath };
  }
  /**
   * \u4ece host card/list \u7684\u987a\u5e8f\u91cc\u627e\u7b2c\u4e00\u4e2a\u771f\u6b63\u7684\u89d2\u8272\u5361\uff08card-png/card-json\uff09\u3002
   * \u4e16\u754c\u4e66 JSON \u53ef\u80fd\u8bed\u4e49\u7248\u672c\u66f4\u9ad8\u3001mtime \u66f4\u65b0\uff0c\u4f46\u5b83\u4e0d\u662f\u5361\uff0c\u4e0d\u80fd\u5f53\u6210“Más reciente\u5361”\u3002
   */
  async function latestCardInFiles(root, files) {
    for (const file of files) {
      let info = store.get().ws.cardMeta[file.path];
      if (!info) {
        try {
          info = normalizeCardRead(await postJson(WORKSPACE_ROUTES.cardRead, { root, path: file.path }));
        } catch {
          continue;
        }
        setWs({ cardMeta: { ...store.get().ws.cardMeta, [file.path]: info } });
      }
      if (isCardRead(info)) return { path: file.path, info };
    }
    return null;
  }
  /**
   * \u81ea\u52a8Más reciente\u8df3\u8fc7\u6ca1Sí\u5361\u7684\u6700\u9ad8\u7248\u672c\uff1bSí\u754c\u68c0\u67e5\u6700muchos 8\u7248\u672c\u3002
   * host \u7684 versions \u5df2\u6309 semver/mtime \u964d\u5e8f\uff0c\u8fd4\u56de\u7b2c\u4e00\u4e2aSí PNG/JSON \u5361\u7684\u7248\u672c\u3002
   */
  async function pickVersionWithCards(versions, latestPath) {
    const source = Array.isArray(versions) && versions.length
      ? versions
      : (latestPath ? [{ path: latestPath, name: basename(latestPath), relative: '' }] : []);
    const candidates = source.slice(0, AUTO_VERSION_CARD_LIMIT);
    let checked = 0;
    for (const version of candidates) {
      if (!version || !version.path) continue;
      checked += 1;
      try {
        const list = await cardListRoot(version.path);
        const card = await latestCardInFiles(version.path, list.files);
        if (card) return { found: true, version, checked };
      } catch {
        // \uff1b loadCards \u3002
      }
    }
    return { found: false, version: candidates[0] || null, checked };
  }
  function noCardsMessage(pick, latestPath) {
    const checked = pick && pick.checked ? pick.checked : 0;
    return 'no hay \u8bc6\u522b\u5230\u5361\uff1a\u5df2\u68c0\u67e5 ' + checked + ' versiones'
      + (latestPath ? '\uff0cLa versión más alta ' + basename(latestPath) + 'tampoco tiene una tarjeta PNG/JSON' : '')
      + '\u3002';
  }
  async function restoreWorldbookSelection(root, file) {
    if (!root) return { ok: true, skipped: true };
    const opened = await openWorldbookRoot(root);
    if (!opened.ok) {
      setWb({ root, rootInput: root, filesState: 'error', folderError: errorText(opened.error || 'Error al leer el directorio de la worldbook') });
      addRestoreNotice('El directorio de la worldbook anterior ya no está; vuelve a elegirlo: ' + root);
      return { ok: false, error: opened.error };
    }
    const target = workspaceString(file);
    if (target) {
      const wb = store.get().wb;
      if (wb.files.some((entry) => entry.path === target)) {
        const read = await readWorldbookFile(target);
        if (!read.ok) addRestoreNotice('Falló la lectura del archivo de worldbook anterior: ' + errorText(read.error));
      } else {
        setWb({ selectedPath: '', loadingFile: false, kind: '', entries: [], raw: null, openIndex: -1, dirty: false, error: '' });
        addRestoreNotice('El archivo de worldbook anterior ya no está; vuelve a elegirlo: ' + target);
      }
    }
    patchActiveProject({ lastWorldbookRoot: store.get().wb.root, lastWorldbookPath: store.get().wb.selectedPath || '' });
    scheduleWorkspaceSave();
    return { ok: true };
  }
  async function restoreMvuSelection(root, file) {
    if (!root) return { ok: true, skipped: true };
    const current = store.get().mvu;
    const alreadyOpen = current.root === root && current.filesState === 'ready';
    const opened = alreadyOpen ? { ok: true } : await openMvuRoot(root);
    if (!opened.ok) {
      setMvu({ root, rootInput: root, filesState: 'error', folderError: errorText(opened.error || 'Error al leer el directorio MVU') });
      addRestoreNotice('El directorio MVU anterior ya no está; vuelve a elegirlo: ' + root);
      return { ok: false, error: opened.error };
    }
    const target = workspaceString(file);
    if (target) {
      const mvu = store.get().mvu;
      if (mvu.files.some((entry) => entry.path === target)) {
        const read = await inspectMvuFile(target);
        if (!read.ok) addRestoreNotice('Falló la lectura del archivo MVU anterior: ' + errorText(read.error));
      } else {
        setMvu({ selectedPath: '', loadingFile: false, file: null, meta: null, schema: null, reason: '', warnings: [], error: '' });
        addRestoreNotice('El archivo MVU anterior ya no está; vuelve a elegirlo: ' + target);
      }
    }
    patchActiveProject({ lastMvuRoot: store.get().mvu.root, lastMvuPath: store.get().mvu.selectedPath || '' });
    scheduleWorkspaceSave();
    return { ok: true };
  }
  async function restoreWorkspaceState(state) {
    setWs({
      projects: state.projects, activeProjectId: state.activeProjectId, autoLatest: state.autoLatest,
      versions: [], versionsRoot: '', versionsLatest: '', scanError: '', cards: [], cardsRoot: '', cardsLatest: '',
      cardError: '', cardMissing: '', activeCard: null, restoreNotice: '',
      cardDetail: null, cardInspectBusy: false, cardInspectError: '',
    });
    const project = projectById(state.activeProjectId);
    if (project) {
      try {
        const scan = await scanProjectRoot(project.root);
        setWs({ versions: scan.versions, versionsLatest: scan.latest });
        const autoPick = state.autoLatest ? await pickVersionWithCards(scan.versions, scan.latest) : null;
        const preferred = autoPick && autoPick.version && autoPick.version.path
          ? autoPick.version.path
          : (state.autoLatest
            ? scan.latest
            : ((scan.versions.find((version) => version.path === project.lastVersionDir) || {}).path || scan.latest));
        setWs({ versionsRoot: preferred });
        await loadCards(preferred, {
          selectLatest: state.autoLatest,
          preferredPath: state.autoLatest ? '' : project.lastCardPath,
          auto: true,
        });
        if (autoPick && !autoPick.found) setWs({ cardMissing: noCardsMessage(autoPick, scan.latest) });
      } catch (error) {
        setWs({ scanError: errorText(error) });
      }
    }
    const wbRoot = state.worldbook.root || (project && project.lastWorldbookRoot) || '';
    const wbFile = wbRoot ? (state.worldbook.file || (project && project.lastWorldbookPath) || '') : '';
    const savedMvuRoot = state.mvu.root || (project && project.lastMvuRoot) || '';
    const sharedRoot = wbRoot || savedMvuRoot;
    if (sharedRoot) {
      await restoreWorldbookSelection(sharedRoot, wbFile);
      const alignedRoot = store.get().wb.root || sharedRoot;
      const sameRoot = !savedMvuRoot || savedMvuRoot === alignedRoot;
      const mvuFile = sameRoot ? (state.mvu.file || (project && project.lastMvuPath) || '') : '';
      if (!sameRoot) addRestoreNotice('El directorio de variables anterior era distinto del de la worldbook; se ha alineado con este: ' + alignedRoot);
      await restoreMvuSelection(alignedRoot, mvuFile);
    }
  }
  async function loadWorkspace() {
    const seq = ++wsLoadSeq;
    const snapshot = readWorkspaceSnapshot();
    let state = null;
    let hostError = '';
    let hostAvailable = false;
    let statePath = '';
    let savedAt = '';
    try {
      const data = await getJson(WORKSPACE_ROUTES.state);
      state = normalizeWorkspaceState(data.state || {});
      hostAvailable = true;
      statePath = workspaceString(data.path);
      savedAt = workspaceString(data.savedAt);
    } catch (error) {
      hostError = 'Error al leer el espacio de trabajo: ' + errorText(error);
      state = snapshot || normalizeWorkspaceState({});
    }
    if (seq !== wsLoadSeq) return { ok: false, error: 'superseded' };
    setWs({ hostAvailable, hostError, statePath, savedAt, busy: true, restoring: true, loaded: false });
    wsRestoring = true;
    try {
      await restoreWorkspaceState(state || normalizeWorkspaceState({}));
    } finally {
      wsRestoring = false;
      setWs({ loaded: true, busy: false, restoring: false });
      writeWorkspaceSnapshot(workspaceStateFromStore());
      if (hostAvailable) scheduleWorkspaceSave();
    }
    return { ok: true, hostAvailable };
  }
  function openProjectManager() {
    closeLibrary();
    setWs({ managerOpen: true });
    refreshLatest();
  }
  function closeProjectManager() { setWs({ managerOpen: false }); }
  async function pickProjectRoot() {
    if (store.get().ws.picking || store.get().ws.busy) return { ok: false, error: 'busy' };
    setWs({ picking: true, addError: '' });
    try {
      const pick = await requestHostDirectory();
      if (pick.cancelled) { toast('Selección de directorio cancelada'); return { ok: true, cancelled: true }; }
      if (!pick.ok) {
        setWs({ addError: directoryPickMessage(pick) });
        return { ok: false, error: pick.detail || pick.reason };
      }
      setWs({ rootInput: pick.path });
      return await addProject(pick.path);
    } finally {
      if (store.get().ws.picking) setWs({ picking: false });
    }
  }
  async function addProject(root) {
    if (store.get().ws.busy || store.get().ws.scanBusy) return { ok: false, error: 'busy' };
    const target = String(root == null ? '' : root).trim();
    if (!target) {
      setWs({ addError: 'Introduce primero la ruta absoluta del directorio del proyecto.' });
      return { ok: false, error: 'empty-root' };
    }
    setWs({ addError: '', scanBusy: true });
    let scan;
    try {
      scan = await scanProjectRoot(target);
    } catch (error) {
      setWs({ scanBusy: false, addError: errorText(error) });
      return { ok: false, error: errorText(error) };
    }
    const ws = store.get().ws;
    const existing = ws.projects.find((project) => project.root === scan.root);
    if (existing) {
      setWs({ scanBusy: false, rootInput: '' });
      await switchProject(existing.id);
      return { ok: true, existing: true, projectId: existing.id };
    }
    const auto = ws.autoLatest;
    const autoPick = auto ? await pickVersionWithCards(scan.versions, scan.latest) : null;
    const preferred = autoPick && autoPick.version && autoPick.version.path ? autoPick.version.path : scan.latest;
    const project = {
      id: 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
      root: scan.root,
      label: basename(scan.root),
      lastVersionDir: preferred,
      lastCardPath: '',
      lastWorldbookRoot: '',
      lastWorldbookPath: '',
      lastMvuRoot: '',
      lastMvuPath: '',
      lastUsed: new Date().toISOString(),
    };
    // Sí\uff0c/ Schema \u3002
    setWb(freshWb());
    setMvu(freshMvu());
    setWs({
      projects: [...ws.projects, project],
      activeProjectId: project.id,
      versions: scan.versions,
      versionsLatest: scan.latest,
      versionsRoot: preferred,
      scanBusy: false,
      rootInput: '',
      addError: '',
      scanError: '',
      cardMissing: '',
      newAvailable: null,
      busy: true,
    });
    try {
      await loadCards(preferred, { selectLatest: auto, auto: true });
      if (autoPick && !autoPick.found) setWs({ cardMissing: noCardsMessage(autoPick, scan.latest) });
    } finally {
      setWs({ busy: false });
    }
    scheduleWorkspaceSave();
    toast('Proyecto añadido: ' + project.label);
    return { ok: true, projectId: project.id, root: project.root };
  }
  async function switchProject(id) {
    if (store.get().ws.busy) return { ok: false, error: 'busy' };
    const project = projectById(id);
    if (!project) return { ok: false, error: 'not-found' };
    setWs({
      activeProjectId: id, busy: true, versions: [], versionsRoot: '', versionsLatest: '',
      scanError: '', cards: [], cardsRoot: '', cardsLatest: '', cardError: '', cardMissing: '',
      activeCard: null, restoreNotice: '', newAvailable: null,
      cardDetail: null, cardInspectBusy: false, cardInspectError: '',
    });
    patchActiveProject({ lastUsed: new Date().toISOString() });
    try {
      const scan = await scanProjectRoot(project.root);
      const auto = store.get().ws.autoLatest;
      const autoPick = auto ? await pickVersionWithCards(scan.versions, scan.latest) : null;
      const preferred = autoPick && autoPick.version && autoPick.version.path
        ? autoPick.version.path
        : (auto
          ? scan.latest
          : ((scan.versions.find((version) => version.path === project.lastVersionDir) || {}).path || scan.latest));
      setWs({ versions: scan.versions, versionsLatest: scan.latest, versionsRoot: preferred, scanError: '' });
      await loadCards(preferred, { selectLatest: auto, preferredPath: auto ? '' : project.lastCardPath, auto });
      if (autoPick && !autoPick.found) setWs({ cardMissing: noCardsMessage(autoPick, scan.latest) });
    } catch (error) {
      setWs({ scanError: errorText(error) });
    }
    const sharedRoot = project.lastWorldbookRoot || project.lastMvuRoot;
    if (sharedRoot) {
      const wbFile = project.lastWorldbookRoot === sharedRoot ? project.lastWorldbookPath : '';
      await restoreWorldbookSelection(sharedRoot, wbFile);
      const alignedRoot = store.get().wb.root || sharedRoot;
      const mvuFile = project.lastMvuRoot === alignedRoot ? project.lastMvuPath : '';
      await restoreMvuSelection(alignedRoot, mvuFile);
    } else {
      setWb(freshWb());
      setMvu(freshMvu());
    }
    setWs({ busy: false });
    scheduleWorkspaceSave();
    toast('Proyecto cambiado: ' + project.label);
    return { ok: true, projectId: id };
  }
  async function deleteProject(id) {
    if (store.get().ws.busy) return { ok: false, error: 'busy' };
    const ws = store.get().ws;
    const project = projectById(id);
    if (!project) return { ok: false, error: 'not-found' };
    const remaining = ws.projects.filter((item) => item.id !== id);
    const wasActive = ws.activeProjectId === id;
    setWs({
      projects: remaining,
      activeProjectId: wasActive ? (remaining.length ? remaining[0].id : '') : ws.activeProjectId,
      versions: wasActive ? [] : ws.versions,
      versionsRoot: wasActive ? '' : ws.versionsRoot,
      versionsLatest: wasActive ? '' : ws.versionsLatest,
      cards: wasActive ? [] : ws.cards,
      cardsRoot: wasActive ? '' : ws.cardsRoot,
      cardsLatest: wasActive ? '' : ws.cardsLatest,
      activeCard: wasActive ? null : ws.activeCard,
      cardDetail: wasActive ? null : ws.cardDetail,
      cardInspectBusy: wasActive ? false : ws.cardInspectBusy,
      cardInspectError: wasActive ? '' : ws.cardInspectError,
      scanError: '', cardError: '', cardMissing: '', newAvailable: null,
    });
    scheduleWorkspaceSave();
    toast('Proyecto eliminado: ' + project.label + '(no se borran archivos del disco)');
    if (wasActive && remaining.length) await switchProject(remaining[0].id);
    if (wasActive && !remaining.length) { setWb(freshWb()); setMvu(freshMvu()); }
    return { ok: true };
  }
  async function switchVersion(path) {
    if (store.get().ws.busy) return { ok: false, error: 'busy' };
    const ws = store.get().ws;
    const project = activeProject();
    const target = workspaceString(path);
    if (!project || !target) return { ok: false, error: 'no-project' };
    if (store.get().wb.dirty || store.get().wb.saving) {
      const message = 'La worldbook tiene cambios sin guardar; no se cambió de versión: ' + basename(target);
      setWs({ newAvailable: { kind: 'version', path: target, message }, restoreNotice: message });
      toast(message);
      return { ok: false, error: 'worldbook-dirty' };
    }
    setWs({ busy: true, versionsRoot: target, cardMissing: '', newAvailable: null });
    patchActiveProject({ lastVersionDir: target });
    await loadCards(target, {
      selectLatest: ws.autoLatest,
      preferredPath: ws.autoLatest ? '' : (ws.activeCard && ws.activeCard.file ? ws.activeCard.file.path : ''),
      auto: ws.autoLatest,
    });
    setWs({ busy: false, restoreNotice: '', newAvailable: null });
    scheduleWorkspaceSave();
    return { ok: true };
  }
  async function switchLatest() {
    return refreshLatest({ force: true, manual: true });
  }
  async function switchAutoVersion(target, latest, noCards, pick) {
    setWs({ busy: true, versionsRoot: target, newAvailable: null, restoreNotice: '', cardMissing: '' });
    wsNoticeKey = '';
    patchActiveProject({ lastVersionDir: target });
    await loadCards(target, { selectLatest: true, auto: true });
    setWs({ busy: false });
    scheduleWorkspaceSave();
    if (noCards) {
      const message = noCardsMessage(pick, latest);
      setWs({ cardMissing: message });
      toast(message);
      return { ok: true, switched: true, noCards: true };
    }
    toast(target === latest ? '\u5df2Cambiar al más reciente versiones\uff1a' + basename(target) : 'Se cambió a la versión más reciente con tarjeta: ' + basename(target));
    return { ok: true, switched: true };
  }
  async function refreshLatest(options = {}) {
    if (wsRefreshInFlight) return { ok: false, error: 'busy' };
    const s = store.get();
    const ws = s.ws;
    const project = activeProject();
    if (!ws.loaded || ws.restoring || ws.busy || ws.scanBusy || !project) return { ok: false, error: 'not-ready' };
    wsRefreshInFlight = true;
    try {
      const scan = await scanProjectRoot(project.root);
      const latest = scan.latest;
      const current = ws.versionsRoot;
      const newerVersion = !!latest && latest !== current;
      const dirty = s.wb.dirty || s.wb.saving;
      const canAuto = ws.autoLatest || options.force;
      setWs({ versions: scan.versions, versionsLatest: latest, scanError: '' });
      if (newerVersion) {
        const message = 'sí \u65b0 versiones\u53ef\u7528\uff1a' + basename(latest) + (dirty ? '\uff08\u4e16\u754c\u4e66no se ha Guardar\u4fee\u6539\uff0c\u672a\u5207\u6362\uff09' : '');
        if (dirty) {
          if (wsNoticeKey !== 'version:' + latest) {
            wsNoticeKey = 'version:' + latest;
            setWs({ newAvailable: { kind: 'version', path: latest, message }, restoreNotice: message });
            toast(message);
          }
          return { ok: true, newer: true, switched: false };
        }
        if (canAuto) {
          const pick = await pickVersionWithCards(scan.versions, latest);
          const target = pick.found && pick.version && pick.version.path ? pick.version.path : latest;
          if (pick.found && target === current) {
            const retained = '\u66f4\u9ad8 versionesno hay \u8bc6\u522b\u5230\u5361\uff0c\u4fdd\u7559Actualsí \u5361 versiones\uff1a' + basename(current);
            setWs({ cardMissing: retained, newAvailable: null });
            if (wsNoticeKey !== 'no-card:' + latest) {
              wsNoticeKey = 'no-card:' + latest;
              toast(retained);
            }
            return { ok: true, newer: true, switched: false, retained: true };
          }
          return await switchAutoVersion(target, latest, !pick.found, pick);
        }
        if (wsNoticeKey !== 'version:' + latest) {
          wsNoticeKey = 'version:' + latest;
          setWs({ newAvailable: { kind: 'version', path: latest, message } });
        }
        return { ok: true, newer: true, switched: false };
      }
      // Sí\uff1aMás recienteSí\uff08Sí\uff09\u3002
      if (canAuto && !dirty && !ws.activeCard) {
        const pick = await pickVersionWithCards(scan.versions, latest);
        if (pick.found && pick.version && pick.version.path && pick.version.path !== current) {
          return await switchAutoVersion(pick.version.path, latest, false, pick);
        }
        if (!pick.found) {
          const message = noCardsMessage(pick, latest);
          setWs({ cardMissing: message, newAvailable: null });
          if (wsNoticeKey !== 'no-card:' + latest) {
            wsNoticeKey = 'no-card:' + latest;
            toast(message);
          }
          return { ok: true, switched: false, noCards: true };
        }
      }
      if (current) {
        const list = await cardListRoot(current);
        const latestCardInfo = await latestCardInFiles(current, list.files);
        const latestCard = latestCardInfo ? latestCardInfo.path : '';
        const currentCard = ws.activeCard && ws.activeCard.file ? ws.activeCard.file.path : '';
        setWs({ cards: list.files, cardsRoot: list.root, cardsLatest: latestCard, cardError: '' });
        if (latestCard && latestCard !== currentCard) {
          if (s.wb.dirty || s.wb.saving) {
            const message = 'sí \u65b0\u6587\u4ef6\u53ef\u7528\uff1a' + basename(latestCard) + '\uff08\u4e16\u754c\u4e66no se ha Guardar\u4fee\u6539\uff0c\u672a\u5207\u6362\uff09';
            if (wsNoticeKey !== 'card:' + latestCard) {
              wsNoticeKey = 'card:' + latestCard;
              setWs({ newAvailable: { kind: 'card', path: latestCard, message }, restoreNotice: message });
              toast(message);
            }
            return { ok: true, newerCard: true, switched: false };
          }
          if (ws.autoLatest || options.force) {
            const loaded = await loadCards(current, { selectLatest: true, auto: true });
            scheduleWorkspaceSave();
            const switched = !!loaded.activePath && loaded.activePath !== currentCard;
            if (switched) toast('Se cambió al archivo de tarjeta más reciente: ' + basename(loaded.activePath));
            return { ok: true, newerCard: switched, switched, activePath: loaded.activePath };
          }
          if (wsNoticeKey !== 'card:' + latestCard) {
            wsNoticeKey = 'card:' + latestCard;
            setWs({ newAvailable: { kind: 'card', path: latestCard, message: 'sí \u65b0\u6587\u4ef6\u53ef\u7528\uff1a' + basename(latestCard) } });
          }
          return { ok: true, newerCard: true, switched: false };
        }
      }
      if (ws.newAvailable) setWs({ newAvailable: null });
      wsNoticeKey = '';
      return { ok: true };
    } catch (error) {
      setWs({ scanError: errorText(error) });
      if (options.manual) toast('\u68c0\u67e5Más reciente versioneserror\uff1a' + errorText(error));
      return { ok: false, error: errorText(error) };
    } finally {
      wsRefreshInFlight = false;
    }
  }
  async function toggleAutoLatest() {
    const next = !store.get().ws.autoLatest;
    setWs({ autoLatest: next });
    scheduleWorkspaceSave();
    if (next) await refreshLatest();
    return { ok: true, autoLatest: next };
  }
  async function useCurrentVersionRoot() {
    const ws = store.get().ws;
    const project = activeProject();
    if (ws.busy) return { ok: false, error: 'busy' };
    const root = ws.versionsRoot || (project && project.root) || '';
    if (!root) { setWs({ addError: 'Selecciona primero un proyecto o un directorio de versión.' }); return { ok: false, error: 'no-project' }; }
    setWs({ restoreNotice: '' });
    // Actual\uff1bopenWorldbookRoot  /mvu/select\u3002
    const result = await openWorldbookRoot(root);
    if (result.ok) {
      patchActiveProject({ lastWorldbookRoot: store.get().wb.root, lastMvuRoot: store.get().mvu.root || '' });
      scheduleWorkspaceSave();
    }
    return result;
  }
  async function useProjectRootForWorldbook() { return useCurrentVersionRoot(); }
  async function useProjectRootForMvu() { return useCurrentVersionRoot(); }

  /* ---------------- \u62d6 Skill \u5230\u8f93\u5165\u6846 ---------------- */

  function startSkillDrag(e, name) {
    try {
      e.dataTransfer.setData(SKILL_MIME, name);
      e.dataTransfer.setData('text/plain', '/' + name + ' ');
      e.dataTransfer.effectAllowed = 'copy';
    } catch {}
  }
  function isSkillDrag(e) {
    const types = e.dataTransfer && e.dataTransfer.types;
    return !!types && Array.prototype.indexOf.call(types, SKILL_MIME) >= 0;
  }
  function dropTargetAt(x, y) {
    const card = composerCard();
    if (!card) return null;
    const r = card.getBoundingClientRect();
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return null;
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), radius: getComputedStyle(card).borderTopLeftRadius };
  }
  function setDrop(next) {
    const cur = store.get().drop;
    if (!next && !cur) return;
    if (next && cur && next.x === cur.x && next.y === cur.y && next.w === cur.w && next.h === cur.h) return;
    store.set({ drop: next });
  }
  /**
   * \u6587\u6863\u7ea7\u6355\u83b7\uff1a\u62d6\u7740Mano divina\u7684 Skill \u5361\u7ecf\u8fc7\u8f93\u5165\u6846\u65f6\u7531\u8fd9\u91cc\u63a5\u4f4f\uff0c\u63d2\u5165 `/\u540d\u5b57 `\u3002
   * \u8f93\u5165\u6846\u81ea\u5df1\u7684\u62d6\u653e\u5904\u7406\u6536\u4e0d\u5230\u8fd9\u6b21\u62d6\u52a8\uff0c\u6240\u4ee5\u4e0d\u4f1a\u91cd\u590d\u63d2\u5165\u3002
   */
  function installDropTarget() {
    const over = (e) => {
      if (!isSkillDrag(e)) return;
      const t = dropTargetAt(e.clientX, e.clientY);
      setDrop(t);
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      try { e.dataTransfer.dropEffect = 'copy'; } catch {}
    };
    const leave = (e) => { if (isSkillDrag(e) && !dropTargetAt(e.clientX, e.clientY)) setDrop(null); };
    const drop = (e) => {
      if (!isSkillDrag(e)) return;
      const t = dropTargetAt(e.clientX, e.clientY);
      setDrop(null);
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      let name = '';
      try { name = e.dataTransfer.getData(SKILL_MIME); } catch {}
      if (name) insertSkill(name);
    };
    const end = () => setDrop(null);
    document.addEventListener('dragenter', over, true);
    document.addEventListener('dragover', over, true);
    document.addEventListener('dragleave', leave, true);
    document.addEventListener('drop', drop, true);
    document.addEventListener('dragend', end, true);
    return () => {
      document.removeEventListener('dragenter', over, true);
      document.removeEventListener('dragover', over, true);
      document.removeEventListener('dragleave', leave, true);
      document.removeEventListener('drop', drop, true);
      document.removeEventListener('dragend', end, true);
    };
  }

  /* ---------------- \u8f6e\u76d8\u7684\u4f4d\u7f6e\uff1a\u5de6\u4fa7\u680f\u548c\u5bf9\u8bdd\u680f\u4e4b\u95f4\u7684\u7a7a\u767d ---------------- */

  /**
   * \u5de6\u8fb9 = \u4f1a\u8bdd\u89c6\u56fe\u5de6\u7f18\uff08\u5de6\u4fa7\u680f\u53f3\u7f18\uff09\uff0c\u53f3\u8fb9 = \u8f93\u5165\u6846\u5361\u7247\u5de6\u7f18\uff08\u5bf9\u8bdd\u6b63\u6587\u5217\u5728\u5b83\u53f3\u4fa7\uff09\uff0c
   * \u4e0a\u8fb9 = \u4f1a\u8bdd\u5934\u5e95\u8fb9\uff0c\u4e0b\u8fb9 = \u4f1a\u8bdd\u89c6\u56fe\u5e95\u8fb9\u3002\u53ea\u6309Estructura\u91cf\uff0c\u4e0d\u4f9d\u8d56 DSH \u7684\u6837\u5f0f\u7c7b\u540d\u3002
   */
  function measureGutter() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let anchor = [...document.querySelectorAll('.gh2-souldock')].find((el) => el.getBoundingClientRect().width > 0) || null;
    if (!anchor) {
      const card = composerCard();
      if (card && card.getBoundingClientRect().width > 0) anchor = card;
    }
    if (!anchor) return { reason: 'no-composer' };
    const cardLeft = anchor.getBoundingClientRect().left;
    // \uff08\uff09
    let root = null;
    let rr = null;
    for (let el = anchor.parentElement, i = 0; el && el !== document.body && i < 30; el = el.parentElement, i++) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > vh * 0.5) { root = el; rr = r; break; }
    }
    if (!root) return { reason: 'no-view' };
    let top = rr.top;
    const header = root.querySelector('header');
    if (header) {
      const hr = header.getBoundingClientRect();
      if (hr.height > 0 && hr.top - rr.top < 24 && hr.bottom - rr.top < vh * 0.3) top = hr.bottom;
    }
    const left = Math.max(0, rr.left) + EDGE;
    const right = Math.min(cardLeft, vw) - 12;
    const bottom = Math.min(rr.bottom, vh) - EDGE;
    top = Math.max(0, top) + EDGE;
    const g = { x: Math.round(left), y: Math.round(top), w: Math.round(right - left), h: Math.round(bottom - top), root, anchor };
    g.reason = g.w < WHEEL.minW ? 'narrow' : g.h < WHEEL.minH ? 'short' : 'ok';
    if (g.reason !== 'ok') return g;
    // Sí\uff08“”\u3001\uff09\uff1a
    // \uff0c\u3001\uff0c\u3001Sí
    const spans = (el, px) => {
      const r = el.getBoundingClientRect();
      return r.left <= px - 1 && r.right >= cardLeft + 100;
    };
    const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
    for (const fx of [0.1, 0.5, 0.9]) {
      for (const fy of [0.1, 0.3, 0.5, 0.7, 0.9]) {
        const px = left + (right - left) * fx;
        const py = top + (bottom - top) * fy;
        const el = document.elementsFromPoint(px, py).find((e) => !(e.closest && e.closest('.gh2-root')));
        if (!el || el.contains(root)) continue;
        if (root.contains(el) && spans(el, px) && !ownText(el)) continue;
        g.reason = 'occupied';
        g.blocker = el.tagName.toLowerCase() + ':' + String(el.textContent || '').trim().slice(0, 16);
        return g;
      }
    }
    return g;
  }

  /* ---------------- \u6837\u5f0f ---------------- */

  const LIVE = 'light-dark(#0f766e,#6fd8d2)';
  const GOLD = 'light-dark(#8a6420,#d8b36a)';
  const CSS = `
.gh2-root{box-sizing:border-box;font-family:var(--dsh-font-family-text,var(--dsw-font-family,system-ui,sans-serif));font-size:var(--dsh-content-font-size,14px);line-height:1.5;color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-root *,.gh2-root *::before,.gh2-root *::after{box-sizing:border-box}
.gh2-win{position:fixed;z-index:60;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1,#1e1e22);border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));border-radius:var(--dsw-radius-lg,12px);box-shadow:var(--dsw-elevation-prominent,0 18px 48px rgba(0,0,0,.4));overflow:hidden;outline:none}
.gh2-busy,.gh2-busy *{user-select:none!important}
.gh2-bar{flex:none;display:flex;align-items:center;gap:8px;height:42px;padding:0 6px 0 12px;cursor:grab;user-select:none;touch-action:none;border-bottom:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.gh2-busy .gh2-bar{cursor:grabbing}
.gh2-brand{display:inline-flex;flex:none;color:${GOLD}}
.gh2-title{font-size:.93em;font-weight:600;color:var(--dsw-alias-label-primary,#e9e9ec);white-space:nowrap}
.gh2-spacer{flex:1}
.gh2-iconbtn{width:28px;padding:0;flex:none;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-iconbtn svg{width:15px;height:15px}
.gh2-hbtn{position:relative}
.gh2-hbtn[aria-pressed="true"]{background:var(--dsw-alias-interactive-bg-active,rgba(255,255,255,.1));color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-hbtn.is-live{color:${LIVE}}
.gh2-wheelbtn[aria-pressed="false"]{color:var(--dsw-alias-label-caption,rgba(255,255,255,.35))}
.gh2-wheelbtn.is-off .gh2-wheelico{opacity:.7}
.gh2-ping{position:absolute;top:4px;right:4px;width:6px;height:6px;border-radius:50%;background:${LIVE};box-shadow:0 0 0 2px var(--dsw-alias-bg-base,#151517)}
@media (prefers-reduced-motion:no-preference){.gh2-ping{animation:gh2-ping 1.6s ease-in-out infinite}}
@keyframes gh2-ping{50%{opacity:.35}}
.gh2-tabs{flex:none;padding:10px 12px 2px}
.gh2-seg{max-width:720px;width:100%}
.gh2-seg [role="tab"]{white-space:nowrap}
.gh2-body{flex:1;min-height:0;overflow:auto;padding:8px 12px 18px;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2,rgba(255,255,255,.2)) transparent}
.gh2-grip{position:absolute;right:2px;bottom:2px;width:16px;height:16px;display:grid;place-items:center;cursor:nwse-resize;touch-action:none;color:var(--dsw-alias-label-caption,rgba(255,255,255,.35))}
@media (pointer:coarse){.gh2-grip{display:none}}
.gh2-tools{display:flex;align-items:center;gap:8px;margin:6px 0 8px;flex-wrap:wrap}
.gh2-search{flex:1 1 180px;min-width:150px}
.gh2-summary{margin:0 0 6px;font-size:.84em;color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.gh2-row{border-radius:var(--dsw-radius-md,10px)}
.gh2-row.is-open{background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.04))}
.gh2-rowmain{all:unset;-webkit-user-drag:element;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;width:100%;padding:8px 10px;border-radius:var(--dsw-radius-md,10px);cursor:pointer}
.gh2-rowmain:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-rowmain:focus-visible,.gh2-recent button:focus-visible,.gh2-soulpill:focus-visible,.gh2-wcard:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-2px}
.gh2-rowtext{display:flex;flex-direction:column;min-width:0;gap:1px}
.gh2-nameline{display:flex;align-items:center;gap:6px;min-width:0}
.gh2-rowtag{flex:none;font-size:.72em;line-height:1;padding:3px 6px;border-radius:999px;border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));color:var(--dsw-alias-label-secondary,#b5b5bb);white-space:nowrap}
.gh2-name{font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.9em;color:var(--dsw-alias-label-primary,#e9e9ec);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.gh2-desc{font-size:.84em;color:var(--dsw-alias-label-tertiary,#8b8b92);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh2-row.is-open .gh2-desc{white-space:normal}
.gh2-meta{font-size:.8em;color:var(--dsw-alias-label-tertiary,#8b8b92);white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
.gh2-row.is-live .gh2-meta{color:${LIVE}}
.gh2-rowmore{display:flex;flex-direction:column;gap:8px;padding:0 10px 10px}
.gh2-rowdetail{margin:0;font-size:.84em;line-height:1.65;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-rowactions{display:flex;gap:8px;flex-wrap:wrap}
.gh2-rowmore button:disabled{opacity:.5;cursor:default}
.gh2-recent{margin-top:16px;padding-top:12px;border-top:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.gh2-recent h4{margin:0 0 6px;padding:0 10px;font-size:.84em;font-weight:600;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-recent ul{list-style:none;margin:0;padding:0}
.gh2-recent button{all:unset;box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;padding:5px 10px;border-radius:var(--dsw-radius-sm,8px);cursor:pointer}
.gh2-recent button:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-empty{padding:28px 6px;max-width:440px}
.gh2-empty h3{margin:0 0 6px;font-size:1em;font-weight:600;color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-empty p{margin:0 0 12px;font-size:.9em;line-height:1.7;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-none{margin:12px 10px;font-size:.88em;color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-idle{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-label-caption,rgba(255,255,255,.35))}
.gh2-wheel{position:fixed;z-index:10;overflow:hidden;outline:none;touch-action:none;user-select:none;-webkit-user-select:none}
.gh2-wheel:focus-visible{outline:1px solid light-dark(rgba(138,100,32,.5),rgba(216,179,106,.45));outline-offset:-4px;border-radius:var(--dsw-radius-sm,8px)}
.gh2-wheel.is-spinning{cursor:grabbing}
.gh2-plate{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.gh2-ring{fill:none;stroke:light-dark(rgba(138,100,32,.38),rgba(216,179,106,.46));stroke-width:1;stroke-dasharray:3 3}
.gh2-ring.is-inner{stroke:light-dark(rgba(0,0,0,.07),rgba(239,232,218,.08));stroke-dasharray:none}
.gh2-ring.is-accent{stroke:light-dark(rgba(15,118,110,.26),rgba(111,216,210,.32));stroke-dasharray:none}
.gh2-whead{position:absolute;top:12px;left:${WHEEL.left}px;right:4px;z-index:40;display:flex;align-items:center;gap:6px;font-size:max(10px,.72em);letter-spacing:.06em;color:var(--dsw-alias-label-tertiary,#8b8b92);white-space:nowrap;overflow:hidden;pointer-events:none}
.gh2-whead b{font-weight:600;letter-spacing:.08em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-whead[data-round="skills"] .gh2-wh-features,.gh2-whead[data-round="skills"] .gh2-wh-other,
.gh2-whead[data-round="features"] .gh2-wh-skills,.gh2-whead[data-round="features"] .gh2-wh-other,
.gh2-whead[data-round="other"] .gh2-wh-skills,.gh2-whead[data-round="other"] .gh2-wh-features{display:none}
.gh2-whint{color:${GOLD}}
.gh2-wnote{position:absolute;left:${WHEEL.left}px;right:6px;top:40px;z-index:40;font-size:.86em;line-height:1.6;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-wnote p{margin:0 0 8px}
.gh2-wcard{all:unset;-webkit-user-drag:element;box-sizing:border-box;position:absolute;left:0;top:0;display:block;width:var(--gh2-card-w,180px);padding:10px;border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-layer-1,#232324);box-shadow:var(--dsw-elevation-panel,0 8px 24px rgba(0,0,0,.32));color:var(--dsw-alias-label-primary,#e9e9ec);text-align:left;cursor:pointer;visibility:hidden;transform-origin:center;will-change:transform,opacity;transition:border-color .15s,background-color .15s}
.gh2-wcard:hover{border-color:light-dark(rgba(138,100,32,.5),rgba(216,179,106,.42));background:var(--dsw-alias-bg-layer-2,#2a2a2c)}
.gh2-wcard:active{cursor:grabbing}
.gh2-wcard.is-live{border-color:light-dark(rgba(15,118,110,.55),rgba(111,216,210,.5));background:linear-gradient(160deg,light-dark(rgba(15,118,110,.09),rgba(111,216,210,.11)),var(--dsw-alias-bg-layer-1,#232324) 70%);box-shadow:var(--dsw-elevation-panel,0 8px 24px rgba(0,0,0,.32)),0 0 0 1px light-dark(rgba(15,118,110,.14),rgba(111,216,210,.14))}
.gh2-wcard.is-feature{border-style:dashed;background:var(--dsw-alias-bg-base,#1b1b1c);box-shadow:none}
.gh2-wtop{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:max(10px,.71em);line-height:1.3;letter-spacing:.04em;color:var(--dsw-alias-label-tertiary,#8b8b92);white-space:nowrap}
.gh2-wcard.is-live .gh2-wtop{color:${LIVE}}
.gh2-wlabel{display:inline-flex;align-items:center;gap:5px;min-width:0;overflow:hidden;text-overflow:ellipsis}
.gh2-wdot{flex:none;width:5px;height:5px;border-radius:50%;background:currentColor;box-shadow:0 0 6px currentColor}
.gh2-wname{display:block;margin-top:5px;font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.93em;font-weight:600;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh2-wcard.is-feature .gh2-wname{font-family:inherit}
.gh2-wheel.is-compact .gh2-wname{white-space:normal;overflow-wrap:anywhere;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;min-height:2.5em}
.gh2-wheel.is-compact .gh2-wmeta{display:none}
.gh2-wdesc{display:block;margin-top:3px;font-size:max(11px,.78em);line-height:1.4;color:var(--dsw-alias-label-tertiary,#8b8b92);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh2-wmeta{display:block;margin-top:6px;font-size:max(10px,.71em);line-height:1.3;color:var(--dsw-alias-label-caption,rgba(255,255,255,.4));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh2-whover{position:fixed;z-index:65;width:340px;max-width:calc(100vw - 24px);padding:12px 14px;border:.5px solid light-dark(rgba(138,100,32,.45),rgba(216,179,106,.38));border-radius:var(--dsw-radius-md,12px);background:var(--dsw-alias-bg-layer-1,#232324);box-shadow:var(--dsw-elevation-prominent,0 18px 48px rgba(0,0,0,.4));pointer-events:none;font-size:.86em;line-height:1.65}
.gh2-hk{display:flex;justify-content:space-between;gap:8px;font-size:max(10px,.84em);letter-spacing:.04em;color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-hk .is-live{color:${LIVE}}
.gh2-whover h4{margin:4px 0 0;font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:1.04em;font-weight:600;line-height:1.35;color:var(--dsw-alias-label-primary,#e9e9ec);word-break:break-all}
.gh2-whover p{margin:6px 0 0;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-hnote{margin-top:6px;font-size:.9em;color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-hlast{margin-top:8px;font-size:.92em;color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-hhint{margin-top:8px;padding-top:8px;border-top:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));font-size:.92em;color:${GOLD}}
.gh2-drophint{position:fixed;z-index:12;border:1.5px dashed light-dark(rgba(138,100,32,.7),rgba(216,179,106,.75));background:light-dark(rgba(138,100,32,.05),rgba(216,179,106,.05));pointer-events:none}
.gh2-souldock{position:relative;height:0;width:calc(100% - 2 * var(--dsh-composer-side-clearance,0px));max-width:var(--dsh-composer-card-max-width,100%);margin:0 auto;z-index:4}
.gh2-soul{position:absolute;right:0;bottom:8px;display:flex;flex-direction:column;align-items:flex-end;gap:6px}
.gh2-soulpill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 9px 0 10px;border-radius:13px;border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-1,#1e1e22));backdrop-filter:var(--dsw-menu-backdrop-filter,none);box-shadow:var(--dsw-elevation-panel,0 4px 16px rgba(0,0,0,.25));color:var(--dsw-alias-label-secondary,#b5b5bb);font:inherit;font-size:12px;line-height:1;white-space:nowrap;cursor:pointer}
.gh2-soulpill:hover{color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-soulpill:disabled{cursor:default;opacity:.6}
.gh2-soulpill.is-on{color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-soulpill.is-off{color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-soulpill svg{width:12px;height:12px;opacity:.7}
.gh2-souldot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-label-caption,rgba(255,255,255,.35))}
.gh2-soulpill.is-on .gh2-souldot{background:light-dark(#b8862f,#d8b36a)}
.gh2-soulpop{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px;width:max-content;max-width:min(440px,calc(100vw - 32px));padding:6px;border-radius:var(--dsw-radius-lg,12px);border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-1,#1e1e22));backdrop-filter:var(--dsw-menu-backdrop-filter,none);box-shadow:var(--dsw-elevation-prominent,0 18px 48px rgba(0,0,0,.4))}
.gh2-soulnote{margin:2px 4px;max-width:300px;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-fbtn{display:inline-flex;align-items:center;justify-content:center;gap:4px;height:28px;padding:0 10px;border:0;border-radius:var(--dsw-radius-sm,8px);background:transparent;color:inherit;font:inherit;font-size:12px;cursor:pointer}
.gh2-fbtn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-fbtn.is-outline{border:.5px solid var(--dsw-alias-border-l3,rgba(255,255,255,.2))}
.gh2-fpill{height:26px;padding:0 10px;border-radius:13px;border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:transparent;color:var(--dsw-alias-label-secondary,#b5b5bb);font:inherit;font-size:12px;cursor:pointer}
.gh2-fpill[aria-pressed="true"]{color:var(--dsw-alias-label-primary,#e9e9ec);background:var(--dsw-alias-interactive-bg-active,rgba(255,255,255,.1))}
.gh2-finput{flex:1 1 180px;min-width:150px;height:30px;padding:0 10px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:transparent;color:inherit;font:inherit;font-size:.9em}
.gh2-ftabs{display:flex;gap:4px}
.gh2-ftab{white-space:nowrap}
.gh2-ftab{height:28px;padding:0 12px;border:0;border-radius:var(--dsw-radius-sm,8px);background:transparent;color:var(--dsw-alias-label-secondary,#b5b5bb);font:inherit;font-size:.88em;cursor:pointer}
.gh2-ftab[aria-selected="true"]{background:var(--dsw-alias-interactive-bg-active,rgba(255,255,255,.1));color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-m5{display:flex;flex-direction:column;gap:10px;min-width:0}
.gh2-m5-lead{margin:0;font-size:.9em;line-height:1.65;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-m5-note{margin:0;font-size:.82em;line-height:1.6;color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-m5-meta{font-size:.8em;color:var(--dsw-alias-label-tertiary,#8b8b92);min-width:0;overflow-wrap:anywhere}
.gh2-m5-warn{margin:0;padding:8px 10px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid light-dark(rgba(138,100,32,.38),rgba(216,179,106,.42));background:light-dark(rgba(138,100,32,.06),rgba(216,179,106,.08));font-size:.84em;line-height:1.6;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-m5-error{margin:0;padding:8px 10px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid light-dark(rgba(180,35,24,.4),rgba(255,138,128,.45));background:light-dark(rgba(180,35,24,.07),rgba(255,138,128,.09));font-size:.84em;line-height:1.6;color:light-dark(#a4261b,#ffaaa0);overflow-wrap:anywhere}
.gh2-m5-ok{margin:0;padding:8px 10px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid light-dark(rgba(20,108,67,.35),rgba(125,219,163,.38));background:light-dark(rgba(20,108,67,.06),rgba(125,219,163,.08));font-size:.82em;line-height:1.6;color:light-dark(#146c43,#8de3b0);overflow-wrap:anywhere}
.gh2-m5-ok-inline{font-size:.82em;color:light-dark(#146c43,#8de3b0)}
.gh2-m5-dirty{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:11px;border:.5px solid light-dark(rgba(138,100,32,.45),rgba(216,179,106,.5));font-size:.78em;color:${GOLD};white-space:nowrap}
.gh2-m5-chip{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:11px;border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));font-size:.78em;color:var(--dsw-alias-label-secondary,#b5b5bb);white-space:nowrap}
.gh2-m5-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.gh2-m5-actions .gh2-finput{flex:1 1 260px;min-width:170px}
.gh2-m5-rowhead{display:flex;align-items:center;gap:8px;font-size:.9em;min-width:0}
.gh2-mono{font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.88em;overflow-wrap:anywhere}
.gh2-m5-field{display:flex;flex-direction:column;gap:4px;min-width:0;font-size:.86em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-m5-field .gh2-finput{flex:0 0 auto;width:100%;min-width:0;height:30px}
.gh2-m5-ftextarea{width:100%;min-height:170px;resize:vertical;padding:8px 10px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:transparent;color:var(--dsw-alias-label-primary,#e9e9ec);font:inherit;font-size:.92em;line-height:1.6}
.gh2-m5-ftextarea:focus{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-1px}
.gh2-m5-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.gh2-m5-version{display:flex;align-items:center;gap:10px;min-width:0;padding:5px 8px;border-radius:var(--dsw-radius-sm,8px);font-size:.82em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-m5-version:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-m5-version .gh2-mono{flex:1;min-width:0}
.gh2-m5-raw{margin:0;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);padding:6px 8px}
.gh2-m5-raw summary{cursor:pointer;font-size:.84em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-m5-pre{max-height:260px;overflow:auto;margin:6px 0 0;padding:8px;border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-base,#151517);font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.76em;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-wb-files{display:flex;flex-wrap:wrap;gap:6px;max-height:150px;overflow:auto;padding:6px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px)}
.gh2-wb-file{all:unset;box-sizing:border-box;display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:4px 8px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid transparent;font-size:.82em;color:var(--dsw-alias-label-secondary,#b5b5bb);cursor:pointer}
.gh2-wb-file:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-wb-file.is-active{border-color:light-dark(rgba(138,100,32,.5),rgba(216,179,106,.5));color:var(--dsw-alias-label-primary,#e9e9ec);background:light-dark(rgba(138,100,32,.06),rgba(216,179,106,.08))}
.gh2-wb-file:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-2px}
.gh2-wb-fname{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh2-wb-filehead{padding-top:2px}
.gh2-wb-grid{display:grid;grid-template-columns:minmax(150px,.8fr) minmax(0,2fr);gap:10px;min-height:260px}
.gh2-wb-listbox,.gh2-wb-editor{display:flex;flex-direction:column;gap:8px;min-width:0}
.gh2-wb-list{list-style:none;margin:0;padding:4px;display:flex;flex-direction:column;gap:2px;max-height:420px;overflow:auto;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px)}
.gh2-wb-entry{all:unset;box-sizing:border-box;display:flex;flex-direction:column;gap:1px;width:100%;padding:6px 8px;border-radius:var(--dsw-radius-sm,8px);cursor:pointer;font-size:.84em;color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-wb-entry:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-wb-entry.is-open{background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.04));box-shadow:inset 2px 0 0 ${GOLD}}
.gh2-wb-entry:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-2px}
.gh2-wb-entrytitle{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh2-json-tree{font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.8em;line-height:1.55;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);padding:8px;max-height:420px;overflow:auto;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-json-tree details{margin-left:14px}
.gh2-json-tree summary{cursor:pointer}
.gh2-json-leaf{margin-left:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gh2-json-key{color:${GOLD}}
.gh2-json-type{color:var(--dsw-alias-label-caption,rgba(255,255,255,.4))}
.gh2-json-val{color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-mvu{display:flex;flex-direction:column;gap:10px;min-width:0;padding:10px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-md,10px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-mvu-note{color:${GOLD}}
.gh2-mvu-meta{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:.84em;line-height:1.6;color:var(--dsw-alias-label-secondary,#b5b5bb);min-width:0;overflow-wrap:anywhere}
.gh2-mvu-meta b{font-weight:600;color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-mvu-tree{font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.82em;line-height:1.6;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);padding:8px;max-height:420px;overflow:auto;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-mvu-node{margin-left:14px}
.gh2-mvu-node > summary{cursor:pointer;list-style-position:outside}
.gh2-mvu-leaf{display:flex;flex-wrap:wrap;gap:2px 10px;margin-left:14px;min-width:0}
.gh2-mvu-key{color:${GOLD};overflow-wrap:anywhere}
.gh2-mvu-key.is-star{color:${LIVE}}
.gh2-mvu-type{padding:0 5px;border-radius:5px;background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.06));font-size:.94em;color:var(--dsw-alias-label-secondary,#b5b5bb);white-space:nowrap}
.gh2-mvu-default{color:var(--dsw-alias-label-caption,rgba(255,255,255,.45));overflow-wrap:anywhere}
.gh2-mvu-warnings{margin:0;padding:6px 10px 6px 24px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid light-dark(rgba(138,100,32,.35),rgba(216,179,106,.4));background:light-dark(rgba(138,100,32,.06),rgba(216,179,106,.08));font-size:.8em;line-height:1.6;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-mvu-warnings li{margin:0}
.gh2-mvu-sep{height:1px;margin:2px 0;background:var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.gh2-wb-json{display:flex;flex-direction:column;gap:8px;min-width:0}
.gh2-card-mvu{border-color:light-dark(rgba(138,100,32,.3),rgba(216,179,106,.36));background:light-dark(rgba(138,100,32,.035),rgba(216,179,106,.045))}
.gh2-card-mvu.is-focus{outline:2px solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:2px}
.gh2-card-wb{display:flex;flex-direction:column;gap:6px;min-width:0;padding:10px;border:.5px solid light-dark(rgba(138,100,32,.3),rgba(216,179,106,.36));border-left:2px solid ${GOLD};border-radius:var(--dsw-radius-md,10px);background:light-dark(rgba(138,100,32,.035),rgba(216,179,106,.045))}
.gh2-card-wb-fold > summary,.gh2-card-wb-summary{cursor:pointer;display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:.9em;list-style-position:outside}
.gh2-card-wb-list{display:flex;flex-direction:column;gap:4px;margin-top:8px;max-height:320px;overflow:auto}
.gh2-card-wb-entry{margin:0;padding:5px 8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-card-wb-entry > summary{cursor:pointer;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px;font-size:.84em}
.gh2-card-wb-entrytitle{font-weight:600;color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-card-wb-key{color:${GOLD};font-size:.82em;overflow-wrap:anywhere}
.gh2-card-wb-content{margin:6px 0 0;padding:8px;border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-base,#151517);font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.8em;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;max-height:240px;overflow:auto;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-card-scripts{display:flex;flex-direction:column;gap:6px;min-width:0;padding:8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px)}
.gh2-card-script-list{display:flex;flex-direction:column;gap:4px;max-height:220px;overflow:auto}
.gh2-card-script{padding:6px 8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-card-script-head{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;font-size:.86em;color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-var-page{display:flex;flex-direction:column;gap:10px;min-width:0}
.gh2-var-manual{display:flex;flex-direction:column;gap:6px;min-width:0;padding:8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-var-modebar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}
.gh2-var-modes{display:flex;flex-wrap:wrap;gap:4px}
.gh2-var-mode.is-active{border-color:light-dark(rgba(138,100,32,.45),rgba(216,179,106,.55));color:${GOLD};background:light-dark(rgba(138,100,32,.08),rgba(216,179,106,.1));font-weight:700}
.gh2-var-compare,.gh2-var-run{display:flex;flex-direction:column;gap:10px;min-width:0}
.gh2-var-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;min-width:0}
.gh2-var-textarea{width:100%;min-height:120px;resize:vertical;padding:8px 10px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:var(--dsw-alias-bg-base,#151517);color:var(--dsw-alias-label-primary,#e9e9ec);font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.82em;line-height:1.55}
.gh2-var-textarea:focus{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-1px}
.gh2-var-dialect{display:inline-flex;align-items:center;gap:6px;font-size:.84em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-var-dialect select{height:30px;padding:0 8px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:transparent;color:var(--dsw-alias-label-primary,#e9e9ec);font:inherit;font-size:.9em}
.gh2-var-result{display:flex;flex-direction:column;gap:10px;min-width:0;padding:10px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-md,10px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-var-resultblock{display:flex;flex-direction:column;gap:5px;min-width:0;padding:8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px)}
.gh2-var-resultlist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:3px;max-height:220px;overflow:auto;font-size:.8em;line-height:1.5;color:var(--dsw-alias-label-secondary,#b5b5bb);overflow-wrap:anywhere}
.gh2-var-resultlist li{padding:4px 6px;border-radius:5px;background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.04))}
.gh2-var-summary{display:flex;flex-wrap:wrap;gap:6px}
.gh2-var-check-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;max-height:360px;overflow:auto}
.gh2-var-check{display:grid;grid-template-columns:auto minmax(120px,.28fr) minmax(0,1fr);align-items:start;gap:8px;padding:5px 7px;border-radius:6px;background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.04));font-size:.8em;line-height:1.5;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-var-checkstatus{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:10px;border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));font-size:.9em;white-space:nowrap}
.gh2-var-check[data-status="pass"] .gh2-var-checkstatus{color:light-dark(#146c43,#8de3b0);border-color:light-dark(rgba(20,108,67,.35),rgba(125,219,163,.38))}
.gh2-var-check[data-status="observed"] .gh2-var-checkstatus{color:${GOLD};border-color:light-dark(rgba(138,100,32,.45),rgba(216,179,106,.5))}
.gh2-var-check[data-status="not_triggered"] .gh2-var-checkstatus,.gh2-var-check[data-status="not_run"] .gh2-var-checkstatus{color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-var-raw{margin:0;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);padding:6px 8px}
.gh2-var-raw summary{cursor:pointer;font-size:.84em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-var-schema-tree-block{display:flex;flex-direction:column;gap:5px;min-width:0;padding:8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px)}
.gh2-var-schema-tree{min-height:80px;max-height:300px;overflow:auto;padding:4px;border-radius:6px;background:var(--dsw-alias-bg-base,rgba(0,0,0,.14));scrollbar-width:thin}
.gh2-var-schema-tree-row{display:flex;align-items:center;gap:7px;min-height:30px;padding:4px 7px;border-radius:5px;font-size:.8em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-var-schema-tree-row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.05))}
.gh2-var-ruleentries{display:flex;flex-direction:column;gap:6px;max-height:380px;overflow:auto;padding-right:2px;scrollbar-width:thin}
.gh2-var-ruleentry{display:flex;flex-direction:column;gap:4px;padding:6px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:6px;background:var(--dsw-alias-bg-base,rgba(0,0,0,.1))}
.gh2-var-ruleentry > span{font-size:.78em;color:var(--dsw-alias-label-tertiary,#8b8b92);overflow-wrap:anywhere}
.gh2-var-ruleentry .gh2-var-textarea{min-height:88px}
.gh2-var-writebar{display:flex;flex-direction:column;gap:8px;min-width:0;padding:8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-var-writehead{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.gh2-var-writeinfo{display:flex;align-items:baseline;flex-wrap:wrap;gap:7px;min-width:0}
.gh2-var-writeinfo > span{min-width:0;overflow-wrap:anywhere}
.gh2-var-writeconfirm{display:flex;flex-direction:column;gap:6px;padding:8px;border:.5px solid light-dark(rgba(138,100,32,.4),rgba(216,179,106,.45));border-radius:6px;background:light-dark(rgba(138,100,32,.05),rgba(216,179,106,.06))}
.gh2-var-writeconfirm p{margin:0;font-size:.82em;line-height:1.5;color:var(--dsw-alias-label-secondary,#b5b5bb);overflow-wrap:anywhere}
.gh2-var-writeresult{display:flex;flex-direction:column;gap:5px;padding:8px;border:.5px solid light-dark(rgba(20,108,67,.35),rgba(125,219,163,.35));border-radius:6px;background:light-dark(rgba(20,108,67,.04),rgba(125,219,163,.05))}
.gh2-var-writeresult p{display:flex;gap:6px;flex-wrap:wrap;margin:0;font-size:.82em;line-height:1.5;color:var(--dsw-alias-label-secondary,#b5b5bb);overflow-wrap:anywhere}
.gh2-var-writeresult code{white-space:pre-wrap;overflow-wrap:anywhere}
@media (max-width:760px){.gh2-var-two{grid-template-columns:1fr}.gh2-var-check{grid-template-columns:auto minmax(90px,.35fr) minmax(0,1fr)}}
.gh2-var-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.gh2-var-toolbar .gh2-finput{flex:1 1 250px;min-width:170px;height:30px}
.gh2-var-layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(220px,.8fr);gap:10px;min-height:380px}
.gh2-var-tablewrap{min-width:0;max-height:520px;overflow:auto;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-md,10px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-var-table{width:100%;border-collapse:collapse;font-size:.82em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-var-table th{position:sticky;top:0;z-index:1;text-align:left;padding:7px 8px;background:var(--dsw-alias-bg-layer-1,#1e1e22);border-bottom:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));font-weight:600;color:var(--dsw-alias-label-tertiary,#8b8b92);white-space:nowrap}
.gh2-var-table td{padding:6px 8px;border-bottom:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));vertical-align:top;min-width:0;overflow-wrap:anywhere}
.gh2-var-row{cursor:pointer}
.gh2-var-row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-var-row.is-selected{background:light-dark(rgba(138,100,32,.08),rgba(216,179,106,.1));box-shadow:inset 2px 0 0 ${GOLD}}
.gh2-var-row.is-focus{outline:2px solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-2px}
.gh2-var-path{min-width:210px}
.gh2-var-path > *{vertical-align:middle}
.gh2-var-chev{all:unset;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;width:16px;height:20px;margin-right:2px;color:${GOLD};cursor:pointer;font-size:.9em}
.gh2-var-chev.is-empty{cursor:default;color:var(--dsw-alias-label-caption,rgba(255,255,255,.35))}
.gh2-var-chev:focus-visible{outline:2px solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-2px}
.gh2-var-indent{display:inline-block;min-width:0;overflow-wrap:anywhere}
.gh2-var-detail{display:flex;flex-direction:column;gap:8px;min-width:0;padding:10px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-md,10px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-var-fields{display:flex;flex-direction:column;gap:7px}
.gh2-var-value{padding:5px 8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);font-size:.82em;color:var(--dsw-alias-label-secondary,#b5b5bb);overflow-wrap:anywhere}
.gh2-var-value.mono{font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace)}
.gh2-var-visual{min-width:0;min-height:460px;display:grid;grid-template-columns:minmax(290px,.44fr) minmax(0,1fr);overflow:hidden;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-md,10px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-var-tree-pane{min-width:0;min-height:0;display:grid;grid-template-rows:auto auto minmax(0,1fr);border-right:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.gh2-var-detail-pane{min-width:0;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr)}
.gh2-var-panehead{display:flex;align-items:center;justify-content:space-between;gap:10px;min-width:0;min-height:54px;padding:9px 12px;border-bottom:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.gh2-var-panehead > div{min-width:0}
.gh2-var-panehead > div > span{display:block;color:${GOLD};font-size:.72em;font-weight:800;letter-spacing:.06em}
.gh2-var-panehead h4{margin:2px 0 0;font-size:.94em;color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-var-treetools{display:grid;grid-template-columns:minmax(120px,1fr) auto;gap:6px;padding:8px;border-bottom:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.gh2-var-treetools .gh2-finput{height:32px;min-width:0}
.gh2-var-tree{min-width:0;min-height:0;overflow:auto;padding:8px;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2,rgba(255,255,255,.2)) transparent}
.gh2-var-treeitem{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:7px;width:100%;min-height:34px;padding:5px 7px;margin:0 0 2px;border:1px solid transparent;border-radius:7px;font-size:.84em;color:var(--dsw-alias-label-secondary,#b5b5bb);cursor:pointer}
.gh2-var-treeitem:hover{color:var(--dsw-alias-label-primary,#e9e9ec);background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-var-treeitem.is-selected{border-color:light-dark(rgba(138,100,32,.45),rgba(216,179,106,.5));color:var(--dsw-alias-label-primary,#e9e9ec);background:light-dark(rgba(138,100,32,.07),rgba(216,179,106,.09))}
.gh2-var-treeitem.is-focus{outline:2px solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-2px}
.gh2-var-treeitem:focus-visible{outline:2px solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-2px}
.gh2-var-disclosure{flex:0 0 12px;text-align:center;color:${GOLD};line-height:1;cursor:pointer}
.gh2-var-treekey{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:${GOLD};font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.94em}
.gh2-var-treemeta{margin-left:auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary,#8b8b92);font-size:.82em}
.gh2-var-tree-empty,.gh2-var-detail-empty{min-height:100%;display:grid;place-content:center;justify-items:center;gap:5px;padding:24px;color:var(--dsw-alias-label-tertiary,#8b8b92);text-align:center}
.gh2-var-tree-empty strong,.gh2-var-detail-empty strong{color:var(--dsw-alias-label-secondary,#b5b5bb);font-size:.88em}
.gh2-var-tree-empty span,.gh2-var-detail-empty span{max-width:340px;font-size:.8em;line-height:1.55}
.gh2-var-pathcode{max-width:62%;overflow:auto hidden;padding:5px 7px;border-radius:5px;color:${GOLD};background:light-dark(rgba(138,100,32,.07),rgba(216,179,106,.09));font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.78em;white-space:nowrap;scrollbar-width:thin}
.gh2-var-detailbody{min-width:0;min-height:0;display:flex;flex-direction:column;gap:11px;padding:12px;overflow:auto;scrollbar-width:thin}
.gh2-var-fieldgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.gh2-var-initial{margin:0;padding:8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px);background:var(--dsw-alias-bg-base,#151517);font-family:var(--dsh-font-family-code,ui-monospace,Consolas,monospace);font-size:.8em;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere;max-height:260px;overflow:auto;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-var-initial.is-json{color:var(--dsw-alias-label-primary,#e9e9ec)}
@media (max-width:760px){.gh2-var-layout{grid-template-columns:1fr}.gh2-var-visual{grid-template-columns:1fr}.gh2-var-tree-pane{border-right:0;border-bottom:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}.gh2-var-fieldgrid{grid-template-columns:1fr 1fr}}
.gh2-m5-links{display:flex;flex-wrap:wrap;align-items:center;gap:4px 16px;padding:2px 0}
.gh2-m5-link{all:unset;box-sizing:border-box;cursor:pointer;padding:2px 0;border-radius:4px;font-size:.84em;color:${GOLD};text-decoration:underline;text-underline-offset:3px}
.gh2-m5-link:hover{color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-m5-link:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:2px}
.gh2-m5-link:disabled{opacity:.45;cursor:not-allowed;text-decoration:none;color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-m5-ui-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) minmax(0,1fr);gap:10px}
.gh2-m5-col{display:flex;flex-direction:column;gap:6px;min-width:0;padding:8px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-sm,8px)}
.gh2-ui-layer{padding:5px 8px;border-radius:var(--dsw-radius-sm,8px);font-size:.84em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-ui-layer.is-open{background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.04));box-shadow:inset 2px 0 0 ${GOLD};color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-ui-canvas{display:flex;align-items:center;justify-content:center;min-height:150px;border:1px dashed var(--dsw-alias-border-l3,rgba(255,255,255,.2));border-radius:var(--dsw-radius-sm,8px);font-size:.84em;color:var(--dsw-alias-label-tertiary,#8b8b92);text-align:center;padding:12px}
.gh2-ui-ins{padding:5px 8px;border-radius:var(--dsw-radius-sm,8px);border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));font-size:.8em;color:var(--dsw-alias-label-tertiary,#8b8b92);overflow-wrap:anywhere}
.gh2-libmask{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:max(14px,2.5vh) max(14px,2.5vw);background:rgba(0,0,0,.62)}
.gh2-libpanel{display:flex;flex-direction:column;width:min(1280px,96vw);height:min(92vh,1000px);overflow:hidden;background:var(--dsw-alias-bg-layer-1,#1e1e22);border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));border-radius:var(--dsw-radius-lg,12px);box-shadow:var(--dsw-elevation-prominent,0 18px 48px rgba(0,0,0,.4))}
.gh2-libbar{flex:none;display:flex;align-items:center;gap:10px;height:44px;padding:0 10px 0 14px;border-bottom:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));font-size:.9em}
.gh2-libframe{flex:1;min-height:80vh;width:100%;border:0;background:#fff}
.gh2-body-lib{padding:0;overflow:hidden;display:flex;flex-direction:column}
.gh2-library-tab{flex:1;min-height:0;display:flex;flex-direction:column;width:100%;background:#fff}
.gh2-library-tab .gh2-libstate{flex:1;min-height:0;background:var(--dsw-alias-bg-layer-1,#1e1e22)}
.gh2-libframe-tab{flex:1;min-height:0;height:100%;width:100%;border:0;background:#fff}
.gh2-libstate{flex:1;min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;font-size:.9em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-projectpanel{display:flex;flex-direction:column;width:min(1200px,96vw);height:min(90vh,980px);overflow:hidden;background:var(--dsw-alias-bg-layer-1,#1e1e22);border:.5px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));border-radius:var(--dsw-radius-lg,12px);box-shadow:var(--dsw-elevation-prominent,0 18px 48px rgba(0,0,0,.4))}
.gh2-projectmask{z-index:92}
.gh2-projectbar{flex:none;display:flex;align-items:center;gap:10px;min-height:44px;padding:0 10px 0 14px;border-bottom:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));font-size:.9em}
.gh2-projectbody{flex:1;min-height:0;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:14px}
.gh2-project-section{display:flex;flex-direction:column;gap:8px;min-width:0;padding:10px;border:.5px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:var(--dsw-radius-md,10px);background:var(--dsw-alias-bg-base,rgba(255,255,255,.02))}
.gh2-project-columns{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;min-width:0}
.gh2-project-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;min-width:0}
.gh2-project-row{display:flex;align-items:center;gap:6px;min-width:0;border-radius:var(--dsw-radius-sm,8px)}
.gh2-project-row.is-active{background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.04))}
.gh2-project-main{all:unset;box-sizing:border-box;flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;padding:6px 8px;border-radius:var(--dsw-radius-sm,8px);cursor:pointer;font-size:.84em;color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-project-main:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-project-main:focus-visible,.gh2-project-item:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,#6aa0ff);outline-offset:-2px}
.gh2-project-main .gh2-mono,.gh2-project-item .gh2-mono{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;min-width:0}
.gh2-project-meta{font-size:.94em;color:var(--dsw-alias-label-tertiary,#8b8b92);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh2-project-delete{flex:none;height:26px;padding:0 8px;border:0;border-radius:var(--dsw-radius-sm,8px);background:transparent;color:var(--dsw-alias-label-tertiary,#8b8b92);font:inherit;font-size:.8em;cursor:pointer}
.gh2-project-delete:hover{background:light-dark(rgba(180,35,24,.08),rgba(255,138,128,.1));color:light-dark(#a4261b,#ffaaa0)}
.gh2-project-item{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:8px;min-width:0;padding:5px 8px;border-radius:var(--dsw-radius-sm,8px);cursor:pointer;font-size:.82em;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-project-item:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.gh2-project-item.is-active{box-shadow:inset 2px 0 0 ${GOLD};background:light-dark(rgba(138,100,32,.06),rgba(216,179,106,.08));color:var(--dsw-alias-label-primary,#e9e9ec)}
.gh2-project-itemtext{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}
.gh2-project-itemtitle{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh2-project-carddetail{display:flex;flex-wrap:wrap;gap:4px 18px;font-size:.82em;line-height:1.6;color:var(--dsw-alias-label-secondary,#b5b5bb)}
.gh2-project-carddetail b{font-weight:600;color:var(--dsw-alias-label-tertiary,#8b8b92)}
.gh2-projectbtn{max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gh2-project-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.gh2-project-actions .gh2-finput{flex:1 1 240px;min-width:160px}
@media (max-width:760px){.gh2-project-columns{grid-template-columns:1fr}}
@media (max-width:720px){.gh2-wb-grid{grid-template-columns:1fr}.gh2-m5-ui-grid{grid-template-columns:1fr}}
.gh2-toast{position:fixed;left:50%;bottom:112px;transform:translateX(-50%);z-index:70;padding:7px 14px;border-radius:var(--dsw-radius-md,10px);background:var(--dsw-alias-label-primary,#eeeef0);color:var(--dsw-alias-label-primary-inverted,#141416);font-size:13px;line-height:1.4;pointer-events:none;box-shadow:var(--dsw-elevation-panel,0 4px 16px rgba(0,0,0,.25))}
`;
  function injectStyles() {
    let el = document.getElementById('gh2-style');
    if (!el) {
      el = document.createElement('style');
      el.id = 'gh2-style';
      el.setAttribute('data-plugin-css', PLUGIN_ID);
      document.head.appendChild(el);
    }
    el.textContent = CSS;
  }

  /* ---------------- \u754c\u9762 ---------------- */

  function makeFactory() {
    return (require) => {
      const module = { exports: {} };
      const React = require('react');
      const { createElement: h, Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } = React;
      let P = null;
      try { P = require('@deepseek-ai/dsh-client-ui-primitives'); } catch (error) { fail('primitives', error); }
      const has = (name) => !!(P && P[name]);

      const useStoreState = () => useSyncExternalStore(store.subscribe, store.get);
      function useNow(fast) {
        const [now, setNow] = useState(() => Date.now());
        useEffect(() => {
          const timer = setInterval(() => setNow(Date.now()), fast ? 1000 : 30000);
          return () => clearInterval(timer);
        }, [fast]);
        return now;
      }
      function sessionOf(props) {
        return (props && (props.sessionId || (props.session && props.session.sessionId))) || undefined;
      }
      /** \u4f1a\u8bdd\u4f5c\u7528\u57df\u7684\u90e8\u4ef6\u628a\u5bbf\u4e3b\u7ed9\u7684 inputActions \u767b\u8bb0\u4e0b\u6765\uff0c\u63d2\u5165 /\u540d\u5b57 \u65f6\u7528\u3002 */
      function usePublishInput(props) {
        const sid = sessionOf(props);
        const actions = props && props.inputActions;
        useEffect(() => {
          if (!sid || !actions) return undefined;
          inputRegistry.set(sid, actions);
          return () => { if (inputRegistry.get(sid) === actions) inputRegistry.delete(sid); };
        }, [sid, actions]);
      }
      function useDismiss(ref, open, setOpen) {
        useEffect(() => {
          if (!open) return undefined;
          const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
          const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); } };
          document.addEventListener('pointerdown', onDown, true);
          document.addEventListener('keydown', onKey, true);
          return () => {
            document.removeEventListener('pointerdown', onDown, true);
            document.removeEventListener('keydown', onKey, true);
          };
        }, [open]);
      }

      /* \u56fe\u5f62 */
      function Logo({ size }) {
        return h('svg', { width: size, height: size, viewBox: '0 0 32 32', fill: 'currentColor', 'aria-hidden': 'true', focusable: 'false' },
          h('path', { d: 'M2 13 5.5 7 11 12 9 17Z' }),
          h('path', { d: 'M8.5 4.5 14.5 2 14.5 10.5 13 11.5Z' }),
          h('path', { d: 'M18 2.5 24 6 19.5 12.5 17 11Z' }),
          h('path', { d: 'M26.5 9 29.5 15.5 22.5 17.5 21.5 14.5Z' }),
          h('path', { d: 'M3 19.5 9.5 22.5 14.5 25 19 22.5 15.5 19 18.5 17 23 21.5 28 20.5 23 26.5 14.5 29.5 6 25Z' }));
      }
      const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' };
      const IconMinimize = () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', ...stroke }, h('path', { d: 'M4 8.5h8' }));
      const IconGrip = () => h('svg', { width: 12, height: 12, viewBox: '0 0 12 12', ...stroke }, h('path', { d: 'M10.5 4.5l-6 6M10.5 8l-2.5 2.5' }));
      const IconChevron = () => h('svg', { width: 12, height: 12, viewBox: '0 0 12 12', ...stroke }, h('path', { d: 'M3.5 7.5L6 5l2.5 2.5' }));
      const IconSearch = () => (has('IconSearchOutlineRegular') ? h(P.IconSearchOutlineRegular, { size: 16 }) : null);
      // ActivadoDesactivado\uff1a + \uff08 Logo\uff09\uff1bmuchos\u3002
      const IconWheel = ({ off }) => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', ...stroke, className: 'gh2-wheelico' },
        h('circle', { cx: 8, cy: 8, r: 5.4 }),
        h('circle', { cx: 8, cy: 8, r: 1.6 }),
        h('path', { d: 'M8 2.6v2.1M8 11.3v2.1M2.6 8h2.1M11.3 8h2.1' }),
        off ? h('path', { d: 'M3.8 12.2 12.2 3.8' }) : null);

      /* \u5bbf\u4e3b\u539f\u751f\u90e8\u4ef6\uff08\u7f3a\u5931\u65f6\u9000\u56de\u540c\u6837\u5916\u89c2\u7684\u666e\u901a\u5143\u7d20\uff09 */
      function IconButton({ label, onClick, pressed, className, children, ...rest }) {
        const cls = 'gh2-iconbtn' + (className ? ' ' + className : '');
        if (has('Button') && has('Tooltip')) {
          return h(P.Tooltip, {
            label, side: 'bottom', delayMs: 400,
            children: h(P.Button, { size: 'sm', className: cls, 'aria-label': label, 'aria-pressed': pressed, onClick, ...rest, children }),
          });
        }
        return h('button', { type: 'button', className: 'gh2-fbtn ' + cls, title: label, 'aria-label': label, 'aria-pressed': pressed, onClick, ...rest, children });
      }
      function TextButton({ onClick, children, variant, disabled, title, ...rest }) {
        if (has('Button')) return h(P.Button, { size: 'sm', variant: variant || 'outline', onClick, disabled, title, ...rest }, children);
        return h('button', { type: 'button', className: 'gh2-fbtn is-outline', onClick, disabled, title, ...rest }, children);
      }
      function Chip({ active, onClick, disabled, children }) {
        if (has('Pill')) return h(P.Pill, { active, onClick, disabled, 'aria-pressed': active }, children);
        return h('button', { type: 'button', className: 'gh2-fpill', 'aria-pressed': active, onClick, disabled }, children);
      }
      function SearchBox({ value, onChange }) {
        const props = { placeholder: 'Buscar habilidad por nombre o descripción', 'aria-label': 'Buscar habilidad', value, onChange: (e) => onChange(e.target.value) };
        if (has('Input')) return h(P.Input, { ...props, icon: IconSearch(), className: 'gh2-search' });
        return h('input', { ...props, className: 'gh2-finput' });
      }
      function Dot({ live }) {
        if (live && has('StateDot')) return h(P.StateDot, { state: 'ongoing', size: 12 });
        return h('span', { className: live ? 'gh2-idle is-live' : 'gh2-idle', 'aria-hidden': 'true' });
      }
      function Tabs({ value, onChange }) {
        const items = TABS.map((t) => ({ value: t.id, label: t.label, id: 'gh2-tab-' + t.id, panelId: 'gh2-panel-' + t.id }));
        if (has('SegmentedTabs')) return h(P.SegmentedTabs, { items, value, onChange, label: 'Pestañas de Mano divina', className: 'gh2-seg' });
        return h('div', { role: 'tablist', 'aria-label': 'Pestañas de Mano divina', className: 'gh2-ftabs' }, items.map((it) => h('button', {
          key: it.value, id: it.id, role: 'tab', type: 'button', 'aria-selected': it.value === value, 'aria-controls': it.panelId,
          className: 'gh2-ftab', onClick: () => onChange(it.value),
        }, it.label)));
      }
      function Empty({ title, text, action }) {
        return h('div', { className: 'gh2-empty' }, h('h3', null, title), text ? h('p', null, text) : null, action || null);
      }

      /* \u4f1a\u8bdd\u5934\u6309\u94ae */
      function HeaderButton(props) {
        usePublishInput(props);
        const s = useStoreState();
        const sid = sessionOf(props) || s.sessionId;
        const live = sid === s.sessionId && Object.keys(s.activity.inUse).length > 0;
        const full = s.ui.mode === 'full';
        return h(IconButton, {
          label: 'Mano divina',
          pressed: full,
          className: 'gh2-hbtn' + (live ? ' is-live' : ''),
          // Activado\uff0c\uff1bActivadoActivadoDesactivado\u3002
          onClick: () => setUi(full ? { mode: 'compact', wheelOn: true } : { mode: 'full' }),
        }, h(Logo, { size: 16 }), live ? h('span', { className: 'gh2-ping', 'aria-hidden': 'true' }) : null);
      }

      /* \u4f1a\u8bdd\u5934\u8f6e\u76d8ActivadoDesactivado\uff1a\u663e\u793a/Ocultar la rueda\uff0c\u72b6\u6001\u5b58\u672c\u673a */
      function WheelToggleButton() {
        const s = useStoreState();
        const on = s.ui.wheelOn !== false;
        return h(IconButton, {
          label: on ? 'Ocultar la rueda' : 'Mostrar la rueda',
          pressed: on,
          className: 'gh2-wheelbtn' + (on ? '' : ' is-off'),
          'data-gh': 'wheel-toggle',
          onClick: () => setUi({ wheelOn: !on }),
        }, h(IconWheel, { off: !on }));
      }

      /* Soul \u5c0f\u6d6e\u7a97 */
      function SoulDock(props) {
        usePublishInput(props);
        const s = useStoreState();
        const [open, setOpen] = useState(false);
        const rootRef = useRef(null);
        useDismiss(rootRef, open, setOpen);
        const sid = sessionOf(props) || s.sessionId;
        if (!sid || sid !== s.sessionId) return null;
        const cat = s.catalog;
        const known = cat.state === 'ready';
        const available = known && cat.skills.some((k) => k.name === SOUL_SKILL);
        const current = SOULS.find((x) => x.id === s.activity.soul);
        const label = known && !available ? 'Soul no disponible' : current ? 'Soul · ' + current.name : 'Soul';
        const pick = (id) => { setOpen(false); sendSoul(id); };
        const pop = !open ? null : h('div', { className: 'gh2-soulpop', 'data-gh': 'soul-pop' }, available
          ? [
            ...SOULS.map((x) => h(Chip, { key: x.id, active: s.activity.soul === x.id, onClick: () => pick(x.id) }, x.name)),
            h(Chip, { key: 'off', active: false, disabled: s.activity.soul === 'off', onClick: () => pick('off') }, 'Cerrar'),
          ]
          : h('p', { className: 'gh2-soulnote' }, '\u8fd9\u4e2a\u4f1a\u8bdd\u7684\u9884\u8bbeno hay \u52a0\u8f7d TW Soul\u3002Elige el preajuste «TavernWeave X DSH» al crear una tarea para poder cambiar aquí.'));
        return h('div', { className: 'gh2-root gh2-souldock' },
          h('div', { className: 'gh2-soul', ref: rootRef },
            pop,
            h('button', {
              type: 'button',
              className: 'gh2-soulpill' + (current ? ' is-on' : '') + (known && !available ? ' is-off' : ''),
              'data-gh': 'soul-pill',
              'aria-haspopup': 'true',
              'aria-expanded': open,
              disabled: !known,
              title: current ? 'Modo actual inferido del último comando Soul de esta sesión' : undefined,
              onClick: () => setOpen((v) => !v),
            }, h('span', { className: 'gh2-souldot', 'aria-hidden': 'true' }), label, h(IconChevron))));
      }

      /* \u7f29\u7565\u6001\uff1aSkill \u8f6e\u76d8 */
      function sameFrame(a, b) {
        return a === b || (!!a && !!b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h);
      }
      /** \u8ddf\u8e2a\u5de6\u4fa7\u680f\u548c\u5bf9\u8bdd\u680f\u4e4b\u95f4\u7684\u7a7a\u767d\uff1b\u653e\u4e0d\u4e0b\u8f6e\u76d8\u65f6\u8fd4\u56de null\u3002 */
      function useGutter(active) {
        const [frame, setFrame] = useState(null);
        useEffect(() => {
          if (!active) { G.wheel.reason = 'no-session'; setFrame(null); return undefined; }
          let raf = 0;
          let watched = [];
          const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => schedule()) : null;
          function run() {
            raf = 0;
            let g = null;
            try { g = measureGutter(); } catch (error) { fail('gutter', error); }
            G.wheel.reason = g ? g.reason : 'error';
            G.wheel.blocker = g && g.blocker ? g.blocker : null;
            G.wheel.gutter = g && g.w !== undefined ? { x: g.x, y: g.y, w: g.w, h: g.h } : null;
            const targets = g && g.root ? [g.root, g.anchor] : [];
            if (ro && (targets[0] !== watched[0] || targets[1] !== watched[1])) {
              ro.disconnect();
              for (const t of targets) ro.observe(t);
              watched = targets;
            }
            const next = g && g.reason === 'ok' ? { x: g.x, y: g.y, w: g.w, h: g.h } : null;
            setFrame((prev) => (sameFrame(prev, next) ? prev : next));
          }
          function schedule() { if (!raf) raf = requestAnimationFrame(run); }
          window.addEventListener('resize', schedule);
          const timer = setInterval(schedule, 1000);
          schedule();
          return () => {
            if (raf) cancelAnimationFrame(raf);
            clearInterval(timer);
            window.removeEventListener('resize', schedule);
            if (ro) ro.disconnect();
          };
        }, [active]);
        return active ? frame : null;
      }
      function wheelItems(skills) {
        const item = (k, section) => ({
          kind: 'skill', section, key: 'skill:' + k.name, name: k.name,
          desc: k.description, zh: k.zh, detail: k.detail, tag: k.tag,
        });
        return [
          ...skills.filter((k) => k.tw).map((k) => item(k, 'tw')),
          ...FEATURES.map((f) => ({ kind: 'feature', section: 'feature', key: 'feature:' + f.tab, name: f.name, desc: f.desc, tab: f.tab })),
          ...skills.filter((k) => !k.tw).map((k) => item(k, 'other')),
        ];
      }
      function WheelHover({ item, pos, s, now }) {
        const ref = useRef(null);
        useLayoutEffect(() => {
          const el = ref.current;
          if (!el) return;
          el.style.top = Math.max(EDGE, Math.min(window.innerHeight - el.offsetHeight - EDGE, pos.top)) + 'px';
          el.style.left = Math.max(EDGE, Math.min(window.innerWidth - el.offsetWidth - EDGE, pos.left)) + 'px';
        });
        const a = s.activity;
        const live = a.inUse[item.name];
        const count = a.counts[item.name] || 0;
        let last = null;
        for (let i = a.calls.length - 1; i >= 0; i--) if (a.calls[i].name === item.name) { last = a.calls[i]; break; }
        return h('div', { ref, className: 'gh2-root gh2-whover', role: 'tooltip', 'data-gh': 'wheel-hover', style: { left: pos.left, top: pos.top } },
          h('div', { className: 'gh2-hk' },
            h('span', null, item.tag || 'Skill'),
            h('span', { className: live ? 'is-live' : undefined }, live ? 'En uso ' + clock(now - live.since) : count ? 'Llamadas en esta sesión: ' + count + ' ' : 'Aún no se ha llamado en esta sesión')),
          h('h4', null, item.name),
          h('p', null, item.detail || item.zh || item.desc || 'no hay \u8bf4\u660e'),
          !item.detail && item.desc ? h('p', { className: 'gh2-hnote' }, 'Este Skill no está en la lista de descripciones traducidas; se conserva el texto original.') : null,
          last ? h('div', { className: 'gh2-hlast' }, 'Última vez: ' + ago(last.time, now) + ' · ' + (last.source === 'model' ? 'Llamada del modelo' : 'Llamada manual')) : null,
          h('div', { className: 'gh2-hhint' }, 'Haz clic para ver detalles · Arrastra al campo para insertar /' + item.name));
      }
      function Wheel({ s }) {
        const sid = s.sessionId;
        const frame = useGutter(!!sid);
        const zoneRef = useRef(null);
        const plateRef = useRef(null);
        const headRef = useRef(null);
        const cardEls = useRef(new Map());
        const st = useRef(null);
        if (!st.current) {
          const start = store.get().ui.wheel || 0;
          st.current = { geo: null, cards: [], count: 0, featureStart: 0, otherStart: 0, current: start, target: start, raf: 0, acc: 0, spin: null, hovering: false, rotatedFor: '' };
        }
        const [hover, setHover] = useState(null);
        const cat = s.catalog;
        const skills = cat.sessionId === sid ? cat.skills : [];
        const items = useMemo(() => (cat.state === 'ready' || skills.length ? wheelItems(skills) : []), [skills, cat.state]);
        const itemsKey = items.map((it) => it.key).join('\n');
        const a = s.activity;
        const liveNames = Object.keys(a.inUse);
        const now = useNow(liveNames.length > 0);

        const api = useRef(null);
        if (!api.current) {
          const S = st.current;
          const maxScroll = () => Math.max(0, S.count - (S.geo ? S.geo.slots : 0));
          const clampScroll = (i) => Math.max(0, Math.min(maxScroll(), i));
          const layout = () => {
            const g = S.geo;
            if (!g) return;
            const mid = (g.slots - 1) / 2;
            const offset = S.count < g.slots ? (g.slots - S.count) / 2 : 0;
            S.cards.forEach((el, i) => {
              const f = i - S.current + offset;
              if (!(f > -0.6 && f < g.slots - 0.4)) {
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                return;
              }
              const slotPos = f - mid;
              const angle = slotPos * g.step;
              const x = g.X0 - g.R * (1 - Math.cos(angle));
              const y = g.Cy + slotPos * g.spacing;
              let op = 1;
              if (f < 0) op = Math.max(0, 1 + f / 0.6);
              else if (f > g.slots - 1) op = Math.max(0, 1 - (f - (g.slots - 1)) / 0.6);
              el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%) rotate(' + (angle * 180 / Math.PI).toFixed(2) + 'deg)';
              el.style.visibility = 'visible';
              el.style.opacity = op.toFixed(2);
              el.style.zIndex = String(20 + Math.round(10 - Math.abs(slotPos)));
            });
            const head = headRef.current;
            if (head) {
              const last = Math.round(S.current) + g.slots - 1;
              const round = S.otherStart >= 0 && last >= S.otherStart ? 'other'
                : S.featureStart >= 0 && last >= S.featureStart ? 'features' : 'skills';
              if (head.dataset.round !== round) head.dataset.round = round;
            }
            G.wheel.current = S.current;
            G.wheel.target = S.target;
          };
          const reduce = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
          const tick = () => {
            S.raf = 0;
            const diff = S.target - S.current;
            if (Math.abs(diff) < 0.01 || reduce()) {
              S.current = S.target;
              layout();
              if (store.get().ui.wheel !== S.target) setUi({ wheel: S.target });
              return;
            }
            S.current += diff * WHEEL.ease;
            layout();
            S.raf = requestAnimationFrame(tick);
          };
          const go = (i) => {
            S.target = clampScroll(Math.round(i));
            if (!S.raf) S.raf = requestAnimationFrame(tick);
          };
          api.current = { layout, go, clampScroll, maxScroll };
        }
        const W = api.current;

        //  →  → \u3002\u3001\u3002
        useLayoutEffect(() => {
          const S = st.current;
          const zone = zoneRef.current;
          if (!zone || !frame) { S.geo = null; G.wheel.geo = null; G.wheel.zoneRight = undefined; return undefined; }
          const cards = items.map((it) => cardEls.current.get(it.key)).filter(Boolean);
          const setup = () => {
            try {
              // \uff08\uff09\uff0c/
              const measure = () => {
                let cardH = 0;
                for (const el of cards) cardH = Math.max(cardH, el.offsetHeight || 0);
                return cardH || 92;
              };
              let g = wheelGeometry(frame.w, frame.h, measure());
              const compact = zone.classList.contains('is-compact');
              //  6px \uff0c
              if (g && (g.cardW < WHEEL.compactBelow + (compact ? 6 : 0)) !== compact) {
                zone.classList.toggle('is-compact', !compact);
                g = wheelGeometry(frame.w, frame.h, measure());
              }
              G.wheel.fit = !!g;
              G.wheel.zoneRight = g ? frame.x + g.width : undefined;
              if (!g) { zone.style.visibility = 'hidden'; S.geo = null; return; }
              zone.style.visibility = '';
              zone.style.width = g.width + 'px';
              zone.style.setProperty('--gh2-card-w', g.cardW + 'px');
              // \uff1a\uff0c\uff1b
              const plate = plateRef.current;
              if (plate) {
                const cx = g.X0 - g.R;
                const vh = window.innerHeight / 100;
                const [ring, inner, accent] = plate.querySelectorAll('path');
                ring.setAttribute('d', ringPath(cx, g.Cy, g.R, frame.h));
                inner.setAttribute('d', ringPath(cx, g.Cy, g.R - 7 * vh, frame.h));
                accent.setAttribute('d', ringPath(cx, g.Cy, g.R - 14 * vh, frame.h));
                plate.dataset.cx = cx.toFixed(2);
                plate.dataset.cy = g.Cy.toFixed(2);
                plate.dataset.r = g.R.toFixed(2);
              }
              S.geo = g;
              S.cards = cards;
              S.count = cards.length;
              S.featureStart = items.findIndex((it) => it.kind === 'feature');
              S.otherStart = items.findIndex((it) => it.section === 'other');
              // \uff0c 0
              if (S.count) {
                S.target = W.clampScroll(S.target);
                S.current = W.clampScroll(S.current);
              }
              G.wheel.geo = { slots: g.slots, cardW: g.cardW, cardH: g.cardH, theta: +(g.theta * 180 / Math.PI).toFixed(2), R: Math.round(g.R), X0: +g.X0.toFixed(1), Cy: +g.Cy.toFixed(1), spacing: +g.spacing.toFixed(1), width: g.width };
              G.wheel.count = S.count;
              W.layout();
            } catch (error) {
              fail('wheel', error);
            }
          };
          setup();
          const ro = typeof ResizeObserver === 'function' && cards[0] ? new ResizeObserver(() => setup()) : null;
          if (ro) ro.observe(cards[0]);
          return () => { if (ro) ro.disconnect(); };
        }, [frame && frame.w, frame && frame.h, !!frame, itemsKey]);

        // \u3001\u3001\uff1a\uff08\uff09
        useEffect(() => {
          const zone = zoneRef.current;
          if (!zone) return undefined;
          const S = st.current;
          const onWheel = (e) => {
            e.preventDefault();
            setHover(null);
            const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
            const dy = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit;
            if (Math.abs(dy) >= 50) { S.acc = 0; W.go(S.target + Math.sign(dy)); return; }
            S.acc += dy;
            if (Math.abs(S.acc) >= 60) {
              const n = Math.trunc(S.acc / 60);
              S.acc -= n * 60;
              W.go(S.target + n);
            }
          };
          const onDown = (e) => {
            if (e.button !== 0 || (e.target.closest && e.target.closest('.gh2-wcard'))) return;
            S.spin = { y: e.clientY, base: S.target };
            try { zone.setPointerCapture(e.pointerId); } catch {}
            zone.classList.add('is-spinning');
            setHover(null);
          };
          const onMove = (e) => {
            if (!S.spin) return;
            const stepPx = Math.max(40, S.geo ? S.geo.spacing : 100);
            W.go(S.spin.base + Math.trunc((S.spin.y - e.clientY) / stepPx));
          };
          const onUp = () => { S.spin = null; zone.classList.remove('is-spinning'); };
          const onOver = (e) => {
            S.hovering = true;
            if (S.spin) return;
            const card = e.target.closest && e.target.closest('.gh2-wcard');
            if (!card) return;
            if (card.dataset.kind !== 'skill') { setHover(null); return; }
            const r = card.getBoundingClientRect();
            const z = zone.getBoundingClientRect();
            setHover((prev) => (prev && prev.key === card.dataset.key ? prev : { key: card.dataset.key, pos: { left: Math.round(z.right + 8), top: Math.round(r.top) } }));
          };
          const onOut = (e) => {
            const to = e.relatedTarget;
            if (!to || !to.closest || !to.closest('.gh2-wcard')) setHover(null);
          };
          const onLeave = () => { S.hovering = false; setHover(null); };
          zone.addEventListener('wheel', onWheel, { passive: false });
          zone.addEventListener('pointerdown', onDown);
          zone.addEventListener('pointermove', onMove);
          zone.addEventListener('pointerup', onUp);
          zone.addEventListener('pointercancel', onUp);
          zone.addEventListener('pointerover', onOver);
          zone.addEventListener('pointerout', onOut);
          zone.addEventListener('pointerleave', onLeave);
          return () => {
            zone.removeEventListener('wheel', onWheel);
            zone.removeEventListener('pointerdown', onDown);
            zone.removeEventListener('pointermove', onMove);
            zone.removeEventListener('pointerup', onUp);
            zone.removeEventListener('pointercancel', onUp);
            zone.removeEventListener('pointerover', onOver);
            zone.removeEventListener('pointerout', onOut);
            zone.removeEventListener('pointerleave', onLeave);
          };
        }, [!!frame]);

        // Sí Skill Activado\uff08\uff09
        const newest = liveNames.length ? liveNames[liveNames.length - 1] : '';
        useEffect(() => {
          const S = st.current;
          if (!newest) { S.rotatedFor = ''; return; }
          if (S.rotatedFor === newest || S.hovering || S.spin || !S.geo) return;
          const idx = items.findIndex((it) => it.kind === 'skill' && it.name === newest);
          if (idx < 0) return;
          S.rotatedFor = newest;
          W.go(idx - Math.floor(S.geo.slots / 2));
        }, [newest, itemsKey, !!frame]);

        useEffect(() => () => { if (st.current.raf) cancelAnimationFrame(st.current.raf); }, []);

        if (!frame) return null;
        const onKeyDown = (e) => {
          const S = st.current;
          if (!S.geo || e.target !== e.currentTarget) return;
          const page = Math.max(1, S.geo.slots - 1);
          const next = { ArrowDown: S.target + 1, ArrowRight: S.target + 1, ArrowUp: S.target - 1, ArrowLeft: S.target - 1,
            PageDown: S.target + page, PageUp: S.target - page, Home: 0, End: W.maxScroll() }[e.key];
          if (next === undefined) return;
          e.preventDefault();
          e.stopPropagation();
          setHover(null);
          W.go(next);
        };
        const showFocus = (it, el) => {
          if (it.kind !== 'skill' || !el || !zoneRef.current) return;
          const r = el.getBoundingClientRect();
          const z = zoneRef.current.getBoundingClientRect();
          setHover({ key: it.key, pos: { left: Math.round(z.right + 8), top: Math.round(r.top) } });
        };
        const twCount = skills.filter((k) => k.tw).length;
        const otherCount = skills.length - twCount;
        let head;
        if (cat.state === 'error' && !skills.length) head = 'Error al leer el directorio de Skills';
        else if (!items.length) head = 'Leyendo el directorio de Skills…';
        else if (!skills.length) head = '\u8fd9\u4e2a\u4f1a\u8bddno hay  Skill';
        else head = [h('b', { key: 'b' }, 'TW SKILLS'), ' · ' + twCount + ' · Otros ' + otherCount + ' · ', h('span', { key: 'h', className: 'gh2-whint' }, 'girar con la rueda')];
        const hoverItem = hover ? items.find((it) => it.key === hover.key) : null;
        return h(Fragment, null,
          h('section', {
            ref: zoneRef, className: 'gh2-root gh2-wheel', role: 'group', tabIndex: 0, 'data-gh': 'wheel',
            'aria-label': 'Rueda de Skills: gira con la rueda, las flechas o arrastrando; haz clic en una tarjeta para ver detalles y arrástrala al campo para insertar',
            style: { left: frame.x, top: frame.y, height: frame.h },
            onKeyDown,
          },
            h('svg', { ref: plateRef, className: 'gh2-plate', 'aria-hidden': 'true', focusable: 'false', 'data-gh': 'wheel-plate' },
              h('path', { className: 'gh2-ring' }),
              h('path', { className: 'gh2-ring is-inner' }),
              h('path', { className: 'gh2-ring is-accent' })),
            h('div', { ref: headRef, className: 'gh2-whead', 'data-gh': 'wheel-head', 'data-round': 'skills' },
              h('span', { className: 'gh2-brand' }, h(Logo, { size: 13 })),
              h('span', { className: 'gh2-wh-skills' }, head),
              h('span', { className: 'gh2-wh-features' }, h('b', null, 'Funciones'), ' · Siguiente rueda'),
              h('span', { className: 'gh2-wh-other' }, h('b', null, 'Otros Skills'), ' · ' + otherCount + '')),
            cat.state === 'error' && !skills.length ? h('div', { className: 'gh2-wnote' },
              h('p', null, cat.error), h(TextButton, { onClick: () => loadCatalog(sid) }, 'Reintentar')) : null,
            items.map((it) => {
              const live = it.kind === 'skill' ? a.inUse[it.name] : null;
              const count = it.kind === 'skill' ? a.counts[it.name] || 0 : 0;
              const label = live ? [h('i', { key: 'd', className: 'gh2-wdot' }), it.tag || 'Skill']
                : it.kind === 'feature' ? 'Funciones' : it.tag || 'Otros';
              return h('button', {
                key: it.key,
                ref: (el) => { if (el) cardEls.current.set(it.key, el); else cardEls.current.delete(it.key); },
                type: 'button',
                className: 'gh2-wcard' + (it.kind === 'feature' ? ' is-feature' : '') + (live ? ' is-live' : ''),
                'data-gh': 'wheel-card', 'data-key': it.key, 'data-kind': it.kind,
                'data-skill': it.kind === 'skill' ? it.name : undefined,
                'data-tab': it.kind === 'feature' ? it.tab : undefined,
                draggable: it.kind === 'skill',
                onClick: () => (it.kind === 'skill' ? openSkill(it.name) : openTab(it.tab)),
                onDragStart: (e) => { setHover(null); startSkillDrag(e, it.name); },
                onFocus: (e) => showFocus(it, e.currentTarget),
                onBlur: () => setHover(null),
              },
                h('span', { className: 'gh2-wtop' },
                  h('span', { className: 'gh2-wlabel' }, label),
                  h('span', null, live ? 'En uso ' + clock(now - live.since) : count ? '\u672c\u4f1a\u8bdd ' + count + ' ' : '')),
                h('span', { className: 'gh2-wname' }, it.name),
                h('span', { className: 'gh2-wdesc' }, it.zh || it.desc || 'no hay \u8bf4\u660e'),
                h('span', { className: 'gh2-wmeta' }, it.kind === 'feature' ? 'Haz clic para activar' : live ? 'Haz clic para activar · En uso' : 'Arrastra al campo para insertar'));
            })),
          hoverItem ? h(WheelHover, { item: hoverItem, pos: hover.pos, s, now }) : null);
      }

      /* \u5b8c\u6574\u6001 */
      function SkillsPane({ s }) {
        const [query, setQuery] = useState('');
        const [usedOnly, setUsedOnly] = useState(false);
        const [scope, setScope] = useState('all');
        const [openName, setOpenName] = useState(null);
        const [sending, setSending] = useState(null);
        const sendingRef = useRef(false);
        const listRef = useRef(null);
        const a = s.activity;
        const cat = s.catalog;
        const now = useNow(Object.keys(a.inUse).length > 0);
        const focus = s.focus;
        // \uff1a\u3001Activado
        useEffect(() => {
          if (!focus) return undefined;
          setQuery('');
          setUsedOnly(false);
          setScope('all');
          setOpenName(focus.name);
          const raf = requestAnimationFrame(() => {
            const row = listRef.current && [...listRef.current.querySelectorAll('li')].find((li) => li.dataset.skill === focus.name);
            if (row) { try { row.scrollIntoView({ block: 'nearest' }); } catch {} }
          });
          return () => cancelAnimationFrame(raf);
        }, [focus && focus.seq]);
        if (!s.sessionId) return h(Empty, { title: 'no hay \u6253Activado\u7684\u4f1a\u8bdd', text: 'Abre una sesión para ver las habilidades que puede usar.' });
        if (cat.sessionId !== s.sessionId) {
          return h(Empty, { title: 'Leyendo las habilidades de esta sesión…', text: 'Espera a que termine de leerse el directorio para no enviar habilidades de otra sesión.' });
        }
        if (cat.state === 'error') {
          return h(Empty, {
            title: 'Error al leer el directorio de habilidades', text: cat.error,
            action: h(TextButton, { onClick: () => loadCatalog(s.sessionId) }, 'Reintentar'),
          });
        }
        if (!cat.skills.length) {
          return cat.state === 'ready'
            ? h(Empty, { title: '\u8fd9\u4e2a\u4f1a\u8bddno hay \u53ef\u7528\u7684 Skill', text: 'Las habilidades cargadas dependen del preajuste de la sesión.' })
            : h(Empty, { title: 'Leyendo el directorio de Skills…' });
        }
        const q = query.trim().toLowerCase();
        const twCount = cat.skills.filter((k) => k.tw).length;
        const otherCount = cat.skills.length - twCount;
        const rows = cat.skills.filter((k) => (scope === 'all' || (scope === 'tw' ? k.tw : !k.tw))
          && (!usedOnly || a.counts[k.name])
          && (!q || k.name.toLowerCase().includes(q) || k.description.toLowerCase().includes(q)
            || (k.zh || '').toLowerCase().includes(q) || (k.tag || '').toLowerCase().includes(q)
            || (k.detail || '').toLowerCase().includes(q)));
        const liveNames = Object.keys(a.inUse);
        const summary = 'Llamadas en esta sesión: ' + a.total + ' ' + (a.hasMore ? '\uff08registros anteriores no cargados\uff09' : '')
          + ' · TW ' + twCount + ' / Otros ' + otherCount
          + (liveNames.length ? ' · En uso\uff1a' + liveNames.join('\u3001') : '');
        return h(Fragment, null,
          h('div', { className: 'gh2-tools' },
            h(SearchBox, { value: query, onChange: setQuery }),
            h(Chip, { active: scope === 'all', onClick: () => setScope('all') }, 'Todas ' + cat.skills.length),
            h(Chip, { active: scope === 'tw', onClick: () => setScope('tw') }, 'TW ' + twCount),
            h(Chip, { active: scope === 'other', onClick: () => setScope('other') }, 'Otros ' + otherCount),
            h(Chip, { active: usedOnly, onClick: () => setUsedOnly(!usedOnly) }, 'Usadas en esta sesión')),
          h('p', { className: 'gh2-summary', 'data-gh': 'summary' }, summary),
          rows.length
            ? h('ul', { className: 'gh2-list', 'data-gh': 'skill-list', ref: listRef }, rows.map((k) => {
              const live = !!a.inUse[k.name];
              const count = a.counts[k.name] || 0;
              const isOpen = openName === k.name;
              return h('li', { key: k.name, className: 'gh2-row' + (live ? ' is-live' : '') + (isOpen ? ' is-open' : ''), 'data-skill': k.name },
                h('button', {
                  type: 'button', className: 'gh2-rowmain', 'aria-expanded': isOpen, draggable: true,
                  onClick: () => setOpenName(isOpen ? null : k.name),
                  onDoubleClick: () => insertSkill(k.name),
                  onDragStart: (e) => startSkillDrag(e, k.name),
                },
                  h('span', { className: 'gh2-rowtext' },
                    h('span', { className: 'gh2-nameline' },
                      h('span', { className: 'gh2-rowtag' }, k.tag || 'Otros'),
                      h('span', { className: 'gh2-name' }, k.name)),
                    h('span', { className: 'gh2-desc' }, k.zh || k.description || 'no hay \u8bf4\u660e')),
                  h('span', { className: 'gh2-meta' }, live ? [h(Dot, { key: 'd', live: true }), 'En uso'] : count ? count + ' ' : '')),
                isOpen ? h('div', { className: 'gh2-rowmore' },
                  h('p', { className: 'gh2-rowdetail', 'data-gh': 'row-detail' }, k.detail || k.zh || k.description || 'no hay \u8bf4\u660e'),
                  h('div', { className: 'gh2-rowactions' },
                    h(TextButton, { onClick: () => insertSkill(k.name) }, 'Insertar en el campo'),
                    h(TextButton, {
                      disabled: live || !!sending,
                      title: live ? 'Este Skill se está llamando' : sending ? 'Enviando la última instrucción' : '\u628a /' + k.name + ' enviar a la sesión actual',
                      onClick: async () => {
                        if (sendingRef.current) return;
                        sendingRef.current = true;
                        setSending(k.name);
                        try { await runSkill(k.name); }
                        finally {
                          // \uff0c 1.5 \uff1b\u3002
                          setTimeout(() => { sendingRef.current = false; setSending(null); }, 1500);
                        }
                      },
                    }, live ? 'En uso' : sending === k.name ? 'Enviando…' : 'Ejecutar Skill'))) : null);
            }))
            : h('p', { className: 'gh2-none' }, usedOnly
              ? '\u672c\u4f1a\u8bdd\u8fd8no hay \u8c03\u7528\u8fc7' + (scope === 'tw' ? ' TW Skill' : scope === 'other' ? 'Otros Skills' : ' Skill')
              : scope === 'tw' ? 'no hay \u5339\u914d\u7684 TW Skill' : scope === 'other' ? '\u8fd9\u4e2a\u4f1a\u8bddno hay Otros\u6765\u6e90\u7684 Skill' : 'no hay \u5339\u914d\u7684 Skill'),
          a.calls.length ? h('section', { className: 'gh2-recent', 'data-gh': 'recent' },
            h('h4', null, 'Llamadas recientes'),
            h('ul', null, a.calls.slice(-6).reverse().map((c, i) => h('li', { key: String(c.seq !== undefined ? c.seq : i) + c.name },
              h('button', { type: 'button', onClick: () => { setUsedOnly(false); setQuery(''); setOpenName(c.name); } },
                h('span', { className: 'gh2-name' }, c.name),
                h('span', { className: 'gh2-meta' }, (c.source === 'model' ? 'Llamada del modelo' : 'Manual') + ' · ' + ago(c.time, now))))))) : null);
      }
      /* ---------- M5\uff1a\u8d44\u6599\u5e93\u7b5b\u9009\u9875 / \u771f\u5b9e\u4e16\u754c\u4e66 / MVU / \u754c\u9762 ---------- */

      function errorLine(text, dataName) {
        if (!text) return null;
        return h('p', { className: 'gh2-m5-error', role: 'alert', 'data-gh': dataName || undefined }, text);
      }

      function leafPreview(value) {
        if (typeof value === 'string') {
          const text = value.length > 100 ? value.slice(0, 100) + '…' : value;
          return JSON.stringify(text);
        }
        return String(value);
      }
      function uidText(uid) {
        return uid === undefined || uid === null ? '\uff08No\uff09' : String(uid);
      }

      /** Solo lectura JSON nodos\u6811\uff1a\u5bf9\u8c61/\u6570\u7ec4\u53ef\u6298\u53e0\uff0c\u5b57\u7b26\u4e32\u622a\u65ad\u663e\u793a\uff1b\u76f4\u63a5\u6765\u81ea\u6587\u4ef6 raw\u3002 */
      function JsonValue({ name, value, depth, budget }) {
        if (budget) {
          budget.left -= 1;
          if (budget.left < 0) return null;
        }
        const isObject = value !== null && typeof value === 'object';
        if (!isObject) {
          return h('div', { className: 'gh2-json-leaf' },
            name !== undefined && name !== '' ? h('span', { className: 'gh2-json-key' }, name) : null,
            name !== undefined && name !== '' ? ' ' : null,
            h('span', { className: 'gh2-json-type' }, value === null ? 'null' : typeof value),
            ' ',
            h('span', { className: 'gh2-json-val' }, leafPreview(value)));
        }
        const isArray = Array.isArray(value);
        const rows = isArray ? value.map((item, index) => [String(index), item]) : Object.entries(value);
        const shown = rows.slice(0, 200);
        return h('details', { className: 'gh2-json-node', open: depth === 0 ? true : undefined },
          h('summary', null,
            name !== undefined && name !== '' ? h('span', { className: 'gh2-json-key' }, name) : null,
            name !== undefined && name !== '' ? ' ' : null,
            h('span', { className: 'gh2-json-type' }, (isArray ? 'Array ' : 'Objeto ') + rows.length + ' elementos')),
          shown.map(([key, item]) => h(JsonValue, { key, name: key, value: item, depth: (depth || 0) + 1, budget })),
          rows.length > shown.length ? h('p', { className: 'gh2-m5-meta' }, '…y ' + (rows.length - shown.length) + ' elementos\u672a\u5c55Activado') : null,
          budget && budget.left <= 0 ? h('p', { className: 'gh2-m5-meta' }, '…demasiados nodos, truncado; consulta el JSON original.') : null);
      }

      function CardWorldbookSection({ s }) {
        const detail = s.ws.cardDetail;
        const wb = detail && detail.worldbook;
        const entries = wb && Array.isArray(wb.entries) ? wb.entries : [];
        if (!detail || !entries.length) return null;
        const cardName = detail.meta.name || detail.meta.characterName || basename(detail.file.path) || 'Actual\u5361';
        return h('section', { className: 'gh2-card-wb', 'data-gh': 'card-worldbook-section' },
          h('details', { className: 'gh2-card-wb-fold', open: true },
            h('summary', { className: 'gh2-card-wb-summary' },
              h('b', { 'data-gh': 'card-wb-title' }, 'Worldbook de la tarjeta (solo lectura)'),
              h('span', { className: 'gh2-m5-meta' }, ' · ' + cardName + ' · ' + (wb.count || entries.length) + ' entradas'),
              h('span', { className: 'gh2-m5-chip' }, 'Solo lectura')),
            h('p', { className: 'gh2-m5-note' }, '\u6765\u81eaActual\u5361\uff1bSolo lectura\u5c55\u793a\uff0c\u4e0dGuardarArchivo de tarjeta\uff0c\u4e0d\u53d1\u5199\u8bf7\u6c42\u3002'),
            h('div', { className: 'gh2-card-wb-list', 'data-gh': 'card-wb-entries' },
              entries.map((entry, index) => h('details', {
                key: String(entry.uid) + ':' + index,
                className: 'gh2-card-wb-entry',
                'data-gh': 'card-wb-entry',
                'data-index': String(index),
              },
                h('summary', null,
                  h('span', { className: 'gh2-card-wb-entrytitle' }, entry.comment || '\uff08no hay \u6807\u9898\uff09'),
                  h('span', { className: 'gh2-card-wb-key' }, entry.keys.length ? entry.keys.join(' / ') : (entry.key || 'No key')),
                  h('span', { className: 'gh2-m5-meta' }, 'UID ' + metaText(entry.uid))),
                h('pre', { className: 'gh2-card-wb-content', 'data-gh': 'card-wb-content' }, entry.content || '(contenido vacío)'))))));
      }

      function WorldbookPane() {
        const s = useStoreState();
        const wb = s.wb;
        const rawText = useMemo(() => jsonPreview(wb.raw), [wb.raw, wb.selectedPath]);
        const entry = wb.openIndex >= 0 ? wb.entries[wb.openIndex] : null;
        const cardWb = s.ws.cardDetail && s.ws.cardDetail.worldbook;
        const hasCardWb = !!(cardWb && Array.isArray(cardWb.entries) && cardWb.entries.length);
        const kindLabel = wb.kind === 'st-object' ? 'st-object (objeto json.entries)'
          : wb.kind === 'st-array' ? 'st-array (array)'
            : wb.kind === 'unknown' ? 'Estructura\u672a\u8bc6\u522b' : '';
        const openDir = () => openWorldbookRoot(wb.rootInput);
        return h('div', { className: 'gh2-m5', 'data-gh': 'worldbook-pane' },
          h('p', { className: 'gh2-m5-lead' }, '\u8bfb\u5199\u672c\u673a\u4e16\u754c\u4e66 JSON\u3002\u76ee\u5f55\u548c\u6587\u4ef6\u90fd\u7531\u5bbf\u4e3b\u6821\u9a8c\uff1bGuardar\u524d\u5bbf\u4e3b\u4f1a\u5907\u4efd\u65e7\u7248\uff0c\u9875\u9762\u53ea\u663e\u793a\u771f\u5b9e\u54cd\u5e94\u3002'),
          s.ws.restoreNotice ? h('p', { className: 'gh2-m5-warn', 'data-gh': 'ws-restore-notice' }, s.ws.restoreNotice) : null,
          errorLine(s.ws.cardInspectError, 'card-inspect-error-wb'),
          s.ws.cardInspectBusy ? h('p', { className: 'gh2-m5-meta', 'data-gh': 'card-inspect-busy-wb' }, 'Leyendo la worldbook, MVU y metadatos de scripts de la tarjeta…') : null,
          h(CardWorldbookSection, { s }),
          hasCardWb ? h('div', { className: 'gh2-mvu-sep' }) : null,
          h('div', { className: 'gh2-m5-rowhead', 'data-gh': 'worldbook-file-heading' },
            h('b', null, 'Archivo local de worldbook (editable)'),
            h('span', { className: 'gh2-m5-meta' }, '\u771f\u5b9e .json · \u72ec\u7acb\u4e8e\u5361\u5185Solo lectura\u5185\u5bb9')),
          h('div', { className: 'gh2-m5-actions' },
            h(TextButton, {
              onClick: pickWorldbookRoot,
              disabled: wb.picking,
              'data-gh': 'wb-pick-root',
            }, wb.picking ? '\u6b63\u5728\u6253Activado\u76ee\u5f55\u9009\u62e9\u5668…' : 'Elegir directorio de la worldbook'),
            h('input', {
              type: 'text',
              className: 'gh2-finput',
              'data-gh': 'wb-root-input',
              'aria-label': 'Ruta del directorio de la worldbook',
              placeholder: 'o introduce una ruta de directorio (absoluta)',
              value: wb.rootInput,
              onChange: (e) => setWb({ rootInput: e.target.value }),
              onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); openDir(); } },
            }),
            h(TextButton, { onClick: openDir, disabled: wb.filesState === 'loading', 'data-gh': 'wb-open-root' },
              wb.filesState === 'loading' ? '\u6b63\u5728\u6253Activado…' : '\u6253Activado\u76ee\u5f55')),
          h('p', { className: 'gh2-m5-note' }, 'no hay \u539f\u751f\u76ee\u5f55\u9009\u62e9\u5668\u65f6\u7528\u8def\u5f84\u6846\uff1b\u8fd9\u91cc\u4e0d\u4f1a\u628a\u76ee\u5f55\u5185\u5bb9\u5047\u88c5\u6210\u5df2\u7ecf\u8bfb\u5230\u3002'),
          errorLine(wb.folderError, 'wb-error'),
          wb.root ? h('p', { className: 'gh2-m5-meta' },
            'Actual\u76ee\u5f55\uff1a', h('span', { className: 'gh2-mono', 'data-gh': 'wb-root' }, wb.root),
            ' · ', wb.filesState === 'loading' ? 'Leyendo…' : wb.files.length + ' .json') : null,
          wb.filesState === 'ready' && !wb.files.length
            ? h('p', { className: 'gh2-m5-warn', 'data-gh': 'wb-empty-files' }, '\u8fd9\u4e2a\u76ee\u5f55\u4e0b\uff08\u6700muchos\u4e09\u5c42\uff09no hay  .json \u6587\u4ef6\u3002\u6362\u4e00\u4e2a\u76ee\u5f55\uff0c\u6216\u786e\u8ba4\u6587\u4ef6\u6269\u5c55\u540d\u3002')
            : null,
          wb.files.length ? h('div', { className: 'gh2-wb-files', 'data-gh': 'wb-files' }, wb.files.map((file) => h('button', {
            key: file.path,
            type: 'button',
            title: file.path,
            className: 'gh2-wb-file' + (file.path === wb.selectedPath ? ' is-active' : ''),
            'data-gh': 'wb-file',
            'data-path': file.path,
            onClick: () => readWorldbookFile(file.path),
          },
            h('span', { className: 'gh2-wb-fname' }, file.name || basename(file.path)),
            h('span', { className: 'gh2-m5-meta' }, formatSize(file.size))))) : null,
          wb.selectedPath ? h(Fragment, null,
            h('div', { className: 'gh2-m5-actions gh2-wb-filehead' },
              h('span', { className: 'gh2-mono', 'data-gh': 'wb-path' }, wb.selectedPath),
              kindLabel ? h('span', { className: 'gh2-m5-chip', 'data-gh': 'wb-kind' }, kindLabel) : null,
              wb.dirty ? h('span', { className: 'gh2-m5-dirty', 'data-gh': 'wb-dirty' }, '\u672aGuardar') : h('span', { className: 'gh2-m5-meta' }, 'no hay \u672aGuardar\u4fee\u6539'),
              wb.saving ? h('span', { className: 'gh2-m5-meta' }, 'Guardar\u4e2d…') : null,
              h('span', { className: 'gh2-spacer' }),
              h(TextButton, {
                onClick: saveWorldbook,
                disabled: wb.saving || (!wb.dirty && wb.kind !== 'unknown'),
                'data-gh': 'wb-save',
              }, wb.saving ? 'Guardar\u4e2d…' : wb.pendingUnknown ? '\u518d\u70b9\u4e00\u786e\u8ba4Guardar' : 'Guardar')),
            wb.loadingFile ? h('p', { className: 'gh2-m5-meta', 'data-gh': 'wb-loading' }, 'Leyendo el archivo…') : null,
            errorLine(wb.error, 'wb-file-error'),
            wb.saveNotice ? h('p', { className: 'gh2-m5-ok', 'data-gh': 'wb-backup' }, wb.saveNotice) : null,
            wb.kind === 'unknown' ? h('p', { className: 'gh2-m5-warn', 'data-gh': 'wb-unknown' }, 'Estructura\u672a\u8bc6\u522b\uff1a\u8fd9\u4e2a\u6587\u4ef6\u4e0dsí st-object (objeto json.entries)\u6216 st-array (array)\u3002\u53ef\u4ee5\u67e5\u770b\u539f\u59cb JSON\uff1bGuardar\u4f1a\u628a\u539f JSON \u539f\u6837\u5199\u56de\u5e76\u5148\u5907\u4efd\uff0c\u9700\u8981\u70b9\u4e24Guardar\u786e\u8ba4\u3002') : null,
            wb.pendingUnknown ? h('p', { className: 'gh2-m5-warn', 'data-gh': 'wb-confirm' }, '\u518d\u70b9\u4e00“Guardar”Confirmar reescrituraEstructura\u672a\u8bc6\u522b\u7684\u6587\u4ef6\u3002') : null,
            wb.entries.length ? h('div', { className: 'gh2-wb-grid' },
              h('section', { className: 'gh2-wb-listbox' },
                h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Entradas'), h('span', { className: 'gh2-m5-meta' }, wb.entries.length + ' entradas')),
                h('ul', { className: 'gh2-wb-list', 'data-gh': 'wb-entries' }, wb.entries.map((item, index) => h('li', { key: item.slot + ':' + index },
                  h('button', {
                    type: 'button',
                    className: 'gh2-wb-entry' + (index === wb.openIndex ? ' is-open' : ''),
                    'data-gh': 'wb-entry',
                    'data-index': String(index),
                    onClick: () => setWb({ openIndex: index, pendingUnknown: false }),
                  },
                    h('span', { className: 'gh2-wb-entrytitle' }, item.comment || '\uff08no hay \u6807\u9898\uff09'),
                    h('span', { className: 'gh2-m5-meta' }, 'UID ' + uidText(item.uid) + ' · ' + parseKeys(item.keysText).length + ' key')))))),
              entry ? h('section', { className: 'gh2-wb-editor', 'data-gh': 'wb-editor' },
                h('label', { className: 'gh2-m5-field' }, h('span', null, 'Título / comment'),
                  h('input', {
                    type: 'text',
                    className: 'gh2-finput',
                    'data-gh': 'wb-title',
                    value: entry.comment,
                    onChange: (e) => updateWbEntry(wb.openIndex, { comment: e.target.value }),
                  })),
                h('label', { className: 'gh2-m5-field' }, h('span', null, 'Palabra clave principal / key (separadas por comas)'),
                  h('input', {
                    type: 'text',
                    className: 'gh2-finput',
                    'data-gh': 'wb-keys',
                    value: entry.keysText,
                    onChange: (e) => updateWbEntry(wb.openIndex, { keysText: e.target.value }),
                  })),
                h('label', { className: 'gh2-m5-field' }, h('span', null, 'Contenido / content'),
                  h('textarea', {
                    className: 'gh2-m5-ftextarea',
                    'data-gh': 'wb-body',
                    rows: 10,
                    spellCheck: false,
                    value: entry.content,
                    onChange: (e) => updateWbEntry(wb.openIndex, { content: e.target.value }),
                  })),
                h('p', { className: 'gh2-m5-meta' }, 'UID ' + uidText(entry.uid) + ' · ranura ' + entry.slot + ' · guardar reescribe comment/content/key/keysecondary; se conservan los campos desconocidos.'))
              : h('section', { className: 'gh2-wb-editor' }, h('p', { className: 'gh2-m5-note' }, wb.kind === 'unknown' ? 'Estructura\u672a\u8bc6\u522b\uff0cno hay \u53ef\u7f16\u8f91Entradas\uff1b\u53ef\u4ee5\u67e5\u770b\u4e0b\u9762\u7684\u539f\u59cb JSON\u3002' : '\u8fd9\u4e2a\u6587\u4ef6no hay Entradas\u3002'))) : null,
            h('details', { className: 'gh2-m5-raw', 'data-gh': 'wb-raw' },
              h('summary', null, 'JSON original (solo lectura)'),
              h('pre', { className: 'gh2-m5-pre' }, rawText)),
            h('section', { className: 'gh2-wb-versions', 'data-gh': 'wb-versions' },
              h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Copias de versión'), h('span', { className: 'gh2-m5-meta' }, 'Guardar\u5728 .godhand/versions'),
                h('span', { className: 'gh2-spacer' }),
                h(TextButton, {
                  onClick: () => refreshWbVersions(wb.selectedPath),
                  disabled: wb.versionsState === 'loading',
                  'data-gh': 'wb-versions-refresh',
                }, wb.versionsState === 'loading' ? 'Actualizando…' : 'Actualizar versiones')),
              errorLine(wb.versionsError, 'wb-versions-error'),
              wb.versions.length ? h('ul', { className: 'gh2-m5-list' }, wb.versions.map((version) => h('li', {
                key: version.path, className: 'gh2-m5-version', title: version.path, 'data-gh': 'wb-version',
              },
                h('span', null, formatMtime(version.mtime)),
                h('span', { className: 'gh2-mono' }, version.name || basename(version.path)),
                h('span', { className: 'gh2-m5-meta' }, formatSize(version.size)))))
                : h('p', { className: 'gh2-m5-meta' }, wb.versionsAt ? '\u8fd8no hay \u5907\u4efd\u3002' : 'Aún no se ha leído la lista de versiones.'))
          ) : h('p', { className: 'gh2-m5-note' }, '\u5148\u9009\u76ee\u5f55\uff0c\u518d\u70b9\u4e00 archivos .json \u6587\u4ef6\u8bfb\u53d6\u3002'));
      }

      function metaText(value) {
        if (value === undefined || value === null || value === '') return '(vacío)';
        if (typeof value === 'boolean') return value ? 'true' : 'false';
        if (typeof value === 'object') {
          try { return JSON.stringify(value); } catch { return String(value); }
        }
        return String(value);
      }

      function mvuDefaultText(value) {
        if (value === undefined || value === null) return '';
        if (typeof value === 'string') return JSON.stringify(value);
        if (typeof value === 'number' || typeof value === 'boolean') return String(value);
        try {
          const text = JSON.stringify(value);
          return text.length > 80 ? text.slice(0, 80) + '…' : text;
        } catch {
          return String(value);
        }
      }

      /** \u4e00\u4e2a MVU MVU\uff1akey\u3001type\u3001default\uff1brecord \u7684\u5b50\u5b57\u6bb5 key \u7edf\u4e00\u663e\u793a\u6210 *\u3002 */
      function MvuNode({ node, depth, star }) {
        const rawKey = node && node.key !== undefined && node.key !== null ? String(node.key) : '(sin nombre)';
        const key = star ? '*' : rawKey;
        const type = node && typeof node.type === 'string' && node.type ? node.type : 'unknown';
        const children = node && Array.isArray(node.children) ? node.children : [];
        const isRecord = /(^|\.)record$/u.test(type);
        const def = mvuDefaultText(node && node.default);
        const head = [
          h('span', { key: 'k', className: 'gh2-mvu-key' + (key === '*' ? ' is-star' : '') }, key),
          h('span', { key: 't', className: 'gh2-mvu-type' }, type),
          def ? h('span', { key: 'd', className: 'gh2-mvu-default' }, 'Predeterminado: ' + def) : null,
        ];
        if (!children.length) return h('div', { className: 'gh2-mvu-leaf' }, head);
        return h('details', { className: 'gh2-mvu-node', open: depth === 0 ? true : undefined },
          h('summary', null, head),
          children.map((child, index) => h(MvuNode, {
            key: index + ':' + (child && child.key !== undefined ? String(child.key) : ''),
            node: child,
            depth: (depth || 0) + 1,
            star: isRecord,
          })));
      }

      function MvuSection({ s }) {
        const m = s.mvu;
        const wbRoot = s.wb.root;
        const files = (Array.isArray(s.wb.files) ? s.wb.files : []).filter((file) => /\.json$/iu.test(file.name || file.path));
        const schema = m.schema;
        const roots = schema ? schema.roots : [];
        return h('section', { className: 'gh2-mvu', 'data-gh': 'mvu-section' },
          h('div', { className: 'gh2-m5-rowhead' },
            h('b', null, 'Componentes MVU'),
            h('span', { className: 'gh2-m5-chip' }, 'Directorio de componentes igual que el de la worldbook')),
          h('p', { className: 'gh2-m5-warn gh2-mvu-note', 'data-gh': 'mvu-note' }, 'Análisis estático de Zod; sin validación en tiempo de ejecución; no se muestra PASS/FAIL.'),
          h('p', { className: 'gh2-m5-note' }, 'Solo lectura\uff1a\u5bbf\u4e3b\u53ea\u505a\u5b57\u7b26\u4e32\u626b\u63cf\uff0c\u4e0d\u6267\u884c\u88ab\u68c0\u67e5\u7684\u811a\u672c\uff0c\u4e5f\u4e0d\u8fd0\u884c Zod\u3002'),
          h('p', { className: 'gh2-m5-meta', 'data-gh': 'mvu-shared-root' },
            wbRoot ? h(Fragment, null, 'Directorio de componentes igual que el de la worldbook\uff1a', h('span', { className: 'gh2-mono', 'data-gh': 'mvu-root' }, wbRoot))
              : 'Abre primero el directorio en la página de worldbook.'),
          errorLine(m.folderError, 'mvu-folder-error'),
          !wbRoot ? h('p', { className: 'gh2-m5-warn', 'data-gh': 'mvu-shared-empty' }, 'Abre primero el directorio en la página de worldbook; aquí no se elige por separado.')
            : s.wb.filesState === 'loading' ? h('p', { className: 'gh2-m5-meta', 'data-gh': 'mvu-loading-files' }, 'Leyendo el directorio de la worldbook…')
              : files.length ? h('div', { className: 'gh2-wb-files', 'data-gh': 'mvu-files' }, files.map((file) => h('button', {
                key: file.path,
                type: 'button',
                title: file.path,
                className: 'gh2-wb-file' + (file.path === m.selectedPath ? ' is-active' : ''),
                'data-gh': 'mvu-file',
                'data-path': file.path,
                onClick: () => inspectMvuFile(file.path),
              },
                h('span', { className: 'gh2-wb-fname' }, file.name || basename(file.path)),
                h('span', { className: 'gh2-m5-meta' }, formatSize(file.size)))))
                : h('p', { className: 'gh2-m5-warn', 'data-gh': 'mvu-empty-files' }, 'No hay componentes .json en el directorio de la worldbook.'),
          m.selectedPath ? h(Fragment, null,
            m.loadingFile ? h('p', { className: 'gh2-m5-meta', 'data-gh': 'mvu-loading' }, 'Analizando estáticamente…') : null,
            errorLine(m.error, 'mvu-error'),
            m.file ? h('div', { className: 'gh2-mvu-meta', 'data-gh': 'mvu-file-meta' },
              h('span', null, h('b', null, 'Archivo: '), m.file.name || basename(m.file.path), ' · ',
                h('span', { className: 'gh2-mono', 'data-gh': 'mvu-file-path' }, m.file.path), ' · ', formatSize(m.file.size))) : null,
            m.meta ? h('div', { className: 'gh2-mvu-meta', 'data-gh': 'mvu-meta' },
              h('span', null, h('b', null, 'type\uff1a'), metaText(m.meta.type)),
              h('span', null, h('b', null, 'enabled\uff1a'), metaText(m.meta.enabled)),
              h('span', { 'data-gh': 'mvu-meta-name' }, h('b', null, 'name\uff1a'), metaText(m.meta.name)),
              h('span', { 'data-gh': 'mvu-meta-id' }, h('b', null, 'id\uff1a'), metaText(m.meta.id)),
              h('span', { 'data-gh': 'mvu-meta-content' }, h('b', null, 'Longitud de content: '), metaText(m.meta.contentLength))) : null,
            m.warnings.length ? h('ul', { className: 'gh2-mvu-warnings', 'data-gh': 'mvu-warnings' },
              m.warnings.map((warning, index) => h('li', { key: index }, warning))) : null,
            schema ? h(Fragment, null,
              h('div', { className: 'gh2-mvu-meta', 'data-gh': 'mvu-schema-meta' },
                h('span', null, h('b', null, 'parser\uff1a'), schema.parser || '(el host no lo devolvió)'),
                h('span', null, h('b', null, 'Nodos: '), String(schema.nodeCount)),
                h('span', null, h('b', null, 'Campos raíz: '), String(roots.length))),
              roots.length ? h('div', { className: 'gh2-mvu-tree', 'data-gh': 'mvu-tree' },
                roots.map((node, index) => h(MvuNode, {
                  key: index + ':' + (node && node.key !== undefined ? String(node.key) : ''),
                  node,
                  depth: 0,
                })))
                : h('p', { className: 'gh2-m5-warn', 'data-gh': 'mvu-empty-roots' }, 'El host devolvió un esquema pero sin campos raíz.'))
              : (m.loadingFile ? null : (m.error ? null : h('p', { className: 'gh2-m5-warn', 'data-gh': 'mvu-reason' },
                m.reason === 'no-zod-object' ? 'no hay \u627e\u5230 const Schema / z.object\uff08reason\uff1ano-zod-object\uff09\u3002'
                  : m.reason ? 'El host no devolvió un esquema (reason: ' + m.reason + '\uff09\u3002'
                    : 'El host no devolvió un esquema ni un motivo.'))))
            : h('p', { className: 'gh2-m5-note' }, wbRoot ? 'Haz clic en un script .json del directorio de la worldbook para analizarlo.' : '\u5148\u5728\u4e16\u754c\u4e66\u9875\u6253Activado\u76ee\u5f55\uff0c\u518d\u70b9\u4e00 archivos .json \u811a\u672c\u3002'));
      }

      function CardMvuSection({ s }) {
        const detail = s.ws.cardDetail;
        const mvu = detail && detail.mvu;
        const schema = mvu && mvu.schema;
        if (!schema) return null;
        const script = mvu.script || {};
        const roots = Array.isArray(schema.roots) ? schema.roots : [];
        const scriptName = script.name || script.id || 'Script sin nombre';
        return h('section', {
          className: 'gh2-mvu gh2-card-mvu', 'data-gh': 'card-mvu-section',
          tabIndex: -1, 'aria-label': 'MVU de la tarjeta',
        },
          h('div', { className: 'gh2-m5-rowhead' },
            h('b', { 'data-gh': 'card-mvu-title' }, 'MVU de la tarjeta · ' + scriptName),
            h('span', { className: 'gh2-m5-chip' }, '\u6765\u81eaActual\u5361'),
            h('span', { className: 'gh2-m5-chip' }, 'Análisis estático de Zod')),
          h('p', { className: 'gh2-m5-warn gh2-mvu-note', 'data-gh': 'card-mvu-note' },
            '\u6765\u81eaActual\u5361\uff1b\u9759\u6001\u89e3\u6790 Zod\uff1b\u672a\u6267\u884c\u8fd0\u884c\u65f6\u6821\u9a8c\uff1b\u4e0d\u663e\u793a PASS/FAIL'),
          h('p', { className: 'gh2-m5-note' }, 'Solo lectura\uff1a\u5bbf\u4e3b\u53ea\u626b\u63cf\u811a\u672c\u5b57\u7b26\u4e32\uff0c\u4e0d\u6267\u884c\u5361\u5185 JS\uff0c\u4e5f\u4e0d\u8fd0\u884c Zod\u3002'),
          h('div', { className: 'gh2-mvu-meta', 'data-gh': 'card-mvu-meta' },
            h('span', null, h('b', null, 'Script: '), scriptName),
            h('span', null, h('b', null, 'type\uff1a'), script.type || 'script'),
            h('span', null, h('b', null, 'enabled\uff1a'), script.enabled ? 'true' : 'false'),
            h('span', null, h('b', null, 'Longitud de content: '), String(script.contentLength || 0)),
            h('span', null, h('b', null, 'parser\uff1a'), schema.parser || 'static-zod-object'),
            h('span', null, h('b', null, 'Nodos: '), String(schema.nodeCount || 0)),
            h('span', null, h('b', null, 'Campos raíz: '), String(roots.length))),
          mvu.warnings.length ? h('ul', { className: 'gh2-mvu-warnings', 'data-gh': 'card-mvu-warnings' },
            mvu.warnings.map((warning, index) => h('li', { key: index }, warning))) : null,
          roots.length ? h('div', { className: 'gh2-mvu-tree', 'data-gh': 'card-mvu-tree' },
            roots.map((node, index) => h(MvuNode, {
              key: index + ':' + (node && node.key !== undefined ? String(node.key) : ''),
              node,
              depth: 0,
            })))
            : h('p', { className: 'gh2-m5-warn', 'data-gh': 'card-mvu-empty-roots' }, '\u5bbf\u4e3b\u8fd4\u56de\u4e86\u5361\u5185 schema\uff0c\u4f46no hay \u6839\u5b57\u6bb5\u3002'));
      }

      function WorldbookJsonSection({ wb }) {
        if (!wb.selectedPath || wb.raw === null || wb.raw === undefined) {
          return h('section', { className: 'gh2-wb-json', 'data-gh': 'wb-json-section' },
            h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Actual\u4e16\u754c\u4e66 JSON'), h('span', { className: 'gh2-m5-meta' }, 'Solo lectura')),
            h('p', { className: 'gh2-m5-warn', 'data-gh': 'var-empty' }, '\u8fd8no hay \u6253Activado\u4e16\u754c\u4e66\u6587\u4ef6\u3002\u5148\u53bb\u4e16\u754c\u4e66\u9875\u9009\u62e9\u4e00 archivos .json\u3002'),
            h(TextButton, { onClick: () => setUi({ mode: 'full', tab: 'worldbook' }) }, 'Ir a elegir un archivo de worldbook'));
        }
        const kind = wb.kind === 'st-object' ? 'st-object' : wb.kind === 'st-array' ? 'st-array' : 'Estructura\u672a\u8bc6\u522b';
        return h('section', { className: 'gh2-wb-json', 'data-gh': 'wb-json-section' },
          h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Actual\u4e16\u754c\u4e66 JSON'), h('span', { className: 'gh2-m5-meta' }, 'Solo lectura')),
          h('p', { className: 'gh2-m5-warn', 'data-gh': 'var-note' }, '\u771f\u5b9e\u6587\u4ef6Estructura\uff1bMVU Estructura\u6821\u9a8c\u8fd8\u6ca1\u63a5\u5165\u3002\u8fd9\u91cc\u53ea\u663e\u793a JSON nodos\uff0c\u4e0d\u505a PASS / FAIL \u5224\u65ad\u3002'),
          h('p', { className: 'gh2-m5-meta' },
            'Archivo: ', h('span', { className: 'gh2-mono', 'data-gh': 'var-path' }, wb.selectedPath),
            ' · ', kind, ' · ', String(wb.entries.length), 'Entradas'),
          wb.dirty ? h('p', { className: 'gh2-m5-note', 'data-gh': 'var-dirty-note' }, 'La worldbook tiene cambios sin guardar: aquí se muestra el JSON real leído (o guardado) la última vez, no el borrador del editor.') : null,
          h('div', { className: 'gh2-json-tree', 'data-gh': 'var-tree' },
            h(JsonValue, { name: basename(wb.selectedPath), value: wb.raw, depth: 0, budget: { left: 2000 } })),
          h('p', { className: 'gh2-m5-note' }, 'Solo lectura\uff1a\u8282\u70b9\u76f4\u63a5\u6765\u81ea\u6587\u4ef6\uff1bno hay \u8fd0\u884c MVU / Zod \u6821\u9a8c\uff0c\u6240\u4ee5\u4e0d\u663e\u793aCorrecto\u6216error\u3002'));
      }

      function legacyInitialDisplay(value, wildcard) {
        if (wildcard || value === undefined) return { text: '—', json: false };
        if (value === null) return { text: 'null', json: false };
        if (typeof value === 'string') return { text: value === '' ? '(cadena vacía)' : value, json: false };
        if (typeof value === 'number' || typeof value === 'boolean') return { text: String(value), json: false };
        return { text: JSON.stringify(value, null, 2), json: true };
      }
      function lookupLegacyInitial(statData, path) {
        if (!statData || typeof statData !== 'object') return undefined;
        let current = statData;
        for (const part of String(path).split('.')) {
          if (Array.isArray(current)) {
            const index = Number(part);
            if (!Number.isInteger(index) || index < 0 || index >= current.length) return undefined;
            current = current[index];
            continue;
          }
          if (!current || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, part)) return undefined;
          current = current[part];
        }
        return current;
      }
      /** \u628a Schema roots \u6241\u5e73\u6210\u8282\u70b9\u5217\u8868\uff1bValor inicial\u4fdd\u7559 JSON\uff0crecord \u7684 * \u624d\u4e0d\u786c\u731c\u3002 */
      function flattenLegacyNodes(roots, statData) {
        const out = [];
        const visit = (node, parentPath, depth, parentType, ancestorWildcard) => {
          const raw = node && typeof node === 'object' ? node : {};
          const key = raw.key !== undefined && raw.key !== null ? String(raw.key) : '(sin nombre)';
          const declaredType = typeof raw.type === 'string' && raw.type ? raw.type : 'unknown';
          const children = Array.isArray(raw.children) ? raw.children : [];
          const type = /^ref:/u.test(declaredType) && children.length ? 'object' : declaredType;
          const path = parentPath ? parentPath + '.' + key : key;
          const isWildcard = ancestorWildcard || key === '*' || /(^|\.)record$/u.test(parentType);
          const initial = legacyInitialDisplay(lookupLegacyInitial(statData, path), isWildcard);
          const defaultText = raw.default === undefined || raw.default === null ? '—' : mvuDefaultText(raw.default);
          out.push({
            path, key, type, defaultText,
            initialText: initial.text, initialJson: initial.json,
            depth, childCount: children.length, hasChildren: children.length > 0, parentPath,
          });
          for (const child of children) visit(child, path, depth + 1, type, isWildcard);
        };
        for (const root of Array.isArray(roots) ? roots : []) visit(root, '', 0, '', false);
        return out;
      }
      function workbenchActualType(value) {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
      }
      function workbenchSchemaType(type) {
        const raw = String(type || '');
        if (!raw || raw === 'any' || raw === 'unknown' || raw.startsWith('ref:')) return '';
        if (raw === 'integer') return 'number';
        if (raw === 'record') return 'object';
        return raw;
      }
      function collectInitialPaths(value, prefix, out) {
        if (prefix) out.push(prefix);
        if (Array.isArray(value)) {
          value.forEach((item, index) => collectInitialPaths(item, prefix ? prefix + '.' + index : String(index), out));
        } else if (value && typeof value === 'object') {
          Object.keys(value).sort().forEach((key) => collectInitialPaths(value[key], prefix ? prefix + '.' + key : key, out));
        }
      }
      function compareSchemaInitial(schemaNodes, initial) {
        const missing = [];
        const extra = [];
        const typeMismatch = [];
        const schemaByPath = new Map(schemaNodes.map((node) => [node.path, node]));
        const allowedPrefixes = schemaNodes
          .filter((node) => node.type === 'record' || node.type === 'array' || node.path.includes('*'))
          .map((node) => node.path);
        const missingPrefixes = [];
        for (const node of schemaNodes) {
          if (!node.path || node.path.includes('*')) continue;
          const schemaType = workbenchSchemaType(node.type);
          if (!schemaType) continue;
          if (missingPrefixes.some((prefix) => node.path === prefix || node.path.startsWith(prefix + '.'))) continue;
          const actual = lookupLegacyInitial(initial, node.path);
          if (actual === undefined) {
            missing.push({ path: node.path, schemaType });
            if (node.hasChildren || schemaType === 'array' || schemaType === 'object') missingPrefixes.push(node.path);
            continue;
          }
          const initialType = workbenchActualType(actual);
          if (initialType !== schemaType) typeMismatch.push({ path: node.path, schemaType, initialType });
        }
        const initialPaths = [];
        collectInitialPaths(initial, '', initialPaths);
        for (const path of initialPaths) {
          if (schemaByPath.has(path)) continue;
          if (allowedPrefixes.some((prefix) => path.startsWith(prefix + '.'))) continue;
          extra.push({ path });
        }
        return { missing, extra, typeMismatch, initialPaths };
      }
      function workbenchPath(path) {
        return String(path || '').replace(/^\//u, '').replace(/\//gu, '.');
      }
      function compareContractSchema(contract, schemaNodes, initialPaths) {
        const schemaByPath = new Map(schemaNodes.map((node) => [node.path, node]));
        const allowedPrefixes = schemaNodes
          .filter((node) => node.type === 'record' || node.type === 'array' || node.path.includes('*'))
          .map((node) => node.path);
        const initialSet = new Set(initialPaths);
        const ruleUnknown = [];
        const ruleTypeMismatch = [];
        const fields = contract && Array.isArray(contract.fields) ? contract.fields : [];
        for (const field of fields) {
          const path = workbenchPath(field && field.path);
          if (!path || path.includes('*') || initialSet.has(path)) continue;
          const node = schemaByPath.get(path);
          if (!node) {
            if (!allowedPrefixes.some((prefix) => path.startsWith(prefix + '.'))) {
              ruleUnknown.push({ path, type: workspaceString(field.type), label: workspaceString(field.label) });
            }
            continue;
          }
          const schemaType = workbenchSchemaType(node.type);
          const fieldType = workbenchSchemaType(field.type);
          if (schemaType && fieldType && fieldType !== 'any' && schemaType !== fieldType) {
            ruleTypeMismatch.push({ path, schemaType, ruleType: fieldType });
          }
        }
        return {
          ruleUnknown,
          ruleTypeMismatch,
          ruleChecks: contract && Array.isArray(contract.ruleChecks) ? contract.ruleChecks.map((check) => ({
            path: workbenchPath(check.path),
            label: workspaceString(check.label),
            detail: workspaceString(check.detail),
          })) : [],
        };
      }

      function LegacyNodesPane() {
        const s = useStoreState();
        const detail = s.ws.cardDetail;
        const cardMvu = detail && detail.mvu;
        const manualSchema = s.mvu && s.mvu.schema;
        const cardSchema = cardMvu && cardMvu.schema;
        const schema = cardSchema || manualSchema || null;
        const scriptName = cardMvu && cardMvu.script ? (cardMvu.script.name || cardMvu.script.id) : '';
        const sourceLabel = cardSchema ? 'MVU de la tarjeta · ' + (scriptName || 'Script sin nombre')
          : manualSchema ? '\u7ec4\u4ef6\u76ee\u5f55 · ' + (s.mvu.file && (s.mvu.file.name || basename(s.mvu.file.path)) || basename(s.mvu.selectedPath) || 'Componentes MVU')
            : '';
        const sourceKey = cardSchema
          ? 'card:' + ((s.ws.activeCard && s.ws.activeCard.file && s.ws.activeCard.file.path) || '') + ':' + sourceLabel
          : manualSchema ? 'manual:' + (s.mvu.selectedPath || sourceLabel) : 'none';
        const statData = detail && detail.legacyVars ? detail.legacyVars.statData : null;
        const initVarSourceText = cardMvu && cardMvu.initVarSource ? cardMvu.initVarSource : '';
        const initialSourceLabel = initVarSourceText
          ? '\u771f\u5b9e\u53d8\u91cf\u4e66 · ' + (cardMvu.initVarName || '\u521d\u59cb\u53d8\u91cf')
          : statData ? 'tavern_helper.legacyVars.stat_data' : '\u7a7a\u5bf9\u8c61';
        const [hostInitial, setHostInitial] = useState(null);
        const initialData = initVarSourceText ? hostInitial : statData;
        const nodes = useMemo(() => schema ? flattenLegacyNodes(schema.roots, initialData) : [], [schema, initialData]);
        const [search, setSearch] = useState('');
        const [selectedPath, setSelectedPath] = useState('');
        const [collapsed, setCollapsed] = useState(() => new Set());
        const focus = s.ws.legacyFocus;
        useEffect(() => {
          setSearch('');
          setCollapsed(new Set());
          setSelectedPath(nodes.length ? nodes[0].path : '');
        }, [sourceKey, nodes.length]);
        useEffect(() => {
          if (!focus) return;
          setSearch('');
          setCollapsed(new Set());
          const first = nodes[0];
          if (first) setSelectedPath(first.path);
          const timer = setTimeout(() => {
            const row = [...document.querySelectorAll('[data-gh="var-node-row"]')].find((el) => el.dataset.path === (first && first.path));
            if (!row) return;
            row.scrollIntoView({ block: 'center', behavior: 'smooth' });
            row.focus({ preventScroll: true });
            row.classList.add('is-focus');
            setTimeout(() => row.classList.remove('is-focus'), 1500);
          }, 80);
          return () => clearTimeout(timer);
        }, [focus, sourceKey]);
        useEffect(() => {
          setHostInitial(null);
          if (!initVarSourceText || !cardMvu || !cardMvu.schemaSource) return undefined;
          let cancelled = false;
          (async () => {
            try {
              const payload = await postJson(M5.api.mvuSimulate, {
                initialLegacys: initVarSourceText,
                operations: [],
                updateRules: '',
                schema: cardMvu.schemaSource,
                dialect: 'rfc6902',
              });
              const result = payload.result || payload;
              if (!cancelled && result && result.before && typeof result.before === 'object' && !Array.isArray(result.before)) {
                setHostInitial(result.before);
              }
            } catch {}
          })();
          return () => { cancelled = true; };
        }, [sourceKey, initVarSourceText]);
        const [compareBusy, setCompareBusy] = useState(false);
        const [compareError, setCompareError] = useState('');
        const [compareResult, setCompareResult] = useState(null);
        const [compareCollapsed, setCompareCollapsed] = useState(() => new Set());
        const [runBusy, setRunBusy] = useState(false);
        const [runError, setRunError] = useState('');
        const [runResult, setRunResult] = useState(null);
        const [writeConfirm, setWriteConfirm] = useState(false);
        const [writing, setWriting] = useState(false);
        const [writeError, setWriteError] = useState('');
        const [writeResult, setWriteResult] = useState(null);
        const writeResultSourceRef = useRef('');
        const initialJson = statData ? JSON.stringify(statData, null, 2) : '{}';
        const initialDefault = initVarSourceText || initialJson;
        const defaultRuleEntries = cardMvu && Array.isArray(cardMvu.updateRuleEntries) && cardMvu.updateRuleEntries.length
          ? cardMvu.updateRuleEntries.map((entry) => ({ ...entry }))
          : (cardMvu && cardMvu.updateRules ? [{ id: 'rule-1', name: 'Reglas de actualización', content: cardMvu.updateRules }] : []);
        const makeWork = (notice = '') => ({
          sourceKey,
          schemaSource: cardMvu && cardMvu.schemaSource ? cardMvu.schemaSource : '',
          initialText: initialDefault,
          initialSource: initialSourceLabel,
          ruleEntries: defaultRuleEntries.map((entry) => ({ ...entry })),
          beforeText: initialDefault,
          operationsText: '[]',
          dialect: 'rfc6902',
          resetNotice: notice,
        });
        const work = s.ws.varWork && s.ws.varWork.sourceKey === sourceKey ? s.ws.varWork : makeWork('');
        const workRuleEntries = Array.isArray(work.ruleEntries) ? work.ruleEntries : defaultRuleEntries;
        const mergedRules = workRuleEntries.map((entry) => entry.content || '').join('\n\n');
        useEffect(() => {
          const current = store.get().ws.varWork;
          if (!current || current.sourceKey !== sourceKey) {
            setWs({ varWork: makeWork(current ? 'Actual\u5361/\u6765\u6e90\u5df2\u5207\u6362\uff0cCopia de trabajo\u5df2\u91cd\u7f6e\u3002' : (sourceLabel ? 'Copia de trabajo\u5df2\u4eceActual\u5361\u8f7d\u5165\u3002' : '')) });
          }
          setCompareResult(null);
          setCompareError('');
          setCompareBusy(false);
          setCompareCollapsed(new Set());
          setRunResult(null);
          setRunError('');
          setRunBusy(false);
          setWriteConfirm(false);
          setWriteError('');
          if (writeResultSourceRef.current !== sourceKey) setWriteResult(null);
          setWriting(false);
        }, [sourceKey]);
        const updateWork = (patch) => {
          const current = store.get().ws.varWork;
          const base = current && current.sourceKey === sourceKey ? current : makeWork('');
          setWs({ varWork: { ...base, ...patch, sourceKey } });
        };
        const updateRuleEntry = (index, content) => {
          const next = workRuleEntries.map((entry, item) => item === index ? { ...entry, content } : entry);
          updateWork({ ruleEntries: next });
        };
        const reloadWork = () => {
          setWs({ varWork: makeWork('\u5df2Volver a cargar desde la tarjeta actualCopia de trabajo\u3002') });
          setCompareResult(null);
          setCompareError('');
          setCompareCollapsed(new Set());
          setRunResult(null);
          setRunError('');
          setWriteConfirm(false);
          setWriteError('');
          writeResultSourceRef.current = '';
          setWriteResult(null);
        };
        const workTab = ['structure', 'compare', 'run'].includes(s.ws.legacyTab) ? s.ws.legacyTab : 'structure';
        const setWorkTab = (next) => setWs({ legacyTab: next });
        async function runCompare() {
          setCompareBusy(true);
          setCompareError('');
          setCompareResult(null);
          setCompareCollapsed(new Set());
          try {
            let schema = null;
            let schemaError = '';
            try {
              const parsed = await postJson(M5.api.mvuParse, { content: work.schemaSource });
              schema = normalizeMvuSchema(parsed.schema);
              if (!schema) schemaError = workspaceString(parsed.reason) || 'no-schema';
            } catch (error) {
              schemaError = errorText(error);
            }
            let initial = null;
            let initialError = '';
            try {
              const seedPayload = await postJson(M5.api.mvuSimulate, {
                initialLegacys: work.initialText,
                operations: [],
                updateRules: '',
                schema: work.schemaSource,
                dialect: 'rfc6902',
              });
              const seed = seedPayload.result || seedPayload;
              if (seed && seed.before && typeof seed.before === 'object' && !Array.isArray(seed.before)) {
                initial = seed.before;
              } else {
                initialError = '\u5bbf\u4e3bno hay \u8fd4\u56de\u53efComparación\u7684\u521d\u59cb\u53d8\u91cf\u5bf9\u8c61\u3002';
              }
            } catch (error) {
              initialError = errorText(error);
            }
            let simulation = null;
            let simulateError = '';
            try {
              const payload = await postJson(M5.api.mvuSimulate, {
                initialLegacys: work.initialText,
                operations: [],
                updateRules: mergedRules,
                schema: work.schemaSource,
                dialect: 'rfc6902',
              });
              simulation = payload.result || payload;
            } catch (error) {
              simulateError = errorText(error);
            }
            const schemaNodes = schema ? flattenLegacyNodes(schema.roots, null) : [];
            const initialCompare = initial ? compareSchemaInitial(schemaNodes, initial) : { missing: [], extra: [], typeMismatch: [], initialPaths: [] };
            const ruleCompare = compareContractSchema(simulation && simulation.contract, schemaNodes, initialCompare.initialPaths);
            setCompareResult({
              schemaError,
              initialError,
              simulateError,
              schemaParsed: !!schema,
              schemaReason: schema ? '' : schemaError,
              schemaNodes,
              schemaNodeCount: schemaNodes.length,
              schemaFieldCount: schemaNodes.filter((node) => node.type !== 'object' && !node.path.includes('*') && !/^ref:/u.test(node.type)).length,
              fieldCount: simulation && simulation.contract && Array.isArray(simulation.contract.fields) ? simulation.contract.fields.length : 0,
              ruleEntryCount: workRuleEntries.length,
              initialSource: work.initialSource || initialSourceLabel,
              missing: initialCompare.missing,
              extra: initialCompare.extra,
              typeMismatch: initialCompare.typeMismatch,
              ruleUnknown: ruleCompare.ruleUnknown,
              ruleTypeMismatch: ruleCompare.ruleTypeMismatch,
              ruleChecks: ruleCompare.ruleChecks,
            });
          } catch (error) {
            setCompareError(errorText(error));
          } finally {
            setCompareBusy(false);
          }
        }
        async function runSimulation() {
          setRunBusy(true);
          setRunError('');
          setRunResult(null);
          try {
            const payload = await postJson(M5.api.mvuSimulate, {
              initialLegacys: work.beforeText,
              operations: work.operationsText,
              updateRules: mergedRules,
              schema: work.schemaSource,
              dialect: work.dialect || 'rfc6902',
            });
            const result = payload.result || payload;
            const operations = result && result.operation;
            const operationCount = Array.isArray(operations) ? operations.length
              : operations && Array.isArray(operations.operations) ? operations.operations.length : 0;
            setRunResult({
              result,
              checks: result && Array.isArray(result.checks) ? result.checks : [],
              diff: result && Array.isArray(result.diff) ? result.diff : [],
              after: result ? result.after : null,
              trace: result && result.trace ? result.trace : result,
              operationCount,
              fieldCount: result && result.contract && Array.isArray(result.contract.fields) ? result.contract.fields.length : 0,
              zodExecuted: !!(result && ((result.trace && result.trace.schema && result.trace.schema.zodExecuted)
                || (result.schema && result.schema.zodExecuted))),
            });
          } catch (error) {
            setRunError(errorText(error));
          } finally {
            setRunBusy(false);
          }
        }
        async function writeCardBack() {
          setWriting(true);
          setWriteError('');
          setWriteResult(null);
          try {
            const wsNow = store.get().ws;
            const card = wsNow.activeCard && wsNow.activeCard.file;
            if (!card || !card.path) throw new Error('no hay \u9009\u4e2d\u7684\u5361\uff0cNo\u6cd5\u5199\u56de');
            const project = activeProject();
            const root = (project && project.root) || wsNow.root || '';
            const body = { path: card.path };
            if (work.schemaSource) body.schemaContent = work.schemaSource;
            if (workRuleEntries.length) {
              body.updateRules = workRuleEntries.map((entry) => ({
                id: entry.id, name: entry.name, content: entry.content,
              }));
            }
            const initKind = cardMvu && cardMvu.initVar ? cardMvu.initVar.kind : '';
            if (initKind === 'worldbook' || (!initKind && cardMvu && cardMvu.initVarSource)) {
              body.initVarContent = work.initialText;
            } else if (initKind === 'tavern-helper' || (!initKind && statData)) {
              try {
                body.legacyVars = JSON.parse(work.initialText);
              } catch (error) {
                throw new Error('\u521d\u59cb\u53d8\u91cfsí tavern_helper.legacyVars\uff0c\u9700\u8981 JSON \u5bf9\u8c61\uff1a' + error.message);
              }
            }
            const data = await postJson(M5.api.cardWrite, body);
            if (data && data.ok === false) throw new Error(data.error || data.message || '\u5199\u56deerror');
            setWriteResult(data);
            writeResultSourceRef.current = sourceKey;
            setWriteConfirm(false);
            setWs({ cardDetail: null });
            const inspected = await inspectCardDetail(root, card.path, { silent: true });
            setWriteResult(data);
            if (!inspected.ok) setWriteError('\u5199\u56de\u6210\u529f\uff0c\u4f46\u91cd\u65b0 inspect error\uff1a' + inspected.error);
          } catch (error) {
            setWriteError(errorText(error));
          } finally {
            setWriting(false);
          }
        }
        const query = search.trim().toLowerCase();
        const nodeByPath = useMemo(() => new Map(nodes.map((node) => [node.path, node])), [nodes]);
        const matchingPaths = new Set();
        if (query) {
          for (const node of nodes) {
            if (![node.path, node.key, node.type].some((value) => String(value).toLowerCase().includes(query))) continue;
            let parent = node.path;
            while (parent) {
              matchingPaths.add(parent);
              const parentNode = nodeByPath.get(parent);
              parent = parentNode ? parentNode.parentPath : '';
            }
          }
        }
        const isVisible = (node) => {
          let parent = node.parentPath;
          while (parent) {
            if (collapsed.has(parent)) return false;
            const parentNode = nodeByPath.get(parent);
            parent = parentNode ? parentNode.parentPath : '';
          }
          return true;
        };
        const visible = query ? nodes.filter((node) => matchingPaths.has(node.path)) : nodes.filter(isVisible);
        const selected = nodes.find((node) => node.path === selectedPath) || null;
        const toggle = (path) => {
          setCollapsed((current) => {
            const next = new Set(current);
            if (next.has(path)) next.delete(path); else next.add(path);
            return next;
          });
        };
        const parents = nodes.filter((node) => node.hasChildren);
        const allCollapsed = parents.length > 0 && parents.every((node) => collapsed.has(node.path));
        const toggleAll = () => {
          if (allCollapsed) setCollapsed(new Set());
          else setCollapsed(new Set(parents.map((node) => node.path)));
        };
        const treeRows = visible.map((node) => h('button', {
          key: node.path,
          type: 'button',
          role: 'treeitem',
          className: 'gh2-var-treeitem' + (node.path === selectedPath ? ' is-selected' : ''),
          'aria-level': node.depth + 1,
          'aria-selected': node.path === selectedPath,
          'aria-expanded': node.hasChildren ? !collapsed.has(node.path) : undefined,
          'data-gh': 'var-node-row',
          'data-path': node.path,
          title: node.path,
          style: { paddingLeft: (7 + node.depth * 14) + 'px' },
          onClick: () => setSelectedPath(node.path),
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPath(node.path); }
            if (node.hasChildren && e.key === 'ArrowLeft' && !collapsed.has(node.path)) toggle(node.path);
            if (node.hasChildren && e.key === 'ArrowRight' && collapsed.has(node.path)) toggle(node.path);
          },
        },
          h('span', {
            className: 'gh2-var-disclosure',
            'data-gh': 'var-toggle',
            'aria-hidden': node.hasChildren ? undefined : 'true',
            onClick: node.hasChildren ? (e) => { e.stopPropagation(); toggle(node.path); } : undefined,
          }, node.hasChildren ? (collapsed.has(node.path) ? '▸' : '▾') : '•'),
          h('code', { className: 'gh2-var-treekey' }, node.key),
          h('small', { className: 'gh2-var-treemeta' }, node.childCount ? node.type + ' · ' + node.childCount : node.type)));
        const treePane = h('div', { className: 'gh2-var-tree-pane' },
          h('div', { className: 'gh2-var-panehead' },
            h('div', null, h('span', null, 'Estructura de variables'), h('h4', null, 'Árbol de rutas')),
            h('span', { className: 'gh2-m5-meta' }, nodes.length + '\u8282\u70b9')),
          h('div', { className: 'gh2-var-treetools' },
            h('input', {
              type: 'search',
              className: 'gh2-finput',
              'data-gh': 'var-search',
              'aria-label': 'Buscar MVU',
              placeholder: 'Buscar ruta / clave / tipo',
              value: search,
              onChange: (e) => setSearch(e.target.value),
            }),
            h(TextButton, { onClick: toggleAll, 'data-gh': 'var-collapse-all' }, allCollapsed ? 'Expandir todo' : 'Plegar todo')),
          h('div', { className: 'gh2-var-tree', role: 'tree', 'aria-label': 'Árbol de rutas de variables', 'data-gh': 'var-tree' },
            treeRows.length ? treeRows : h('div', { className: 'gh2-var-tree-empty', 'data-gh': 'var-tree-empty' },
              h('strong', null, query ? 'no hay \u5339\u914d\u7684\u53d8\u91cf\u8def\u5f84' : 'Árbol de variables vacío'),
              h('span', null, query ? '\u6362\u4e00\u4e2aDesactivado\u952e\u8bcd\uff0c\u6216\u6e05\u7a7a\u641c\u7d22\u3002' : 'El esquema no tiene campos raíz.'))));
        const field = (label, value, gh, mono) => h('div', { className: 'gh2-m5-field' },
          h('span', null, label),
          h('div', { className: 'gh2-var-value' + (mono ? ' mono' : ''), 'data-gh': gh }, value));
        const detailPane = h('div', { className: 'gh2-var-detail-pane', 'data-gh': 'var-detail' },
          h('div', { className: 'gh2-var-panehead' },
            h('div', null, h('span', null, 'Detalles del nodo'), h('h4', null, 'Solo lectura\u8282\u70b9')),
            h('code', { className: 'gh2-var-pathcode', 'data-gh': 'var-detail-path', title: selected ? selected.path : 'Actual\u53d8\u91cf\u5b8c\u6574\u8def\u5f84' }, selected ? selected.path : 'No se ha seleccionado ningún nodo')),
          selected ? h('div', { className: 'gh2-var-detailbody' },
            h('div', { className: 'gh2-var-fieldgrid' },
              field('key', selected.key, 'var-detail-key', true),
              field('type', selected.type, 'var-detail-type'),
              field('default', selected.defaultText, 'var-detail-default', true)),
            h('div', { className: 'gh2-m5-field' },
              h('span', null, 'Valor inicial'),
              h('pre', { className: 'gh2-var-initial' + (selected.initialJson ? ' is-json' : ''), 'data-gh': 'var-detail-initial' }, selected.initialText)),
            h('p', { className: 'gh2-m5-meta', 'data-gh': 'var-detail-source' }, 'Origen: ', sourceLabel, ' · inicial: ', initialSourceLabel),
            h('p', { className: 'gh2-m5-note' }, 'Valor inicial\u4f18\u5148\u771f\u5b9e\u53d8\u91cf\u4e66 [initvar]\uff0cno hay \u624d\u7528 stat_data\uff1b\u5bf9\u8c61/\u6570\u7ec4\u663e\u793a JSON\uff1brecord \u7684 * \u548c\u7f3a\u5931\u663e\u793a —\u3002'))
            : h('div', { className: 'gh2-var-detail-empty', 'data-gh': 'var-detail-empty' },
              h('strong', null, 'Elige un MVU'),
              h('span', null, '\u5de6\u6811\u9009\u62e9\u8282\u70b9\u540e\u663e\u793a\u5b8c\u6574\u8def\u5f84\u3001\u7c7b\u578b\u3001\u9ed8\u8ba4\u503c\u548cValor inicial\u3002')));
        const sourceBar = h('div', { className: 'gh2-var-toolbar' },
          h('span', { className: 'gh2-m5-meta', 'data-gh': 'var-source' },
            'Origen: ', sourceLabel ? h('b', null, sourceLabel)
              : h('b', null, s.ws.activeCard ? 'Actual\u5361no hay  MVU Schema' : '\uff08Sin tarjeta seleccionada/\u7ec4\u4ef6\uff09'),
            ' · inicial: ', h('span', { 'data-gh': 'var-initial-source-label' }, initialSourceLabel),
            ' · ', String(nodes.length), '\u8282\u70b9'));
        const structureContent = schema ? h('div', { className: 'gh2-var-visual', 'data-gh': 'var-visual' }, treePane, detailPane)
          : h('p', { className: 'gh2-m5-warn', 'data-gh': 'var-nodes-empty' },
            s.mvu && s.mvu.folderError ? '\u7ec4\u4ef6\u76ee\u5f55Error al leer\uff1a' + s.mvu.folderError
              : 'Actualno hay \u5361\u5185\u6216\u7ec4\u4ef6\u76ee\u5f55\u7684 MVU Schema\u3002\u5148\u9009\u4e2d\u5e26 Schema \u7684\u5361\uff0c\u6216\u5728\u4e16\u754c\u4e66\u76ee\u5f55\u91cc\u6253Activado\u7ec4\u4ef6 JSON\u3002');
        const resultBlock = (title, items, render, gh) => h('section', { className: 'gh2-var-resultblock', 'data-gh': gh },
          h('div', { className: 'gh2-m5-rowhead' }, h('b', null, title), h('span', { className: 'gh2-m5-meta' }, items.length + ' elementos')),
          items.length
            ? h('ul', { className: 'gh2-var-resultlist' }, items.map((item, index) => h('li', { key: index }, render(item, index))))
            : h('p', { className: 'gh2-m5-note' }, 'no hay \u53d1\u73b0'));
        const compareSchemaNodes = compareResult && Array.isArray(compareResult.schemaNodes) ? compareResult.schemaNodes : [];
        const compareNodeByPath = new Map(compareSchemaNodes.map((node) => [node.path, node]));
        const compareVisibleNodes = compareSchemaNodes.filter((node) => {
          let parent = node.parentPath;
          while (parent) {
            if (compareCollapsed.has(parent)) return false;
            const parentNode = compareNodeByPath.get(parent);
            parent = parentNode ? parentNode.parentPath : '';
          }
          return true;
        });
        const toggleCompareNode = (path) => {
          setCompareCollapsed((current) => {
            const next = new Set(current);
            if (next.has(path)) next.delete(path); else next.add(path);
            return next;
          });
        };
        const compareTree = compareResult ? h('section', { className: 'gh2-var-schema-tree-block', 'data-gh': 'var-schema-tree-block' },
          h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Árbol del esquema'), h('span', { className: 'gh2-m5-meta' }, compareSchemaNodes.length + ' nodos')),
          h('div', { className: 'gh2-var-schema-tree', role: 'tree', 'aria-label': '\u89e3\u6790\u540e\u7684 Árbol del esquema', 'data-gh': 'var-schema-tree' },
            compareVisibleNodes.length ? compareVisibleNodes.map((node) => h('div', {
              key: node.path, role: 'treeitem', className: 'gh2-var-schema-tree-row',
              'aria-level': node.depth + 1, 'aria-expanded': node.hasChildren ? !compareCollapsed.has(node.path) : undefined,
              'data-gh': 'var-schema-tree-row', 'data-path': node.path,
              style: { paddingLeft: (7 + node.depth * 14) + 'px' }, title: node.path,
            },
              h('span', {
                className: 'gh2-var-disclosure', 'data-gh': 'var-schema-tree-toggle',
                onClick: node.hasChildren ? () => toggleCompareNode(node.path) : undefined,
              }, node.hasChildren ? (compareCollapsed.has(node.path) ? '▸' : '▾') : '•'),
              h('code', { className: 'gh2-var-treekey' }, node.key),
              h('small', { className: 'gh2-var-treemeta' }, node.childCount ? node.type + ' · ' + node.childCount : node.type)))
              : h('p', { className: 'gh2-m5-note' }, '\u89e3\u6790\u540e\u663e\u793a Árbol del esquema\u3002')))
          : null;
        const compareView = h('div', { className: 'gh2-var-compare', 'data-gh': 'var-compare' },
          h('p', { className: 'gh2-m5-note' }, 'Comparación de esquema / variable book real / reglas de actualización; copia de trabajo; reescribir la tarjeta requiere confirmación y copia; no se ejecuta Zod. Los cambios solo afectan a esta página y se reinician al cambiar de tarjeta o recargar.'),
          h('label', { className: 'gh2-m5-field' },
            h('span', null, 'Esquema original'),
            h('textarea', {
              className: 'gh2-var-textarea', 'data-gh': 'var-schema-source', rows: 10, spellCheck: false,
              value: work.schemaSource, onChange: (e) => updateWork({ schemaSource: e.target.value }),
            })),
          h('div', { className: 'gh2-var-two' },
            h('label', { className: 'gh2-m5-field' },
              h('span', { 'data-gh': 'var-init-source' }, 'Variables iniciales (origen: ' + (work.initialSource || initialSourceLabel) + '\uff09'),
              h('textarea', {
                className: 'gh2-var-textarea', 'data-gh': 'var-initial-source', rows: 8, spellCheck: false,
                value: work.initialText, onChange: (e) => updateWork({ initialText: e.target.value }),
              })),
            h('div', { className: 'gh2-m5-field' },
              h('span', null, 'Reglas de actualización\uff08\u9010\u6761\uff0c' + workRuleEntries.length + ' entradas\uff09'),
              workRuleEntries.length ? h('div', { className: 'gh2-var-ruleentries', 'data-gh': 'var-rule-entries' },
                workRuleEntries.map((entry, index) => h('label', {
                  key: entry.id || index, className: 'gh2-var-ruleentry', 'data-gh': 'var-rule-entry', 'data-id': entry.id,
                },
                  h('span', null, (entry.name || 'Reglas de actualización') + ' · ' + (entry.id || 'rule-' + (index + 1))),
                  h('textarea', {
                    className: 'gh2-var-textarea', 'data-gh': 'var-rule-entry-content', rows: 5, spellCheck: false,
                    value: entry.content, onChange: (e) => updateRuleEntry(index, e.target.value),
                  }))))
                : h('p', { className: 'gh2-m5-note' }, 'Actual\u5361no hay Reglas de actualizaciónEntradas\u3002'))),
          h('div', { className: 'gh2-m5-actions' },
            h(TextButton, { onClick: runCompare, disabled: compareBusy, 'data-gh': 'var-compare-run' }, compareBusy ? 'Analizar y comparar\u4e2d…' : 'Analizar y comparar'),
            h(TextButton, { onClick: reloadWork, disabled: compareBusy, 'data-gh': 'var-compare-reload' }, 'Volver a cargar desde la tarjeta actual')),
          errorLine(compareError, 'var-compare-error'),
          compareResult ? h('div', { className: 'gh2-var-result', 'data-gh': 'var-compare-result' },
            h('div', { className: 'gh2-var-summary', 'data-gh': 'var-compare-summary' },
              h('span', { className: 'gh2-m5-chip' }, 'Schema nodos ' + compareResult.schemaNodeCount),
              h('span', { className: 'gh2-m5-chip' }, 'Campo del esquema ' + compareResult.schemaFieldCount),
              h('span', { className: 'gh2-m5-chip' }, 'Campo del contrato ' + compareResult.fieldCount),
              h('span', { className: 'gh2-m5-chip' }, '\u89c4\u5219Entradas ' + compareResult.ruleEntryCount)),
            errorLine(compareResult.schemaError, 'var-compare-schema-error'),
            errorLine(compareResult.initialError, 'var-compare-initial-error'),
            errorLine(compareResult.simulateError, 'var-compare-simulate-error'),
            compareTree,
            resultBlock('\u7f3aValor inicial', compareResult.missing, (item) => item.path + '\uff08' + item.schemaType + '\uff09', 'var-missing'),
            resultBlock('Valores iniciales adicionales', compareResult.extra, (item) => item.path, 'var-extra'),
            resultBlock('Tipo incoherente', compareResult.typeMismatch, (item) => item.path + '\uff1aSchema ' + item.schemaType + ' / inicial ' + item.initialType, 'var-type-mismatch'),
            resultBlock('Campo de regla ausente en el esquema', compareResult.ruleUnknown, (item) => item.path + (item.type ? '\uff08' + item.type + '\uff09' : ''), 'var-rule-unknown'),
            resultBlock('Tipos incoherentes', compareResult.ruleTypeMismatch, (item) => item.path + '\uff1aSchema ' + item.schemaType + ' / regla ' + item.ruleType, 'var-rule-type'),
            resultBlock('\u89c4\u5219 check entradas\u4ef6', compareResult.ruleChecks, (item) => (item.path || '(sin ruta)') + ' · ' + (item.label || '(sin etiqueta)') + (item.detail ? ' · ' + item.detail : ''), 'var-rule-checks'))
            : h('p', { className: 'gh2-m5-note', 'data-gh': 'var-compare-empty' }, '\u70b9“Analizar y comparar”\u540e\u663e\u793a\u5dee\u5f02\u3002'));
        const checkStatusText = { pass: 'Correcto', observed: 'Coincidencia', not_triggered: 'No activado', not_run: 'No ejecutado' };
        const runView = h('div', { className: 'gh2-var-run', 'data-gh': 'var-run' },
          h('p', { className: 'gh2-m5-note' }, 'Subconjunto seguro determinista RPN: JSONPatch + contrato seguro; no se ejecuta JS/Zod nativo de MVU.'),
          h('div', { className: 'gh2-var-two' },
            h('label', { className: 'gh2-m5-field' },
              h('span', null, 'Estado antes de la ejecución (predeterminado ' + (work.initialSource || initialSourceLabel) + '\uff09'),
              h('textarea', {
                className: 'gh2-var-textarea', 'data-gh': 'var-before', rows: 10, spellCheck: false,
                value: work.beforeText, onChange: (e) => updateWork({ beforeText: e.target.value }),
              })),
            h('label', { className: 'gh2-m5-field' },
              h('span', null, 'Operaciones JSONPatch candidatas'),
              h('textarea', {
                className: 'gh2-var-textarea', 'data-gh': 'var-operations', rows: 10, spellCheck: false,
                value: work.operationsText, onChange: (e) => updateWork({ operationsText: e.target.value }),
              }))),
          h('div', { className: 'gh2-m5-actions' },
            h('label', { className: 'gh2-var-dialect' }, h('span', null, 'Dialecto'),
              h('select', {
                className: 'gh2-finput', 'data-gh': 'var-dialect', value: work.dialect,
                onChange: (e) => updateWork({ dialect: e.target.value }),
              }, h('option', { value: 'rfc6902' }, 'rfc6902'))),
            h(TextButton, { onClick: runSimulation, disabled: runBusy, 'data-gh': 'var-run-button' }, runBusy ? 'Ejecutando…' : 'Ejecutar una vez'),
            h(TextButton, { onClick: reloadWork, disabled: runBusy, 'data-gh': 'var-run-reload' }, 'Volver a cargar desde la tarjeta actual')),
          errorLine(runError, 'var-run-error'),
          runResult ? h('div', { className: 'gh2-var-result', 'data-gh': 'var-run-result' },
            h('div', { className: 'gh2-var-summary', 'data-gh': 'var-run-summary' },
              h('span', { className: 'gh2-m5-chip' }, 'Operaciones: ' + runResult.operationCount),
              h('span', { className: 'gh2-m5-chip' }, 'Campos: ' + runResult.fieldCount),
              h('span', { className: 'gh2-m5-chip' }, 'Checks ' + runResult.checks.length),
              h('span', { className: 'gh2-m5-chip' }, 'Diff ' + runResult.diff.length),
              h('span', { className: 'gh2-m5-chip' }, 'Zod ejecutado: ' + (runResult.zodExecuted ? 'sí' : 'no'))),
            h('section', { className: 'gh2-var-resultblock', 'data-gh': 'var-run-checks' },
              h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Checks'), h('span', { className: 'gh2-m5-meta' }, runResult.checks.length + ' elementos')),
              runResult.checks.length ? h('ul', { className: 'gh2-var-check-list' }, runResult.checks.map((check, index) => h('li', {
                key: (check && check.id) || index, className: 'gh2-var-check', 'data-status': check && check.status,
              },
                h('span', { className: 'gh2-var-checkstatus' }, checkStatusText[check && check.status] || (check && check.status) || '—'),
                h('b', null, (check && check.label) || (check && check.id) || 'check'),
                h('span', { className: 'gh2-m5-meta' }, (check && check.detail) || '')))) : h('p', { className: 'gh2-m5-note' }, 'no hay  checks\u3002')),
            resultBlock('Diff', runResult.diff, (item) => (item.kind || 'replace') + ' ' + (item.path || '/') + ' · ' + JSON.stringify(item.before) + ' → ' + JSON.stringify(item.after), 'var-diff'),
            h('section', { className: 'gh2-var-resultblock', 'data-gh': 'var-after-block' },
              h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Estado tras la ejecución'), h('span', { className: 'gh2-m5-meta' }, 'after')),
              h('pre', { className: 'gh2-var-initial', 'data-gh': 'var-after' }, JSON.stringify(runResult.after, null, 2))),
            h('details', { className: 'gh2-var-raw', 'data-gh': 'var-trace' },
              h('summary', null, 'JSON de traza completo'),
              h('pre', { className: 'gh2-var-initial' }, JSON.stringify(runResult.trace, null, 2))))
            : h('p', { className: 'gh2-m5-note', 'data-gh': 'var-run-empty' }, 'Haz clic en «Ejecutar una vez» para ver checks / diff / after / trace.'));
        const modeButtons = h('div', { className: 'gh2-var-modes', 'data-gh': 'var-modes' },
          h(TextButton, { onClick: () => setWorkTab('structure'), className: 'gh2-var-mode' + (workTab === 'structure' ? ' is-active' : ''), 'data-gh': 'var-mode-structure' }, 'Estructura'),
          h(TextButton, { onClick: () => setWorkTab('compare'), className: 'gh2-var-mode' + (workTab === 'compare' ? ' is-active' : ''), 'data-gh': 'var-mode-compare' }, 'Comparación'),
          h(TextButton, { onClick: () => setWorkTab('run'), className: 'gh2-var-mode' + (workTab === 'run' ? ' is-active' : ''), 'data-gh': 'var-mode-run' }, 'Ejecutar prueba'));
        const manualFiles = (Array.isArray(s.wb.files) ? s.wb.files : []).filter((file) => /\.json$/iu.test(file.name || file.path));
        const manualSource = !cardSchema ? h('div', { className: 'gh2-var-manual', 'data-gh': 'var-manual-source' },
          h('p', { className: 'gh2-m5-meta' },
            s.wb.root ? h(Fragment, null, 'Directorio de componentes igual que el de la worldbook\uff1a', h('span', { className: 'gh2-mono' }, s.wb.root))
              : 'Abre el directorio en la página de worldbook para leer los JSON de componentes.'),
          manualFiles.length ? h('div', { className: 'gh2-wb-files', 'data-gh': 'var-manual-files' },
            manualFiles.map((file) => h('button', {
              key: file.path,
              type: 'button',
              title: file.path,
              className: 'gh2-wb-file' + (file.path === s.mvu.selectedPath ? ' is-active' : ''),
              'data-gh': 'var-manual-file',
              'data-path': file.path,
              onClick: () => inspectMvuFile(file.path),
            },
              h('span', { className: 'gh2-wb-fname' }, file.name || basename(file.path)),
              h('span', { className: 'gh2-m5-meta' }, formatSize(file.size)))))
            : h('p', { className: 'gh2-m5-note' }, 'No hay componentes .json en el directorio de la worldbook.'),
          h('p', { className: 'gh2-m5-note' }, 'no hay \u5361\u5185 Schema \u65f6\uff0c\u70b9\u7ec4\u4ef6 .json \u8ba9\u5bbf\u4e3b\u9759\u6001\u89e3\u6790\uff1b\u8fd9\u91cc\u4e0d\u6267\u884c\u811a\u672c\u3002'))
          : null;
        const writeTarget = s.ws.activeCard && s.ws.activeCard.file ? s.ws.activeCard.file.path : '';
        const canWrite = !!(writeTarget && cardMvu && (cardMvu.schemaSource || cardMvu.updateRuleEntries.length || cardMvu.initVarSource || cardMvu.initVar));
        const writePayload = writeResult && writeResult.result ? writeResult.result : writeResult;
        const backupText = writePayload
          ? (typeof writePayload.backup === 'string' ? writePayload.backup
            : writePayload.backup && typeof writePayload.backup === 'object'
              ? (writePayload.backup.path || writePayload.backup.file || writePayload.backup.dir || '')
              : (writePayload.backupPath || writePayload.backupFile || writePayload.backupDir || ''))
          : '';
        const verifyRaw = writePayload
          ? (writePayload.verification !== undefined ? writePayload.verification
            : writePayload.verified !== undefined ? writePayload.verified
              : writePayload.readback !== undefined ? writePayload.readback : writePayload.validation)
          : undefined;
        const verifyText = verifyRaw === true ? 'Correcto'
          : verifyRaw === false ? 'error'
            : typeof verifyRaw === 'string' ? verifyRaw
              : verifyRaw && typeof verifyRaw === 'object' ? JSON.stringify(verifyRaw, null, 2) : '';
        const writeBar = h('div', { className: 'gh2-var-writebar', 'data-gh': 'var-writebar' },
          h('div', { className: 'gh2-var-writehead' },
            h('div', { className: 'gh2-var-writeinfo' },
              h('b', null, 'Reescribir tarjeta'),
              h('span', { className: 'gh2-m5-meta' }, writeTarget || 'Sin tarjeta seleccionada'),
              h('span', { className: 'gh2-m5-meta' }, 'Se hace una copia primero; solo se cambian los campos seleccionados de esquema / variables iniciales / reglas')),
            h(TextButton, {
              onClick: () => setWriteConfirm(true), disabled: !canWrite || writing,
              title: canWrite ? 'Escribir en la tarjeta actual y mostrar la copia y la verificación' : 'Actual\u5361no hay \u53ef\u5199\u56de\u7684 MVU \u6765\u6e90',
              'data-gh': 'var-write-button',
            }, writing ? 'Reescribiendo…' : 'Reescribir tarjeta\uff08\u5907\u4efd\uff09')),
          writeConfirm ? h('div', { className: 'gh2-var-writeconfirm', 'data-gh': 'var-write-confirm' },
            h('p', null, 'Destino: ', h('code', { className: 'gh2-mono' }, writeTarget)),
            h('p', { className: 'gh2-m5-note' }, 'El host copia primero la tarjeta original en .godhand/backups/<timestamp>/<filename>, escribe de forma atómica y verifica la lectura. No se ejecutan scripts de la tarjeta ni se genera contenido de modelo.'),
            h('div', { className: 'gh2-m5-actions' },
              h(TextButton, { onClick: writeCardBack, disabled: writing, 'data-gh': 'var-write-confirm-button' }, writing ? 'Reescribiendo…' : 'Confirmar reescritura'),
              h(TextButton, { onClick: () => { setWriteConfirm(false); setWriteError(''); }, disabled: writing, 'data-gh': 'var-write-cancel' }, 'Cancelar')))
            : null,
          errorLine(writeError, 'var-write-error'),
          writeResult ? h('div', { className: 'gh2-var-writeresult', 'data-gh': 'var-write-result' },
            h('p', null, 'Copia: ', h('code', { className: 'gh2-mono', 'data-gh': 'var-write-backup' }, backupText || 'La respuesta no incluyó la ruta de la copia')),
            h('p', null, 'Verificación de lectura: ', h('code', { className: 'gh2-mono', 'data-gh': 'var-write-verify' }, verifyText || 'La respuesta no incluyó campos de verificación')),
            h('details', { className: 'gh2-var-raw' },
              h('summary', null, 'Respuesta completa de la reescritura'),
              h('pre', { className: 'gh2-var-initial' }, JSON.stringify(writeResult, null, 2))))
            : null);
        return h('div', { className: 'gh2-m5', 'data-gh': 'legacyVars-pane' },
          s.ws.restoreNotice ? h('p', { className: 'gh2-m5-warn', 'data-gh': 'ws-restore-notice' }, s.ws.restoreNotice) : null,
          errorLine(s.ws.cardInspectError, 'card-inspect-error'),
          s.ws.cardInspectBusy ? h('p', { className: 'gh2-m5-meta', 'data-gh': 'card-inspect-busy' }, 'Leyendo variables de la tarjeta y metadatos MVU…') : null,
          h('section', { className: 'gh2-var-page', 'data-gh': 'var-nodes-page' },
            h('div', { className: 'gh2-m5-rowhead' },
              h('b', null, 'MVU'),
              h('span', { className: 'gh2-m5-chip' }, 'Solo lecturaEstructura'),
              h('span', { className: 'gh2-m5-chip' }, 'Copia de trabajo')),
            h('p', { className: 'gh2-m5-warn', 'data-gh': 'var-nodes-note' },
              workTab === 'structure' ? 'Estructura estática; MVU/Zod no ejecutados; valores de solo lectura; sin PASS/FAIL'
                : 'Copia de trabajo\uff1b\u8fd0\u884c\u5b89\u5168\u5b50\u96c6\uff1bReescribir tarjeta requiere confirmación manual y copia de seguridad; no ejecuta MVU JS/Zod real.'),
            sourceBar,
            h('div', { className: 'gh2-var-modebar' },
              modeButtons,
              work.resetNotice ? h('span', { className: 'gh2-m5-warn', 'data-gh': 'var-reset-notice' }, work.resetNotice) : null),
            writeBar,
            workTab === 'structure' ? manualSource : null,
            workTab === 'structure' ? structureContent : workTab === 'compare' ? compareView : runView),
          h('div', { className: 'gh2-mvu-sep' }),
          h(WorldbookJsonSection, { wb: s.wb }));
      }

      function jumpToLegacyNodes() {
        const s = store.get();
        const cardSchema = s.ws.cardDetail && s.ws.cardDetail.mvu && s.ws.cardDetail.mvu.schema;
        const manualSchema = s.mvu && s.mvu.schema;
        if (!cardSchema && !manualSchema) {
          toast('Actualno hay \u53ef\u6d4f\u89c8\u7684 MVU MVU');
          return false;
        }
        setUi({ mode: 'full', tab: 'legacyVars' });
        setWs({ legacyTab: 'run', legacyFocus: Date.now() });
        return true;
      }
      function jumpToCardMvu() { return jumpToLegacyNodes(); }

      function UiEditorPane() {
        const s = useStoreState();
        const detail = s.ws.cardDetail;
        const scripts = detail && Array.isArray(detail.scripts) ? detail.scripts : [];
        const hasCardMvu = !!(detail && detail.mvu && detail.mvu.schema);
        const hasMvuSource = hasCardMvu || !!(s.mvu && s.mvu.schema);
        const layers = ['AppShell', 'StatusBar', 'DialoguePanel', 'ActionBar'];
        const inspector = [['Diseño', 'flex · 100vw × 100vh'], ['Tokens de estilo', '--surface / --ink'], ['Vinculación de datos', 'ctx.app']];
        return h('div', { className: 'gh2-m5', 'data-gh': 'ui-editor-pane' },
          h('p', { className: 'gh2-m5-lead' }, 'Capas/\u7f16\u8bd1\u5360\u4f4d\uff1b\u8d44\u6599\u5e93\u5df2\u72ec\u7acb\u4e3a“\u524d\u7aef\u8bbe\u8ba1\uff06\u52a8\u6548\u6570\u636e\u5e93”\u9875\u7b7e\u3002'),
          h('div', { className: 'gh2-m5-actions' },
            h(TextButton, { disabled: true, title: 'La cadena de compilación real aún no está conectada', 'data-gh': 'ui-compile' }, 'Compilar (sin conectar)'),
            h('span', { className: 'gh2-m5-chip', 'data-gh': 'ui-compile-chip' }, 'Cadena de compilación sin conectar')),
          h('div', { className: 'gh2-m5-links', 'data-gh': 'ui-links' },
            h('button', {
              type: 'button', className: 'gh2-m5-link', 'data-gh': 'ui-link-card-mvu',
              disabled: !hasMvuSource,
              title: hasMvuSource ? 'Ir a la página MVU y seleccionar el origen' : 'Actualno hay \u53ef\u6d4f\u89c8\u7684 MVU Schema',
              onClick: jumpToCardMvu,
            }, 'Nodo de prueba')),
          h('p', { className: 'gh2-m5-note', 'data-gh': 'ui-library-note' }, 'La biblioteca es ahora una pestaña independiente; esta página ya no la contiene.'),
          errorLine(s.ws.cardInspectError, 'card-inspect-error-ui'),
          s.ws.cardInspectBusy ? h('p', { className: 'gh2-m5-meta', 'data-gh': 'card-inspect-busy-ui' }, 'Leyendo metadatos de scripts de la tarjeta…') : null,
          h('section', { className: 'gh2-card-scripts', 'data-gh': 'card-scripts-section' },
            h('div', { className: 'gh2-m5-rowhead' },
              h('b', null, 'Scripts auxiliares de la tarjeta (solo lectura)'),
              h('span', { className: 'gh2-m5-meta' }, scripts.length + '')),
            scripts.length ? h('div', { className: 'gh2-card-script-list', 'data-gh': 'card-scripts' },
              scripts.map((script, index) => h('div', {
                key: (script.id || 'script') + ':' + index,
                className: 'gh2-card-script',
                'data-gh': 'card-script-row',
                'data-id': script.id || '',
              },
                h('div', { className: 'gh2-card-script-head' },
                  h('b', null, script.name || script.id || ('Script ' + (index + 1))),
                  h('span', { className: 'gh2-m5-chip' }, script.type || 'script'),
                  h('span', { className: 'gh2-m5-chip' }, script.enabled ? 'Activado' : 'Desactivado'),
                  h('span', { className: 'gh2-m5-chip' }, script.hasSchema ? 'Sí Schema' : 'No Schema')),
                h('p', { className: 'gh2-m5-meta' },
                  'id\uff1a' + (script.id || '\uff08No\uff09') + ' · longitud de content: ' + (script.contentLength || 0) + ' caracteres'))))
              : h('p', { className: 'gh2-m5-note', 'data-gh': 'card-scripts-empty' }, 'Actual\u5361no hay \u52a9\u624b\u811a\u672c\u5143\u4fe1\u606f\uff0c\u6216\u8fd8\u6ca1\u9009\u5361\u3002'),
            h('p', { className: 'gh2-m5-note' }, 'Solo se enumeran metadatos; no se ejecutan scripts ni se falsifican resultados de compilación.')),
          h('p', { className: 'gh2-m5-warn', 'data-gh': 'ui-compile-note' }, 'El botón de compilación es solo un marcador: aquí no se muestran resultados ni se generan artefactos.'),
          h('div', { className: 'gh2-m5-ui-grid' },
            h('section', { className: 'gh2-m5-col', 'data-gh': 'ui-layers' },
              h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Capas'), h('span', { className: 'gh2-m5-meta' }, 'Árbol de componentes')),
              layers.map((name) => h('div', { key: name, className: 'gh2-ui-layer' + (name === 'AppShell' ? ' is-open' : '') }, name)),
              h('p', { className: 'gh2-m5-note' }, 'Marcador: cuando se conecte se mostrarán las capas reales, el bloqueo y la selección.')),
            h('section', { className: 'gh2-m5-col', 'data-gh': 'ui-canvas' },
              h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Lienzo'), h('span', { className: 'gh2-m5-meta' }, 'Vista previa · marcador')),
              h('div', { className: 'gh2-ui-canvas' }, h('span', null, 'Área real de vista previa de componentes (marcador)')),
              h('p', { className: 'gh2-m5-note' }, 'No se generan artefactos de front-end; la cadena de compilación no está conectada.')),
            h('section', { className: 'gh2-m5-col', 'data-gh': 'ui-inspector' },
              h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Propiedades'), h('span', { className: 'gh2-m5-meta' }, 'Inspector')),
              inspector.map(([label, value]) => h('div', { key: label, className: 'gh2-m5-field' },
                h('span', null, label), h('div', { className: 'gh2-ui-ins' }, value))),
              h('p', { className: 'gh2-m5-note' }, 'Marcador: el código fuente, los errores de compilación y la conservación de borradores son de una fase posterior.'))));
      }

      function ProjectOverlay({ s }) {
        const ws = s.ws;
        const active = ws.projects.find((project) => project.id === ws.activeProjectId) || null;
        const currentRoot = ws.versionsRoot || (active && active.root) || '';
        const activeCard = ws.activeCard;
        const activeMeta = activeCard && activeCard.meta ? activeCard.meta : {};
        useEffect(() => {
          const onKey = (event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            event.stopPropagation();
            closeProjectManager();
          };
          document.addEventListener('keydown', onKey, true);
          return () => document.removeEventListener('keydown', onKey, true);
        }, []);
        const projectRows = ws.projects.length ? ws.projects.map((project) => h('li', {
          key: project.id,
          className: 'gh2-project-row' + (project.id === ws.activeProjectId ? ' is-active' : ''),
          'data-gh': 'project-row',
          'data-id': project.id,
        },
          h('button', {
            type: 'button', className: 'gh2-project-main', 'data-gh': 'project-switch',
            disabled: ws.busy,
            onClick: () => switchProject(project.id),
          },
            h('span', { className: 'gh2-project-itemtitle' },
              h('b', null, project.label),
              project.id === ws.activeProjectId ? h('span', { className: 'gh2-m5-chip' }, 'Actual') : null),
            h('span', { className: 'gh2-mono' }, project.root),
            h('span', { className: 'gh2-project-meta' },
              'Versión reciente: ' + (project.lastVersionDir || '\uff08No\uff09') + ' · tarjeta reciente: ' + (project.lastCardPath || '\uff08No\uff09'))),
          h('button', {
            type: 'button', className: 'gh2-project-delete', 'data-gh': 'project-delete',
            'aria-label': 'Eliminar proyecto ' + project.label,
            disabled: ws.busy,
            onClick: () => deleteProject(project.id),
          }, '\u5220\u9664')))
          : h('p', { className: 'gh2-m5-note', 'data-gh': 'project-empty' }, '\u8fd8no hay Proyectos\u3002\u9009\u62e9\u76ee\u5f55\u6216\u8f93\u5165\u8def\u5f84\u6dfb\u52a0\u3002');
        const versionRows = ws.versions.length ? ws.versions.map((version) => h('li', { key: version.path },
          h('button', {
            type: 'button',
            className: 'gh2-project-item' + (version.path === ws.versionsRoot ? ' is-active' : ''),
            'data-gh': 'version-row',
            'data-path': version.path,
            'data-relative': version.relative || '',
            disabled: ws.busy,
            onClick: () => switchVersion(version.path),
          },
            h('span', { className: 'gh2-project-itemtext' },
              h('span', { className: 'gh2-project-itemtitle' }, version.name),
              h('span', { className: 'gh2-mono' }, version.relative || version.path)),
            version.version ? h('span', { className: 'gh2-m5-chip' }, version.version) : null,
            version.path === ws.versionsLatest ? h('span', { className: 'gh2-m5-chip' }, 'Más reciente') : null,
            h('span', { className: 'gh2-m5-meta' }, formatMtime(version.mtime)))))
          : h('p', { className: 'gh2-m5-note', 'data-gh': 'versions-empty' }, 'El host no devolvió subdirectorios de versión; se usa la raíz del proyecto como directorio actual.');
        const cardRows = ws.cards.length ? ws.cards.map((file) => {
          const info = ws.cardMeta[file.path];
          const cardMeta = info && info.meta ? info.meta : {};
          const readError = ws.cardReadErrors[file.path];
          const isActive = activeCard && activeCard.file && activeCard.file.path === file.path;
          const isLatest = ws.cardsLatest === file.path;
          const isCard = isCardRead(info);
          const notCard = !!info && !isCard;
          return h('li', { key: file.path },
            h('button', {
              type: 'button',
              className: 'gh2-project-item' + (isActive ? ' is-active' : ''),
              'data-gh': 'card-row',
              'data-path': file.path,
              disabled: ws.busy || notCard,
              title: notCard ? 'Esto es ' + (info.kind || 'unknown') + '\uff0c\u4e0dsí\u89d2\u8272\u5361\uff1b\u8bf7\u9009 PNG/JSON Archivo de tarjeta' : undefined,
              onClick: () => selectCard(ws.cardsRoot, file.path),
            },
              h('span', { className: 'gh2-project-itemtext' },
                h('span', { className: 'gh2-project-itemtitle' },
                  file.name,
                  isLatest ? h('span', { className: 'gh2-m5-chip' }, 'Más reciente') : null,
                  info ? h('span', { className: 'gh2-m5-chip' }, info.kind + (notCard ? ' · no tarjeta' : '')) : null),
                h('span', { className: 'gh2-project-meta' },
                  'Nombre de la tarjeta: ' + (cardMeta.name || (ws.cardsBusy ? 'Leyendo…' : 'desconocido')),
                  ' · spec\uff1a' + (cardMeta.spec || 'desconocido') + (cardMeta.specVersion ? ' ' + cardMeta.specVersion : ''),
                  file.version ? ' · versión del archivo: ' + file.version : ''),
                readError ? h('span', { className: 'gh2-m5-error' }, 'Error al leer\uff1a' + readError) : null),
              h('span', { className: 'gh2-m5-meta' }, formatSize(file.size) + ' · ' + formatMtime(file.mtime))));
        }) : h('p', { className: 'gh2-m5-note', 'data-gh': 'cards-empty' }, ws.cardsBusy ? 'Leyendo metadatos de la tarjeta…' : '\u8fd9\u4e2a\u76ee\u5f55no hay  PNG/JSON Archivo de tarjeta\u3002');
        return h('div', {
          className: 'gh2-libmask gh2-projectmask', 'data-gh': 'project-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Proyectos y tarjetas',
        },
          h('div', { className: 'gh2-projectpanel' },
            h('header', { className: 'gh2-projectbar' },
              h('b', null, 'Proyectos y tarjetas'),
              h('span', { className: 'gh2-m5-meta' }, active ? 'Actual\uff1a' + active.label : 'Actual: ningún proyecto seleccionado'),
              h('span', { className: 'gh2-spacer' }),
              h(TextButton, { onClick: closeProjectManager, 'data-gh': 'project-close' }, 'Cerrar')),
            h('div', { className: 'gh2-projectbody' },
              errorLine(ws.hostError, 'ws-host-error'),
              errorLine(ws.persistError, 'ws-persist-error'),
              h('p', { className: 'gh2-m5-meta', 'data-gh': 'ws-state-info' },
                'Estado del espacio de trabajo: ', h('span', { className: 'gh2-mono', 'data-gh': 'ws-state-path' }, ws.statePath || '(desconocido)'),
                ' · ', ws.savedAt ? 'Guardado el ' + formatMtime(ws.savedAt) : 'sin guardar',
                ws.hostAvailable ? '' : ' · persistencia no disponible (esta página seguirá escribiendo una instantánea en localStorage)'),
              ws.restoreNotice ? h('p', { className: 'gh2-m5-warn', 'data-gh': 'ws-restore-notice' }, ws.restoreNotice) : null,
              ws.newAvailable ? h('p', { className: 'gh2-m5-warn', 'data-gh': 'ws-new-available' }, ws.newAvailable.message || 'sí \u65b0 versiones\u53ef\u7528') : null,
              h('section', { className: 'gh2-project-section' },
                h('div', { className: 'gh2-m5-rowhead' }, h('b', null, 'Proyectos'), h('span', { className: 'gh2-m5-meta' }, ws.projects.length + '')),
                h('div', { className: 'gh2-project-actions' },
                  h(TextButton, { onClick: pickProjectRoot, disabled: ws.picking || ws.busy, 'data-gh': 'project-pick' },
                    ws.picking ? '\u6b63\u5728\u6253Activado\u76ee\u5f55\u9009\u62e9\u5668…' : 'Elegir directorio del proyecto'),
                  h('input', {
                    type: 'text', className: 'gh2-finput', 'data-gh': 'project-root-input', 'aria-label': 'Ruta del directorio del proyecto',
                    placeholder: 'o introduce la ruta del directorio del proyecto (absoluta)', value: ws.rootInput,
                    onChange: (e) => setWs({ rootInput: e.target.value }),
                    onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); addProject(ws.rootInput); } },
                  }),
                  h(TextButton, { onClick: () => addProject(ws.rootInput), disabled: ws.scanBusy || ws.busy, 'data-gh': 'project-add' },
                    ws.scanBusy ? 'Escaneando…' : 'Añadir proyecto')),
                errorLine(ws.addError, 'project-add-error'),
                h('ul', { className: 'gh2-project-list', 'data-gh': 'project-list' }, projectRows)),
              active ? h(Fragment, null,
                h('section', { className: 'gh2-project-section' },
                  h('div', { className: 'gh2-m5-rowhead' },
                    h('b', null, 'ActualProyectos'),
                    h('span', { className: 'gh2-mono' }, active.root),
                    h('span', { className: 'gh2-spacer' }),
                    h(TextButton, { onClick: toggleAutoLatest, 'data-gh': 'auto-latest' },
                      'Más reciente automático: ' + (ws.autoLatest ? 'Activado' : 'Desactivado'))),
                  h('div', { className: 'gh2-project-actions' },
                    h(TextButton, { onClick: switchLatest, disabled: ws.busy, 'data-gh': 'switch-latest' },
                      ws.busy ? 'Cambiando…' : 'Cambiar al más reciente'),
                    h(TextButton, { onClick: useProjectRootForWorldbook, disabled: !currentRoot || ws.busy, 'data-gh': 'project-use-wb' }, 'Usar el directorio actual como raíz de worldbook'),
                    h(TextButton, { onClick: useProjectRootForMvu, disabled: !currentRoot || ws.busy, 'data-gh': 'project-use-mvu' }, 'Usar el directorio actual como raíz de variables')),
                  h('p', { className: 'gh2-m5-note' }, '\u81ea\u52a8Más reciente\u6309\u6587\u4ef6\u540d\u91cc\u7684\u8bed\u4e49 versiones\u4f18\u5148\uff0c versiones\u76f8\u540c\u6309\u4fee\u6539\u65f6\u95f4\uff1b\u4e16\u754c\u4e66no se ha Guardar\u4fee\u6539\u65f6\u4e0d\u4f1a\u5207\u6362\u3002'),
                  errorLine(ws.scanError, 'project-scan-error'),
                  h('ul', { className: 'gh2-project-list', 'data-gh': 'version-list' }, versionRows)),
                h('section', { className: 'gh2-project-section' },
                  h('div', { className: 'gh2-m5-rowhead' },
                    h('b', null, 'Archivo de tarjeta'),
                    h('span', { className: 'gh2-m5-meta' }, ws.cardsBusy ? 'Leyendo metadatos de la tarjeta…' : ws.cards.length + ' PNG/JSON'),
                    h('span', { className: 'gh2-spacer' }),
                    h('span', { className: 'gh2-mono' }, ws.cardsRoot || currentRoot)),
                  errorLine(ws.cardError, 'project-card-error'),
                  ws.cardMissing ? h('p', { className: 'gh2-m5-warn', 'data-gh': 'card-missing' }, ws.cardMissing) : null,
                  h('ul', { className: 'gh2-project-list', 'data-gh': 'card-list' }, cardRows),
                  h('p', { className: 'gh2-m5-note' }, 'Metadatos del archivo de tarjeta en solo lectura: no lee el contenido, no modifica la tarjeta y no escribe en el estado del espacio de trabajo.'),
                  activeCard ? h('div', { className: 'gh2-project-carddetail', 'data-gh': 'active-card' },
                    h('span', null, h('b', null, 'Tarjeta actual: '), activeCard.file.name || basename(activeCard.file.path)),
                    h('span', null, h('b', null, 'kind\uff1a'), activeCard.kind || 'unknown'),
                    h('span', null, h('b', null, 'Nombre de la tarjeta: '), metaText(activeMeta.name)),
                    h('span', null, h('b', null, 'spec\uff1a'), metaText(activeMeta.spec)),
                    h('span', null, h('b', null, 'specVersion\uff1a'), metaText(activeMeta.specVersion)),
                    h('span', null, h('b', null, 'Personaje: '), metaText(activeMeta.characterName)),
                    h('span', null, h('b', null, 'Versión del personaje: '), metaText(activeMeta.characterVersion)),
                    h('span', null, h('b', null, 'creator\uff1a'), metaText(activeMeta.creator)),
                    h('span', null, h('b', null, 'createDate\uff1a'), metaText(activeMeta.createDate)),
                    h('span', null, h('b', null, 'Worldbook integrada: '), activeCard.hasWorldbook ? 'Sí' : 'No'),
                    h('span', null, h('b', null, 'Entradas de worldbook: '), String(activeCard.worldbookEntryCount)),
                    h('span', null, h('b', null, 'Scripts auxiliares: '), String(activeCard.scriptCount)),
                    h('span', null, h('b', null, 'Regex: '), String(activeCard.regexCount))) : null))
                : h('p', { className: 'gh2-m5-note', 'data-gh': 'project-current-empty' }, '\u8fd8no hay ActualProyectos\u3002\u6dfb\u52a0\u6216\u5207\u6362\u4e00\u4e2aProyectos\u540e\uff0c\u4f1a\u5728\u8fd9\u91cc\u5217\u51fa versiones\u76ee\u5f55\u548cArchivo de tarjeta\u3002'))));
      }

      function LibraryOverlay({ lib }) {
        const [note, setNote] = useState('');
        const onEsc = (event) => {
          if (event.key !== 'Escape') return;
          event.preventDefault();
          event.stopPropagation();
          closeLibrary();
        };
        useEffect(() => {
          document.addEventListener('keydown', onEsc, true);
          return () => document.removeEventListener('keydown', onEsc, true);
        }, []);
        const onLoad = (event) => {
          const frame = event.currentTarget;
          try {
            const doc = frame.contentDocument;
            if (!doc) { setNote(''); return; }
            doc.addEventListener('keydown', onEsc);
            const text = String(doc.body && doc.body.textContent || '');
            setNote(/\u6570\u636e\u672a\u8f7d\u5165/u.test(text) ? 'No se cargaron los datos de la página de selección: ' + text.trim().slice(0, 160) : '');
          } catch {
            setNote('');
          }
        };
        return h('div', { className: 'gh2-libmask', 'data-gh': 'lib-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': lib.title },
          h('div', { className: 'gh2-libpanel' },
            h('header', { className: 'gh2-libbar' },
              h('b', null, lib.title),
              h('span', { className: 'gh2-m5-meta' }, 'Instantánea sin conexión de TW Library · ser candidato no implica estar adoptado'),
              h('span', { className: 'gh2-spacer' }),
              h(TextButton, { onClick: closeLibrary, 'data-gh': 'lib-close' }, 'Cerrar')),
            lib.status === 'loading' ? h('div', { className: 'gh2-libstate', 'data-gh': 'lib-loading' }, 'Comprobando la ruta de la biblioteca…') : null,
            lib.status === 'error' ? h('div', { className: 'gh2-libstate' },
              errorLine(lib.error, 'lib-error'),
              h(TextButton, { onClick: closeLibrary }, 'Cerrar')) : null,
            lib.status === 'ready' ? h(Fragment, null,
              note ? h('p', { className: 'gh2-m5-error', 'data-gh': 'lib-note', style: { margin: '8px 12px 0' } }, note) : null,
              h('iframe', {
                className: 'gh2-libframe',
                'data-gh': 'lib-iframe',
                title: lib.title,
                src: lib.url,
                onLoad,
              })) : null));
      }

      function LibraryTab({ tab }) {
        const [status, setStatus] = useState('loading');
        const [error, setError] = useState('');
        const [nonce, setNonce] = useState(0);
        const seq = useRef(0);
        const url = M5.libPage + '#' + tab;
        useEffect(() => {
          const my = ++seq.current;
          setStatus('loading');
          setError('');
          probeLibrary().then(() => {
            if (my === seq.current) setStatus('ready');
          }).catch((err) => {
            if (my !== seq.current) return;
            setStatus('error');
            setError('No se encontró la biblioteca: ' + errorText(err));
          });
          return () => { seq.current += 1; };
        }, [tab, nonce]);
        return h('div', { className: 'gh2-library-tab', 'data-gh': 'library-tab', 'data-tab': tab },
          status === 'loading' ? h('div', { className: 'gh2-libstate', 'data-gh': 'lib-tab-loading' }, 'Comprobando la ruta de la biblioteca…') : null,
          status === 'error' ? h('div', { className: 'gh2-libstate', 'data-gh': 'lib-tab-error' },
            h('p', { className: 'gh2-m5-error' }, error),
            h(TextButton, { onClick: () => setNonce((n) => n + 1) }, 'Recargar')) : null,
          status === 'ready' ? h('iframe', {
            className: 'gh2-libframe gh2-libframe-tab',
            'data-gh': 'lib-tab-frame',
            title: M5.libTitles[tab],
            src: url,
            onError: () => { setStatus('error'); setError('No se pudo cargar la página de la biblioteca.'); },
          }) : null);
      }

      function FullWindow({ s }) {
        const ref = useRef(null);
        const rect = s.ui.full ? clampFull(s.ui.full) : defaultFull();
        const start = useRef(rect);
        start.current = rect;
        useEffect(() => {
          if (!store.get().ui.full) setUi({ full: rect });
          try { ref.current && ref.current.focus({ preventScroll: true }); } catch {}
        }, []);
        const onMove = (e) => beginDrag(e, ref, (dx, dy) => clampFull({ ...start.current, x: start.current.x + dx, y: start.current.y + dy }), (r) => setUi({ full: r }));
        const onResize = (e) => beginDrag(e, ref, (dx, dy) => clampFull({ ...start.current, w: start.current.w + dx, h: start.current.h + dy }), (r) => setUi({ full: r }));
        const tab = s.ui.tab;
        const isLibraryTab = tab === 'library';
        const activeWsProject = s.ws.projects.find((project) => project.id === s.ws.activeProjectId) || null;
        return h('section', {
          ref, className: 'gh2-root gh2-win', role: 'region', 'aria-label': 'Mano divina', tabIndex: -1, 'data-gh': 'window',
          style: { left: rect.x, top: rect.y, width: rect.w, height: rect.h },
          onKeyDown: (e) => { if (e.key === 'Escape') { e.stopPropagation(); setUi({ mode: 'compact', wheelOn: true }); } },
        },
          h('header', { className: 'gh2-bar', onPointerDown: onMove, 'data-gh': 'window-bar' },
            h('span', { className: 'gh2-brand' }, h(Logo, { size: 18 })),
            h('span', { className: 'gh2-title' }, 'Mano divina'),
            h(TextButton, {
              onClick: openProjectManager,
              className: 'gh2-projectbtn',
              'data-gh': 'project-button',
              title: activeWsProject ? activeWsProject.root : 'Proyectos y tarjetas',
            }, 'Proyectos' + (activeWsProject ? ' · ' + activeWsProject.label : '')),
            h('span', { className: 'gh2-spacer' }),
            h(IconButton, { label: 'Plegar en la rueda', onClick: () => setUi({ mode: 'compact', wheelOn: true }) }, h(IconMinimize))),
          h('div', { className: 'gh2-tabs' }, h(Tabs, { value: tab, onChange: (next) => setUi({ tab: next }) })),
          h('div', { className: 'gh2-body' + (isLibraryTab ? ' gh2-body-lib' : ''), id: 'gh2-panel-' + tab, role: 'tabpanel', 'aria-labelledby': 'gh2-tab-' + tab, 'data-gh': 'panel-' + tab },
            tab === 'skills' ? h(SkillsPane, { s })
              : tab === 'worldbook' ? h(WorldbookPane)
                : h(LibraryTab, { tab: 'design' })),
          h('div', { className: 'gh2-grip', onPointerDown: onResize, 'aria-hidden': 'true', 'data-gh': 'grip' }, h(IconGrip)));
      }

      function Overlay() {
        const s = useStoreState();
        useEffect(() => {
          let timer = 0;
          const onResize = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
              const ui = store.get().ui;
              if (ui.full) setUi({ full: clampFull(ui.full) });
            }, 150);
          };
          window.addEventListener('resize', onResize);
          return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); };
        }, []);
        // Activado\uff1a /  10 Archivo de tarjeta\u3002
        useEffect(() => {
          if (s.ui.mode !== 'full') {
            if (s.ws.managerOpen) closeProjectManager();
            return undefined;
          }
          if (!s.ws.loaded || !s.ws.activeProjectId) return undefined;
          let disposed = false;
          const tick = () => { if (!disposed) refreshLatest(); };
          tick();
          const timer = setInterval(tick, 10000);
          return () => { disposed = true; clearInterval(timer); };
        }, [s.ui.mode, s.ws.loaded, s.ws.activeProjectId, s.ws.autoLatest]);
        const d = s.drop;
        return h(Fragment, null,
          // ActivadoDesactivado\uff0c\uff08\u3001\u3001\u3001\uff09\u3002
          s.ui.wheelOn !== false ? h(Wheel, { s }) : null,
          s.ui.mode === 'full' ? h(FullWindow, { s }) : null,
          s.ws.managerOpen ? h(ProjectOverlay, { s }) : null,
          s.lib.open ? h(LibraryOverlay, { lib: s.lib }) : null,
          d ? h('div', {
            className: 'gh2-drophint', 'data-gh': 'drop-hint', 'aria-hidden': 'true',
            style: { left: d.x - 3, top: d.y - 3, width: d.w + 6, height: d.h + 6, borderRadius: 'calc(' + (d.radius || '12px') + ' + 3px)' },
          }) : null,
          s.toast ? h('div', { className: 'gh2-toast', role: 'status', 'data-gh': 'toast' }, s.toast.text) : null);
      }

      /* ---------------- \u88c5\u914d ---------------- */
      const inject = ['slots', 'sidebarRight', 'sessions', 'remote', 'remote.skills', 'remote.directoryPicker'];
      function apply(ctx) {
        ctxRef = ctx;
        G.applied = true;
        injectStyles();
        ctx.effect(() => {
          const mounted = ctx.sidebarRight && ctx.sidebarRight.mounted;
          if (!mounted || typeof mounted.getSnapshot !== 'function' || typeof mounted.subscribe !== 'function') {
            fail('mounted', new Error('No se encontró la fuente «sesión en pantalla»'));
            return () => {};
          }
          const sync = () => track(mounted.getSnapshot());
          const off = mounted.subscribe(sync);
          sync();
          return () => { off(); untrack(); };
        }, 'godhand: on-screen session');
        ctx.effect(() => installDropTarget(), 'godhand: drop skill into composer');
        ctx.effect(() => { loadWorkspace(); return () => {}; }, 'godhand: restore workspace');
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: PLUGIN_ID, order: 850 }, Overlay));
        ctx.slots.inject('conversation.session.header.utilities', () => {
          const brands = [
            ctx.slots.register({ name: 'conversation.session.header.utilities', id: PLUGIN_ID, order: -30 }, HeaderButton),
            ctx.slots.register({ name: 'conversation.session.header.utilities', id: PLUGIN_ID + '-wheel', order: -29 }, WheelToggleButton),
          ].filter((off) => typeof off === 'function');
          return brands.length ? () => { for (const off of brands) { try { off(); } catch {} } } : undefined;
        });
        ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
          name: 'conversation.input.dock', id: PLUGIN_ID + '-soul', order: -10,
        }, SoulDock));
        G.api = {
          store, setUi, insertSkill, runSkill, sendSoul, soulFromText, loadCatalog, openSkill, measureGutter,
          inputSessions: () => [...inputRegistry.keys()],
          binding: () => bindingOf(store.get().sessionId),
          primitives: () => (P ? ['Button', 'Tooltip', 'Pill', 'Input', 'SegmentedTabs', 'StateDot'].filter(has) : []),
          m5: {
            openLibrary, closeLibrary, pickWorldbookRoot, openWorldbookRoot, readWorldbookFile,
            refreshWbVersions, saveWorldbook, updateWbEntry, setWb, setLib,
            pickMvuRoot, openMvuRoot, inspectMvuFile, setMvu,
            loadWorkspace, openProjectManager, closeProjectManager, pickProjectRoot, addProject,
            switchProject, deleteProject, switchVersion, switchLatest, refreshLatest, toggleAutoLatest,
            selectCard, useProjectRootForWorldbook, useProjectRootForMvu, setWs,
            inspectCardDetail,
          },
        };
      }

      module.exports = { name: 'tavernweave-ui', inject, apply };
      return module.exports;
    };
  }

  try {
    window.__ModuleLoader__.load({ id: PLUGIN_ID, factory: makeFactory() });
    G.loaded = true;
  } catch (error) {
    fail('load', error);
  }
})();
