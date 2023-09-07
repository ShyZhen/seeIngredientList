const dataList = [
  {
    id: 1,
    image: '../../static/sil/tuwen.png',
    title: '图文识别',
    value: 'rest/2.0/ocr/v1/general_basic',
    content: '智能识别文字复制粘贴',
    poster: '/mp/sil/hua.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 2,
    image: '../../static/sil/hua.png',
    title: '拍照识花',
    value: 'rest/2.0/image-classify/v1/plant',
    content: '欲问相思处,花开花落时',
    poster: '/mp/sil/hua.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 3,
    image: '../../static/sil/fanyi.png',
    title: '拍照翻译',
    value: 'file/2.0/mt/pictrans/v1',
    content: '支持多种语言翻译中文',
    poster: '/mp/sil/fanyi.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 4,
    image: '../../static/sil/animal.png',
    title: '动物百科',
    value: 'rest/2.0/image-classify/v1/animal',
    content: '哇好可爱!这是什么动物？',
    poster: '/mp/sil/animal5.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 5,
    image: '../../static/sil/idcard.png',
    title: '身份证扫描',
    value: 'rest/2.0/ocr/v1/idcard',
    content: '身份证号码和地址太长啦',
    poster: '/mp/sil/fruit.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 6,
    image: '../../static/sil/fruit.png',
    title: '果蔬识别',
    value: 'rest/2.0/image-classify/v1/classify/ingredient',
    content: '好吃的水果必须拥有名字',
    poster: '/mp/sil/fruit2.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 7,
    image: '../../static/sil/visa.png',
    title: '银行卡扫描',
    value: 'rest/2.0/ocr/v1/bankcard',
    content: '银行卡信息快速识别',
    poster: '/mp/sil/hua.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 8,
    image: '../../static/sil/money.png',
    title: '货币钱币',
    value: 'rest/2.0/image-classify/v1/currency',
    content: '这是津巴布韦不是美元!',
    poster: '/mp/sil/hua.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },

  {
    id: 9,
    image: '../../static/sil/tianyitian.png',
    title: '头像挂件工坊',
    content: '给你的头像加点料',
    appId: 'wx0559a4b18b51c197',
    path: 'pages/index/index',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 10,
    image: '../../static/sil/wangzhe.png',
    title: '王者幸运星',
    content: '皮肤免费抽,碎片免费送',
    appId: 'wx720ac6d7229813a6',
    path: 'pages/history/history',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },

  {
    id: 11,
    image: '../../static/sil/zhao.png',
    title: '营业执照扫描',
    value: 'rest/2.0/ocr/v1/business_license',
    content: '字太多了实在不想抄了',
    poster: '/mp/sil/hua.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 12,
    image: '../../static/sil/every.png',
    title: '万物识别',
    value: 'rest/2.0/image-classify/v2/advanced_general',
    content: '不知道分类？统统交给我!',
    poster: '/mp/sil/hua.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 13,
    image: '../../static/sil/hand.png',
    title: '手写文字识别',
    value: 'rest/2.0/ocr/v1/handwriting',
    content: '字迹潦草无法辨认',
    poster: '/mp/sil/hand.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  },
  {
    id: 14,
    image: '../../static/sil/tuwen.png',
    title: '图文识别',
    value: 'rest/2.0/ocr/v1/accurate_basic',
    content: '图文识别（高精度）',
    poster: '/mp/sil/hua.png',
    desc: ['菊', '秋满篱根始见花，', '却从冷淡遇繁华。', '西风门径含香在，', '除却陶家到我家。']
  }
];

export default dataList;
