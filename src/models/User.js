const seq = require('../db/seq')
const { STRING, BOOLEAN, ENUM } = require('../db/types')

const User = seq.define('user', {
  username: {
    type: STRING,
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  nickname: {
    type: STRING,
    allowNull: false,
    unique: true,
    comment: '昵称'
  },
  password: {
    type: STRING,
    allowNull: false,
    comment: '密码'
  },
  avatar: {
    type: STRING,
    allowNull: false,
    comment: '用户头像地址'
  },
  introduce: {
    type: STRING,
    allowNull: true,
    comment: '用户介绍',
    defaultValue: ''
  },
  autoPlay: {
    // 如果背单词卡片时自动播放是是'1',查看单词本翻译时是2,两者都选是'1,2',否则''
    type: STRING,  
    allowNull: true,
    comment: '是否自动播放,"" / "1" / "2" / "1,2"',
    defaultValue: '',
    get() {
      const autoPlay = this.getDataValue('autoPlay')
      return autoPlay.split(',')
    },
    set(value) {
      this.setDataValue('autoPlay', value.join(','))
    }
  },
  defaultPhonetic: {
    type: ENUM('us', 'uk'),
    allowNull: true,
    comment: '首选播放音标,默认美标',
    defaultValue: 'us',
  }
}, {
  defaultScope: {
    attributes: {
      // 排除密码，不返回密码
      exclude: ['password']
    }
  }
})

module.exports = User