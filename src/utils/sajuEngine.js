/* ──────────────────────────────────────────
   sajuEngine.js — 생년월일 → 사주 계산 엔진
   수(Water) 표기 통일 + 퍼센트 반올림 보정
────────────────────────────────────────── */

// ── 천간 오행 (수(水)로 통일) ──
const CHEONGAN      = ["갑(甲)","을(乙)","병(丙)","정(丁)","무(戊)","기(己)","경(庚)","신(辛)","임(壬)","계(癸)"];
const CHEONGAN_OHANG = ["목(木)","목(木)","화(火)","화(火)","토(土)","토(土)","금(金)","금(金)","수(水)","수(水)"];

// ── 지지 오행 (수(水)로 통일) ──
const JIJI      = ["자(子)","축(丑)","인(寅)","묘(卯)","진(辰)","사(巳)","오(午)","미(未)","신(申)","유(酉)","술(戌)","해(亥)"];
const JIJI_OHANG = ["수(水)","토(土)","목(木)","목(木)","토(土)","화(火)","화(火)","토(土)","금(金)","금(金)","토(土)","수(水)"];
const JIJI_ANIMAL = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];

export const OHANG_COLORS = {
  "목(木)":[34,197,94],
  "화(火)":[239,68,68],
  "토(土)":[245,158,11],
  "금(金)":[156,163,175],
  "수(水)":[59,130,246],
};

const OHANG_TRAITS = {
  "목(木)":"진취적이고 창의적인 에너지를 지녔습니다.",
  "화(火)":"강렬한 열정과 카리스마로 주변을 이끄는 기운입니다.",
  "토(土)":"깊은 포용력과 균형감으로 주변을 안정시킵니다.",
  "금(金)":"날카로운 통찰과 결단력이 당신의 강점입니다.",
  "수(水)":"깊은 직관과 유연한 사고로 본질을 꿰뚫습니다.",
};

// ── 기둥 계산 ──
function getYearPillar(year) {
  const gi = ((year-4)%10+10)%10;
  const ji = ((year-4)%12+12)%12;
  return { gan:CHEONGAN[gi], ji:JIJI[ji], ganOhang:CHEONGAN_OHANG[gi], jiOhang:JIJI_OHANG[ji], animal:JIJI_ANIMAL[ji] };
}

function getMonthPillar(year, month) {
  const MONTH_JI = [11,0,1,2,3,4,5,6,7,8,9,10];
  const jiIdx = MONTH_JI[month-1];
  const ygi = ((year-4)%10+10)%10;
  const gi = ((ygi%5)*2 + (month%2===0?1:0))%10;
  return { gan:CHEONGAN[gi], ji:JIJI[jiIdx], ganOhang:CHEONGAN_OHANG[gi], jiOhang:JIJI_OHANG[jiIdx] };
}

function getDayPillar(year, month, day) {
  const a = Math.floor((14-month)/12);
  const y = year + 4800 - a;
  const m = month + 12*a - 3;
  const jd = day + Math.floor((153*m+2)/5) + 365*y
    + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
  const gi = ((jd-10)%10+10)%10;
  const ji = ((jd-10)%12+12)%12;
  return { gan:CHEONGAN[gi], ji:JIJI[ji], ganOhang:CHEONGAN_OHANG[gi], jiOhang:JIJI_OHANG[ji] };
}

// ── 오행 분포 계산 (반올림 오차 보정 포함) ──
function calcOhangDist(pillars) {
  // 1. 카운트
  const count = { "목(木)":0, "화(火)":0, "토(土)":0, "금(金)":0, "수(水)":0 };
  pillars.forEach(p => {
    if (p.ganOhang && count[p.ganOhang] !== undefined) count[p.ganOhang]++;
    if (p.jiOhang  && count[p.jiOhang]  !== undefined) count[p.jiOhang]++;
  });

  const total = Object.values(count).reduce((s,v)=>s+v, 0);
  if (total === 0) return [];

  // 2. 라지-레마인더 방식으로 정수 퍼센트 합 = 100 보장
  const entries = Object.entries(count);
  const floats  = entries.map(([name, cnt]) => ({ name, cnt, float: cnt/total*100 }));
  const floors  = floats.map(o => ({ ...o, pct: Math.floor(o.float) }));
  let remainder = 100 - floors.reduce((s,o)=>s+o.pct, 0);

  // 소수점 내림차순으로 나머지 1씩 배분
  floors
    .map((o,i) => ({ i, dec: o.float - o.pct }))
    .sort((a,b) => b.dec - a.dec)
    .slice(0, remainder)
    .forEach(({ i }) => floors[i].pct++);

  return floors
    .map(o => ({
      name:  o.name,
      count: o.cnt,
      pct:   o.pct,
      color: OHANG_COLORS[o.name] || [139,92,246],
      trait: OHANG_TRAITS[o.name] || "",
    }))
    .sort((a,b) => b.pct - a.pct);
}

// ── 아우라 타입 ──
const AURA_MAP = {
  "목(木)_화(火)":"목화 창조형","목(木)_수(水)":"목수 지성형","목(木)_토(土)":"목토 안정형","목(木)_금(金)":"목금 결단형",
  "화(火)_목(木)":"화목 열정형","화(火)_토(土)":"화토 리더형","화(火)_금(金)":"화금 개혁형","화(火)_수(水)":"화수 역동형",
  "토(土)_목(木)":"토목 성장형","토(土)_화(火)":"토화 온기형","토(土)_금(金)":"토금 신뢰형","토(土)_수(水)":"토수 지혜형",
  "금(金)_목(木)":"금목 도전형","금(金)_화(火)":"금화 강인형","금(金)_토(土)":"금토 원칙형","금(金)_수(水)":"금수 통찰형",
  "수(水)_목(木)":"수목 생명형","수(水)_화(火)":"수화 신비형","수(水)_토(土)":"수토 심연형","수(水)_금(金)":"수금 직관형",
};
const AURA_DESC = {
  "목화 창조형":"열정과 성장이 폭발하는 창조적 영혼","목수 지성형":"지혜로 성장을 이끄는 탐구의 영혼",
  "목토 안정형":"뿌리 깊은 나무처럼 흔들리지 않는 영혼","목금 결단형":"빠른 결단과 성장이 공존하는 영혼",
  "화목 열정형":"넘치는 생명력과 열정으로 빛나는 영혼","화토 리더형":"카리스마와 포용력을 겸비한 영혼",
  "화금 개혁형":"강렬한 변화를 추구하는 선구자 영혼","화수 역동형":"상반된 에너지가 만드는 역동적 영혼",
  "토목 성장형":"안정된 기반 위에 성장을 꿈꾸는 영혼","토화 온기형":"따뜻함과 포용으로 주변을 밝히는 영혼",
  "토금 신뢰형":"깊은 신뢰와 원칙으로 움직이는 영혼","토수 지혜형":"조용한 깊이로 세상을 읽는 현자형 영혼",
  "금목 도전형":"날카로운 결단으로 새 길을 여는 영혼","금화 강인형":"불 속에서 단련된 강철 같은 영혼",
  "금토 원칙형":"흔들리지 않는 원칙과 기준의 영혼","금수 통찰형":"예리한 직관과 지혜를 겸비한 영혼",
  "수목 생명형":"깊은 지혜로 새 생명을 키우는 영혼","수화 신비형":"물과 불처럼 신비로운 이중성의 영혼",
  "수토 심연형":"깊은 내면으로 세상을 품는 영혼","수금 직관형":"날카로운 직관과 지혜로 진실을 꿰뚫는 영혼",
};

function getAuraType(dist) {
  const nonZero = dist.filter(d => d.count > 0);
  if (nonZero.length < 2) {
    const top = nonZero[0] || dist[0];
    return { type:`${top.name} 순수형`, desc:`${top.name} 에너지가 순수하게 응축된 영혼`, color: top.color };
  }
  const key = `${nonZero[0].name}_${nonZero[1].name}`;
  const typeName = AURA_MAP[key] || `${nonZero[0].name} 중심형`;
  return { type:typeName, desc:AURA_DESC[typeName]||nonZero[0].trait, color:nonZero[0].color };
}

// ── 상생/상극 관계 ──
const REL_MAP = {
  "목(木)_화(火)":{rel:"상생(相生)",desc:"나무가 불을 키우듯, 두 기운이 서로를 살립니다."},
  "화(火)_토(土)":{rel:"상생(相生)",desc:"불이 재가 되어 대지를 기름지게 합니다."},
  "토(土)_금(金)":{rel:"상생(相生)",desc:"땅이 금속을 품듯, 안정이 결단을 낳습니다."},
  "금(金)_수(水)":{rel:"상생(相生)",desc:"쇠가 물을 낳듯, 결단이 지혜를 흘려보냅니다."},
  "수(水)_목(木)":{rel:"상생(相生)",desc:"물이 나무를 키우듯, 직관이 성장을 이끕니다."},
  "목(木)_토(土)":{rel:"상극(相剋)",desc:"나무가 땅을 뚫듯, 긴장이 돌파구를 만들어냅니다."},
  "토(土)_수(水)":{rel:"상극(相剋)",desc:"땅이 물을 막듯, 안정과 흐름이 충돌합니다."},
  "수(水)_화(火)":{rel:"상극(相剋)",desc:"물이 불을 끄듯, 상반된 에너지가 역동을 만듭니다."},
  "화(火)_금(金)":{rel:"상극(相剋)",desc:"불이 쇠를 녹이듯, 열정이 원칙을 흔듭니다."},
  "금(金)_목(木)":{rel:"상극(相剋)",desc:"금이 나무를 자르듯, 결단이 성장에 도전합니다."},
};

function getRelation(o1, o2) {
  if (o1 === o2) return { rel:"동기(同氣)", desc:"같은 기운이 증폭되어 특성이 강렬하게 드러납니다." };
  return REL_MAP[`${o1}_${o2}`] || REL_MAP[`${o2}_${o1}`] || { rel:"중성(中性)", desc:"두 에너지가 서로 영향을 미치며 균형을 찾아갑니다." };
}

// ── 시드 기반 난수 ──
function rng(seed, offset) { return Math.abs(Math.sin(seed*0.001+offset)*10000)%1; }

// ── 월별 운세 ──
function getMonthlyFortune(birthDate, dominant) {
  const seed = new Date(birthDate).getTime();
  const KW = {
    "목(木)":["성장","도약","새 시작","확장","인연","기회","창조","도전","화합","전진","결실","마무리"],
    "화(火)":["열정","변화","표현","주목","전환","발견","에너지","만남","성취","활력","빛남","완성"],
    "토(土)":["안정","기반","인내","포용","준비","조율","신뢰","균형","축적","수확","정리","성숙"],
    "금(金)":["결단","정리","원칙","도약","판단","집중","성과","통찰","갱신","실행","완결","성취"],
    "수(水)":["직관","탐구","내면","흐름","통찰","지혜","성장","인연","심화","확장","수확","새출발"],
  };
  const kws = KW[dominant.name] || KW["수(水)"];
  return ["7월","8월","9월","10월","11월","12월"].map((m,i) => {
    const s = Math.round(rng(seed, i*7.3+1)*2+3);
    return { m, stars:Math.min(5,Math.max(3,s)), key:kws[i+6], peak:s>=5 };
  });
}

// ── 분야별 운세 ──
function getDomainFortune(birthDate) {
  const seed = new Date(birthDate).getTime();
  const LOVE_T=["감춰진 인연의 실","새로운 연결의 시작","깊어지는 유대감","운명적 재회의 기운","관계의 성숙과 완성"];
  const WORK_T=["전환점의 전야","숨겨진 재능의 발현","변화가 기회가 되는 시기","성과가 빛나는 계절","새로운 도약의 발판"];
  const MONEY_T=["흐름을 타면 따라옵니다","차분한 축적의 시기","예상치 못한 기회의 문","안정적 성장의 국면","수확의 시기가 다가옵니다"];
  const LOVE_D=["지금 곁에 있는 사람을 다시 보세요. 새로운 만남보다 깊어질 관계가 더 중요한 시기입니다.","당신의 진심이 전달되는 시기입니다. 먼저 다가가는 용기가 필요합니다.","오래된 인연이 새롭게 빛납니다. 작은 순간들을 소중히 여기세요.","의외의 장소에서 운명적인 만남이 기다립니다. 마음을 열어두세요.","서로에 대한 이해가 깊어지는 시기입니다. 솔직한 대화가 관계를 성장시킵니다."];
  const WORK_D=["당신의 능력은 아직 충분히 보이지 않았습니다. 기회가 곧 옵니다.","숨겨뒀던 재능을 펼칠 시기입니다. 두려움 없이 앞으로 나아가세요.","예상치 못한 변화가 오히려 성장의 발판이 됩니다.","그동안의 노력이 빛을 발하는 계절입니다. 자신감을 가지세요.","새로운 분야로의 도전이 뜻밖의 성과를 가져올 것입니다."];
  const MONEY_D=["무리한 투자나 지출은 금물. 천천히 쌓아가는 전략이 최선입니다.","작은 것부터 차근차근 쌓아가세요. 꾸준함이 재물을 부릅니다.","예상치 못한 곳에서 기회가 옵니다. 눈을 크게 뜨고 주변을 살피세요.","안정적인 흐름이 이어집니다. 꾸준한 관리가 중요합니다.","노력한 만큼의 결실이 들어오는 시기입니다."];
  const li=Math.floor(rng(seed,1.1)*5), wi=Math.floor(rng(seed,2.2)*5), mi=Math.floor(rng(seed,3.3)*5);
  return {
    love:{title:LOVE_T[li],desc:LOVE_D[li],score:Math.round(rng(seed,1.1)*2+3)},
    work:{title:WORK_T[wi],desc:WORK_D[wi],score:Math.round(rng(seed,2.2)*2+3)},
    money:{title:MONEY_T[mi],desc:MONEY_D[mi],score:Math.round(rng(seed,3.3)*2+3)},
  };
}

// ── 핵심 메시지 ──
function getCoreMessage(dominant, birthDate) {
  const year = new Date(birthDate).getFullYear(), age = 2026-year;
  const MSGS = {
    "목(木)":[
      `${age}세의 당신, 지금 당신 안에는 봄의 새싹처럼 강인한 생명력이 숨쉬고 있습니다. 오랫동안 기다려온 성장의 시간이 2026년 하반기에 본격적으로 펼쳐집니다.\n\n지금 느끼는 불안과 막막함은 씨앗이 껍질을 뚫고 나오는 순간의 진통입니다. 나무는 폭풍에 흔들릴수록 뿌리가 더 깊어집니다.`,
      `당신의 목(木) 기운은 끊임없이 위를 향하는 나무의 본성을 닮았습니다.\n\n2026년 8월, 오랫동안 닫혀 있던 문이 열립니다. 그 문을 두드릴 준비를 지금부터 시작하세요.`,
    ],
    "화(火)":[
      `열정의 화(火) 기운을 품은 ${age}세의 당신. 빛나지 않는 게 오히려 어려운 사람입니다.\n\n지금 당신에게 필요한 것은 더 많은 열정이 아니라, 그 열정을 현명하게 담을 그릇입니다. 2026년은 그 그릇을 만드는 해입니다.`,
      `불은 어둠을 밝히지만 동시에 스스로를 소모합니다.\n\n포기가 아닙니다. 더 큰 불꽃을 위한 연료 절약입니다.`,
    ],
    "토(土)":[
      `대지의 토(土) 기운을 가진 ${age}세의 당신. 주변 모든 것을 품어안으려는 깊은 포용력의 소유자입니다.\n\n이제는 당신 자신을 위한 시간이 필요합니다. 스스로를 먼저 채워야 타인도 채울 수 있습니다.`,
      `당신의 토(土) 기운은 어떤 씨앗도 키워낼 수 있는 비옥한 대지입니다.\n\n2026년, 당신에게 꼭 맞는 방향이 선명하게 보이기 시작할 것입니다.`,
    ],
    "금(金)":[
      `금(金)의 기운은 원석이 보석이 되듯 단련을 통해 진가를 발휘합니다. ${age}세의 지금까지의 고난은 당신을 더욱 단단하게 만들어온 과정이었습니다.\n\n이제 그 단련의 결실을 거둘 시간이 다가오고 있습니다.`,
      `날카롭고 예리한 당신의 금(金) 기운은 진실을 꿰뚫어 보는 능력입니다.\n\n2026년, 그 예리함을 안으로 향해보세요. 자신에 대한 통찰이 모든 것을 바꿀 것입니다.`,
    ],
    "수(水)":[
      `깊은 물처럼 고요하되 강력한 힘을 품은 ${age}세의 당신. 수(水)의 기운은 어떤 그릇에도 담기지만, 결국 바다로 흘러가는 물처럼 자신만의 방향을 잃지 않습니다.\n\n지금 느끼는 막막함은 더 큰 그릇을 찾아가는 과정입니다.`,
      `당신의 수(水) 기운은 직관과 통찰의 에너지입니다.\n\n2026년 하반기, 그 직관을 믿으세요. 당신의 내면이 이미 답을 알고 있습니다.`,
    ],
  };
  const opts = MSGS[dominant.name] || MSGS["수(水)"];
  const seed = new Date(birthDate).getTime();
  return opts[Math.floor(rng(seed,99)*opts.length)%opts.length];
}

// ── 메인 엔진 ──
export function analyzeSaju(birthDateStr, drawnCard=null) {
  const d = new Date(birthDateStr);
  const year=d.getFullYear(), month=d.getMonth()+1, day=d.getDate();

  const yp = getYearPillar(year);
  const mp = getMonthPillar(year, month);
  const dp = getDayPillar(year, month, day);

  const ohangDist = calcOhangDist([yp, mp, dp]);
  const dominant  = ohangDist.find(o=>o.count>0) || ohangDist[0];
  const auraType  = getAuraType(ohangDist);
  const cardRelation = drawnCard ? getRelation(dominant.name, drawnCard.element) : null;

  return {
    birthDate: birthDateStr,
    yearPillar: yp, monthPillar: mp, dayPillar: dp,
    ohangDist, dominant, auraType, cardRelation,
    monthlyFortune: getMonthlyFortune(birthDateStr, dominant),
    domainFortune:  getDomainFortune(birthDateStr),
    coreMessage:    getCoreMessage(dominant, birthDateStr),
    zodiacAnimal:   yp.animal,
  };
}
