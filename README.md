# CalmPet Web Demo

CalmPet is a gentle mental wellness companion demo built with `React + TypeScript + Vite`.

## Local development

```bash
npm install
npm run dev
```

## Web build

```bash
npm run build
```

## Deploy to Vercel

1. Push the current project to GitHub.
2. Import the repository in Vercel.
3. Framework preset: `Vite`
4. Build command: `npm run build`
5. Output directory: `dist`

## Android packaging with Capacitor

The project has been connected to Capacitor and now includes an `android/` native shell.

Common commands:

```bash
npm run android:copy
npm run cap:open
```

- `npm run android:copy`: rebuild the web app and sync the latest `dist/` files into the Android project.
- `npm run cap:open`: open the Android project in Android Studio.

Detailed APK packaging instructions are in [docs/apk打包说明.md](E:/XINLIBISAI-AI-CODEX/docs/apk打包说明.md).

## Notes

- All app data is stored locally in `localStorage`.
- No backend or database is required for the current demo.
