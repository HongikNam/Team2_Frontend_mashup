import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  // 팀 개발 서버 포트 3000 고정 (사용 중이면 다른 포트로 넘어가지 않고 에러)
  server: {
    port: 3000,
    strictPort: true,
  },
});
