# Click

> **Click** is a full-stack mobile chat application built with **Expo React Native**, **Supabase**, **Stream Chat**, **Tamagui**, and modern TypeScript tooling.  
> The repo is a **pnpm monorepo** with an Expo Mobile app (iOS/Android), edge functions, and shared infrastructure.

---

## Project Structure

```text
click/
├─ apps/
│  └─ mobile/          # Expo / React Native app
├─ supabase/           # Supabase config & edge functions
│   ├─ functions/
│   └─ config.toml
├─ justfile            # dev automation commands
├─ pnpm-workspace.yaml # monorepo packages
└─ README.md           # you are here
```


## Start the project

Make sure to have `.env.local` in `apps/mobile` (See `.env.example` for required keys), then

1. Install dependencies
```
pnpm install
```
2. Generate native ios/android projects
```
just prebuild
```
3. Run native build
``` 
just ios
just android
```
4. Start metro bundler (app)
```
just start
```



