import { google, youtube_v3 } from 'googleapis';
import { GetServerSideProps } from 'next';
import axios from 'axios';

const API_KEY = process.env.YOUTUBE_API_KEY
const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY,
});

// 채널 handle (user name) -> 채널 id
async function getChannelId(channelHandle: string): Promise<string | undefined> {
    try {
        const response = await youtube.channels.list({
            part: ['id'],
            forUsername: channelHandle,
        });
  
        const channel = response.data.items?.[0];
        if (channel) {
            // console.log(`Channel ID: ${channel.id}`);
            return channel.id || undefined;
        } else {
            // console.log(`Channel not found for handle: ${channelHandle}`);
            return undefined;
        }
    } catch (error) {
      console.error('Error retrieving channel ID:', error);
      return undefined;
    }
}

// 채널 handle (user name) -> 채널 info
async function getChannelInfoByHandle(channelHandle: string): Promise<youtube_v3.Schema$Channel[] | undefined> {
    try {
        const response = await youtube.channels.list({
            part: ['snippet', 'statistics'],
            forUsername: channelHandle,
        });
  
        const channels = response.data.items;
        if (channels && channels.length > 0) {
            return channels;
        } else {
            // console.log(`Channel not found for handle: ${channelHandle}`);
            return undefined;
        }
    } catch (error) {
        console.error('Error retrieving channel info by handle:', error);
        return undefined;
    }
}

// 채널 ID -> 채널 info
async function getChannelInfoByID(channelId: string): Promise<youtube_v3.Schema$Channel[] | undefined> {
    try {
        const response = await youtube.channels.list({
            part: ['snippet', 'statistics'],
            id: [channelId],
        });
  
      const channels = response.data.items;
      if (channels && channels.length > 0) {
        return channels;
      } else {
        console.log(`Channel not found for ID: ${channelId}`);
        return undefined;
      }
    } catch (error) {
      console.error('Error retrieving channel info by ID:', error);
      return undefined;
    }
}

const ChannelInfoById: React.FC<{channel: any;}> = ({ channel }) => {
  return (
    <div>
      {channel ? (
        <div>
          <h2>채널 정보: {channel.snippet.title}</h2>
          {/* 다른 채널 데이터 필드도 렌더링할 수 있음 */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export { getChannelId, getChannelInfoByHandle, getChannelInfoByID };
export default ChannelInfoById;
export async function fetchChannelInfo(channelId: string) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?id=${channelId}-ner7Z_g&key=${process.env.YOUTUBE_API_KEY}&part=snippet`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

// export const getServerSideProps: GetServerSideProps<{channel: any;}> = async (context) => {
//   try {
//     const channelId = context.query.channelId;
//     const response = await axios.get(
//       `https://www.googleapis.com/youtube/v3/channels?id=${channelId}-ner7Z_g&key=${process.env.YOUTUBE_API_KEY}&part=snippet`
//     );
//     const channel = response.data.items[0];
//     console.log(channel);
//     if (!channel) {
//       return {
//         notFound: true, // 원하는 채널을 찾지 못한 경우 404 에러 처리
//       };
//     }
//     return {
//       props: {
//         channel,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching channel info:', error);
//     return { props: { channel: undefined } };
//   }
// };

