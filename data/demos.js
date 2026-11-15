/* 自动/手动维护：本地 Demo 演示清单。
   file 指向 demos/ 下的独立 HTML 文件，点击会经 demo.html 查看器打开。
   想新增 Demo：复制一条，把 file/title/desc/accent/tags 改掉即可。 */
window.DEMOS = [
  {
    id: 'forest-hunter-3d',
    file: 'demos/林间猎手 3D.html',
    title: '林间猎手 3D',
    desc: '第一人称 3D 狩猎射击：猎枪 / 弓箭 / 陷阱三种武器，五个昼夜关卡，雷达定位、开镜瞄准与连击计分，支持键鼠与触屏陀螺仪。',
    category: '3D 游戏',
    accent: ['#5a9a45', '#ffc83d'],
    tags: ['Three.js', 'WebGL', '射击', 'FPS'],
    featured: true
  },
  {
    id: 'v8-engine',
    file: 'demos/V8 发动机 3D 分解组合演示.html',
    title: 'V8 发动机 3D 分解组合演示',
    desc: '基于 Three.js 的 V8 引擎交互式拆解：分解/组合动画、运转动画、缸内冲程着色与点火顺序可视化。',
    category: '3D / WebGL',
    accent: ['#c0392b', '#ec6a58'],
    tags: ['Three.js', 'WebGL', '引擎', '可视化'],
    featured: true
  },
  {
    id: 'neon-grid-racer',
    file: 'demos/Neon Grid · 城市赛车.html',
    title: 'Neon Grid · 城市赛车',
    desc: '霓虹都市 3D 赛车：程序化生成的城市街区与 Bloom 辉光，油门/刹车、手刹漂移与氮气加速；可切换黄昏、白天、夜晚以及雨天湿滑路面，支持 4 车 AI 竞速与检查点计时两种模式。',
    category: '3D 游戏',
    accent: ['#3ee6ff', '#ff4fd8'],
    tags: ['Three.js', 'WebGL', '赛车', '竞速'],
    featured: true
  },
  {
    id: 'neon-grid-racer-v2',
    file: 'demos/Neon Grid · 城市赛车v2.html',
    title: 'Neon Grid · 城市赛车 v2',
    desc: '霓虹都市 3D 赛车增强版：新增小地图与路线导航、车流与行人、远处山地与海岸地形、SSAO/SSR 与水面反射；移动端提供虚拟摇杆和油门 / 刹车 / 氮气 / 手刹触控按钮，支持横屏提示与一键全屏。',
    category: '3D 游戏',
    accent: ['#6366f1', '#22d3ee'],
    tags: ['Three.js', 'WebGL', '赛车', '竞速', '触屏'],
    featured: true
  },
  {
    id: 'urban-siege-deepseek',
    file: 'demos/城市反恐 · URBAN SIEGE.html',
    title: '城市反恐 · URBAN SIEGE（DeepSeek 版）',
    desc: '由 DeepSeek 生成的第一人称反恐射击：程序化城市街区与掩体、雷达小地图、Bloom 辉光与 PBR 环境光；任务是清除区域内 14 名武装分子，含敌人 AI、后坐力与换弹动画、命中率与用时统计。WASD 移动、鼠标瞄准、Shift 冲刺、Space 跳跃。',
    category: '3D 游戏',
    accent: ['#ff3b30', '#ff6b5e'],
    tags: ['Three.js', 'WebGL', 'FPS', '反恐', 'DeepSeek'],
    featured: true
  },
  {
    id: 'urban-strike-claude',
    file: 'demos/URBAN STRIKE · 城市反恐.html',
    title: 'URBAN STRIKE · 城市反恐（Claude 版）',
    desc: '由 Claude 生成的第一人称反恐射击：Three.js 场景里的波次生存玩法，敌人逐波刷新、爆头双倍伤害、APC 自动炮塔支援与曳光弹反馈；WASD 移动、Shift 冲刺、R 换弹，含生命值 / 弹药 HUD 与失败重开。',
    category: '3D 游戏',
    accent: ['#22e5ff', '#ff4433'],
    tags: ['Three.js', 'WebGL', 'FPS', '反恐', 'Claude'],
    featured: true
  },
  {
    id: 'drone-flight-trainer',
    file: 'demos/无人机 3D 飞行训练模拟器.html',
    title: '无人机 3D 飞行训练模拟器',
    desc: '基于 Three.js 的四旋翼飞行训练：定点悬停、穿越门环、精准降落、方形航线、8 字绕桩、楼顶停机坪等 9 个科目，以及带三星计时评级的 9 关闯关模式；含 Angle / Acro 飞行模式、风力、电量与坠机判定，支持跟随 / FPV 视角、拍照相册与地图。可用键盘或手柄操作，移动端自动切换双虚拟摇杆。',
    category: '3D 游戏',
    accent: ['#2f6bff', '#8fd3ff'],
    tags: ['Three.js', 'WebGL', '无人机', '模拟', '飞行'],
    featured: true
  }
];
