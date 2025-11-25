import { useState, useEffect } from 'react';

interface CardDataState {
  data: any[];
  isLoading: boolean;
  error: string | null;
}

export const useMyBetsData = () => {
  const [state, setState] = useState<CardDataState>({
    data: [],
    isLoading: false,
    error: null,
  });

  const fetch = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('/api/predictions/mybets');
      if (!response.ok) throw new Error('Failed to fetch MyBets data');
      const data = await response.json();
      setState({ data: data.predictions || [], isLoading: false, error: null });
    } catch (err) {
      setState({
        data: [],
        isLoading: false,
        error: err instanceof Error ? err.message : 'Error fetching data',
      });
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { ...state, refetch: fetch };
};

export const useScorePredictionData = () => {
  const [state, setState] = useState<CardDataState>({
    data: [],
    isLoading: false,
    error: null,
  });

  const fetch = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('/api/predictions/scoreprediction');
      if (!response.ok) throw new Error('Failed to fetch ScorePrediction data');
      const data = await response.json();
      setState({ data: data.predictions || [], isLoading: false, error: null });
    } catch (err) {
      setState({
        data: [],
        isLoading: false,
        error: err instanceof Error ? err.message : 'Error fetching data',
      });
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { ...state, refetch: fetch };
};

export const useStatAreaData = () => {
  const [state, setState] = useState<CardDataState>({
    data: [],
    isLoading: false,
    error: null,
  });

  const fetch = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('/api/predictions/statarea');
      if (!response.ok) throw new Error('Failed to fetch Statarea data');
      const data = await response.json();
      setState({ data: data.predictions || [], isLoading: false, error: null });
    } catch (err) {
      setState({
        data: [],
        isLoading: false,
        error: err instanceof Error ? err.message : 'Error fetching data',
      });
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { ...state, refetch: fetch };
};
