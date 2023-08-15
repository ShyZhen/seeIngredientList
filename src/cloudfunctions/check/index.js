// 云函数入口文件

const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('index.js 云调用');

  const {
    value,
    txt
  } = event;

  try {
    let msgR = false;
    let imageR = false;
    //检查 文字内容是否违规
    if (txt) {
      msgR = await cloud.openapi.security.msgSecCheck({
        content: txt
      })
    }
    //检查 图片内容是否违规
    if (value) {
      const file = await cloud.downloadFile({
        fileID: value
      })

      // 获取mime
      const fileContent = file.fileContent
      let fileIDArr = value.split('.')
      let mimeType = 'image/' + fileIDArr[fileIDArr.length - 1]
      mimeType = mimeType.replace('jpg', 'jpeg');
      console.log('mime:',mimeType)

      // 云调用
      imageR = await cloud.openapi.security.imgSecCheck({
        media: {
          header: {
            'Content-Type': 'application/octet-stream'
          },
          contentType: mimeType,
          value: fileContent
        }
      })
    }
    return {
      msgR, //内容检查返回值
      imageR //图片检查返回值
    };
  } catch (err) {
    // 错误处理
    // err.errCode !== 0
    return err
  }
}



//
// // 云函数入口文件
// const cloud = require('wx-server-sdk')
//
// cloud.init()
//
// exports.main = async(event, context) => {
//   const wxContext = cloud.getWXContext()
//
//   try {
//     const result = await cloud.openapi.security.imgSecCheck({
//       media:{
//         contentType:event.media.contentType,
//         value:Buffer.from(event.media.buffer,event.media.encode)// Buffer.from()是必须的
//       }
//     })
//     // result 结构
//     // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
//     return result
//   } catch (err) {
//     // 错误处理
//     // err.errCode !== 0
//     return err
//   }
// }