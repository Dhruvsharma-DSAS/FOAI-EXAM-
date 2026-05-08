import { createContext, useContext, useReducer, useCallback } from 'react';

const DashboardContext = createContext(null);

const initialState = {
  iss: {
    lat: null,
    lng: null,
    speed: null,
    nearestPlace: 'Locating…',
    positions: [],
    speedHistory: [],
    timestamp: null,
  },
  astronauts: { number: 0, people: [] },
  news: {
    articles: {},
    activeCategory: 'breaking-news',
    searchQuery: '',
    sortBy: 'latest',
    loading: false,
    error: null,
  },
  isOnline: true,
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_ISS_POSITION':
      return { ...state, iss: { ...state.iss, ...action.payload } };
    case 'ADD_ISS_POSITION': {
      const positions = [...state.iss.positions, action.payload].slice(-15);
      return { ...state, iss: { ...state.iss, positions } };
    }
    case 'ADD_SPEED_READING': {
      const speedHistory = [...state.iss.speedHistory, action.payload].slice(-30);
      return { ...state, iss: { ...state.iss, speedHistory } };
    }
    case 'SET_NEAREST_PLACE':
      return { ...state, iss: { ...state.iss, nearestPlace: action.payload } };
    case 'SET_ASTRONAUTS':
      return { ...state, astronauts: action.payload };
    case 'SET_NEWS_ARTICLES':
      return {
        ...state,
        news: {
          ...state.news,
          articles: { ...state.news.articles, [action.payload.category]: action.payload.articles },
        },
      };
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, news: { ...state.news, activeCategory: action.payload } };
    case 'SET_SEARCH_QUERY':
      return { ...state, news: { ...state.news, searchQuery: action.payload } };
    case 'SET_SORT_BY':
      return { ...state, news: { ...state.news, sortBy: action.payload } };
    case 'SET_NEWS_LOADING':
      return { ...state, news: { ...state.news, loading: action.payload } };
    case 'SET_NEWS_ERROR':
      return { ...state, news: { ...state.news, error: action.payload } };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}

export default DashboardContext;
