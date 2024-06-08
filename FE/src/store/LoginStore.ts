import { create } from 'zustand';
import { loginMember,logoutMember } from '@/services/member';

type LoginState = {
  isLoggedin: boolean;
  login: ({ memberLoginId, memberPassword }: ILoginData) => Promise<boolean>;
  logout: () => void;
};
interface ILoginData {
  memberLoginId: string;
  memberPassword: string;
}

export const LoginStore = create<LoginState>((set) => ({
  isLoggedin: Boolean(localStorage.getItem('token')),

  login: async ({ memberLoginId, memberPassword }: ILoginData) => {
    const response = await loginMember({ memberLoginId, memberPassword });
    localStorage.setItem('token','eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MSwibWVtYmVyTG9naW5JZCI6InNzYWZ5IiwibWVtYmVyUm9sZSI6IlJPTEVfUkVHSVNURVJFRF9NRU1CRVIiLCJpYXQiOjE3MTYzNTMzMzYsImV4cCI6MTcxNzU2MjkzNn0.1Txtc4m2KKTWSEz6TVFmkt63QP5xQU4a0MF8569WlaM')
    if (response.status === 200) {
      console.log(`[Login Store] : Login 200`);
      const token = response.headers['authorization'];
      localStorage.setItem('token', token);
      set({ isLoggedin: true });
      return true;
    }
    return false;
  },

  logout: async () => {
    const response = await logoutMember();
    set({ isLoggedin: response.status === 204 });
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    set({ isLoggedin: false });
  },
}));
