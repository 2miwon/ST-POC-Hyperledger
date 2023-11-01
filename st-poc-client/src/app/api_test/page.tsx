import { fetchChannelInfo } from '@/components/api/youtubeAPI';

export default async function Page() {
  const data = await fetchChannelInfo("UC_x5XG1OV2P6uZZ5FSM9Ttw")
 
  return <main>{data}</main>
}