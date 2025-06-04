import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";
import {
  generateHighlight,
  generateTimeStamps,
  generateTranscripts,
} from "../utils/randomData";

export const useTranscript = ({ duration, fetchData }) =>
  useQuery({
    queryKey: ["transcript"],
    enabled: !!duration && fetchData,
    // 緩存策略配置
    staleTime: 5 * 60 * 1000, // 5分鐘內數據被視為新鮮
    cacheTime: 30 * 60 * 1000, // 緩存保留30分鐘
    refetchOnMount: false, // 組件掛載時不重新獲取
    refetchOnWindowFocus: false, // 窗口獲得焦點時不重新獲取
    refetchOnReconnect: false, // 重新連接網絡時不重新獲取
    queryFn: async () => {
      const { data: chapter } = await axios.get("/chapter");
      const { data } = await axios.get("/transcript");

      // 這邊是 mock api 的資料，需要先轉換成我們需要的資料格式
      const transcripts = generateTranscripts(chapter, data);
      const timeStamps = generateTimeStamps(transcripts, duration);
      const handMakeHighlight = generateHighlight(timeStamps);

      return handMakeHighlight;
    },
  });
