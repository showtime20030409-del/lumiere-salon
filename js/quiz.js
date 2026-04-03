/* ============================================================
   QUIZ — AI Hair Style Diagnosis
   ============================================================ */

const state = {
  step: 0,          // 0 = start, 1-3 = steps, 4 = result
  faceShape: null,
  concern: null,
  style: null,
};

const totalSteps = 3;

/* ── Result data ── */
const results = {
  // faceShape-style
  'oval-natural':   { name: 'エアリーロングレイヤー',     gradient: 'linear-gradient(145deg,#1a1000,#2d1e05,#1a1200)',   desc: '自然な動きと軽さを兼ね備えたロングスタイル。層を重ねたレイヤーカットで、風になびく柔らかな質感を演出します。', features: ['自然なボリューム感', '軽やかな毛流れ', 'メンテナンスしやすい'], menu: 'カット + トリートメント' },
  'oval-cool':      { name: 'シャープウルフカット',        gradient: 'linear-gradient(145deg,#0d1520,#1a2535,#0d0d20)',   desc: '鋭角的なシルエットとレイヤーが融合した、現代的でエッジのきいたスタイル。ストリートとエレガンスを行き来するモードな印象。', features: ['エッジのあるシルエット', 'スタイリング自由度高', 'トレンド感'], menu: 'カット + デジタルパーマ' },
  'oval-feminine':  { name: 'フレンチシックボブ',          gradient: 'linear-gradient(145deg,#180810,#2e1020,#180810)',   desc: 'パリジェンヌを彷彿とさせる洗練されたボブ。あご下で揃えた毛先が女性らしいひし形シルエットを作り、上品な華やかさを漂わせます。', features: ['ひし形シルエット', '女性らしいライン', '時代を超えた美しさ'], menu: 'カット + バレイヤージュカラー' },
  'oval-trendy':    { name: 'レイヤードウルフ',            gradient: 'linear-gradient(145deg,#0a1208,#162010,#0a1208)',   desc: '今シーズン最注目のウルフカットにレイヤーをプラス。ランダムな毛先がナチュラルでアーティスティックな雰囲気を演出します。', features: ['今季トレンド', 'アーティスティック', 'スタイリング映え'], menu: 'カット + コントラストカラー' },

  'round-natural':  { name: 'センターパートミディ',        gradient: 'linear-gradient(145deg,#1a1000,#2a1e06,#1a1200)',   desc: 'センター分けで小顔効果を最大化したミディアムスタイル。自然なストレートが清潔感を演出し、顔周りを縦長に見せます。', features: ['小顔効果', '清潔感', '汎用性が高い'], menu: 'カット + ストレートトリートメント' },
  'round-cool':     { name: 'アシメウルフ',                gradient: 'linear-gradient(145deg,#0d1520,#1a2035,#0d0d20)',   desc: '左右非対称のラインが丸みを打ち消し、クールでモードな印象を加えます。個性を引き立てるスタイリング映えするデザイン。', features: ['縦長効果', '個性的なシルエット', 'クール印象'], menu: 'カット + プラチナカラー' },
  'round-feminine': { name: 'ヘムラインボブ',              gradient: 'linear-gradient(145deg,#15060f,#280d1e,#15060f)',   desc: '毛先に重さをのこしつつ、耳まわりをすっきりさせたエレガントなボブ。下膨れを上品にカバーし、凛とした女性像を作ります。', features: ['顔の丸みをカバー', '上品な重め毛先', 'エレガント'], menu: 'カット + アクセントカラー' },
  'round-trendy':   { name: 'カーテンバングウルフ',        gradient: 'linear-gradient(145deg,#0a1005,#182010,#0a1005)',   desc: '前髪でおでこを程よく隠し、縦のシルエットを意識したウルフカット。カーテンバングがトレンド感を一気に引き上げます。', features: ['バング効果で縦長に', '旬なシルエット', '毎日スタイリング楽しい'], menu: 'カット + ハイライト' },

  'long-natural':   { name: 'ナチュラルウェーブロング',    gradient: 'linear-gradient(145deg,#1a1000,#302208,#1a1200)',   desc: '面長の縦ラインを和らげる横広がりのウェーブをプラス。自然な波打ちがヘルシーで生き生きとした印象を与えます。', features: ['輪郭バランスを整える', '自然なウェーブ', '健康的な美髪感'], menu: 'カット + デジタルパーマ' },
  'long-cool':      { name: 'ワンレングスショート',         gradient: 'linear-gradient(145deg,#0d1015,#1a1825,#0d1015)',   desc: 'すっきりとした一直線のラインが知性とクールさを強調。余白を大切にしたミニマルなデザインが大人の女性を演出します。', features: ['知性的な印象', 'ミニマルデザイン', 'メンテナンス簡単'], menu: 'カット + スモーキーカラー' },
  'long-feminine':  { name: 'レイヤーヘムロング',          gradient: 'linear-gradient(145deg,#15050e,#28101e,#15050e)',   desc: '縦長の輪郭を活かした、ドラマチックなロングスタイル。フェイスラインに沿ったレイヤーが、顔を柔らかくフレームします。', features: ['ドラマチックな印象', 'フェイスフレーミング', 'ロングならではの女性美'], menu: 'カット + バレイヤージュ' },
  'long-trendy':    { name: 'コンケーブボブ',              gradient: 'linear-gradient(145deg,#090f08,#161e12,#090f08)',   desc: '後頭部が丸く、前が長い逆三角形ボブ。面長の輪郭に横の広がりを加えつつ、グラデーションシルエットが今っぽさを演出。', features: ['今季HOTスタイル', '輪郭補正効果', 'ユニーク'], menu: 'カット + コントラストハイライト' },

  'square-natural': { name: 'ソフトウェーブミディ',        gradient: 'linear-gradient(145deg,#1a1200,#2a2005,#1a1200)',   desc: '柔らかなウェーブが顎のラインを和らげ、丸みと女性らしさを演出。重くなりすぎない軽い仕上がりで、毎日扱いやすいスタイル。', features: ['顎ラインを和らげる', '柔らかな印象', '扱いやすい'], menu: 'カット + デジタルパーマ' },
  'square-cool':    { name: 'テクスチャーショート',         gradient: 'linear-gradient(145deg,#0d0d1a,#1a1530,#0d0d1a)',   desc: 'エッジをあえて強調せず、テクスチャーで整えたルーズなショートスタイル。強さと遊び心が共存する個性的な一面を表現します。', features: ['存在感のある個性', 'テクスチャー重視', 'スタイリング自由'], menu: 'カット + カラーパーマ' },
  'square-feminine':{ name: 'オフェイスカールボブ',         gradient: 'linear-gradient(145deg,#140510,#25091e,#140510)',   desc: '外ハネと内カールをMIXし、顔まわりを柔らかくフレームするボブ。輪郭の角張りをやさしく包み込む、女性らしいデザイン。', features: ['顔まわりを柔らかく', 'MIXカールで個性', '上品で可愛い'], menu: 'カット + ハイトーンカラー' },
  'square-trendy':  { name: 'マッシュウルフ',              gradient: 'linear-gradient(145deg,#0a0f08,#18201a,#0a0f08)',   desc: 'マッシュルームのような丸いトップとウルフの長めバックが合わさったハイブリッドスタイル。四角いフォルムをポップに変換します。', features: ['丸みでフォルム補正', 'トレンド×個性', 'SNS映え'], menu: 'カット + コントラストカラー' },
};

/* Fallback by style only */
const fallback = {
  natural: results['oval-natural'],
  cool:    results['oval-cool'],
  feminine:results['oval-feminine'],
  trendy:  results['oval-trendy'],
};

function getResult() {
  const key = `${state.faceShape}-${state.style}`;
  return results[key] || fallback[state.style] || Object.values(results)[0];
}

/* ── DOM refs ── */
const startScreen = document.getElementById('quizStart');
const startBtn    = document.getElementById('quizStartBtn');
const progressBar = document.getElementById('quizProgressBar');
const progressText= document.getElementById('quizProgressText');
const progressWrap= document.getElementById('quizProgress');
const stepEls     = document.querySelectorAll('.quiz-step');
const resultEl    = document.getElementById('quizResult');
const backBtns    = document.querySelectorAll('.quiz-btn-back');
const nextBtns    = document.querySelectorAll('.quiz-btn-next');
const restartBtn  = document.getElementById('quizRestart');

/* ── Helpers ── */
function setProgress(step) {
  const pct = Math.round((step / totalSteps) * 100);
  progressBar.style.width = pct + '%';
  progressText.textContent = `STEP ${step} / ${totalSteps}`;
}

function showStep(n) {
  startScreen.style.display = 'none';
  progressWrap.style.display = 'flex';
  resultEl.classList.remove('active');

  stepEls.forEach((el, i) => {
    el.classList.toggle('active', i === n - 1);
  });

  setProgress(n);
  state.step = n;
}

function showResult() {
  progressWrap.style.display = 'none';
  stepEls.forEach(el => el.classList.remove('active'));
  resultEl.classList.add('active');

  const data = getResult();
  document.getElementById('resultStyleName').textContent = data.name;
  document.getElementById('resultGradient').style.background = data.gradient;
  document.getElementById('resultDesc').textContent = data.desc;
  document.getElementById('resultMenu').textContent = data.menu;

  const featuresEl = document.getElementById('resultFeatures');
  featuresEl.innerHTML = data.features.map(f =>
    `<span class="result-feature-tag">${f}</span>`
  ).join('');
}

function resetQuiz() {
  state.step = 0;
  state.faceShape = null;
  state.concern = null;
  state.style = null;

  // Clear selections
  document.querySelectorAll('.quiz-option.selected').forEach(o => o.classList.remove('selected'));

  progressWrap.style.display = 'none';
  resultEl.classList.remove('active');
  stepEls.forEach(el => el.classList.remove('active'));
  startScreen.style.display = 'block';
}

/* ── Option selection ── */
document.querySelectorAll('.quiz-options').forEach(group => {
  group.addEventListener('click', e => {
    const option = e.target.closest('.quiz-option');
    if (!option) return;

    const step = parseInt(option.dataset.step);
    const value = option.dataset.value;

    // Deselect siblings
    group.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');

    // Save answer
    if (step === 1) state.faceShape = value;
    if (step === 2) state.concern = value;
    if (step === 3) state.style = value;
  });
});

/* ── Navigation ── */
if (startBtn) startBtn.addEventListener('click', () => showStep(1));

nextBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const currentStep = parseInt(btn.dataset.from);
    const answer = (
      currentStep === 1 ? state.faceShape :
      currentStep === 2 ? state.concern : state.style
    );
    if (!answer) {
      btn.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 300 });
      return;
    }
    if (currentStep === totalSteps) {
      showResult();
    } else {
      showStep(currentStep + 1);
    }
  });
});

backBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = parseInt(btn.dataset.to);
    if (target === 0) {
      resetQuiz();
    } else {
      showStep(target);
    }
  });
});

if (restartBtn) restartBtn.addEventListener('click', resetQuiz);
