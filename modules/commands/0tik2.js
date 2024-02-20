module.exports.config = {
  name: "tik",
  version: "1.0.0",
  hasPermssion: "0",
  credits: "Shaon Ahmed",
  description: "tiktok search",
  commandCategory: "tiktok",
  usage: "[Tiktok <search>]",
  cooldowns: 5,
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      api.sendMessage("Usage: tiktok <search text>", event.threadID);
      return;
    }

    api.sendMessage("𝐏𝐋𝐄𝐀𝐒𝐄 𝐖𝐀𝐈𝐓 𝐒𝐄𝐀𝐑𝐂𝐇 𝐅𝐎𝐑 𝐘𝐎𝐔𝐑 𝐓𝐈𝐊𝐓𝐎𝐊 𝐕𝐈𝐃𝐄𝐎....🛰️.", event.threadID);

    const response = await axios.get(`https://shaon-all.onrender.com/tiktok/searchvideo?keywords=${encodeURIComponent(searchQuery)}`);
    const videos = response.data.data.videos;

    if (!videos || videos.length === 0) {
      api.sendMessage("𝐍𝐎 𝐒𝐄𝐀𝐑𝐂𝐇 𝐘𝐎𝐔𝐑 𝐑𝐄𝐒𝐔𝐋𝐓 𝐏𝐋𝐄𝐀𝐒𝐄 𝐒𝐄𝐀𝐑𝐂𝐇 𝐓𝐈𝐊𝐓𝐎𝐊 𝐕𝐈𝐃𝐄𝐎 𝐍𝐀𝐌𝐄", event.threadID);
      return;
    }

    const videoData = videos[0];
    const videoUrl = videoData.play;

    const message = `𝐃𝐀𝐖𝐍𝐋𝐎𝐀𝐃 𝐘𝐎𝐔𝐑 𝐓𝐈𝐊𝐓𝐎𝐊 𝐕𝐈𝐃𝐄𝐎....\n\n 𝐓𝐈𝐊𝐓𝐎𝐊 𝐈𝐃 𝐍𝐀𝐌𝐄 : ${videoData.author.nickname}\n𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${videoData.author.unique_id}\n𝐓𝐢𝐭𝐥𝐞: ${videoData.title}`;

    const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
    const writer = fs.createWriteStream(filePath);

    const videoResponse = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream'
    });

    videoResponse.data.pipe(writer);

    writer.on('finish', () => {
      api.sendMessage(
        { body: message, attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    });
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("𝐀𝐍 𝐄𝐑𝐑𝐎𝐑 𝐎𝐂𝐂𝐔𝐑𝐑𝐄𝐃 𝐄𝐇𝐈𝐋𝐄 𝐏𝐎𝐑𝐂𝐄𝐒𝐒𝐈𝐍𝐆 𝐓𝐇𝐄 𝐑𝐄𝐐𝐔𝐄𝐒𝐓.", event.threadID);
  }
};