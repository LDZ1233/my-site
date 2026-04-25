import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function safeClassName(value, fallback = "h-5 w-5") {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function Icon({ name, className = "h-5 w-5" }) {
  const svgClassName = safeClassName(className);
  const common = {
    className: svgClassName,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    ArrowRight: (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    ),
    ArrowLeft: (
      <svg {...common}>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
    ),
    RotateCcw: (
      <svg {...common}>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 3v6h6" />
      </svg>
    ),
    Share2: (
      <svg {...common}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4" />
        <path d="m15.4 6.5-6.8 4" />
      </svg>
    ),
    Sparkles: (
      <svg {...common}>
        <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
        <path d="M19 15v4" />
        <path d="M21 17h-4" />
        <path d="M5 3v4" />
        <path d="M7 5H3" />
      </svg>
    ),
    ShieldCheck: (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    ),
    Brain: (
      <svg {...common}>
        <path d="M8 6.5A3 3 0 0 1 11 3a3 3 0 0 1 3 3" />
        <path d="M14 6a3 3 0 0 1 3 3 3 3 0 0 1-1 2.2" />
        <path d="M8 6.5A3.5 3.5 0 0 0 5 10a3.5 3.5 0 0 0 1.2 2.6" />
        <path d="M6.2 12.6A4 4 0 0 0 9 20h1" />
        <path d="M15.8 12.6A4 4 0 0 1 13 20h-1" />
        <path d="M12 6v14" />
      </svg>
    ),
    Heart: (
      <svg {...common}>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    ),
    Activity: (
      <svg {...common}>
        <path d="M22 12h-4l-3 8-6-16-3 8H2" />
      </svg>
    ),
    Eye: (
      <svg {...common}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    Copy: (
      <svg {...common}>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
    Check: (
      <svg {...common}>
        <path d="m20 6-11 11-5-5" />
      </svg>
    ),
    Info: (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  };

  return icons[name] || icons.Sparkles;
}

const AXES = {
  perception: {
    left: "S",
    right: "F",
    leftName: "故事导向",
    rightName: "事实导向",
    title: "事实感知",
    description: "你更容易相信第一反应，还是能区分事实与解释。",
    leftDesc: "更容易把模糊信号串成一个解释，并很快相信它。",
    rightDesc: "更容易先看证据，把事实、猜测和情绪分开。",
  },
  feedback: {
    left: "N",
    right: "B",
    leftName: "负反馈放大",
    rightName: "平衡反馈",
    title: "反馈权重",
    description: "你会不会让一句否定盖过许多肯定。",
    leftDesc: "更容易让批评、失败或不认可盖过其他证据。",
    rightDesc: "更容易同时看见问题、肯定和可调整的部分。",
  },
  action: {
    left: "W",
    right: "A",
    leftName: "回避冻结",
    rightName: "行动校准",
    title: "行动反应",
    description: "情绪来临时，你更倾向停住，还是做一个小行动。",
    leftDesc: "压力或不确定感上来时，更容易拖延、停住或躲开。",
    rightDesc: "即使状态不完美，也更能用小动作把自己带回现实。",
  },
  self: {
    left: "J",
    right: "C",
    leftName: "审判修正",
    rightName: "慈悲修正",
    title: "自我态度",
    description: "你反思自己时，是更容易审判自己，还是理解中修正。",
    leftDesc: "更容易把反思变成自我批评，甚至把错误等同于自己不行。",
    rightDesc: "更容易承认问题，同时保留对自己的理解和耐心。",
  },
};

const questions = [
  { id: 1, axis: "perception", reverse: false, text: "当别人语气冷淡时，我会立刻觉得自己哪里做错了。" },
  { id: 2, axis: "perception", reverse: true, text: "我能把“发生了什么”和“我以为它意味着什么”分开。", example: "对方晚回消息，不等于讨厌我" },
  { id: 3, axis: "perception", reverse: false, text: "我经常在证据不足时，就判断别人对我的态度。" },
  { id: 4, axis: "perception", reverse: false, text: "情绪强烈时，我很难分清现实和自己的想象。", example: "他没回消息，我会脑补出很多事" },
  { id: 5, axis: "perception", reverse: true, text: "我会主动寻找其他解释，而不是只相信第一反应。" },
  { id: 6, axis: "perception", reverse: false, text: "一个模糊的表情或停顿，会让我忍不住反复琢磨。" },
  { id: 7, axis: "perception", reverse: true, text: "在下结论前，我通常会先问：我有什么证据？", example: "他是真的不高兴，还是我在猜" },
  { id: 8, axis: "perception", reverse: false, text: "我容易把小细节串成一个对自己不利的故事。" },
  { id: 9, axis: "perception", reverse: true, text: "即使我很不安，也能提醒自己：感受不等于事实。", example: "我很慌，不代表事情真的糟了" },
  { id: 10, axis: "perception", reverse: false, text: "我常常事后发现，自己一开始把事情想得太严重了。" },

  { id: 11, axis: "feedback", reverse: false, text: "一次失败会让我否定自己很久。" },
  { id: 12, axis: "feedback", reverse: false, text: "别人的肯定对我影响不大，但批评会影响很久。" },
  { id: 13, axis: "feedback", reverse: true, text: "我能把一次批评看作局部反馈，而不是整体否定。", example: "这次没做好，不等于我这个人不行" },
  { id: 14, axis: "feedback", reverse: false, text: "当事情出错时，我会自动放大后果。" },
  { id: 15, axis: "feedback", reverse: false, text: "我容易忽略自己已经做得不错的地方。" },
  { id: 16, axis: "feedback", reverse: true, text: "我能同时接收正面评价和负面建议。" },
  { id: 17, axis: "feedback", reverse: false, text: "只要有人不认可我，我就很难记住那些认可我的人。" },
  { id: 18, axis: "feedback", reverse: true, text: "我能把错误当成信息，而不是判决。", example: "这是提醒我调整，不是在给我定性" },
  { id: 19, axis: "feedback", reverse: false, text: "我会反复回想自己说错的话或做错的事。" },
  { id: 20, axis: "feedback", reverse: true, text: "我相信一个人的价值不应该由一次表现决定。" },

  { id: 21, axis: "action", reverse: false, text: "情绪低落时，我会完全停下来，什么都不想做。" },
  { id: 22, axis: "action", reverse: true, text: "即使没有动力，我也能做一个很小的行动。" },
  { id: 23, axis: "action", reverse: false, text: "我经常因为害怕做不好而迟迟不开始。" },
  { id: 24, axis: "action", reverse: true, text: "我会通过具体行动来验证自己的担心是否真实。", example: "直接去问，而不是一直猜" },
  { id: 25, axis: "action", reverse: false, text: "遇到不确定性时，我倾向于先逃避。" },
  { id: 26, axis: "action", reverse: true, text: "当我被触发时，我可以先暂停，再选择一个较稳妥的回应。", example: "先缓一下，再回消息" },
  { id: 27, axis: "action", reverse: false, text: "压力一大，我就容易拖延、断联或躲起来。" },
  { id: 28, axis: "action", reverse: true, text: "我知道如何把大问题拆成下一步小行动。", example: "先发消息、先写标题" },
  { id: 29, axis: "action", reverse: false, text: "我常常等到状态完美了才愿意开始。" },
  { id: 30, axis: "action", reverse: true, text: "我能允许自己带着不确定感继续行动。", example: "没完全准备好，也先做一点" },

  { id: 31, axis: "self", reverse: false, text: "我反思自己时，经常变成攻击自己。" },
  { id: 32, axis: "self", reverse: true, text: "我能承认自己的问题，同时不否定自己这个人。", example: "这件事没做好，不等于我很差" },
  { id: 33, axis: "self", reverse: false, text: "我会把错误理解成“我这个人不行”。" },
  { id: 34, axis: "self", reverse: true, text: "我允许自己有反复，而不是要求一次变好。", example: "今天没做到，不代表前面都白费" },
  { id: 35, axis: "self", reverse: false, text: "我越想改变自己，越容易对自己失望。" },
  { id: 36, axis: "self", reverse: true, text: "我能用温和但诚实的方式看待自己的问题。", example: "承认我有问题，但不骂自己" },
  { id: 37, axis: "self", reverse: false, text: "一旦发现自己有缺点，我会觉得很羞耻。" },
  { id: 38, axis: "self", reverse: true, text: "我相信理解自己和要求自己可以同时存在。", example: "能体谅自己，也能继续改" },
  { id: 39, axis: "self", reverse: false, text: "我常常用很苛刻的语言和自己说话。" },
  { id: 40, axis: "self", reverse: true, text: "我能把成长看成练习，而不是考试。", example: "做得不好也只是练习的一部分" },
];

const resultTypes = {
  SNWJ: {
    name: "内耗叙事者",
    tagline: "你不是没有觉察力，而是觉察力太快进入了自我审判模式。",
    summary: "你对模糊信号很敏感，容易迅速生成负面解释，并把一次反馈扩大成对自我的整体评价。真正消耗你的，往往不是事件本身，而是事件之后不断叠加的故事、自责和停滞。",
    strengths: ["感受力细腻，能捕捉到细微信号", "有强烈的反思能力", "很在意关系与责任"],
    blindspots: ["容易把第一反应当作事实", "容易用自责获得短暂的控制感", "情绪越强，行动越容易冻结"],
    practice: "事实-解释分离法：写下事实、我的解释、另一种可能。目标不是强迫自己乐观，而是让大脑多一个选择。",
  },
  SNWC: {
    name: "敏感守望者",
    tagline: "你很会感受，也愿意理解自己，但仍容易被负面线索牵动。",
    summary: "你通常不是苛刻的人，甚至很想温柔地对待自己。但当关系、评价或失败出现模糊信号时，你的大脑会快速进入警觉状态，放大负反馈并推迟行动。",
    strengths: ["有同理心", "愿意理解自己的来处", "对风险和关系变化敏锐"],
    blindspots: ["容易在行动前消耗太多心理能量", "容易把不确定当成危险", "对负反馈的权重偏高"],
    practice: "三分钟小行动：当你想逃避时，只做一件小到不能再小的事，比如打开文档、发一句确认、走出房间。",
  },
  SNAJ: {
    name: "高压突围者",
    tagline: "你会行动，但常常是用压力和自责把自己往前推。",
    summary: "你不容易完全停下，甚至能在焦虑、自责和不安中继续推进。但你的行动常常来自紧绷，而不是稳定。你可能一边做事，一边在心里不断审判自己。",
    strengths: ["行动力强", "不轻易放弃", "能把压力转化为推进力"],
    blindspots: ["容易过度消耗", "容易把行动变成自我惩罚", "对模糊反馈过度解释"],
    practice: "行动前加一句温和指令：我现在不是为了证明自己没问题，而是为了完成下一步。",
  },
  SNAC: {
    name: "焦虑行动者",
    tagline: "你会被信号牵动，但也能通过行动慢慢找回现实感。",
    summary: "你容易对负面信息敏感，也容易先往坏处想；但你并不会一直停在原地。你最有效的修复方式，通常不是继续分析，而是做一点可验证的小行动。",
    strengths: ["行动恢复能力不错", "愿意尝试修正", "能在不安中继续前进"],
    blindspots: ["行动前容易脑补过多", "容易把别人的反应解读为评价", "可能忽视自己的正向证据"],
    practice: "证据回收练习：每天记录 3 个“事情没有我想得那么糟”的证据，训练大脑重新估计风险。",
  },
  SBWJ: {
    name: "迟疑审判者",
    tagline: "你能接收一部分现实反馈，却容易在行动和自我评价上卡住。",
    summary: "你并不总是放大负反馈，也能看到事情的多面性。但当需要开始、表达或冒险时，你可能因为害怕做不好而停住，并用自我批评解释这种停滞。",
    strengths: ["相对能接收多元反馈", "做事前会思考后果", "有责任心"],
    blindspots: ["容易把迟疑解释成无能", "常常等待状态变好", "自我要求偏硬"],
    practice: "低标准启动法：把任务缩小到 5 分钟内能完成的版本，并允许第一版很粗糙。",
  },
  SBWC: {
    name: "温和延迟者",
    tagline: "你对自己并不残酷，但容易在不确定中慢慢停住。",
    summary: "你通常能比较温和地看待自己，也不是特别容易被单一负反馈击垮。但当任务复杂、关系模糊或风险不明时，你容易延迟行动，让问题悬在心里。",
    strengths: ["自我态度较温和", "不容易极端化自己", "能照顾他人的感受"],
    blindspots: ["容易拖延重要但不紧急的事", "容易用等待代替选择", "可能低估小行动的力量"],
    practice: "下一步清单：任何问题只写下一步，不写完整计划。比如“预约”“发一句话”“整理三行”。",
  },
  SBAJ: {
    name: "高压推进者",
    tagline: "你能行动，也能接收反馈，但常常用苛责维持效率。",
    summary: "你有不错的执行力，也能从反馈中修正自己。但你的内在驱动力可能过于严苛：一旦不够好，你会立刻进入自我审判。你不是不强，而是太少给自己恢复空间。",
    strengths: ["执行力强", "反馈吸收能力不错", "目标感清晰"],
    blindspots: ["容易把休息看成退步", "容易把失误和价值绑定", "长期容易过载"],
    practice: "复盘三分法：每次复盘必须写“做得好的、要调整的、下一步”，缺一不可。",
  },
  SBAC: {
    name: "稳步修正者",
    tagline: "你有行动力，也能较平衡地对待自己，是很适合持续成长的类型。",
    summary: "你能在反馈中学习，不太容易被单一评价击垮，也能用相对温和的方式修正自己。你的成长关键不是更用力，而是更持续、更诚实地观察。",
    strengths: ["稳定", "能行动", "自我修复能力较好"],
    blindspots: ["可能偶尔忽略深层情绪", "容易太快进入解决问题模式", "需要保留感受空间"],
    practice: "行动后感受记录：完成事情后，写一句“我真正感受到的是……”，避免只优化效率。",
  },
  FNWJ: {
    name: "清醒困守者",
    tagline: "你看得很清楚，却容易被负反馈和自我审判困住。",
    summary: "你有较好的事实感，知道很多担心不一定等于现实。但负反馈仍然会重重压在你身上，使你在行动前反复评估、怀疑和责备自己。",
    strengths: ["现实检验能力不错", "能区分事实和想法", "对问题有洞察"],
    blindspots: ["知道不等于做到", "负反馈仍然容易压倒正反馈", "容易用理性包装自责"],
    practice: "从理解到动作：每次想明白后，必须接一个 10 分钟内的小动作，让洞察落地。",
  },
  FNWC: {
    name: "敏感观察者",
    tagline: "你能分清事实，但仍会被负反馈拉住脚步。",
    summary: "你不是容易乱想的人，通常能意识到自己的解释不一定是真的。但你对失败、否定和风险的权重较高，因此容易在行动上变慢。",
    strengths: ["观察准确", "自我理解能力强", "温和且谨慎"],
    blindspots: ["过度谨慎", "正反馈利用率不足", "可能高估失败成本"],
    practice: "正反馈存档：专门保存别人认可你、事情顺利、你完成了某事的证据，用来平衡大脑的负面偏向。",
  },
  FNAJ: {
    name: "理性冲锋者",
    tagline: "你能看清现实，也愿意行动，但容易带着自我压力冲锋。",
    summary: "你具备现实感和行动力，遇到问题会推进解决。但你对负面结果非常敏感，可能因此把自己推得太紧，用不断行动来避免失败感。",
    strengths: ["现实感强", "行动力强", "抗压推进能力好"],
    blindspots: ["容易紧绷", "可能用忙碌逃避脆弱", "自我语言偏苛刻"],
    practice: "行动降压句：这只是一次尝试，不是对我价值的最终评定。",
  },
  FNAC: {
    name: "现实修复者",
    tagline: "你能看清事实，也能带着敏感继续行动。",
    summary: "你对负反馈仍然敏感，但不太容易完全被它吞没。你能回到事实，也能用行动修复状态。你需要练习的，是让正反馈真正进入你的系统。",
    strengths: ["清醒", "能修复", "愿意成长"],
    blindspots: ["可能低估自己的稳定性", "容易轻描淡写自己的进步", "对负面信号仍偏敏感"],
    practice: "进步量化法：不要只记录问题，也记录今天比昨天多做了什么、少逃避了什么。",
  },
  FBWJ: {
    name: "理性迟行者",
    tagline: "你判断相对清醒，却容易因为自我要求而迟迟不动。",
    summary: "你能较客观地看待反馈，不会轻易被负面信息击穿。但当任务涉及评价、暴露或不确定结果时，你可能因为想做好而启动困难，并对这种困难感到自责。",
    strengths: ["判断稳", "反馈吸收平衡", "做事有标准"],
    blindspots: ["完美主义式拖延", "把开始看得太重", "容易责备自己的慢"],
    practice: "粗糙第一版：任何重要事情先做 60 分版本，不追求一次到位。",
  },
  FBWC: {
    name: "温和分析者",
    tagline: "你很清醒，也不太苛责自己，但行动启动需要更多结构。",
    summary: "你能分清事实和解释，也能较平衡地看待反馈。你的主要挑战可能不是内耗，而是把理解转成行动。你需要外部结构、节奏和小目标。",
    strengths: ["清醒", "温和", "能接收多方信息"],
    blindspots: ["容易停在分析", "行动节奏不够稳定", "可能缺少外部约束"],
    practice: "结构化承诺：给下一步行动设置时间、地点、最小标准和一个可见记录。",
  },
  FBAJ: {
    name: "纪律校准者",
    tagline: "你能看清事实、吸收反馈并行动，但需要减少内在审判。",
    summary: "你有很强的自我管理能力，也能从反馈中学习。你的风险是把成长变成考试，把修正变成自责。你需要的不是更努力，而是更可持续。",
    strengths: ["自律", "执行力强", "现实感好"],
    blindspots: ["容易过度要求", "不太允许脆弱", "可能把价值绑定表现"],
    practice: "可持续复盘：每次调整只选一个重点，不同时修正所有问题。",
  },
  FBAC: {
    name: "清醒校准者",
    tagline: "你能从经验中学习，也能用相对稳定的方式修正自己。",
    summary: "你比较能区分事实和解释，也能平衡正负反馈。情绪出现时，你通常能做一个小行动，而不是完全被拖走。你的成长方向是保持开放，而不是追求完美稳定。",
    strengths: ["现实感强", "行动稳定", "自我态度成熟"],
    blindspots: ["可能对自己的成熟有压力", "偶尔会忽略休息和感受", "需要避免把自己变成工具"],
    practice: "开放式成长：每周问自己一次，我最近不是要改掉什么，而是想更理解什么？",
  },
};

const axisIcons = {
  perception: "Eye",
  feedback: "Brain",
  action: "Activity",
  self: "Heart",
};

const scale = [
  { value: 1, label: "非常不同意" },
  { value: 2, label: "比较不同意" },
  { value: 3, label: "不确定" },
  { value: 4, label: "比较同意" },
  { value: 5, label: "非常同意" },
];

const resultSignalThemes = {
  relationshipAlarm: {
    title: "关系一冷，你会先怪自己",
    painText: "当关系信号变冷、变模糊时，你心里很容易先冒出“是不是我哪里做错了”。",
    comfortText: "这不代表你太脆弱，更像是你很在意关系，所以冷淡感会先扎到你。",
    protectionText: "为了快点结束这种悬着的感觉，你会先脑补、先揽责，让自己像是先拿到了一个答案。",
    reflection: "这一次我真的看到了证据，还是只是被冷淡感刺到后，先替对方下了结论？",
    followUp: "如果我先不解释对方，只保留能被录像机拍到的事实，会剩下什么？",
    step: "先写一句事实，再写一句我现在的猜测，把两者分开。",
    resourceText: "你其实已经在慢慢练习，不让别人的反应直接定义你的价值。",
  },
  factBoundary: {
    title: "情绪一上来，事实和想象会混在一起",
    painText: "一旦情绪上来，你的大脑很容易把感受当成现实，脑内那版故事会跑得比证据更快。",
    comfortText: "这不是你不理性，而是你的警觉系统太想尽快把空白补齐。",
    protectionText: "你会用想象去填满不确定，好让自己早点知道“到底发生了什么”。",
    reflection: "我现在最确定的，到底是事实，还是我脑子里那版解释？",
    followUp: "如果把解释先拿掉，只留下真正发生过的事，我还会得出一样的结论吗？",
    step: "把这件事拆成三句：事实是什么、我的解释是什么、另一种可能是什么。",
    resourceText: "你已经有能力在不安里提醒自己：感受不等于事实。",
  },
  feedbackIdentity: {
    title: "一被指出问题，就容易上升成否定自己",
    painText: "当你出错、被批评，或做得不够好时，很容易很快滑到“是不是我这个人不行”。",
    comfortText: "这常常不是你真的很差，而是你太想别再出错，所以会先用更重的话压自己。",
    protectionText: "你会把标准提得更高、把话说得更重，想靠自我要求挡住下一次失望。",
    reflection: "这次被指出的，是一件具体的事，还是我把它扩大成了对整个人的判决？",
    followUp: "如果别人犯了同样的错，我也会这样否定他吗？",
    step: "把“我不行”改写成“这次具体哪一步没做好，我下一次怎么调”。",
    resourceText: "你也已经有一部分能力，能把错误当成信息，而不是当成对自己的判决。",
  },
  feedbackWeight: {
    title: "负反馈会压过正反馈",
    painText: "你的大脑更容易先记住否定、风险和做得不够的地方，好的部分会被挤到后面。",
    comfortText: "这不是你故意忽视自己，而是你长期更习惯先盯住危险和失误。",
    protectionText: "你会反复回想失误，试着靠更警惕来避免下一次再受伤。",
    reflection: "我现在是不是只盯着最糟的一部分，漏掉了已经存在的正向证据？",
    followUp: "如果要更公平地看这件事，支持我和不支持我的证据各有哪些？",
    step: "补写 3 条没有那么糟的证据，把已经做到的也算进去。",
    resourceText: "你并不是看不到好的部分，只是需要更主动地把这些证据留下来。",
  },
  shutdownAvoidance: {
    title: "压力一上来，你更容易先停住",
    painText: "一碰到压力、不确定或怕做不好的事，你更容易先停住、拖延，或者暂时躲开。",
    comfortText: "这不是你懒，而是你的系统先在替你降压，想暂时避开失败和暴露感。",
    protectionText: "先不动、先拖一下，会让你短暂轻松一点，但也会让卡住的感觉越积越重。",
    reflection: "我现在是真的做不到，还是只是太想一次做好，所以不敢开始？",
    followUp: "如果把任务缩成 5 分钟版本，我还会这么抗拒吗？",
    step: "只做一个最小动作，不求完成，只求启动，比如打开文档、发一句话、列三行。",
    resourceText: "你其实不是完全做不到，只是需要把任务缩小到现在接得住的尺寸。",
  },
  smallActionRepair: {
    title: "把不安变成小动作，对你很关键",
    painText: "当你没有把担心变成一个能验证的动作时，脑内推演会越来越大，现实感反而会更少。",
    comfortText: "你不是不想解决，而是很怕一动就暴露、出错，或看见不想面对的答案。",
    protectionText: "你会继续想、继续等，想先把一切想清楚，再决定要不要行动。",
    reflection: "这件事如果不用等到完全想清楚，我现在能先验证什么？",
    followUp: "有没有一个动作，能让我少猜一点、多看到一点现实？",
    step: "先做一个 3 分钟动作：发一句消息、问一个问题、写一个标题、开一个文件。",
    resourceText: "你已经具备把不安转成小动作的能力，这会是你很重要的修复入口。",
  },
  harshSelfTalk: {
    title: "你对自己说话，常常太重了",
    painText: "一出问题，你很容易先把刀口朝向自己，用很重的话来解释自己。",
    comfortText: "这不是因为你不想爱自己，而是你太习惯把严厉当成推动自己的方法。",
    protectionText: "你会先批评、先羞辱自己，想靠这种压力逼自己变好、别再犯错。",
    reflection: "如果现在是我最在乎的人犯了同样的错，我也会这样对他说话吗？",
    followUp: "我现在更需要的是继续骂自己，还是把问题说清楚？",
    step: "把“我就是不行”改成“我卡在第几步、我下一步可以怎么做”。",
    resourceText: "你已经开始知道，诚实地看见问题和羞辱自己，其实不是一回事。",
  },
  compassionateRepair: {
    title: "你最难的，是在不完美里继续修正自己",
    painText: "你并不是看不见自己的问题，真正难的是允许自己在没有立刻变好的情况下继续练习。",
    comfortText: "这往往不是你不上进，而是你太怕反复，太想赶快证明自己已经变好了。",
    protectionText: "你会用更高标准逼自己，想尽快结束这种不舒服和不确定。",
    reflection: "我现在是在认真修正，还是因为受不了不完美，所以急着证明自己？",
    followUp: "如果成长是练习，不是考试，我现在最该练的是哪一步？",
    step: "只选一个调整点，不同时修所有地方，让改变留得住。",
    resourceText: "你已经有一部分能力，能在要求自己时也给自己留空间。",
  },
};

const questionThemeMap = {
  1: "relationshipAlarm",
  2: "factBoundary",
  3: "relationshipAlarm",
  4: "factBoundary",
  5: "factBoundary",
  6: "relationshipAlarm",
  7: "factBoundary",
  8: "relationshipAlarm",
  9: "factBoundary",
  10: "factBoundary",
  11: "feedbackIdentity",
  12: "feedbackWeight",
  13: "feedbackIdentity",
  14: "feedbackWeight",
  15: "feedbackWeight",
  16: "feedbackWeight",
  17: "feedbackWeight",
  18: "feedbackIdentity",
  19: "feedbackWeight",
  20: "feedbackIdentity",
  21: "shutdownAvoidance",
  22: "smallActionRepair",
  23: "shutdownAvoidance",
  24: "smallActionRepair",
  25: "shutdownAvoidance",
  26: "smallActionRepair",
  27: "shutdownAvoidance",
  28: "smallActionRepair",
  29: "shutdownAvoidance",
  30: "smallActionRepair",
  31: "harshSelfTalk",
  32: "compassionateRepair",
  33: "harshSelfTalk",
  34: "compassionateRepair",
  35: "harshSelfTalk",
  36: "compassionateRepair",
  37: "harshSelfTalk",
  38: "compassionateRepair",
  39: "harshSelfTalk",
  40: "compassionateRepair",
};

const questionPurposes = {
  1: "这题用来观察：当外界反馈变得冷淡或模糊时，你是否会立刻把原因归到自己身上。它测的是关系信号中的自责倾向。",
  2: "这题用来观察：你能不能把客观事件和自己的解释分开。它测的是事实-解释分离能力。",
  3: "这题用来观察：在证据不足时，你是否会提前判断他人的态度。它测的是模糊关系中的推断速度。",
  4: "这题用来观察：情绪强烈时，你是否仍能保留现实检验能力。它测的是情绪与事实之间的边界感。",
  5: "这题用来观察：你是否能主动给一件事寻找第二种解释。它测的是认知弹性和解释校准能力。",
  6: "这题用来观察：你对表情、停顿、语气等微弱信号有多敏感。它测的是细节捕捉与反复琢磨倾向。",
  7: "这题用来观察：你在下结论前是否会主动检查证据。它测的是推理前的暂停能力。",
  8: "这题用来观察：你是否容易把零散细节连成一个对自己不利的故事。它测的是负向叙事生成倾向。",
  9: "这题用来观察：即使感到不安，你是否能提醒自己感受并不等于事实。它测的是情绪去融合能力。",
  10: "这题用来观察：你事后是否常发现自己高估了事情的严重性。它测的是灾难化解释倾向。",
  11: "这题用来观察：一次失败会不会长时间影响你的整体自我评价。它测的是失败后的自我否定强度。",
  12: "这题用来观察：你的大脑是否更容易保留批评，而不是肯定。它测的是正负反馈权重是否失衡。",
  13: "这题用来观察：你能否把批评限制在具体事情上，而不是扩大成对整个人的否定。它测的是反馈边界感。",
  14: "这题用来观察：事情出错时，你是否会自动放大后果。它测的是负面结果的放大倾向。",
  15: "这题用来观察：你是否会忽略已经做得不错的部分。它测的是正向证据吸收能力。",
  16: "这题用来观察：你是否能同时接住认可和建议。它测的是综合反馈的能力，而不是只听见其中一端。",
  17: "这题用来观察：一个人的不认可是否会盖过其他人的认可。它测的是少数负面评价的支配力。",
  18: "这题用来观察：你能否把错误当成信息，而不是价值判决。它测的是学习型反馈心态。",
  19: "这题用来观察：你是否会反复回放失误细节。它测的是事后反刍倾向。",
  20: "这题用来观察：你是否能把一次表现和自我价值分开。它测的是稳定自我价值感。",
  21: "这题用来观察：情绪低落时，你的行动系统会不会进入停摆。它测的是低情绪下的冻结倾向。",
  22: "这题用来观察：没有动力时，你是否仍能启动一个很小的动作。它测的是低能量行动能力。",
  23: "这题用来观察：害怕做不好是否会让你迟迟不开始。它测的是失败预期导致的启动困难。",
  24: "这题用来观察：你是否会用行动来验证担心，而不是只在脑中推演。它测的是行为实验能力。",
  25: "这题用来观察：遇到不确定性时，你是否会先退开。它测的是不确定情境下的回避倾向。",
  26: "这题用来观察：被触发时，你能否在反应前插入一个暂停。它测的是冲动与选择之间的缓冲能力。",
  27: "这题用来观察：压力升高时，你是否会拖延、断联或躲起来。它测的是压力下的撤退模式。",
  28: "这题用来观察：你能否把复杂问题拆成下一步。它测的是把焦虑转成行动结构的能力。",
  29: "这题用来观察：你是否需要状态足够好才愿意开始。它测的是完美状态依赖。",
  30: "这题用来观察：你能否带着不确定继续做事。它测的是不确定耐受与行动稳定性。",
  31: "这题用来观察：你的反思是否容易变成自我攻击。它测的是自我审视中的攻击性语言。",
  32: "这题用来观察：你能否承认问题，同时不否定整个人。它测的是自我接纳与修正能否并存。",
  33: "这题用来观察：你是否会把错误上升为人格判断。它测的是错误与身份绑定的程度。",
  34: "这题用来观察：你是否允许自己有反复。它测的是成长过程中的耐心与容错。",
  35: "这题用来观察：想改变自己时，你是否反而更容易对自己失望。它测的是改变压力下的自我挫败。",
  36: "这题用来观察：你能否既诚实又温和地看见自己的问题。它测的是非羞辱式反思能力。",
  37: "这题用来观察：发现缺点时，你是否会迅速进入羞耻感。它测的是缺点暴露后的自我价值波动。",
  38: "这题用来观察：你是否相信理解自己和要求自己可以同时存在。它测的是慈悲与责任的整合能力。",
  39: "这题用来观察：你平时和自己说话是否苛刻。它测的是内在语言的严厉程度。",
  40: "这题用来观察：你是否把成长看成持续练习，而不是一次考试。它测的是长期主义自我修正心态。",
};

function getChoiceDirection(question, value) {
  if (value === 3) return "middle";
  const agrees = value > 3;
  const pointsRight = question.reverse ? agrees : !agrees;
  return pointsRight ? "right" : "left";
}

function getChoiceIntensity(value) {
  if (value === 1 || value === 5) return "强烈";
  if (value === 2 || value === 4) return "轻度";
  return "情境型";
}

function getChoiceReading(question, value) {
  const direction = getChoiceDirection(question, value);
  const intensity = getChoiceIntensity(value);
  const plainMessages = {
    perception: {
      left: "你更容易先按感觉下判断，证据通常会慢一步。",
      right: "你更像会先分开事实和猜测，再决定这件事到底是什么意思。",
      middle: "你会看当时情境来判断，不会总固定在一种理解方式里。",
    },
    feedback: {
      left: "你更容易先被负面的那部分卡住，好的部分会先退到后面。",
      right: "你更像能把反馈当成信息看，不会一下子就上升成否定自己。",
      middle: "你会看当时的人和状态，收到反馈时不一定总往一个方向走。",
    },
    action: {
      left: "你更容易先停一下或拖一下，想等自己更有把握再动。",
      right: "你更像会先做一个小动作，让自己别一直卡在原地。",
      middle: "你会看当时状态来决定，有时先缓一下，有时会先做一点。",
    },
    self: {
      left: "你更容易先批评自己，理解自己通常会排在后面。",
      right: "你更像会先理解自己，再慢慢调整，而不是一上来就责怪自己。",
      middle: "你会在要求自己和体谅自己之间来回切换，看当下状态而定。",
    },
  };

  const prefixMap = {
    strong: "如果你选这个，通常说明",
    light: "这个选择多半表示",
    middle: "",
  };

  const tone = value === 1 || value === 5 ? "strong" : value === 3 ? "middle" : "light";

  if (direction === "middle") {
    return {
      title: "情境型反应",
      body: plainMessages[question.axis].middle,
    };
  }

  const message = plainMessages[question.axis][direction];
  const prefix = prefixMap[tone];

  return {
    title: intensity,
    body: prefix ? `${prefix}${message}` : message,
  };
}

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function formatAiReading(text) {
  if (!text) return "";
  
  return text
    // 去掉 ---
    .replace(/^---+$/gm, "")
    .replace(/^---+$/gm, "")
    // 情绪小记：加粗
    .replace(/\*\*情绪小记：\*\*/g, "**情绪小记：**")
    // 适合你的 3 个小练习 - 作为段落标题（加大字号加粗）
    .replace(/^###\s*适合你的\s*3\s*个\s*小练习$/gm, "## 适合你的 3 个小练习")
    .trim();
}

function getAxisScores(answers) {
  const raw = {
    perception: 0,
    feedback: 0,
    action: 0,
    self: 0,
  };

  questions.forEach((q) => {
    const answer = Number(answers[q.id]);
    if (!Number.isFinite(answer) || answer < 1 || answer > 5) return;
    const normalized = q.reverse ? answer : 6 - answer;
    raw[q.axis] += normalized;
  });

  const dimensions = Object.fromEntries(
    Object.entries(raw).map(([axis, score]) => {
      const percent = Math.round(((score - 10) / 40) * 100);
      return [axis, Math.max(0, Math.min(100, percent))];
    })
  );

  const code = [
    dimensions.perception >= 50 ? "F" : "S",
    dimensions.feedback >= 50 ? "B" : "N",
    dimensions.action >= 50 ? "A" : "W",
    dimensions.self >= 50 ? "C" : "J",
  ].join("");

  return { raw, dimensions, code };
}

function getQuestionDisplayText(question) {
  return question.example ? `${question.text} ${question.example}` : question.text;
}

function compareQuestionSignals(a, b) {
  const distanceDiff = b.distance - a.distance;
  if (distanceDiff !== 0) return distanceDiff;
  return a.question.id - b.question.id;
}

function getResponseInsights(answers) {
  const themeStats = Object.fromEntries(
    Object.entries(resultSignalThemes).map(([key, meta]) => [
      key,
      {
        key,
        ...meta,
        painScore: 0,
        resourceScore: 0,
        signals: [],
      },
    ])
  );

  const questionSignals = [];

  questions.forEach((question) => {
    const answer = Number(answers[question.id]);
    if (!Number.isFinite(answer) || answer < 1 || answer > 5) return;

    const themeKey = questionThemeMap[question.id];
    if (!themeKey || !themeStats[themeKey]) return;

    const signal = {
      question,
      answer,
      answerLabel: scale.find((item) => item.value === answer)?.label || `${answer}`,
      direction: getChoiceDirection(question, answer),
      distance: Math.abs(answer - 3),
      themeKey,
      reading: getChoiceReading(question, answer),
    };

    questionSignals.push(signal);
    themeStats[themeKey].signals.push(signal);

    if (signal.direction === "left") themeStats[themeKey].painScore += signal.distance;
    if (signal.direction === "right") themeStats[themeKey].resourceScore += signal.distance;
  });

  const topTriggers = Object.values(themeStats)
    .map((theme) => ({
      ...theme,
      strongestSignal: [...theme.signals].filter((signal) => signal.direction === "left" && signal.distance > 0).sort(compareQuestionSignals)[0] || null,
    }))
    .filter((theme) => theme.painScore > 0 && theme.strongestSignal)
    .sort((a, b) => {
      const scoreDiff = b.painScore - a.painScore;
      if (scoreDiff !== 0) return scoreDiff;
      return compareQuestionSignals(a.strongestSignal, b.strongestSignal);
    })
    .slice(0, 2);

  const topResources = Object.values(themeStats)
    .map((theme) => ({
      ...theme,
      strongestSignal: [...theme.signals].filter((signal) => signal.direction === "right" && signal.distance > 0).sort(compareQuestionSignals)[0] || null,
    }))
    .filter((theme) => theme.resourceScore > 0 && theme.strongestSignal)
    .sort((a, b) => {
      const scoreDiff = b.resourceScore - a.resourceScore;
      if (scoreDiff !== 0) return scoreDiff;
      return compareQuestionSignals(a.strongestSignal, b.strongestSignal);
    })
    .slice(0, 2);

  const dominantPain = [...questionSignals].filter((signal) => signal.direction === "left" && signal.distance > 0).sort(compareQuestionSignals)[0] || null;
  const dominantResource = [...questionSignals].filter((signal) => signal.direction === "right" && signal.distance > 0).sort(compareQuestionSignals)[0] || null;

  return {
    topTriggers,
    topResources,
    dominantPain,
    dominantResource,
  };
}

function getAxisLabel(axis, value) {
  const meta = AXES[axis];
  return value >= 50 ? meta.rightName : meta.leftName;
}

function isAxisBorderline(value) {
  return value >= 45 && value <= 55;
}

function getAxisDisplayLabel(axis, value) {
  return isAxisBorderline(value) ? "情境型" : getAxisLabel(axis, value);
}

function getBorderlineAxes(dimensions) {
  return Object.entries(dimensions).filter(([, value]) => isAxisBorderline(value));
}

function getAllAnswers(value) {
  return Object.fromEntries(questions.map((q) => [q.id, value]));
}

function runSelfTests() {
  const tests = [
    {
      name: "all neutral answers produce midpoint dimensions and FBAC by threshold",
      answers: getAllAnswers(3),
      expectedCode: "FBAC",
      expectedDimension: 50,
    },
    {
      name: "all strong agreement answers produce correct reverse-aware scoring",
      answers: getAllAnswers(5),
      expectedCode: "SNAC",
    },
    {
      name: "all strong disagreement answers produce opposite reverse-aware scoring",
      answers: getAllAnswers(1),
      expectedCode: "FBAC",
    },
    {
      name: "all result type keys are present",
      custom: () => Object.keys(resultTypes).length === 16,
    },
    {
      name: "every generated code has a result entry for neutral and extremes",
      custom: () => [getAllAnswers(1), getAllAnswers(3), getAllAnswers(5)].every((answers) => Boolean(resultTypes[getAxisScores(answers).code])),
    },
    {
      name: "safeClassName falls back for invalid values",
      custom: () => safeClassName(undefined) === "h-5 w-5" && safeClassName(null) === "h-5 w-5" && safeClassName("  ") === "h-5 w-5" && safeClassName("h-4 w-4") === "h-4 w-4",
    },
    {
      name: "choice readings cover every axis and scale value",
      custom: () => questions.every((question) => scale.every((item) => {
        const reading = getChoiceReading(question, item.value);
        return typeof reading.title === "string" && reading.title.length > 0 && typeof reading.body === "string" && reading.body.length > 0;
      })),
    },
    {
      name: "question purposes cover every question",
      custom: () => questions.every((question) => typeof questionPurposes[question.id] === "string" && questionPurposes[question.id].length > 0),
    },
    {
      name: "question themes cover every question",
      custom: () => questions.every((question) => typeof questionThemeMap[question.id] === "string" && Boolean(resultSignalThemes[questionThemeMap[question.id]])),
    },
    {
      name: "response insights surface both triggers and resources",
      custom: () => {
        const insights = getResponseInsights(getAllAnswers(5));
        return Array.isArray(insights.topTriggers) && Array.isArray(insights.topResources) && Boolean(insights.dominantPain) && Boolean(insights.dominantResource);
      },
    },
  ];

  tests.forEach((test) => {
    const passed = test.custom
      ? test.custom()
      : (() => {
          const result = getAxisScores(test.answers);
          const codeMatches = result.code === test.expectedCode;
          const dimensionMatches =
            typeof test.expectedDimension !== "number" ||
            Object.values(result.dimensions).every((value) => value === test.expectedDimension);
          return codeMatches && dimensionMatches;
        })();

    if (!passed) {
      console.error(`[InnerCalibrationTest self-test failed] ${test.name}`);
    }
  });
}

if (typeof window !== "undefined" && !window.__INNER_CALIBRATION_SELF_TESTED__) {
  window.__INNER_CALIBRATION_SELF_TESTED__ = true;
  runSelfTests();
}

function Header({ onReset, hasStarted }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <Icon name="Sparkles" className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-950">内在校准测试</div>
            <div className="hidden text-xs text-slate-500 sm:block">Self Calibration Test</div>
          </div>
        </div>
        {hasStarted && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Icon name="RotateCcw" className="h-4 w-4" />
            重来
          </button>
        )}
      </div>
    </header>
  );
}

function Home({ onStart }) {
  const homeAxes = [
    {
      key: "perception",
      title: "事实感知",
      desc: "分清发生了什么，和自己以为它意味着什么。",
    },
    {
      key: "feedback",
      title: "反馈权重",
      desc: "看负面反馈会不会盖过已经存在的正向证据。",
    },
    {
      key: "action",
      title: "行动反应",
      desc: "看压力来时，是更容易停住，还是能做一个小动作。",
    },
    {
      key: "self",
      title: "自我态度",
      desc: "看反思自己时，是进入审判，还是能温和修正。",
    },
  ];

  const quickFacts = ["40 道短题", "约 5-8 分钟", "没有标准答案"];

  return (
    <main className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <Icon name="ShieldCheck" className="h-4 w-4" />
            不是诊断，也不是给你贴标签
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            内在校准测试
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            看见你在模糊信号、负面反馈、压力行动和自我反思里，最容易卡住的那一步。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {quickFacts.map((item) => (
              <span key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              开始测试
              <Icon name="ArrowRight" className="h-5 w-5" />
            </button>
            <span className="text-sm leading-6 text-slate-500">结果会给出主要触发点、已有资源和下一步建议。</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-950">测什么</h2>
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">4 个维度</span>
          </div>
          <div className="mt-4 divide-y divide-slate-200">
            {homeAxes.map((item) => {
              const iconName = axisIcons[item.key];
              return (
                <div key={item.key} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Icon name={iconName} className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-950">{item.title}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <details className="mx-auto mt-6 max-w-6xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
        <summary className="cursor-pointer font-semibold">重要说明</summary>
        <p className="mt-2">
          本测试不是医学、心理诊断或治疗工具，不能替代专业心理咨询、精神科评估或医疗建议。如果你长期处在强烈痛苦、失眠、无法正常生活，或出现自伤/伤人想法，请尽快联系专业人员或当地紧急援助服务。
        </p>
      </details>
    </main>
  );
}

function Test({ answers, setAnswers, onSubmit }) {
  const [index, setIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [showChoiceReadings, setShowChoiceReadings] = useState(false);
  const current = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);
  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount === questions.length;
  const currentAxis = AXES[current.axis];
  const currentAnswer = answers[current.id];
  const answerGuide = "按最近一段时间最常见的反应作答。这里没有标准答案，也不用把自己固定成某一种人。";

  const setAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));

    if (autoAdvance && index < questions.length - 1) {
      window.setTimeout(() => {
        setIndex((latestIndex) => (latestIndex === index ? Math.min(latestIndex + 1, questions.length - 1) : latestIndex));
      }, 260);
    }
  };

  const next = () => {
    if (index < questions.length - 1) setIndex((v) => v + 1);
  };

  const prev = () => {
    if (index > 0) setIndex((v) => v - 1);
  };

  return (
    <main className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col px-3 py-3 sm:px-4 sm:py-4 lg:px-6 md:h-[calc(100svh-4.5rem)] md:overflow-hidden">
      <div className="hidden items-stretch gap-2 md:grid md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_16rem_16rem]">
        <div className="flex min-h-[92px] flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4 md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
            <span>第 {index + 1} / {questions.length} 题</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-slate-950"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25 }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-950 px-3 py-1 font-medium text-white">{currentAxis.title}</span>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-slate-500">已完成 {answeredCount} / {questions.length}</span>
          </div>
        </div>

        <div className="flex min-h-[92px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="pr-3">
            <div className="text-sm font-semibold text-slate-950">选择后自动跳转</div>
            <div className="text-xs leading-5 text-slate-500">减少一次额外点击，适合快速答题。</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoAdvance}
            onClick={() => setAutoAdvance((value) => !value)}
            className={classNames(
              "flex h-10 w-24 shrink-0 items-center justify-between rounded-full border px-3 text-xs font-semibold transition",
              autoAdvance ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-600"
            )}
          >
            <span>{autoAdvance ? "开启" : "关闭"}</span>
            <span className={classNames("relative h-5 w-9 rounded-full transition", autoAdvance ? "bg-white/25" : "bg-slate-300")}>
              <span className={classNames("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition", autoAdvance ? "left-4" : "left-0.5")} />
            </span>
          </button>
        </div>

        <div className="flex min-h-[92px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="pr-3">
            <div className="text-sm font-semibold text-slate-950">显示作答辅助</div>
            <div className="text-xs leading-5 text-slate-500">拿不准时再打开，用来理解量表方向。</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={showChoiceReadings}
            onClick={() => setShowChoiceReadings((value) => !value)}
            className={classNames(
              "flex h-10 w-24 shrink-0 items-center justify-between rounded-full border px-3 text-xs font-semibold transition",
              showChoiceReadings ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-600"
            )}
          >
            <span>{showChoiceReadings ? "显示" : "隐藏"}</span>
            <span className={classNames("relative h-5 w-9 rounded-full transition", showChoiceReadings ? "bg-white/25" : "bg-slate-300")}>
              <span className={classNames("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition", showChoiceReadings ? "left-4" : "left-0.5")} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={current.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          className="mt-2 flex flex-1 flex-col rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/5 sm:p-4 lg:p-5 md:min-h-0 md:overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-2.5 md:min-h-0 md:overflow-y-auto md:pr-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-slate-950 px-3 py-1 text-white">Q{index + 1}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{currentAxis.title}</span>
            </div>

            <div className="min-w-0">
              <h2 className="text-[clamp(1.18rem,1.8vw,1.9rem)] font-bold leading-snug tracking-tight text-slate-950">
                {current.text}
                {current.example && (
                  <span className="ml-2 font-medium text-slate-400">
                    {current.example}
                  </span>
                )}
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                {answerGuide}
              </p>
            </div>

            <div className="grid gap-2 md:flex-1 md:auto-rows-fr">
              {scale.map((item) => {
                const selected = currentAnswer === item.value;
                const choiceReading = getChoiceReading(current, item.value);

                return (
                  <button
                    key={item.value}
                    onClick={() => setAnswer(item.value)}
                    className={classNames(
                      "group relative flex h-full flex-col justify-center rounded-2xl border px-4 py-2.5 text-left transition sm:px-5",
                      selected
                        ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={classNames(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                          selected ? "bg-white text-slate-950" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {item.value}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className={classNames("font-semibold leading-5", selected ? "text-white" : "text-slate-950")}>{item.label}</div>
                        {showChoiceReadings && (
                          <div className={classNames("mt-1 text-xs leading-5", selected ? "text-white/85" : "text-slate-500")}>
                            {choiceReading.body}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 shrink-0 border-t border-slate-200 pt-3">
            <div className="mb-3 space-y-2 md:hidden">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>第 {index + 1} / {questions.length} 题</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-slate-950"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoAdvance}
                  onClick={() => setAutoAdvance((value) => !value)}
                  className={classNames(
                    "flex h-11 items-center justify-between rounded-2xl border px-3 text-left text-xs font-semibold transition",
                    autoAdvance ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700"
                  )}
                >
                  <span>自动跳转</span>
                  <span className={classNames("relative h-5 w-9 rounded-full transition", autoAdvance ? "bg-white/25" : "bg-slate-300")}>
                    <span className={classNames("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition", autoAdvance ? "left-4" : "left-0.5")} />
                  </span>
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={showChoiceReadings}
                  onClick={() => setShowChoiceReadings((value) => !value)}
                  className={classNames(
                    "flex h-11 items-center justify-between rounded-2xl border px-3 text-left text-xs font-semibold transition",
                    showChoiceReadings ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700"
                  )}
                >
                  <span>作答辅助</span>
                  <span className={classNames("relative h-5 w-9 rounded-full transition", showChoiceReadings ? "bg-white/25" : "bg-slate-300")}>
                    <span className={classNames("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition", showChoiceReadings ? "left-4" : "left-0.5")} />
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={prev}
                disabled={index === 0}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                <Icon name="ArrowLeft" className="h-5 w-5" />
                上一题
              </button>

              {index < questions.length - 1 ? (
                <button
                  onClick={next}
                  disabled={!currentAnswer}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  下一题
                  <Icon name="ArrowRight" className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  disabled={!canSubmit}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  查看结果
                  <Icon name="Sparkles" className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </main>
  );
}

function Loading({ answers, dimensions, code, resultName, tagline, onComplete, onAiReady }) {
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    async function loadAiReading() {
      try {
        const res = await fetch("https://wandering-flower-b5b8.a1324283562.workers.dev/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
            dimensions,
            code,
            resultName,
            tagline,
          }),
        });

        const data = await res.json();
        if (data.text) {
          onAiReady(data.text);
        }
      } catch (error) {
        console.error(error);
        setAiError(true);
      } finally {
        setAiLoading(false);
      }
    }

    loadAiReading();
  }, [answers, dimensions, code, resultName, tagline, onAiReady]);

  useEffect(() => {
    // 无论 AI 是否加载完成，4秒后都进入结果页
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <main className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 animate-ping rounded-full bg-slate-950 opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950">
              <Icon name="Sparkles" className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-950">结果分析中</h2>
        <p className="mt-4 text-lg text-slate-600">
          {aiLoading ? "正在生成 AI 深度解读..." : aiError ? "AI 解读生成中，请稍候..." : "AI 解读已生成"}
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
          <span className="h-3 w-3 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
          <span className="h-3 w-3 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
        </div>
      </motion.div>
    </main>
  );
}

function ScoreBar({ axis, value }) {
  const meta = AXES[axis];
  const isBorderline = isAxisBorderline(value);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-950">{meta.title}</div>
          <div className="text-sm text-slate-500">{getAxisDisplayLabel(axis, value)}</div>
        </div>
        <div className="text-lg font-bold text-slate-950">{value}</div>
      </div>
      <div className="relative mt-4 h-3 rounded-full bg-slate-200">
        <div className="absolute left-1/2 top-1/2 h-5 w-px -translate-y-1/2 bg-slate-400" />
        <motion.div
          className="h-full rounded-full bg-slate-950"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7 }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{meta.leftName}</span>
        <span>{meta.rightName}</span>
      </div>
      {isBorderline && <div className="mt-3 text-xs leading-5 text-slate-500">接近中线，更容易随场景变化。</div>}
      <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-600">
        <div>
          <div className="font-semibold text-slate-950">{meta.leftName}</div>
          <p className="mt-1">{meta.leftDesc}</p>
        </div>
        <div>
          <div className="font-semibold text-slate-950">{meta.rightName}</div>
          <p className="mt-1">{meta.rightDesc}</p>
        </div>
      </div>
    </div>
  );
}

function Result({ answers, onReset, aiReading: externalAiReading }) {
  const [copied, setCopied] = useState(false);
  const [internalAiReading, setInternalAiReading] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  
  // 优先使用外部传入的 AI 解读，否则使用内部状态
  const aiReading = externalAiReading || internalAiReading;
  const { dimensions, code } = useMemo(() => getAxisScores(answers), [answers]);
  const insights = useMemo(() => getResponseInsights(answers), [answers]);
  const result = resultTypes[code] || resultTypes.FBAC;
  const borderlineAxes = getBorderlineAxes(dimensions);
  const borderlineNames = borderlineAxes.map(([axis]) => AXES[axis].title).join("、");
  const displayName = borderlineAxes.length >= 3 ? "情境型校准者" : borderlineAxes.length > 0 ? `偏向${result.name}` : result.name;
  const displayTagline = borderlineAxes.length >= 3
    ? "你的答案大多落在中间区，更像会随场景、对象和状态切换。"
    : result.tagline;
  const confidenceNote = borderlineAxes.length > 0
    ? `${borderlineNames}接近中线，这部分更适合看成倾向，不适合当成定论。`
    : "";
  const topTrigger = insights.topTriggers[0] || null;
  const dominantSignal = insights.dominantPain || insights.dominantResource;
  const calibrationPrompts = [
    {
      title: "事实",
      body: topTrigger?.reflection || "我现在能确定发生了什么？哪些还只是自己的解释或预判？",
    },
    {
      title: "反证",
      body: topTrigger?.followUp || "有没有任何证据，能支持一个没那么糟、没那么指向自己的解释？",
    },
    {
      title: "信息",
      body: "如果先不急着得出结论，我还需要什么信息、时间或支持，才能看得更准一点？",
    },
  ];
  const nextStepCards = [
    {
      title: "先降强度",
      body: "把当下反应命名成一句话：我正在紧张、害怕、自责或想退开。只命名，不急着判定它对不对。",
    },
    {
      title: "再取两边证据",
      body: "写下支持当前判断的证据，再写下不支持它的证据。两边都要有，避免只喂养一个结论。",
    },
    {
      title: "最后做小动作",
      body: topTrigger?.step || "把建议缩成 5 分钟内能完成的版本，只求启动，不求一次解决。",
    },
  ];
  const dominantSignalTitle = insights.dominantPain ? "最容易刺到你的那道题" : "你已经有的稳定点";
  const dominantSignalNote = insights.dominantPain
    ? "这不说明你一定有某段明确的创伤，更像是这类场景最容易刺到你，所以你的反应会更快、更重。"
    : "这说明在这类场景里，你已经有一部分能力，可以先把自己稳住，而不是完全被当下拖走。";

  const shareText = `我的内在校准类型是「${displayName}」：${displayTagline}\n\n四维结果：${AXES.perception.title}-${getAxisDisplayLabel("perception", dimensions.perception)} / ${AXES.feedback.title}-${getAxisDisplayLabel("feedback", dimensions.feedback)} / ${AXES.action.title}-${getAxisDisplayLabel("action", dimensions.action)} / ${AXES.self.title}-${getAxisDisplayLabel("self", dimensions.self)}。`;

  // 只有当没有外部传入 AI 解读时，才在 Result 组件内请求
  useEffect(() => {
    if (externalAiReading) return;
    
    async function loadAiReading() {
      setAiLoading(true);

      try {
        const res = await fetch("https://wandering-flower-b5b8.a1324283562.workers.dev/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
            dimensions,
            code,
            resultName: displayName,
            tagline: displayTagline,
          }),
        });

        const data = await res.json();
        setInternalAiReading(data.text || "");
      } catch (error) {
        console.error(error);
        setInternalAiReading("AI 解读暂时生成失败，你仍然可以查看上方基础结果。");
      } finally {
        setAiLoading(false);
      }
    }

    loadAiReading();
  }, [externalAiReading, answers, dimensions, code, displayName, displayTagline]);

  const copyShare = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareText;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
              <Icon name="Share2" className="h-4 w-4" />
              你的测试结果
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{displayName}</h1>
            <p className="mt-4 text-xl leading-8 text-slate-600">{displayTagline}</p>
            {confidenceNote && (
              <p className="mt-4 rounded-[1.5rem] bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                {confidenceNote}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:w-[22rem] lg:flex-col">
            <button
              onClick={copyShare}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              {copied ? <Icon name="Check" className="h-5 w-5" /> : <Icon name="Copy" className="h-5 w-5" />}
              {copied ? "已复制" : "复制分享文案"}
            </button>
            <button
              onClick={onReset}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Icon name="RotateCcw" className="h-5 w-5" />
              重新测试
            </button>
          </div>
        </div>
      </motion.section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(dimensions).map(([axis, value]) => (
          <ScoreBar key={axis} axis={axis} value={value} />
        ))}
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-slate-950">完整解读</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">最明显触发点</h3>
            <div className="mt-4 space-y-4">
              {insights.topTriggers.length > 0 ? (
                insights.topTriggers.slice(0, 2).map((theme) => (
                  <div key={theme.key} className="rounded-2xl bg-slate-50 p-5">
                    <div className="font-semibold text-slate-950">{theme.title}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{theme.painText}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{theme.comfortText}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-slate-500">你的回答相对均衡，没有某一个高强度触发点明显压过其他部分。</p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">已有修复能力</h3>
            <div className="mt-4 space-y-4">
              {insights.topResources.length > 0 ? (
                insights.topResources.slice(0, 2).map((theme) => (
                  <div key={theme.key} className="rounded-2xl bg-slate-50 p-5">
                    <div className="font-semibold text-slate-950">{theme.title}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{theme.resourceText}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-slate-500">这次结果里，修复能力的信号还不够突出，后面的小练习会更适合你。</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-xl font-bold text-slate-950">你的优势</h3>
          <ul className="mt-4 space-y-3 text-slate-600">
            {result.strengths.map((item) => (
              <li key={item} className="flex gap-3 leading-7">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-950" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-xl font-bold text-slate-950">可能的盲点</h3>
          <ul className="mt-4 space-y-3 text-slate-600">
            {result.blindspots.map((item) => (
              <li key={item} className="flex gap-3 leading-7">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            <Icon name={insights.dominantPain ? "Info" : "ShieldCheck"} className="h-4 w-4" />
            {dominantSignalTitle}
          </div>
          {dominantSignal ? (
            <>
              <h3 className="mt-4 text-2xl font-bold leading-snug text-slate-950">
                {getQuestionDisplayText(dominantSignal.question)}
              </h3>
              <div className="mt-4 inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
                你的选择：{dominantSignal.answerLabel}
              </div>
              <p className="mt-5 text-lg leading-8 text-slate-600">{dominantSignal.reading.body}</p>
              <p className="mt-4 rounded-[1.5rem] bg-slate-50 p-5 text-sm leading-7 text-slate-500">{dominantSignalNote}</p>
            </>
          ) : (
            <p className="mt-4 text-lg leading-8 text-slate-600">这次你的回答比较居中，所以没有出现一眼就很突出的高强度题目。</p>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-xl font-bold text-slate-950">校准问题</h3>
          <div className="mt-4 space-y-3">
            {calibrationPrompts.map((prompt) => (
              <div key={prompt.title} className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                <div className="font-semibold text-slate-950">{prompt.title}</div>
                <div className="mt-1">{prompt.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-500">可能的自动保护</div>
            <p className="mt-3 text-base leading-7 text-slate-700">
              {topTrigger?.protectionText || "当我们不舒服时，总会有一些自动保护动作。先看见它们，比立刻改掉它们更重要。"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">下一步建议</h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">{result.practice}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {nextStepCards.map((card) => (
            <div key={card.title} className="rounded-2xl bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-500">{card.title}</div>
              <p className="mt-3 leading-7 text-slate-700">{card.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <div className="text-sm font-semibold text-slate-500">通用练习模板</div>
          <div className="mt-4 grid gap-3 text-slate-700 md:grid-cols-2">
            <div>1. 刚才发生的事实是：______</div>
            <div>2. 我第一时间的解释是：______</div>
            <div>3. 我的情绪强度是：__/10</div>
            <div>4. 除了第一解释，还有一种可能是：______</div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-950">AI 深度解读</h2>

        {aiLoading ? (
          <p className="mt-4 text-slate-500">正在生成更细致的解读...</p>
        ) : aiReading ? (
          <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
            {formatAiReading(aiReading).split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              // 段落标题 (## 开头)
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={i} className="text-xl font-bold text-slate-950 mt-6 mb-2">
                    {trimmed.replace("## ", "")}
                  </h3>
                );
              }
              // 加粗标题
              if (trimmed.match(/^\*\*[^*]+\*\*:$/)) {
                return (
                  <h4 key={i} className="text-lg font-bold text-slate-800 mt-4 mb-1">
                    {trimmed.replace(/\*\*/g, "")}
                  </h4>
                );
              }
              // 无序列表
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <li key={i} className="ml-4 text-slate-700">
                    {trimmed.replace(/^[*-]\s*/, "")}
                  </li>
                );
              }
              // 普通段落
              return (
                <p key={i} className="text-slate-700">
                  {trimmed}
                </p>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-slate-500">暂无 AI 解读</p>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900">
        <strong>重要说明：</strong>这个结果不是诊断，也不说明你有某种精神障碍。它只是帮助你理解自己处理反馈、情绪和行动的风格。如果你正在经历长期痛苦、失眠、强烈绝望、无法正常生活，或有自伤/伤人想法，请尽快寻求专业帮助。
      </section>
    </main>
  );
}

export default function InnerCalibrationTestApp() {
  const [stage, setStage] = useState("home");
  const [answers, setAnswers] = useState({});
  const [aiReading, setAiReading] = useState("");
  const [loadingData, setLoadingData] = useState(null);

  const scrollTop = () => {
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const reset = () => {
    setAnswers({});
    setStage("home");
    scrollTop();
  };

  const start = () => {
    setStage("test");
    scrollTop();
  };

  const submit = () => {
    if (Object.keys(answers).length !== questions.length) return;
    const { dimensions, code } = getAxisScores(answers);
    const result = resultTypes[code] || resultTypes.FBAC;
    const borderlineAxes = getBorderlineAxes(dimensions);
    const displayName = borderlineAxes.length >= 3 ? "情境型校准者" : borderlineAxes.length > 0 ? `偏向${result.name}` : result.name;
    const displayTagline = borderlineAxes.length >= 3
      ? "你的答案大多落在中间区，更像会随场景、对象和状态切换。"
      : result.tagline;
    setLoadingData({ answers, dimensions, code, resultName: displayName, tagline: displayTagline });
    setStage("loading");
    scrollTop();
  };

  const goToResult = () => {
    setStage("result");
    scrollTop();
  };

  const handleAiReady = (text) => {
    setAiReading(text);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_32%),linear-gradient(to_bottom,#ffffff,#f8fafc)] text-slate-950">
      <Header onReset={reset} hasStarted={stage !== "home" && stage !== "loading"} />
      {stage === "home" && <Home onStart={start} />}
      {stage === "test" && <Test answers={answers} setAnswers={setAnswers} onSubmit={submit} />}
      {stage === "loading" && loadingData && (
        <Loading
          answers={loadingData.answers}
          dimensions={loadingData.dimensions}
          code={loadingData.code}
          resultName={loadingData.resultName}
          tagline={loadingData.tagline}
          onComplete={goToResult}
          onAiReady={handleAiReady}
        />
      )}
      {stage === "result" && <Result answers={answers} onReset={reset} aiReading={aiReading} />}
      {stage !== "test" && (
        <footer className="w-full px-4 py-10 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} 内在校准测试 · 用于自我理解，不用于医学诊断
        </footer>
      )}
    </div>
  );
}
