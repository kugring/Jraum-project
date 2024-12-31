// store/menuCalendarStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarStore {
  today: Date;
  date: Value;
  activeStartDate: Date | null;
  showCalendar: boolean;
  attendDay: string[];

  setDate: (newDate: Value) => void;
  setActiveStartDate: (date: Date | null) => void;
  setShowCalendar: (show: boolean) => void;
  handleTodayClick: () => void;
  handleResetClick: () => void;
}

// Zustand 상태 생성
const useCalendarStore = create<CalendarStore>()(
  devtools((set) => ({
    today: new Date(),
    date: null,
    activeStartDate: new Date(),
    showCalendar: false,
    attendDay: ["2024-12-18", "2024-12-26"],

    setDate: (newDate) => set({ date: newDate, showCalendar: false }),
    setActiveStartDate: (date) => set({ activeStartDate: date }),
    setShowCalendar: (show) => set({ showCalendar: show }),

    handleTodayClick: () =>
      set((state) => ({ activeStartDate: state.today, date: state.today })),

    handleResetClick: () =>
      set({ activeStartDate: null, date: null, showCalendar: false }),
  }))
);

export default useCalendarStore;
