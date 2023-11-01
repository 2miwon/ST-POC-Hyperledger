const {google} = require('googleapis');
// const {authenticate} = require('@google-cloud/local-auth');

// initialize the Youtube API
const API_KEY = YOUTUBE_API_KEY;
const youtube = google.youtube({
  version: "v3",
  auth: API_KEY
});

// const channelHandle = 'bay'; // 조회하려는 채널 핸들

// 채널 ID 조회
async function fetchChannelId(channelHandle) {
  try {
    const response = await youtube.channels.list({
      auth: API_KEY,
      part: 'id',
      forUsername: channelHandle,
    });

    const channel = response.data.items[0];
    if (channel) {
      console.log(`Channel ID: ${channel.id}`);
    } else {
      console.log(`Channel not found for handle: ${channelHandle}`);
    }
    return channel.id
  } catch (error) {
    console.error('Error retrieving channel ID:', error);
  }
}

// 채널 정보 조회 함수, youtube handle 로 검색하는데, 일부 검색이 되지 않는 채널이 있음
async function fetchChannelInfoByHandle(channelHandle) {
  try {
    const response = await youtube.channels.list({
      part: "snippet,statistics",
      forUsername: channelHandle,
    });
    const channel = response.data.items;
    return channel
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error.message);
  }
}

// 채널 정보 조회 함수
async function fetchChannelInfoById(channelId) {
  try {
    const response = await youtube.channels.list({
      part: "snippet,statistics",
      id: channelId,
    });
    const channel = response.data.items;
    return channel
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error.message);
  }
}