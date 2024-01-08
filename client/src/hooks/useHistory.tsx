import { useState } from "react";
import { Server } from "../clients";
import { DeleteHistoryResponse, GetHistoryByIdResponse, PostHistoryPayload, PostHistoryResponse } from "../models";

const useHistory = () => {
  const baseUrl = '/history'
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  const getHistoryByUserId = async (userId: number) => {
    setLoading(true)
    try {
      const history = await Server.get<GetHistoryByIdResponse>(`${baseUrl}/${userId}`).then(({ data }) => data.history);
      setHistory(history);
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false);
    }
  }

  const deleteHistory = async (userId: number) => {
    setLoading(true)
    try {
      const { message } = await Server.delete<DeleteHistoryResponse>(`${baseUrl}/${userId}`).then(({ data }) => data);
      return message;
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false);
    }
  };

  const updateHistory = async (userId: number, term: string) => {
    setLoading(true);
    try {
      const { history } = await Server.post<PostHistoryPayload, PostHistoryResponse, PostHistoryPayload>(baseUrl, {
        term,
        userId
      });
      return history;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return {
    getHistoryByUserId,
    deleteHistory,
    updateHistory,
    history,
    loading,
  }
};

export default useHistory;
